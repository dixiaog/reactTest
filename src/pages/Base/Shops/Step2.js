import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Input, Steps, Tooltip, Checkbox, Row, Col, Tag, Button, notification } from 'antd'
import config from '../../../utils/config'
import { addShop, tokenShop } from '../../../services/api'

const FormItem = Form.Item
const Step = Steps.Step
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
export default class Step2 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      checkedList: ['isOrderDownload', 'isDeliveryUpload', 'isSupportDownload'],
      confirmLoading: false,
      authorizeCode: '',
      isWPH: false,
      isTB: false,
    }
  }
  componentWillReceiveProps(nextProps) {
    const { siteName } = nextProps.site
    if (siteName === '唯品会') {
      this.setState({
        isWPH: true,
      })
    }
    if (nextProps.code) {
      tokenShop({
        shortName: nextProps.site.shortName,
        code: nextProps.code,
      }).then((json) => {
        if (json !== null) {
          this.setState({
            authorizeCode: json,
          })
        }
      })
    }
  }
  // 校验联系方式
  checkPhone = (rule, value, callback) => {
    if (value) {
      if (!(/^1[345678]\d{9}$/.test(value)) && !(/^0\d{2,3}-?\d{7,8}$/.test(value))) {
        callback('请输入正确的手机号')
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
      isWPH: false,
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
        Object.assign(values, {
          shopName: values.shopName.trim(),
          authorizeCode: this.state.authorizeCode,
        })
        if (values.siteName === '唯品会') {
          Object.assign(values, { siteShortName: 'Vip' })
        }
        addShop(values).then((json) => {
          if (json) {
            notification.success({
              message: '操作成功',
            })
            this.setState({
              confirmLoading: false,
              checkedList: ['isOrderDownload', 'isDeliveryUpload', 'isSupportDownload'],
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
    const { getFieldDecorator } = this.props.form
    const { siteName } = this.props.site
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
          title="填写店铺信息"
          visible={this.props.visiable}
          onOk={this.handleOk}
          maskClosable={false}
          onCancel={this.handleCancel}
          bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
          confirmLoading={this.state.confirmLoading}
        >
          <Steps current={1}>
            <Step title="选择站点" />
            <Step title="填写店铺信息" />
          </Steps>
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
            })(<Input size={config.InputSize} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="联系电话"
            >
              {getFieldDecorator('telNo', {
                rules: [{
                  validator: this.checkTel,
                }],
            })(<Input size={config.InputSize} />)}
            </FormItem>
            {this.state.isTB ? <Row><Col span={6}><div /></Col><Col span={16}><Button type="primary" size="small">获取淘宝地址</Button></Col></Row> : null}
            <FormItem
              {...formItemLayout}
              label="退货地址"
            >
              {getFieldDecorator('receiveAddr', {
            })(<Input readOnly={this.state.isTB} size={config.InputSize} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="退货手机"
            >
              {getFieldDecorator('mobileNo', {
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
            })(<Input readOnly={this.state.isTB} size={config.InputSize} />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="退货联系人"
            >
              {getFieldDecorator('principal', {
            })(<Input readOnly={this.state.isTB} size={config.InputSize} />)}
            </FormItem>


            <FormItem
              {...formItemLayout}
              label="授权状态"
            >{
              this.state.authorizeCode === '' ? <Tag >未授权</Tag> : <Tag color="#2db7f5">已授权</Tag>
            }
            </FormItem>
          </Form>
          <CheckboxGroup onChange={this.handleCheckboxChange} value={this.state.checkedList} >
            <Row>
              { options.map((op, i) => <Col span={16} offset={8} key={i} ><Checkbox style={{ marginBottom: 10 }} value={op.value}>{op.label}</Checkbox></Col>)}
            </Row>
          </CheckboxGroup>
        </Modal>
      </div>)
  }
}
