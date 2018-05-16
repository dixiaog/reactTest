import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Input, Icon, Upload, Button, message } from 'antd'

const FormItem = Form.Item

@connect(state => ({
  software: state.software,
}))
@Form.create()
export default class SoftModal extends Component {
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
    const { show } = this.props
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }
    const $this = this
    const props = {
      showUploadList: false,
      name: 'file',
      action: '//jsonplaceholder.typicode.com/posts/',
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          // console.log(info.file.name, info.fileList)
        }
        if (info.file.status === 'done') {
          $this.props.form.setFieldsValue({
            appfile: info.file.name,
          })
          message.success('上传应用成功')
        } else if (info.file.status === 'error') {
          message.error('上传应用失败')
        }
      },
    }
    return (
      <div>
        <Modal
          title="新增应用"
          visible={show}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          maskClosable={false}
          confirmLoading={this.state.confirmLoading}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label="应用名称"
            >
              {getFieldDecorator('appname', {
                rules: [{
                  required: true, message: '请输入应用名称',
                }],
            })(
              <Input size="small" placeholder="请输入应用名称" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="版本号"
            >
              {getFieldDecorator('appversion', {
                rules: [{
                  required: true, message: '请输入版本号',
                }],
            })(
              <Input size="small" placeholder="请输入版本号" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="产品名称"
            >
              {getFieldDecorator('productname', {
                rules: [{
                  required: true, message: '请输入产品名称',
                }],
            })(
              <Input size="small" placeholder="请输入产品名称" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="上传应用"
            >
              {getFieldDecorator('appfile', {
                rules: [{
                  required: true, message: '请选择上传应用',
                }],
            })(
              <Input readOnly={true} style={{ width: 199, marginRight: 10 }} size="small" placeholder="请选择上传应用" />
            )}
            <Upload {...props}>
              <Button type="primary" size="small">
                <Icon type="upload" />上传
              </Button>
            </Upload>
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}
