import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Select, Input } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

@connect(state => ({
  dictionary: state.dictionary,
}))
@Form.create()
export default class DicModal extends Component {
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
    const { autoNo, name, description } = this.props.record
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }
    return (
      <div>
        <Modal
          title={ autoNo ? '编辑字典' : '新增字典'}
          visible={show}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          maskClosable={false}
          confirmLoading={this.state.confirmLoading}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label="名称"
            >
              {getFieldDecorator('name', {
                initialValue: name,
                rules: [{
                  required: true, message: '请选择字典名称',
                }],
            })(
              <Select
                size="small"
                placeholder="请选择字典名称"
              >
                <Option value={1}>名称1</Option>
                <Option value={2}>名称2</Option>
                <Option value={3}>名称3</Option>
              </Select>
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="说明"
            >
              {getFieldDecorator('description', {
                initialValue: description,
                rules: [{
                  required: true, message: '请输入说明',
                }],
            })(
              <Input size="small" placeholder="请输入说明" />
            )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}
