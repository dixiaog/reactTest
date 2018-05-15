/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-04-24 14:10:58
 * 自定义异常信息
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Input, Alert, message } from 'antd'
import { insertCustomException } from '../../../services/order/search'

const FormItem = Form.Item
const text = '请输入自定义异常,逗号(英文输入法)分隔多个异常,请不要输入特殊字符,单个异常长度不能超过20,灰色带下划线为自定义异常'
@Form.create()
@connect(state => ({
  search: state.search,
}))
export default class DefineAbnormal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      message: '',
      value: [],
      valueCopy: [],
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.search.abnormalList.length) {
      const value = []
      nextProps.search.abnormalList.forEach((ele) => {
        if (ele.companyNo !== 0) {
          value.push(ele.abnormalName)
        }
      })
      this.setState({
        value,
        valueCopy: value,
      })
    }
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let newData = []
        if (values.message) {
          const result = typeof(values.message) === 'object' ? values.message : values.message.split(',')
          result.forEach((ele) => {
            if (ele.trim().length) {
              newData.push(ele.trim())
            }
          })
        } else {
          newData = values.message.split(',')
        }
        insertCustomException(newData.toString()).then((json) => {
          if (json && json.review) {
            this.props.dispatch({
              type: 'search/getAbnormal',
            })
            this.hideModal()
          } else {
            message.warning(`已经使用的自定义异常【${json.errorMessage.substring(0, json.errorMessage.length - 1)}】不允许删除或修改!`)
          }
          this.setState({
            confirmLoading: false,
          })
        })
      }
    })
  }
  checkMessage = (rules, value, callback) => {
    let length = false
    if (value && value.toString().indexOf(',') !== -1) {
      const result = value.toString().split(',')
      result.forEach((ele) => {
        if (ele.length > 20) {
          length = true
        }
      })
    } else {
      if (value && value.length > 20) {
        length = true
      }
      this.setState({
        value,
      })
    }
    const reg = /[~#^$@%&!?%*]/gi
    if (value && value.toString().trim() === '') {
      this.setState({
        message: '异常描述不能只输入空格',
      })
      callback('error')
    } else if (value && reg.test(value.toString().trim())) {
      this.setState({
        message: '异常描述不能包含特殊字符',
      })
      callback('error')
    } else if (length) {
      this.setState({
        message: '单个异常长度不能超过20',
      })
      callback('error')
    } else {
      this.setState({
        message: '',
      })
      callback()
    }
  }
  // 关闭窗口
  hideModal = () => {
    const { hideModal } = this.props
    this.setState({
      confirmLoading: false,
      message: '',
    })
    hideModal()
    this.handleReset()
  }
   // 重置表单
   handleReset = () => {
    this.props.form.resetFields()
  }
  render() {
    const { show } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <div>
        <Modal
          title="自定义异常"
          visible={show}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          width={800}
          maskClosable={false}
          confirmLoading={this.state.confirmLoading}
        >
          <Form
            style={{ marginTop: 8 }}
          >
            <Alert showIcon={false} message={text} banner />
            <FormItem
              help={this.state.message}
            >
              {getFieldDecorator('message', {
                initialValue: this.state.value,
                rules: [{
                  validator: this.checkMessage,
                }],
              })(
                <Input size="small" placeholder="请输入异常描述" />
            )}
            </FormItem>
            <p style={{ color: 'blue', fontWeight: 'bold' }}>若不输入任何内容,则清除当前公司下的自定义异常数据</p>
          </Form>
        </Modal>
      </div>)
  }
}
