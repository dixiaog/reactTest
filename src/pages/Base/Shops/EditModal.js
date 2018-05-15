import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Input, Tooltip, Checkbox, Row, Col, Button, notification } from 'antd'
import config from '../../../utils/config'
import { editShop } from '../../../services/api'
import TaobaoAddress from './TaobaoAddress'

const FormItem = Form.Item
const { TextArea } = Input
const CheckboxGroup = Checkbox.Group
const options = [
  { label: '订单下载', value: 'isOrderDownload' },
  { label: '发货上传', value: 'isDeliveryUpload' },
  { label: '库存上传', value: 'isInventoryUpload' },
  { label: '售后下载', value: 'isSupportDownload' },
  { label: '淘宝供销', value: 'isTaobaoSupply' },
]

@connect(state => ({
  shops: state.shops,
}))
@Form.create()
export default class EditModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      checkedList: [],
      confirmLoading: false,
      isWPH: false,
      isTB: false,
      taobaoVisiable: false,
    }
  }
  componentWillMount() {
    const { siteName } = this.props.shop
    if (siteName === '唯品会') {
      this.setState({
        isWPH: true,
      })
    } else if (siteName === '淘宝') {
      this.setState({
        isTB: true,
      })
    }
    const data = this.props.shop
    const array = []
    options.forEach((ele) => {
      if (data[ele.value] === 1) {
        array.push(ele.value)
      }
    })
    this.setState({
      checkedList: array,
    })
  }
  // 校验联系方式
  checkPhone = (rule, value, callback) => {
    if (value) {
      if (!(/^1[345678]\d{9}$/.test(value)) && !(/^0\d{2,3}-?\d{7,8}$/.test(value))) {
        callback('请输入正确的联系电话')
      } else {
        callback()
      }
    } else {
      callback()
    }
  }
  checkTel = (rulr, value, callback) => {
    if (!value) {
      callback()
    } else {
      const isPhone = /^(?:(?:0\d{2,4})-)?(?:\d{7,8})(-(?:\d{3,}))?$/
      if (!isPhone.test(value)) {
        callback('请输入正确的联系电话')
      } else {
        callback()
      }
    }
  }
  handleOk = () => {
    this.handleSubmit()
  }
  handleCancel = () => {
    this.setState({
      confirmLoading: false,
    })
    this.props.form.resetFields()
    this.props.hidden()
  }
  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          confirmLoading: true,
        })
        options.forEach((ele) => {
          if (this.state.checkedList.indexOf(ele.value) !== -1) {
            Object.assign(values, { [ele.value]: 1 })
          } else {
            Object.assign(values, { [ele.value]: 0 })
          }
        })
        Object.assign(values, { shopNo: this.props.shop.shopNo })
        editShop(values).then((json) => {
          if (json) {
            this.setState({
              confirmLoading: false,
            })
            notification.success({
              message: '操作成功',
            })
            this.props.hidden()
            this.props.form.resetFields()
            this.props.dispatch({
              type: 'shops/search',
            })
          } else {
            this.setState({
              confirmLoading: false,
            })
          }
        })
      }
    })
  }
  handleCheckboxChange = (v) => {
    this.setState({
      checkedList: v,
    })
  }
  checkBlank = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (value.indexOf(' ') !== -1) {
        callback('店铺名称不能输入空格')
      } else {
      callback()
  }
  }
  checkBlank1 = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (value.indexOf(' ') !== -1) {
        callback('掌柜昵称不能输入空格')
      } else {
      callback()
  }
  }
  checkBlank2 = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (value.indexOf(' ') !== -1) {
        callback('唯品会供应商编号不能输入空格')
      } else {
      callback()
  }
  }
  render() {
    const { getFieldDecorator, setFieldsValue } = this.props.form
    const { siteName, shopName, shopShortName, mainAccount, shopAddress, principal, telNo, receiveAddr, mobileNo, postCode, vipSupplyNo, shopNo } = this.props.shop
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
    const tabaoProps = {
      taobaoVisiable: this.state.taobaoVisiable,
      shopNo,
      taobaoModelHidden: () => {
        this.setState({
          taobaoVisiable: false,
        })
      },
      chooseAddress: (address, callback) => {
        console.log('address', address)
        setFieldsValue({
          receiveAddr: `${address.province}${address.city}${address.country}${address.addr}`, // 退货地址
          mobileNo: address.mobilePhone, // 退货手机
          postCode: address.zipCode, // 退货邮编
          principal: address.contactName, // 退货联系人
        })
        callback()
      }
    }
    return (
      <div>
        <Modal
          maskClosable={false}
          title="编辑店铺信息"
          visible={this.props.visiable}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
          confirmLoading={this.state.confirmLoading}
        >
          <Form
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="所属站点"
            >
              {getFieldDecorator('siteName', {
                initialValue: siteName,
                rules: [{
                }],
            })(<Input readOnly size={config.InputSize} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="店铺名称"
            >
              {getFieldDecorator('shopName', {
                initialValue: shopName,
                rules: [{
                  required: true, message: '请填写店铺名称',
                },
                {
                  validator: this.checkBlank,
                }],
            })(<Input size={config.InputSize} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="店铺简称"
            >
              {getFieldDecorator('shopShortName', {
                initialValue: shopShortName,
                rules: [{
                  // required: true, message: '请填写店铺简称',
                }],
            })(<Input size={config.InputSize} />)}
            </FormItem>
            <Tooltip title="必须为主账号，子账号权限不足">
              <FormItem
                {...formItemLayout}
                label="掌柜昵称"
              >
                {getFieldDecorator('mainAccount', {
                  initialValue: mainAccount,
                  rules: [{
                    required: true, message: '请填写掌柜昵称',
                  },
                  {
                    validator: this.checkBlank1,
                  }],
              })(<Input size={config.InputSize} />)}
              </FormItem>
            </Tooltip>
            {this.state.isWPH ?
              <FormItem
                {...formItemLayout}
                label="唯品会供应商编号"
              >
                {getFieldDecorator('vipSupplyNo', {
                  initialValue: vipSupplyNo,
                  rules: [{
                    required: true, message: '请填写唯品会供应商编号',
                  },
                  {
                    validator: this.checkBlank2,
                  }],
                })(<Input size={config.InputSize} />)}
              </FormItem>
            : null
            }
            <FormItem
              {...formItemLayout}
              label="店铺网址"
            >
              {getFieldDecorator('shopAddress', {
                initialValue: shopAddress,
            })(<Input size={config.InputSize} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="联系电话"
            >
              {getFieldDecorator('telNo', {
                initialValue: telNo,
                rules: [{
                  validator: this.checkTel,
                }],
            })(<Input size={config.InputSize} />)}
            </FormItem>
            {this.state.isTB ?
              <Row style={{ marginBottom: 7, marginTop: 5 }}>
                <Col span={6}><div /></Col>
                <Col span={16}><Button type="primary" size="small" onClick={() => { this.setState({ taobaoVisiable: true }) }}>获取淘宝地址</Button></Col>
              </Row> : null}
            <FormItem
              {...formItemLayout}
              label="退货地址"
            >
              {getFieldDecorator('receiveAddr', {
                initialValue: receiveAddr,
            })(
              <TextArea rows={3} readOnly={this.state.isTB} />
              // <Input readOnly={this.state.isTB} size={config.InputSize} />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="退货手机"
            >
              {getFieldDecorator('mobileNo', {
                initialValue: mobileNo,
                rules: [{
                  validator: this.checkPhone,
                }],
            })(<Input readOnly={this.state.isTB} size={config.InputSize} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="退货邮编"
            >
              {getFieldDecorator('postCode', {
                initialValue: postCode,
            })(<Input readOnly={this.state.isTB} size={config.InputSize} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="退货联系人"
            >
              {getFieldDecorator('principal', {
                initialValue: principal,
            })(<Input readOnly={this.state.isTB} size={config.InputSize} />)}
            </FormItem>
          </Form>
          <CheckboxGroup onChange={this.handleCheckboxChange} value={this.state.checkedList} >
            <Row>
              { options.map((op, i) => <Col span={16} offset={8} key={i} ><Checkbox style={{ marginBottom: 10 }} value={op.value}>{op.label}</Checkbox></Col>)}
            </Row>
          </CheckboxGroup>
          {this.state.taobaoVisiable ? <TaobaoAddress {...tabaoProps}/> : null}
        </Modal>
      </div>)
  }
}
