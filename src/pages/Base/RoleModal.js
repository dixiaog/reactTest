/*
 * @Author: chenjie
 * @Date: 2017-12-16 17:15:26
 * @Last Modified by: chenjie
 * @Last Modified time: 2017-12-19 16:50:10
 * 添加|编辑角色
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Select, Form, Input } from 'antd'
import config from '../../utils/config'

const FormItem = Form.Item
const Option = Select.Option
@connect(state => ({
    powers: state.powers,
}))
@Form.create()
export default class RoleModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  handleOk = () => {
    this.handleSubmit()
  }
  handleCancel = () => {
    this.props.form.resetFields()
    this.props.itemModalHidden()
  }
  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values)
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { powerName, powerGroup, remark } = this.props.role
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        md: { span: 16 },
      },
    }
    return (
      <div>
        <Modal
          title={powerName ? '编辑角色' : '添加角色'}
          visible={this.props.itemModalVisiable}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
        >
          <Form
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="名称"
            >
              {getFieldDecorator('powerName', {
                initialValue: powerName,
                rules: [{
                required: true, message: '请输入角色名称',
                }],
            })(
              <Input size={config.InputSize} />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="群组类型"
            >
              {getFieldDecorator('powerGroup', {
                initialValue: powerGroup,
                rules: [{
                required: true, message: '请选择群组类型',
                }],
            })(
              <Select placeholder="群组类型" size="small" style={{ marginTop: 4 }}>
                <Option value="标准">标准</Option>
                <Option value="分销">分销</Option>
                <Option value="仓储">仓储</Option>
                <Option value="全渠道">全渠道</Option>
              </Select>
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="备注"
            >
              {getFieldDecorator('remark', {
                initialValue: remark,
                rules: [{
                }],
            })(
              <Input.TextArea size={config.InputSize} rows={4} />
            )}
            </FormItem>
          </Form>
        </Modal>
      </div>)
  }
}
