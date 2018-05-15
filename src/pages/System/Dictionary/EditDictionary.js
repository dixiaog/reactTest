/*
 * @Author: jiangteng
 * @Date: 2017-12-26 17:03:18
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-10 19:26:10
 * 添加字典
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Select, Form, Input } from 'antd'
import config from '../../../utils/config'
import { editSave } from '../../../services/system'

const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input

@connect(state => ({
    dictionary: state.dictionary,
}))
@Form.create()
export default class EditDictionary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      itemNo: null,
      itemName: null,
    }
  }
  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
        if (!err) {
          this.setState({
            confirmLoading: true,
          })
          Object.assign(values, {
            dictType: Number(values.dictType.title),
            typeName: values.dictType.label,
            autoNo: this.props.record.autoNo,
          })
          editSave(values).then((json) => {
            this.setState({
              confirmLoading: false,
            })
            if (json) {
              const { hideModal } = this.props
              hideModal()
              this.handleReset()
              this.props.dispatch({
                type: 'dictionary/search',
              })
            }
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

  // 清空表单
  handleReset = () => {
    this.props.form.resetFields()
  }

  check1 = (rule, value, callback) => {
    if (!value) {
      this.setState({
        itemNo: '请输入自主编号',
      })
      callback('error')
    } else if (value.indexOf(' ') !== -1) {
      this.setState({
        itemNo: '自主编号不允许输入空格',
      })
      callback('error')
    } else {
      this.setState({
        itemNo: '',
      })
      callback()
    }
  }

  check2 = (rule, value, callback) => {
    if (!value) {
      this.setState({
        itemName: '请输入名称',
      })
      callback('error')
    } else if (value.indexOf(' ') !== -1) {
      this.setState({
        itemName: '名称不允许输入空格',
      })
      callback('error')
    } else {
      this.setState({
        itemName: '',
      })
      callback()
    }
  }

  renderType = (ele) => {
    return <Option value={ele.typeName} key={ele.dictType} title={String(ele.dictType)}>{ele.typeName}</Option>
  }

  render() {
    const { getFieldDecorator } = this.props.form
    // const { list } = this.props.roles
    const { show, record } = this.props
    const { types } = this.props.dictionary
    const { itemNo, itemName, remark, typeName } = record
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    }
    return (
      <div>
        <Modal
          title="编辑字典"
          visible={show}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
          confirmLoading={this.state.confirmLoading}
          maskClosable={false}
        >
          <Form
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="类别"
            >
              {getFieldDecorator('dictType', {
                initialValue: { key: typeName, value: typeName },
                rules: [{
                    required: true, message: '请选择字典类别',
                }],
            })(
              <Select
                style={{ marginTop: '3px' }}
                size={config.InputSize}
                placeholder="请选择字典类别"
                labelInValue
              >
                { types.length ? types.map(ele => this.renderType(ele)) : '' }
              </Select>
            )}
            </FormItem>
            <FormItem
              help={this.state.itemNo}
              {...formItemLayout}
              label="自主编号"
            >
              {getFieldDecorator('itemNo', {
                initialValue: itemNo,
                rules: [{
                    required: true, message: '请输入自主编号',
                }, {
                  validator: this.check1,
                }],
            })(
              <Input size={config.InputSize} placeholder="请输入3位自主编号" maxLength="3" />
            )}
            </FormItem>
            <FormItem
              help={this.state.itemName}
              {...formItemLayout}
              label="名称"
            >
              {getFieldDecorator('itemName', {
                initialValue: itemName,
                rules: [{
                    required: true, message: '请输入名称',
                }, {
                  validator: this.check2,
                }],
            })(
              <Input size={config.InputSize} placeholder="请输入名称" maxLength="50" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="备注"
            >
              {getFieldDecorator('remark', {
                initialValue: remark,
              })(
                <TextArea rows={4} maxLength="100" />
            )}
            </FormItem>
          </Form>
        </Modal>
      </div>)
  }
}
