/*
 * @Author: chenjie
 * @Date: 2017-12-08 18:04:11
 * @Last Modified by: chenjie
 * 新增库存锁定单
 * @Last Modified time: 2018-05-05 14:26:28
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Input, Select, DatePicker, Alert } from 'antd'
import moment from 'moment'
import numeral from 'numeral'
import config from '../../../utils/config'
import { addDeposit } from '../../../services/supplySell/accountBalance'
import { moneyCheck } from '../../../utils/utils'

const FormItem = Form.Item
const { Option } = Select
@Form.create()
@connect(state => ({
  accountBalance: state.accountBalance,
}))
export default class AccountDepositModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
          confirmLoading: false,
        }
    }
    // nextProps.lists.bdSkuDTO.
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
      this.props.form.validateFieldsAndScroll({ force: true }, (err, values) => {
        if (!err) {
            Object.assign(values, {
              strBillDate: new Date(values.strBillDate).toLocaleDateString(),
              amount: values.amount.replace(/,/g, ''),
              distributorName: this.props.distributorName,
          })
            if (this.props.fundType === 21) {
              Object.assign(values, { fundType: 2, addSubtract: -1 })
            } else {
              Object.assign(values, { fundType: this.props.fundType, addSubtract: 1 })
            }
            if (this.props.fundType === 6) {
              Object.assign(values, {
                supplierNo: this.props.supplierNo,
              })
            } else {
              Object.assign(values, {
                distributorNo: this.props.distributorNo,
              })
            }
            this.setState({
              confirmLoading: true,
            })
            addDeposit(values).then((json) => {
              if (json) {
                this.props.dispatch({
                  type: 'accountBalance/fetch',
                  payload: { disSupTypeNo: this.props.disSupTypeNo },
                })
                this.handleCancel()
              } else {
                this.setState({
                  confirmLoading: false,
                })
              }
            })
        }
      })
    }
    moneyCheckFormat = (rule, value, callback) => {
      const newVal = value ? value.toString().replace(/,/g, '') : ''
      if (moneyCheck(newVal) && newVal * 1 > 0) {
        if(this.props.fundType === 6 && newVal>this.props.availableBalance) {
          callback('提现金额不足')
        } else{
          callback()
        }
      } else {
        callback('格式错误')
      }
    }
    handleAmount = (e) => {
      const { setFieldsValue } = this.props.form
      setFieldsValue({
        amount: numeral(e.target.value).format('0,0.00'),
      })
    }
    render() {
      const { getFieldDecorator, getFieldValue } = this.props.form
      const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
            md: { span: 6 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 12 },
            md: { span: 12 },
          },
        }
      let title = ''
      switch (this.props.fundType) {
        case 0:
        title = ''
        break
        case 2:
        title = '登记保证金'
        break
        case 21:
        title = '退换保证金'
        break
        case 3:
        title = '登记付款'
        break
        case 4:
        title = '奖励'
        break
        case 5:
        title = '罚款'
        break
        case 6:
        title = '申请提现'
        break
        default:
        title = ''
        break
      }
      return (
        <div>
          <Modal
            maskClosable={false}
            title={`${title}(${this.props.distributorName})`}
            visible={this.props.visiable}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            confirmLoading={this.state.confirmLoading}
          >
            <Alert type="warning" message="注: 一旦确认需要财务审核完成才能生效" />
            <Form
              onSubmit={this.handleSubmit}
              style={{ marginTop: 8 }}
            >
              <FormItem
                {...formItemLayout}
                label="支付单号"
              >
                {getFieldDecorator('billNo', {
                })(
                  <Input maxLength="50" size={config.InputSize} />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="分销商支付账号"
              >
                {getFieldDecorator('payAccount', {
                  rules: [{
                    required: [0, 1, 3, 4, 5, 6, 7].indexOf(getFieldValue('modeNo')) > -1, message: '请填写支付账户',
                  }],
                })(
                  <Input maxLength="50" size={config.InputSize} />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="支付时间"
              >
                {getFieldDecorator('strBillDate', {
                  initialValue: moment(),
                })(
                  <DatePicker size={config.InputSize} />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="支付方式"
              >
                {getFieldDecorator('modeNo', {
                    rules: [{
                      required: true, message: '请选择支付方式',
                    }],
                })(
                  <Select size="small" style={{ marginTop: 4 }}>
                    <Option value={0}>支付宝</Option>
                    <Option value={1}>银行转账</Option>
                    <Option value={2}>现金支付</Option>
                    <Option value={3}>京东-货到付款</Option>
                    <Option value={4}>京东-在线支付</Option>
                    <Option value={5}>京东-分期付款</Option>
                    <Option value={6}>京东-公司转账</Option>
                    <Option value={7}>唯品会</Option>
                    <Option value={8}>内部流转</Option>
                    <Option value={9}>供销支付</Option>
                    <Option value={10}>快速支付</Option>
                    <Option value={11}>其他</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="支付金额"
              >
                {getFieldDecorator('amount', {
                    rules: [{
                        required: true,
                        // validateTrigger: ['onBlur'],
                        validator: this.moneyCheckFormat.bind(this),
                      }],
                })(
                  <Input onBlur={this.handleAmount.bind(this)} size={config.InputSize} />
                )}
              </FormItem>
              {this.props.fundType === 3 ?
                <FormItem
                  {...formItemLayout}
                  label="资金类型"
                >
                  {getFieldDecorator('fundType', {
                    rules: [{
                      required: true, message: '请选择登记类型',
                    }],
                  })(
                    <Select size="small" style={{ marginTop: 4 }}>
                      <Option value={3}>预付款</Option>
                      <Option value={20}>其他</Option>
                    </Select>
                  )}
                </FormItem> : null}
              <FormItem
                {...formItemLayout}
                label="备注"
              >
                {getFieldDecorator('remark', {
                })(
                  <Input.TextArea maxLength="200" rows={6} />
                )}
              </FormItem>
            </Form>
          </Modal>
        </div>
      )
    }
}
