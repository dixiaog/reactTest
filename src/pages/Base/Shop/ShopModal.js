import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Input } from 'antd'

const FormItem = Form.Item

@connect(state => ({
  shop: state.shop,
}))
@Form.create()
export default class ShopModal extends Component {
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
    const { shopNo, shopName, procurementCenter, wechatUrl } = this.props.record
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }
    return (
      <div>
        <Modal
          title={ shopNo ? '编辑店铺' : '新增店铺'}
          visible={show}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          maskClosable={false}
          confirmLoading={this.state.confirmLoading}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label="店铺编号"
            >
              {getFieldDecorator('shopNo', {
                initialValue: shopNo,
                rules: [{
                  required: true, message: '请输入店铺编号',
                }],
            })(
              <Input size="small" placeholder="请输入店铺编号" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="店铺名称"
            >
              {getFieldDecorator('shopName', {
                initialValue: shopName,
                rules: [{
                  required: true, message: '请输入店铺名称',
                }],
            })(
              <Input size="small" placeholder="请输入店铺名称" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="采购中心"
            >
              {getFieldDecorator('procurementCenter', {
                initialValue: procurementCenter,
                rules: [{
                  required: true, message: '请输入采购中心',
                }],
            })(
              <Input size="small" placeholder="请输入采购中心" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="微信地址"
            >
              {getFieldDecorator('wechatUrl', {
                initialValue: wechatUrl,
            })(
              <Input size="small" />
            )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}
