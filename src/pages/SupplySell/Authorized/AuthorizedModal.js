/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-04-03 21:04:35
 * 新增/修改授信
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Input, Switch, Select, DatePicker, Button } from 'antd'
import moment from 'moment'
import numeral from 'numeral'
import config from '../../../utils/config'
import { addAuthorized, editAuthorized } from '../../../services/supplySell/authorized'

const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input

@Form.create()
@connect(state => ({
  authorized: state.authorized,
}))
export default class AuthorizedModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      checked: false,
      init: true,
      num: '',
      creditTime: '',
      expireTime: '',
      credit: moment().subtract(0, 'days'),
      expire: moment().subtract(0, 'days'),
      xiaoshu: 0,
      status: false,
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.record.autoExpire !== undefined && this.state.init) {
      this.setState({
        checked: nextProps.record.autoExpire === 0 ? false : !false,
        init: false,
        credit: moment(nextProps.record.creditTime),
        expire: moment(nextProps.record.expireTime),
        status: nextProps.record.status === 0 ? false : true,
      })
    }
  }
  onCredit = (e) => {
    this.setState({
      credit: e ? e : undefined,
    })
  }
  onExpire = (e) => {
    this.setState({
      expire: e ? e : undefined,
    })
  }
  checkCreditTime = (rule, value, callback) => {
    if (!value) {
      this.setState({
        creditTime: '请选择授信日期',
      })
      callback('error')
    } else if (this.state.expire && value.format('YYYY-MM-DD') >= this.state.expire.format('YYYY-MM-DD')) {
      this.setState({
        creditTime: '授信日期需小于过期日期',
      })
      callback('error')
    } else {
      const { getFieldValue, resetFields, setFieldsValue } = this.props.form
      const expireTime = getFieldValue('expireTime')
      resetFields('expireTime')
      setFieldsValue({ expireTime })
      callback()
      this.setState({
        creditTime: '',
        expireTime: '',
      })
      callback()
    }
  }
  checkExpireTime = (rule, value, callback) => {
    if (!value) {
      this.setState({
        expireTime: '请选择过期日期',
      })
      callback('error')
    } else if (this.state.credit && value.format('YYYY-MM-DD') <= this.state.credit.format('YYYY-MM-DD')) {
      this.setState({
        expireTime: '过期日期需大于授信日期',
      })
      callback('error')
    } else {
      const { getFieldValue, resetFields, setFieldsValue } = this.props.form
      const creditTime = getFieldValue('creditTime')
      resetFields('creditTime')
      setFieldsValue({ creditTime })
      callback()
      this.setState({
        creditTime: '',
        expireTime: '',
      })
      callback()
    }
  }
  checkNum = (rule, value1, callback) => {
    const value = value1 ? value1.indexOf(',') !== -1 ? value1.replace(/,/g, '') : value1 : undefined
    const bool = value ? (value.toString().indexOf('.') !== -1 ? (value.toString().split('.')[1].length > 2 ? !false : false) : false) : false
    if (value) {
      if (isNaN(value)) {
        this.setState({
          num: '授信金额请输入数字',
        })
        callback('error')
      } else if (value < 0) {
        this.setState({
          num: '请输入不小于0的数字',
        })
        callback('error')
      } else if (value <= 0) {
        this.setState({
          num: '授信金额必须大于0',
        })
        callback('error')
      } else if (value.indexOf(' ') !== -1) {
        this.setState({
          num: '授信金额不能输入空格',
        })
        callback('error')
      } else if (value.charAt([value.length - 1]) === '.') {
        this.setState({
          num: '授信金额不能以.结尾',
        })
        callback('error')
      } else if (bool) {
        this.setState({
          num: '小数位数不允许超过2位',
        })
        callback('error')
      } else if (value > 999999999.99) {
        this.setState({
          num: '授信金额不能大于999999999.99',
        })
        callback('error')
      } else {
        value.indexOf('.') !== -1 ?
        this.setState({
          xiaoshu: value.toString().split('.')[1].length,
        }, () => {
          const { setFieldsValue } = this.props.form
          this.state.xiaoshu === 1 ? setFieldsValue({
            creditAmount: numeral(value).format('0,0.0'),
          }) : setFieldsValue({
            creditAmount: numeral(value).format('0,0.00'),
          })
        })
        :
        this.setState({
          xiaoshu: 0,
        }, () => {
          const { setFieldsValue } = this.props.form
          setFieldsValue({
            creditAmount: numeral(value).format('0,0'),
          })
        })
        this.setState({
          num: '',
        })
        callback()
      }
    } else {
      this.setState({
        num: '请输入授信金额',
      })
      callback('error')
    }
  }
  switch = (e) => {
    this.setState({
      checked: e,
    })
  }
  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          confirmLoading: true,
        })
         if (this.props.record.distributorNo !== undefined) {
          Object.assign(values, {
            creditTime: values.creditTime.format('YYYY-MM-DD'),
            expireTime: values.expireTime.format('YYYY-MM-DD'),
            autoExpire: this.state.checked ? 1 : 0,
            creditAmount: values.creditAmount.indexOf(',') !== -1 ? values.creditAmount.replace(/,/g, '') : values.creditAmount,
            distributorName: typeof(values.distributorName) === 'string' ? 
              this.props.record.distributorName : this.props.authorized.distributorList.filter(ele => ele.distributorNo === values.distributorName)[0].distributorName,
            distributorNo: typeof(values.distributorName) === 'string' ? this.props.record.distributorNo : values.distributorName,
            autoNo: this.props.record.autoNo,
          })
          editAuthorized(values).then((json) => {
            if (json) {
              this.hideModal()
              this.props.dispatch({
                type: 'authorized/search',
              })
            } else {
              this.setState({
                confirmLoading: false,
              })
            }
          })
        } else {
          Object.assign(values, {
            creditTime: values.creditTime.format('YYYY-MM-DD'),
            expireTime: values.expireTime.format('YYYY-MM-DD'),
            autoExpire: values.autoExpire ? 1 : 0,
            creditAmount: values.creditAmount.indexOf(',') !== -1 ? values.creditAmount.replace(/,/g, '') : values.creditAmount,
            distributorName: this.props.authorized.distributorList.filter(ele => ele.distributorNo === values.distributorName)[0].distributorName,
            distributorNo: values.distributorName,
          })
          addAuthorized(values).then((json) => {
            if (json) {
              this.hideModal()
              this.props.dispatch({
                type: 'authorized/search',
              })
            } else {
              this.setState({
                confirmLoading: false,
              })
            }
          })
        }
      }
    })
  }

  // 关闭窗口
  hideModal = () => {
    const { hideModal } = this.props
    this.setState({
      confirmLoading: false,
      checked: false,
      init: true,
      num: '',
      creditTime: '',
      expireTime: '',
      status: false,
      credit: moment().subtract(0, 'days'),
      expire: moment().subtract(0, 'days'),
    })
    hideModal()
    this.handleReset()
  }
  // 清空表单
  handleReset = () => {
    this.props.form.resetFields()
  }
  disabledDate = (current) => {
    return current && current < moment().endOf('day')
  }
  render() {
    const { distributorList } = this.props.authorized
    const { getFieldDecorator } = this.props.form
    const { distributorNo, distributorName, creditTime, expireTime, creditAmount, remark } = this.props.record
    const { show } = this.props
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    }
    return (
      <div>
        <Modal
          title={distributorNo !== undefined ? '编辑授信' : '新增授信'}
          visible={show}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
          maskClosable={false}
          confirmLoading={this.state.confirmLoading}
          footer={this.state.status ?
            [
              <Button key="back" onClick={this.hideModal}>关闭</Button>,
            ]
          :
          [
            <Button key="back" onClick={this.hideModal}>取消</Button>,
            <Button key="submit" type="primary" loading={this.state.confirmLoading} onClick={this.handleSubmit}>
              确定
            </Button>,
          ]}
        >
          <Form
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="分销商"
            >
              {getFieldDecorator('distributorName', {
                initialValue: distributorName,
                rules: [{
                  required: true, message: '请选择分销商',
                }],
              })(
                <Select
                  disabled={this.state.status}
                  placeholder="请选择分销商"
                  size="small"
                  showSearch
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {distributorList.length ? distributorList.map(ele => <Option key={ele.distributorNo} value={ele.distributorNo}>{ele.distributorName}</Option>) : ''}
                </Select>
            )}
            </FormItem>
            <FormItem
              help={this.state.creditTime}
              {...formItemLayout}
              label="授信日期"
            >
              {getFieldDecorator('creditTime', {
                initialValue: creditTime ? moment(creditTime) : this.state.credit,
                rules: [{
                    required: true, message: '请选择授信日期',
                }, {
                  validator: this.checkCreditTime,
                }],
            })(
              <DatePicker disabled={this.state.status} onChange={this.onCredit} placeholder="请选择授信日期" size="small" />
            )}
            </FormItem>
            <FormItem
              help={this.state.expireTime}
              {...formItemLayout}
              label="过期日期"
            >
              {getFieldDecorator('expireTime', {
                initialValue: expireTime ? moment(expireTime) : this.state.expire,
                rules: [{
                  required: true, message: '请选择过期日期',
                }, {
                  validator: this.checkExpireTime,
                }],
            })(
              <DatePicker disabledDate={this.disabledDate} disabled={this.state.status} onChange={this.onExpire} placeholder="请选择过期日期" size="small" />
            )}
            </FormItem>
            <FormItem
              help={this.state.num}
              {...formItemLayout}
              label="授信金额"
            >
              {getFieldDecorator('creditAmount', {
                initialValue: creditAmount ? numeral(creditAmount).format('0,0.00') : undefined,
                rules: [{
                  required: true, message: '请输入授信金额',
                }, {
                  validator: this.checkNum,
                }],
              })(
                <Input readOnly={this.state.status} size={config.InputSize} placeholder="请输入授信金额" maxLength="14" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="自动过期"
            >
              <span>
                {getFieldDecorator('autoExpire')(
                  <Switch disabled={this.state.status} checked={this.state.checked} onChange={this.switch} />
              )}
                <span style={{ color: 'red' }}>当分销商还清所有欠款,自动作废授信</span>
              </span>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="备注"
            >
              {getFieldDecorator('remark', {
                initialValue: remark,
              })(
                <TextArea readOnly={this.state.status} rows={4} maxLength="200" />
            )}
            </FormItem>
          </Form>
        </Modal>
      </div>)
  }
}
