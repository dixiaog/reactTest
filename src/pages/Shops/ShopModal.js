import React, { Component } from 'react'
// import { connect } from 'dva'
import { Modal, Form, Input, Switch, Select } from 'antd'
import config from '../../utils/config'

const FormItem = Form.Item
const Option = Select.Option

@Form.create()
export default class ShopsModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      checkSwitch: true,
      init: true,
    }
  }
  componentWillMount () {
    if (this.state.init && this.props.shops.enable !== undefined) {
      this.setState({
        checkSwitch: this.props.shops.enable === 1,
        init: false,
      })
    }
  }
  onSwitch = (checked) => {
    this.setState({
      checkSwitch: checked,
    })
  }
  handleOk = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      Object.assign(values, { enable: this.state.checkSwitch ? 1 : 0 })
      console.log('values', values)
    })
    // this.props.form.resetFields()
    // this.props.shopsModalHidden()
  }
  handleCancel = () => {
    this.props.form.resetFields()
    this.props.shopsModalHidden()
  }
  render () {
    const { getFieldDecorator } = this.props.form
    const { shopName, shortName, address, shopLevel } = this.props.shops
    // , enable
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 12 },
      },
    }
    return (
      <div>
        <Modal
          maskClosable={false}
          title={this.props.add ? '新增店铺' : '编辑店铺'}
          visible={this.props.shopsModalVisiable}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          // bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
          width={700}
        >
          <Form
            // style={{ marginTop: 8 }}
          >
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
              <Input size={config.InputSize} />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="店铺简称"
            >
              {getFieldDecorator('shortName', {
                initialValue: shortName,
                rules: [{
                  required: true, message: '请输入店铺简称',
                }],
            })(
              <Input size={config.InputSize} />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="地址"
            >
              {getFieldDecorator('address', {
                initialValue: address,
                rules: [{
                  required: true, message: '请输入地址',
                }],
            })(
              <Input size={config.InputSize} />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="店铺等级"
            >
              {getFieldDecorator('shopLevel', {
                initialValue: shopLevel,
            })(
              <Select size={config.InputSize} style={{ marginTop: 4 }}>
                <Option key={1} value={1}>1级</Option>
                <Option key={2} value={2}>2级</Option>
                <Option key={3} value={3}>3级</Option>
              </Select>
            )}
            </FormItem>
            {/* <FormItem
              {...formItemLayout}
              label="启用"
            >
              {getFieldDecorator('enable', {
                initialValue: enable * 1,
            })(
              <Select size={config.InputSize} style={{ marginTop: 4 }} >
                <Option key={1} value={1}>开启</Option>
                <Option key={2} value={2}>关闭</Option>
              </Select>
            )}
            </FormItem> */}
            {/* <FormItem
              {...formItemLayout}
              label={<Tooltip title="系统只支持款式编号的限定，不支持颜色规则级别的限定"><a style={{ color: 'red' }}>?</a>限定款式编号</Tooltip>}
            >
              {getFieldDecorator('limitType', {
                initialValue: limitType ? String(limitType) : '0',
                rules: [{
                  required: true,
                }],
            })(
              <RadioGroup disabled={this.props.productLimit.chooseData ? true : false}>
                <Radio value="0">允许销售</Radio>
                <Radio value="1">禁止销售</Radio>
              </RadioGroup>
            )}
            </FormItem> */}
            <FormItem
              {...formItemLayout}
              label="启用"
            >
              {getFieldDecorator('enable')(
                <Switch checked={this.state.checkSwitch} onChange={this.onSwitch} />
            )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}
