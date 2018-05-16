/*
 * @Author: tanmengjia
 * @Date: 2018-05-16 10:36:44
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-16 13:49:29
 * 添加角色
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Input } from 'antd'

const FormItem = Form.Item

@connect(state => ({
  role: state.role,
}))
@Form.create()
export default class AddRoles extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // confirmLoading: false,
    }
  }
  componentDidMount() {
    if (this.props.record) {
      this.props.dispatch({
        type: 'role/getChooseData',
        payload: this.props.record.autoNo,
      })
    }
  }
  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.props.record) {
          Object.assign(values, { autoNo: this.props.record.autoNo})
        }
        console.log('values', values)
      }
    })
  }

  hideModal = () => {
    this.props.form.resetFields()
    this.props.hideModal()
    this.props.dispatch({
      type: 'role/clean',
    })
  }
  render() {
    const { roleVisible } = this.props
    const { autoNo, roleName, title } = this.props.record ? this.props.record : ''
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }
    return (
      <div>
        <Modal
          title={autoNo ? '详情' : '添加角色'}
          visible={roleVisible}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          maskClosable={false}
          // confirmLoading={this.state.confirmLoading}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label="角色名称"
            >
              {getFieldDecorator('title', {
                initialValue: title,
                rules: [{
                  required: true, message: '请输入角色名称',
                }],
            })(
              <Input size="small" placeholder="请输入角色名称" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="角色简称"
            >
              {getFieldDecorator('roleName', {
                initialValue: roleName,
                rules: [{
                  required: true, message: '请输入角色简称',
                }],
            })(
              <Input size="small" placeholder="请输入角色简称" />
            )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}
