/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-10 11:42:24
 * 手工下单
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Card, Select, Input, Checkbox } from 'antd'
import { insertOrderInfo, checkSiteOrderNo } from '../../../services/order/search'
import OmBuyerT from '../../../components/OmBuyerChoose/index'
import AddressCas from '../../../components/AddressCas'

const FormItem = Form.Item
const Option = Select.Option
const CheckboxGroup = Checkbox.Group
const { TextArea } = Input
@Form.create()
@connect(state => ({
  search: state.search,
  omBuyerChoose: state.omBuyerChoose,
}))
export default class ManualOrder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      OmBuyer: false,
      phone: '',
      telNo: '',
      siteBuyerNo: '',
      siteOrderNo: '',
      invoiceTaxNo: '',
      warehouse: {},
      addrClean: false,
      shopNo: true, // 记录选中的店铺编号
      invoiceType: [],
    }
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        Object.assign(values, {
          province: values.addressDetail[0],
          city: values.addressDetail[1],
          county: values.addressDetail[2],
          shopNo: values.shopNo.key,
          shopName: values.shopNo.label,
          invoiceType: this.state.invoiceType[0] !== undefined ? this.state.invoiceType[0] : 2,
        })
        delete values.addressDetail
        this.setState({
          confirmLoading: true,
        })
        insertOrderInfo(values).then((json) => {
          if (json) {
            this.hideModal()
            this.props.dispatch({
              type: 'search/search',
            })
          }
          this.setState({
            confirmLoading: false,
          })
        })
      }
    })
  }
  shopChange = (e) => {
    this.setState({
      shopNo: e.key !== '0',
    })
    if (e.key === '0') {
      this.props.form.setFields({
        siteOrderNo: {
          value: '',
        },
      })
      this.setState({
        siteOrderNo: '',
      })
    }
  }
  // 关闭窗口
  hideModal = () => {
    const { setFieldsValue } = this.props.form
    setFieldsValue({
      addressDetail: [],
    })
    const { hideModal } = this.props
    this.setState({
      confirmLoading: false,
      phone: '',
      telNo: '',
      siteOrderNo: '',
      invoiceTaxNo: '',
      warehouse: {},
      addrClean: true,
      shopNo: true,
      invoiceType: [],
    })
    this.props.form.setFields({
      mobileNo: {
        errors: '',
      },
    })
    this.props.form.setFields({
      telNo: {
        errors: '',
      },
    })
    hideModal()
    this.handleReset()
  }
  addrSelect = (selectedOptions) => {
    const { setFieldsValue } = this.props.form
    if (selectedOptions[0] === undefined) {
      setFieldsValue({
        addressDetail: [],
      })
    } else {
      setFieldsValue({
        addressDetail: selectedOptions,
      })
    }
    this.setState({
      addrClean: false,
    })
  }
   // 重置表单
   handleReset = () => {
    this.props.form.resetFields()
  }
  buyer = () => {
    this.setState({ OmBuyer: true })
    this.props.dispatch({
      type: 'omBuyerChoose/changeState',
      payload: { tabelToolbarJ: true },
    })
  }
  hideOmBuyer = () => {
    const value = this.props.omBuyerChoose.selectedRows[0]
    this.props.dispatch({ type: 'omBuyerChoose/clean' })
    this.setState({
      OmBuyer: false,
      phone: '',
      telNo: '',
    })
    this.setState({
      warehouse: { province: value.province, city: value.city, county: value.county },
    })
    this.props.form.setFields({
      siteBuyerNo: {
        value: value.siteBuyerNo,
      },
      address: {
        value: value.address,
      },
      telNo: {
        value: value.telNo,
      },
      mobileNo: {
        value: value.mobileNo,
      },
      receiver: {
        value: value.receiver,
      },
      addressDetail: {
        value: [value.province, value.city, value.county],
      },
    })
    this.props.dispatch({
      type: 'omBuyer/changeState',
      payload: { tabelToolbarJ: false },
    })
  }
  // 检验座机--TelNo
  checkTelNo = (rule, value, callback) => {
    const { getFieldValue, getFieldError } = this.props.form
    const mobileNo = getFieldValue('mobileNo')
    const errorM = getFieldError('mobileNo')
    if (!value && !mobileNo) {
      this.setState({
        telNo: '联系电话,联系手机必填一项',
        phone: '联系电话,联系手机必填一项',
      })
      callback('error')
      this.props.form.setFields({
        mobileNo: {
          errors: [new Error()],
        },
      })
    } else if (value && mobileNo && !(/^([0-9]{3,4}-)?[0-9]{7,8}$/.test(value))) {
        this.setState({
          telNo: '请输入正确的联系电话',
        })
        callback('error')
        this.props.form.setFields({
          mobileNo: {
            value: mobileNo,
            errors: errorM,
          },
        })
      } else if (value && !mobileNo && !(/^([0-9]{3,4}-)?[0-9]{7,8}$/.test(value))) {
        this.setState({
          telNo: '请输入正确的联系电话',
          phone: '',
        })
        callback('error')
        this.props.form.setFields({
          mobileNo: {
            value: '',
            errors: '',
          },
        })
      } else {
        this.setState({
          telNo: '',
        })
        callback()
        this.props.form.setFields({
          mobileNo: {
            value: mobileNo,
            errors: errorM,
          },
        })
    }
  }
  // 检验手机--MobileNo
  checkMobileNo = (rule, value, callback) => {
    const { getFieldValue, getFieldError } = this.props.form
    const errorM = getFieldError('telNo')
    const telNo = getFieldValue('telNo')
    if (!value && !telNo) {
      this.setState({
        telNo: '联系电话,联系手机必填一项',
        phone: '联系电话,联系手机必填一项',
      })
      callback('error')
      this.props.form.setFields({
        telNo: {
          errors: [new Error()],
        },
      })
    } else if (value && telNo && value.length !== 11) {
        this.setState({
          phone: '请输入11位手机号码',
        })
        callback('error')
        this.props.form.setFields({
          telNo: {
            value: telNo,
            errors: errorM,
          },
        })
      } else if (value && !telNo && value.length !== 11) {
        this.setState({
          phone: '请输入11位手机号码',
          telNo: '',
        })
        callback('error')
        this.props.form.setFields({
          telNo: {
            value: '',
            errors: '',
          },
        })
      } else if (value && telNo && !(/^1[345678]\d{9}$/.test(value))) {
        this.setState({
          phone: '请输入正确的手机号码',
        })
        callback('error')
        this.props.form.setFields({
          telNo: {
            value: telNo,
            errors: errorM,
          },
        })
      } else if (value && !telNo && !(/^1[345678]\d{9}$/.test(value))) {
        this.setState({
          phone: '请输入正确的手机号码',
          telNo: '',
        })
        callback('error')
        this.props.form.setFields({
          telNo: {
            value: '',
            errors: '',
          },
        })
      } else {
        this.setState({
          phone: '',
        })
        callback()
        this.props.form.setFields({
          telNo: {
            value: telNo,
            errors: errorM,
          },
        })
    }
  }
  checkSiteBuyerNo = (rule, value, callback) => {
    if (!value) {
      this.setState({
        siteBuyerNo: '',
      })
      callback()
    } else if (value.indexOf(' ') !== -1) {
        this.setState({
          siteBuyerNo: '买家账号不能输入空格',
        })
        callback('error')
      } else {
        this.setState({
          siteBuyerNo: '',
        })
        callback()
    }
  }
  checkSiteOrderNo = (rule, value, callback) => {
    if (!value) {
      this.setState({
        siteOrderNo: '请输入线上订单号',
      })
      callback('error')
    } else if (value.indexOf(' ') !== -1) {
        this.setState({
          siteOrderNo: '线上订单号不能输入空格',
        })
        callback('error')
      } else if (value.indexOf(',') !== -1) {
        this.setState({
          siteOrderNo: '线上订单号不能输入逗号',
        })
        callback('error')
      } else {
        checkSiteOrderNo(value).then((json) => {
          if (!json) {
            this.setState({
              siteOrderNo: '线上订单号已存在,不可重复录入',
            })
            callback('error')
          } else {
            this.setState({
              siteOrderNo: '',
            })
            callback()
          }
        })
      }
    }
  checkExpressAmount = (rule, value, callback) => {
    if (!value) {
      this.setState({
        expressAmount: '',
      })
      callback()
    } else if (value.indexOf('.') !== -1 && value.charAt(0) === '.') {
      this.setState({
        expressAmount: '运费不能以.开始',
      })
      callback('error')
    } else if (value.indexOf('.') !== -1 && value.charAt([value.length - 1]) === '.') {
      this.setState({
        expressAmount: '运费不能以.结尾',
      })
      callback('error')
    } else if (isNaN(value)) {
        this.setState({
          expressAmount: '运费请输入数字',
        })
        callback('error')
      } else if (value < 0) {
        this.setState({
          expressAmount: '运费不能小于0',
        })
        callback('error')
      } else if (value >= 100000) {
        this.setState({
          expressAmount: '运费必须小于100000',
        })
        callback('error')
      } else if (value.indexOf(' ') !== -1) {
        this.setState({
          expressAmount: '运费不能输入空格',
        })
        callback('error')
      } else {
        this.setState({
          expressAmount: '',
        })
        callback()
    }
  }
  checkInvoiceTaxNo = (rule, value, callback) => {
    if (!value) {
      this.setState({
        invoiceTaxNo: this.state.invoiceType.length ? '请输入发票税号' : '',
      })
      this.state.invoiceType.length ? callback('error') : callback()
    } else if (value.indexOf(' ') !== -1) {
      this.setState({
        invoiceTaxNo: '发票税号不允许输入空格',
      })
      callback('error')
    } else if (value.length < 18) {
      this.setState({
        invoiceTaxNo: '请输入18位发票税号',
      })
      callback('error')
    } else {
        this.setState({
          invoiceTaxNo: '',
        })
        callback()
        this.props.form.setFields({
          invoiceTaxNo: {
            value: this.props.form.getFieldValue('invoiceTaxNo').substr(0, 18).toLocaleUpperCase(),
          },
        })
    }
  }
  remark = (flag, rule, value, callback) => {
    const reg = /[~#^$@%&!！?%*()-+()]/gi
    if (reg.test(value)) {
      this.props.form.setFields({
        [flag]: {
          value,
        },
      })
      callback(`${ flag === 'sellerRemark' ? '卖家' : '买家' }备注不能输入[特殊字符]只能输入[数字,字母,中文]`)
    } else {
      this.props.form.setFields({
        [flag]: {
          value,
        },
      })
      callback()
    }
  }
  invoiceType = (e) => {
    if (!e.length) {
      this.setState({
        invoiceType: [],
        invoiceTaxNo: '',
      })
      this.props.form.setFields({
        invoiceTitle: {
          value: this.props.form.getFieldValue('invoiceTitle'),
        },
        invoiceTaxNo: {
          value: this.props.form.getFieldValue('invoiceTaxNo'),
        },
      })
    } else {
      const last = []
      const data = this.state.invoiceType
      e.length && e.forEach((ele) => {
        if (data.indexOf(ele) === -1) {
          last.push(ele)
        }
      })
      this.setState({
        invoiceType: last,
      })
      this.props.form.setFields({
        invoiceType: {
          value: last,
        },
      })
    }
  }
  invoiceChange = (e) => {
    if (!e.target.value) {
      if (e.target.id === 'invoiceTitle') {
        if (!this.props.form.getFieldValue('invoiceTaxNo')) {
          this.props.form.setFields({
            invoiceType: {
              value: this.state.invoiceType,
              errors: [new Error('')],
            },
          })
        }
      } else if (!this.props.form.getFieldValue('invoiceTitle')) {
          this.props.form.setFields({
            invoiceType: {
              value: this.state.invoiceType,
              errors: [new Error('')],
            },
          })
        }
      }
  }
  render() {
    const { shopList } = this.props.search
    const { show } = this.props
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 14 },
    }
    return (
      <div>
        <Modal
          title="创建新的订单"
          visible={show}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          width={800}
          bodyStyle={{ maxHeight: 480, overflowX: 'hidden', padding: 0 }}
          maskClosable={false}
          confirmLoading={this.state.confirmLoading}
        >
          <Form
            style={{ marginTop: 8 }}
          >
            <Card title={<div style={{ paddingLeft: 7 }}>订单基本信息</div>} bordered={false} style={{ width: '800px' }}>
              <FormItem
                {...formItemLayout}
                label="选择店铺"
              >
                {getFieldDecorator('shopNo', {
                  rules: [{
                    required: true, message: '请选择店铺',
                  }],
                })(
                  <Select
                    style={{ width: '200px' }}
                    placeholder="请选择店铺"
                    size="small"
                    showSearch
                    labelInValue
                    onChange={this.shopChange}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {shopList && shopList.map(ele => <Option key={ele.shopNo}>{ele.shopName}</Option>)}
                  </Select>
              )}
              </FormItem>
              <FormItem
                help={this.state.siteOrderNo}
                {...formItemLayout}
                label="线上订单号"
              >
                {getFieldDecorator('siteOrderNo', {
                  validateTrigger: ['onBlur'],
                  rules: [{
                    required: this.state.shopNo, message: '请输入线上订单号',
                  }, {
                    validator: this.state.shopNo ? this.checkSiteOrderNo : '',
                  }],
                })(
                  <Input readOnly={!(this.state.shopNo)} maxLength="20" style={{ width: '200px' }} size="small" placeholder={this.state.shopNo ? "请输入线上订单号" : '自动生成'} />
              )}
                <span style={{ color: 'green', fontWeight: 'bold', marginLeft: '10px' }}>店铺选择[线下手工单]将自动生成线上订单号</span>
              </FormItem>
              <FormItem
                help={this.state.expressAmount}
                {...formItemLayout}
                label="运费"
              >
                {getFieldDecorator('expressAmount', {
                  initialValue: 0,
                  rules: [{
                    validator: this.checkExpressAmount,
                  }],
                })(
                  <Input maxLength="8" size="small" style={{ width: '200px' }} />
              )}
              </FormItem>
            </Card>
            <Card title={<div style={{ paddingLeft: 7 }}>买家及收货地址信息</div>} bordered={false} style={{ width: '800px' }}>
              <FormItem
                help={this.state.siteBuyerNo}
                {...formItemLayout}
                label="买家账号"
              >
                {getFieldDecorator('siteBuyerNo', {
                  rules: [{
                    validator: this.checkSiteBuyerNo,
                  }],
                })(
                  <Input maxLength="50" size="small" style={{ width: '200px' }} />
              )}
                <span style={{ color: '#55d4fd' }}><a onClick={this.buyer} style={{ fontWeight: 'bold', marginLeft: '10px' }}>选择买家</a></span>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="收货地址"
              >
                {getFieldDecorator('addressDetail', {
                    rules: [{
                      required: true, message: '请选择省市县',
                    }],
                  })(
                    <AddressCas doClean={this.state.addrClean} addrSelect={this.addrSelect} wh={this.state.warehouse} />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="具体地址"
              >
                {getFieldDecorator('address', {
                    rules: [{
                      required: true, message: '请输入具体地址',
                    }],
                  })(
                    <Input maxLength="250" size="small" style={{ width: '300px' }} placeholder="请输入具体地址" />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="收货人名"
              >
                {getFieldDecorator('receiver', {
                  rules: [{
                    required: true, message: '请输入收货人',
                  }],
                })(
                  <Input maxLength="20" style={{ width: '200px' }} size="small" placeholder="请输入收货人" />
              )}
              </FormItem>
              <FormItem
                help={this.state.telNo}
                {...formItemLayout}
                label="联系电话"
              >
                {getFieldDecorator('telNo', {
                  rules: [{
                    validator: this.checkTelNo,
                  }],
                })(
                  <Input maxLength="25" style={{ width: '200px' }} size="small" />
              )}
                <span style={{ color: '#55d4fd', fontWeight: 'bold', marginLeft: '10px' }}>联系电话,联系手机必填一项</span>
              </FormItem>
              <FormItem
                help={this.state.phone}
                {...formItemLayout}
                label="联系手机"
              >
                {getFieldDecorator('mobileNo', {
                  rules: [{
                    validator: this.checkMobileNo,
                  }],
                })(
                  <Input maxLength="11" style={{ width: '200px' }} size="small" />
              )}
                <span style={{ color: '#55d4fd', fontWeight: 'bold', marginLeft: '10px' }}>联系电话,联系手机必填一项</span>
              </FormItem>
            </Card>
            <Card title={<div style={{ paddingLeft: 7 }}>发票信息</div>} bordered={false} style={{ width: '1000px' }}>
              <FormItem
                {...formItemLayout}
                label="发票类型"
              >
                {getFieldDecorator('invoiceType', {
                  rules: [{
                    required: this.props.form.getFieldValue('invoiceTitle') || this.props.form.getFieldValue('invoiceTaxNo'), message: '填写发票抬头或发票税号需选择发票类型',
                  }],
                })(
                  <CheckboxGroup onChange={this.invoiceType}>
                    <Checkbox value={0} disabled={this.state.invoiceType[0] !== 0 && this.state.invoiceType[0] !== undefined ? true : false}>个人</Checkbox>
                    <Checkbox value={1} disabled={this.state.invoiceType[0] !== 1 && this.state.invoiceType[0] !== undefined ? true : false}>公司</Checkbox>
                  </CheckboxGroup>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="发票抬头"
              >
                {getFieldDecorator('invoiceTitle', {
                  rules: [{
                    required: this.state.invoiceType.length, message: '请输入发票抬头',
                  }],
                })(
                  <Input onChange={this.invoiceChange} maxLength="500" style={{ width: '200px' }} size="small" />
              )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="发票税号"
                help={this.state.invoiceTaxNo}
              >
                {getFieldDecorator('invoiceTaxNo', {
                  rules: [{
                    required: this.state.invoiceType.length, message: '请输入发票税号',
                  }, {
                    validator: this.checkInvoiceTaxNo,
                  }],
                })(
                  <Input onChange={this.invoiceChange} maxLength="18" size="small" style={{ width: '200px' }} />
              )}
              </FormItem>
            </Card>
            <Card title={<div style={{ paddingLeft: 7 }}>买家留言及备注</div>} bordered={false} style={{ width: '800px' }}>
              <FormItem
                {...formItemLayout}
                label="买家留言"
              >
                {getFieldDecorator('buyerRemark', {
                  rules: [{
                    validator: this.remark.bind(this, 'buyerRemark'),
                  }],
                })(
                  <TextArea style={{ marginBottom: 10 }} rows={4} maxLength="250" />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="卖家备注"
              >
                {getFieldDecorator('sellerRemark', {
                  rules: [{
                    validator: this.remark.bind(this, 'sellerRemark'),
                  }],
                })(
                  <TextArea style={{ marginBottom: 10 }} rows={4} maxLength="250" />
              )}
              </FormItem>
              <span style={{ color: 'green', fontWeight: 'bold', marginLeft: 98 }}>订单商品请在建立订单信息后在订单明细中添加</span>
            </Card>
          </Form>
        </Modal>
        <OmBuyerT
          buyerChooseVisiable={this.state.OmBuyer}
          chooseBuyer={() => this.hideOmBuyer()}
          itemModalHidden={() => {
            this.setState({
              OmBuyer: false,
            })
            this.props.dispatch({
              type: 'omBuyerChoose/changeState',
              payload: { tabelToolbarJ: false },
            })
          }}
        />
      </div>)
  }
}
