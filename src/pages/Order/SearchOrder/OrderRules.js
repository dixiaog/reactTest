/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-03-20 13:23:52
 * 订单规则
 */

import React, { Component } from 'react'
import { Modal, Form, Input, DatePicker, Select, Radio } from 'antd'
import moment from 'moment'
import { billList } from './BaseData'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const children = []
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>)
}

@Form.create()
export default class OrderRules extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      yanshi: '',
      startTime: '',
      endTime: '',
      start: '',
      end: '',
      downStartTime: '',
      downEndTime: '',
      downStart: '',
      downEnd: '',
    }
  }
  onStart = (e) => {
    this.setState({
      startTime: e ? e.format('YYYY-MM-DD') : undefined,
    })
  }
  onEnd = (e) => {
    this.setState({
      endTime: e ? e.format('YYYY-MM-DD') : undefined,
    })
  }
  downStart = (e) => {
    this.setState({
      downStartTime: e ? e.format('YYYY-MM-DD') : undefined,
    })
  }
  downEnd = (e) => {
    this.setState({
      downEndTime: e ? e.format('YYYY-MM-DD') : undefined,
    })
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          confirmLoading: true,
        })
        const params = []
        Object.assign(params, {
          startTime: values.startTime.format('YYYY-MM-DD'),
          endTime: values.endTime.format('YYYY-MM-DD'),
          kaishi: values.kaishi ? values.kaishi.format('YYYY-MM-DD') : null,
          jiezhi: values.jiezhi ? values.jiezhi.format('YYYY-MM-DD') : null,
          shopNo: values.shopNo,
          billType: values.billType,
          yanshi: values.yanshi,
          remark: values.remark,
          name: values.name,
        })
      }
    })
  }
  // 关闭窗口
  hideModal = () => {
    const { hideModal } = this.props
    this.setState({
      confirmLoading: false,
      start: '',
      end: '',
      downStart: '',
      downEnd: '',
    })
    hideModal()
    this.handleReset()
  }
   // 重置表单
   handleReset = () => {
    this.props.form.resetFields()
  }
  checkStartTime = (rule, value, callback) => {
    if (!value) {
      this.setState({
        start: '请选择开始时间',
      })
      callback('error')
    } else if (this.state.endTime && new Date(value.format('YYYY-MM-DD').replace(/-/g, '\/')) >= new Date(this.state.endTime.replace(/-/g, '\/'))) {
      this.setState({
        start: '开始时间必须小于结束时间',
      })
      callback('error')
    } else {
      const { getFieldValue, resetFields, setFieldsValue } = this.props.form
      const endTime = getFieldValue('endTime')
      resetFields('endTime')
      setFieldsValue({ endTime })
      callback()
      this.setState({
        start: '',
        end: '',
      })
      callback()
    }
  }
  checkEndTime = (rule, value, callback) => {
    if (!value) {
      this.setState({
        end: '请选择结束时间',
      })
      callback('error')
    } else if (this.state.startTime && new Date(value.format('YYYY-MM-DD').replace(/-/g, '\/')) <= new Date(this.state.startTime.replace(/-/g, '\/'))) {
      this.setState({
        end: '结束时间必须大于开始时间',
      })
      callback('error')
    } else {
      const { getFieldValue, resetFields, setFieldsValue } = this.props.form
      const startTime = getFieldValue('startTime')
      resetFields('startTime')
      setFieldsValue({ startTime })
      callback()
      this.setState({
        start: '',
        end: '',
      })
      callback()
    }
  }
  checkDownStart = (rule, value, callback) => {
    if (!value) {
      const { getFieldValue, resetFields, setFieldsValue } = this.props.form
      const jiezhi = getFieldValue('jiezhi')
      resetFields('jiezhi')
      setFieldsValue({ jiezhi })
      this.setState({
        downStart: '',
        downEnd: '',
      })
      callback()
    } else if (this.state.downEndTime && new Date(value.format('YYYY-MM-DD').replace(/-/g, '\/')) >= new Date(this.state.downEndTime.replace(/-/g, '\/'))) {
      this.setState({
        downStart: '开始下单时间必须小于截止下单时间',
      })
      callback('error')
    } else {
      const { getFieldValue, resetFields, setFieldsValue } = this.props.form
      const jiezhi = getFieldValue('jiezhi')
      resetFields('jiezhi')
      setFieldsValue({ jiezhi })
      callback()
      this.setState({
        downStart: '',
        downEnd: '',
      })
      callback()
    }
  }
  checkDownEnd = (rule, value, callback) => {
    if (!value) {
      const { getFieldValue, resetFields, setFieldsValue } = this.props.form
      const kaishi = getFieldValue('kaishi')
      resetFields('kaishi')
      setFieldsValue({ kaishi })
      this.setState({
        downStart: '',
        downEnd: '',
      })
      callback()
    } else if (this.state.downStartTime && new Date(value.format('YYYY-MM-DD').replace(/-/g, '\/')) <= new Date(this.state.downStartTime.replace(/-/g, '\/'))) {
      this.setState({
        downEnd: '截至下单时间必须大于开始下单时间',
      })
      callback('error')
    } else {
      const { getFieldValue, resetFields, setFieldsValue } = this.props.form
      const kaishi = getFieldValue('kaishi')
      resetFields('kaishi')
      setFieldsValue({ kaishi })
      callback()
      this.setState({
        downStart: '',
        downEnd: '',
      })
      callback()
    }
  }
  // 检验延时
  checkYanshi = (rule, value, callback) => {
    const reg = /^[0-9]+$/
    if (!value) {
      this.setState({
        yanshi: '请输入延时审核时间',
      })
      callback('error')
    } else if (!reg.test(value)) {
      this.setState({
        yanshi: '延时审核时间必须为整数(提示:整数后不要携带小数)',
      })
      callback('error')
    } else {
      this.setState({
        yanshi: '',
      })
      callback()
    }
  }
  render() {
    const { show } = this.props
    const { name, startTime, endTime, kaishi, jiezhi, supplierName, billDate, relativeBillNo } = this.props.record
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    }
    return (
      <div>
        <Modal
          title="订单自动确认规则设置"
          visible={show}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          width={800}
          maskClosable={false}
          confirmLoading={this.state.confirmLoading}
        >
          <Form
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="规则名称"
            >
              {getFieldDecorator('name', {
                initialValue: name,
                rules: [{
                  required: true, message: '请输入规则名称',
                }],
              })(
                <Input size="small" placeholder="请输入规则名称" style={{ width: '300px' }} />
            )}
            </FormItem>
            <FormItem
              help={this.state.start}
              {...formItemLayout}
              label="开始时间"
            >
              {getFieldDecorator('startTime', {
                initialValue: startTime ? moment(startTime) : undefined,
                rules: [{
                  required: true, message: '请选择开始时间',
                }, {
                  validator: this.checkStartTime,
                }],
              })(
                <DatePicker onChange={this.onStart} size="small" placeholder="请选择开始时间" />
            )}
            </FormItem>
            <FormItem
              help={this.state.end}
              {...formItemLayout}
              label="结束时间"
            >
              {getFieldDecorator('endTime', {
                initialValue: endTime ? moment(endTime) : undefined,
                rules: [{
                  required: true, message: '请选择结束时间',
                }, {
                  validator: this.checkEndTime,
                }],
              })(
                <DatePicker onChange={this.onEnd} size="small" placeholder="请选择结束时间" />
            )}
            </FormItem>
            <FormItem
              help={this.state.downStart}
              {...formItemLayout}
              label="开始下单时间"
            >
              {getFieldDecorator('kaishi', {
                initialValue: kaishi ? moment(kaishi) : undefined,
                rules: [{
                  validator: this.checkDownStart,
                }],
              })(
                <DatePicker onChange={this.downStart} size="small" />
            )}
            </FormItem>
            <FormItem
              help={this.state.downEnd}
              {...formItemLayout}
              label="截至下单时间"
            >
              {getFieldDecorator('jiezhi', {
                initialValue: jiezhi ? moment(jiezhi) : undefined,
                rules: [{
                  validator: this.checkDownEnd,
                }],
              })(
                <DatePicker onChange={this.downEnd} size="small" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="是否含有买家留言"
            >
              {getFieldDecorator('remark', {
                initialValue: supplierName ? 0 : 1,
              })(
                <RadioGroup>
                  <Radio value={0}>含有留言</Radio>
                  <Radio value={1}>不含有留言</Radio>
                </RadioGroup>
            )}
              <span style={{ color: 'green', fontWeight: 'bold' }}>默认不自动审核含有留言的订单,如果勾选,将会忽略买家留言的订单,会一并审核</span>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="指定店铺"
            >
              {getFieldDecorator('shopNo', {
                initialValue: billDate,
              })(
                <Select
                  mode="multiple"
                  size="small"
                  style={{ width: '100%' }}
                >
                  {children}
                </Select>
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="限定订单类型"
            >
              {getFieldDecorator('billType', {
                initialValue: relativeBillNo,
              })(
                <Select
                  mode="multiple"
                  size="small"
                  style={{ width: '100%' }}
                >
                  {billList.map(ele => <Option key={ele.key}>{ele.title}</Option>)}
                </Select>
            )}
            </FormItem>
            <FormItem
              help={this.state.yanshi}
              {...formItemLayout}
              label="延时审核"
            >
              {getFieldDecorator('yanshi', {
                rules: [{
                  required: true, message: '请输入延时审核时间',
                }, {
                  validator: this.checkYanshi,
                }],
              })(
                <Input style={{ width: '144px' }} size="small" placeholder="请输入延时审核时间" />
            )}
              <span style={{ color: 'green', fontWeight: 'bold' }}>单位:分,如果0表示不自动审核,当≥1的时候,会自动延迟时间值审核订单</span>
            </FormItem>
          </Form>
        </Modal>
      </div>)
  }
}
