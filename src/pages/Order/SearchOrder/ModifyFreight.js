/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-03-20 13:27:07
 * 修改运费
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Input, message } from 'antd'
import { editOrderMark } from '../../../services/order/search'

const FormItem = Form.Item

@connect(state => ({
  search: state.search,
}))
@Form.create()
export default class ModifyAddress extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      freight: '',
    }
  }
  componentWillReceiveProps(nextProps) {
    const { selectedRows } = nextProps.search
    if (selectedRows.length) {
      this.setState({ currentRecord: selectedRows[0] })
    }
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          confirmLoading: true,
        })
        Object.assign(values, { orderNos: this.props.search.selectedRowKeys })
        editOrderMark(values).then((json) => {
          if (json) {
            message.success('运费修改成功')
            this.hideModal()
            this.props.dispatch({
              type: 'search/search',
            })
            this.props.dispatch({
              type: 'search/changeState',
              payload: { selectedRowKeys: [], selectedRows: [] },
            })
          }
          this.setState({
            confirmLoading: false,
          })
        })
      }
    })
  }
  // 关闭窗口
  hideModal = () => {
    const { hideModal } = this.props
    this.setState({
      confirmLoading: false,
    })
    hideModal()
    this.handleReset()
  }
   // 重置表单
   handleReset = () => {
    this.props.form.resetFields()
  }
  // 检验运费
  checkFreight = (rule, value, callback) => {
    if (!value) {
      this.setState({
        freight: '请输入新的运费',
      })
      callback('error')
    } else if (isNaN(value)) {
      this.setState({
        freight: '运费请输入数字',
      })
      callback('error')
    } else if (value < 0) {
      this.setState({
        freight: '运费不能小于0',
      })
      callback('error')
    } else {
      this.setState({
        freight: '',
      })
      callback()
    }
  }
  render() {
    const { show } = this.props
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }
    let expressAmount = ''
    if (this.state.currentRecord) {
      expressAmount = this.state.currentRecord.expressAmount
    }
    return (
      <div>
        <Modal
          title="修改运费"
          visible={show}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          maskClosable={false}
          confirmLoading={this.state.confirmLoading}
        >
          <Form
            style={{ marginTop: 8 }}
          >
            <FormItem
              help={this.state.freight}
              {...formItemLayout}
              label="运费"
            >
              {getFieldDecorator('expressAmount', {
                  initialValue: expressAmount,
                  rules: [{
                    required: true, message: '请输入新的运费',
                  }, {
                    validator: this.checkFreight,
                  }],
                })(
                  <Input size="small" placeholder="请输入新的运费" />
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>)
  }
}
