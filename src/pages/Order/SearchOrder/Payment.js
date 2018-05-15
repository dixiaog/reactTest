/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-11 16:18:13
 * 支付方式
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Select, DatePicker, Input } from 'antd'
import { insertManualPaySingle } from '../../../services/order/search'
import { payment } from './BaseData'

const FormItem = Form.Item
const Option = Select.Option
@connect(state => ({
  orderDetail: state.orderDetail,
}))
@Form.create()
export default class Payment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      payAmount: '',
      checkNick: true,
    }
  }
  handleSubmit = () => {
    const { isMerge, siteOrderNo } = this.props.record
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.setState({
          confirmLoading: true,
        })
        Object.assign(values, {
          billDate: values.billDate.format('YYYY-MM-DD'),
          innerNo: this.props.record.orderNo,
          modeName: payment.filter(ele => ele.key === values.modeNo)[0].title,
          onlineNo: isMerge ? this.siteOrderNo(siteOrderNo) : null,
        })
        insertManualPaySingle(values).then((json) => {
          if (json) {
            this.hideModal()
            this.props.getBack(json)
            this.props.listLog()
          }
          this.setState({
            confirmLoading: false,
          })
        })
      }
    })
  }
  siteOrderNo = (siteOrderNo) => {
    if (siteOrderNo.indexOf(',') === -1) {
      return siteOrderNo
    } else {
      return siteOrderNo.split(',')[siteOrderNo.split(',').length - 1]
    }
  } 
  // 关闭窗口
  hideModal = () => {
    this.props.hideModal()
    this.handleReset()
    this.setState({
      confirmLoading: false,
      payAmount: '',
      checkNick: true,
    })
  }
  // 清空表单
  handleReset = () => {
    this.props.form.resetFields()
  }
  handleChange = (e) => {
    if (e === 2) {
      this.setState({
        checkNick: false,
      })
      this.props.form.setFields({
        billNo: {
          value: '',
          error: '',
        },
      })
    } else {
      this.setState({
        checkNick: true,
      })
    }
  }
  checkNum = (rule, value, callback) => {
    const bool = value ? (value.toString().indexOf('.') !== -1 ? (value.toString().split('.')[1].length > 2 ? !false : false) : false) : false
    if (value) {
      if (isNaN(value)) {
        this.setState({
          payAmount: '金额请输入数字',
        })
        callback('error')
      } else if (value.charAt(0) === '.') {
        this.setState({
          payAmount: '金额不能以.开始',
        })
        callback('error')
      } else if (value <= 0) {
        this.setState({
          payAmount: '金额必须大于0',
        })
        callback('error')
      } else if (value >= 100000000) {
        this.setState({
          payAmount: '金额必须小于100000000',
        })
        callback('error')
      } else if (value.charAt([value.length - 1]) === '.') {
        this.setState({
          payAmount: '金额不能以.结尾',
        })
        callback('error')
      } else if (value.indexOf(' ') !== -1) {
        this.setState({
          payAmount: '金额不能输入空格',
        })
        callback('error')
      } else if (bool) {
        this.setState({
          payAmount: '金额小位数不允许超过2位',
        })
        callback('error')
      } else {
        this.setState({
          payAmount: '',
        })
        callback()
      }
    } else {
      this.setState({
        payAmount: '请输入支付金额',
      })
      callback('error')
    }
  }
  render() {
    const { show } = this.props
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 14 },
    }
    return (
      <div>
        <Modal
          title="添加新的支付"
          visible={show}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          maskClosable={false}
          confirmLoading={this.state.confirmLoading}
          width={600}
        >
          <Form
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="支付方式"
            >
              {getFieldDecorator('modeNo', {
                rules: [{
                  required: true, message: '请选择支付方式',
                }],
              })(
                <Select
                  onChange={this.handleChange}
                  style={{ width: 200 }}
                  size="small"
                  placeholder="请选择支付方式"
                >
                  {payment.map(ele => <Option value={ele.key} key={ele.key}>{ele.title}</Option>)}
                </Select>
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="支付日期"
            >
              {getFieldDecorator('billDate', {
                rules: [{
                  required: true, message: '请选择支付日期',
                }],
              })(
                <DatePicker size="small" placeholder="请选择支付日期" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="支付单号"
            >
              {getFieldDecorator('billNo', {
                rules: [{
                  required: this.state.checkNick, message: '请输入支付单号',
                }],
              })(
                <Input maxLength="50" style={{ width: 200 }} size="small" placeholder={this.state.checkNick ? '请输入支付单号' : ''} />
            )}
              <span style={{ color: 'red', marginLeft: 10 }}>除现金支付外必填</span>
            </FormItem>
            <FormItem
              help={this.state.payAmount}
              {...formItemLayout}
              label="支付金额"
            >
              {getFieldDecorator('amount', {
                rules: [{
                  required: true, message: '请输入支付金额',
                }, {
                  validator: this.checkNum,
                }],
              })(
                <Input maxLength="12" style={{ width: 200 }} size="small" placeholder="请输入支付金额" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="支付账号"
            >
              {getFieldDecorator('payAccount')(
                <Input maxLength="50" style={{ width: 200 }} size="small" />
            )}
            </FormItem>
          </Form>
        </Modal>
      </div>)
  }
}
