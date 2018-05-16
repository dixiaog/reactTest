import React, { Component } from 'react'
import { Modal, Form, Input } from 'antd'

const FormItem = Form.Item

@Form.create()
export default class TaskModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
    }
  }
  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('values', values)
      }
    })
  }

  hideModal = () => {
    this.props.form.resetFields()
    this.props.hideModal()
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { id, jobname, jobgroup, cronexpression, classname, methodname } = this.props.record
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }
    return (
      <div>
        <Modal
          title={ id ? '编辑任务' : '添加任务' }
          visible={this.props.show}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          maskClosable={false}
          confirmLoading={this.state.confirmLoading}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label="任务名称"
            >
              {getFieldDecorator('jobname', {
                initialValue: jobname,
                rules: [{
                  required: true, message: '请输入任务名称',
                }],
            })(
              <Input size="small" placeholder="请输入任务名称" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="任务组"
            >
              {getFieldDecorator('jobgroup', {
                initialValue: jobgroup,
                rules: [{
                  required: true, message: '请输入任务组',
                }],
            })(
              <Input size="small" placeholder="请输入任务组" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="表单式"
            >
              {getFieldDecorator('cronexpression', {
                initialValue: cronexpression,
                rules: [{
                  required: true, message: '请输入表单式',
                }],
            })(
              <Input size="small" placeholder="请输入表单式" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="类名"
            >
              {getFieldDecorator('classname', {
                initialValue: classname,
                rules: [{
                  required: true, message: '请输入类名',
                }],
            })(
              <Input size="small" placeholder="请输入类名" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="方法名"
            >
              {getFieldDecorator('methodname', {
                initialValue: methodname,
                rules: [{
                  required: true, message: '请输入方法名',
                }],
            })(
              <Input size="small" placeholder="请输入方法名" />
            )}
            </FormItem>
          </Form>  
        </Modal>
      </div>
    )
  }
}
