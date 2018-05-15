/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified time: 2018-02-08 09:18:49
 * 按时间下载
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Alert, Button, Radio, Col, Form, DatePicker, message } from 'antd'
import { autoDownSave } from '../../../services/order/search'

const RadioGroup = Radio.Group
const FormItem = Form.Item

@connect(state => ({
  search: state.search,
}))
@Form.create()
export default class TimeDownload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: null,
      startTime: '',
      endTime: '',
      start: undefined,
      end: undefined,
      loading: false,
    }
  }
  onStart = (e) => {
    this.setState({
      startTime: e ? e.format('YYYY-MM-DD') : undefined,
    })
    const { getFieldValue, setFieldsValue } = this.props.form
    const endTime = getFieldValue('endTime')
    if (!endTime) {
      setFieldsValue({ endTime: e })
    }
  }
  onEnd = (e) => {
    this.setState({
      endTime: e ? e.format('YYYY-MM-DD') : undefined,
    })
    const { getFieldValue, setFieldsValue } = this.props.form
    const startTime = getFieldValue('startTime')
    if (!startTime) {
      setFieldsValue({ startTime: e })
    }
  }
  onChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  }
  // 关闭窗口
  hideModal = () => {
    this.setState({
      value: null,
      startTime: '',
      endTime: '',
      start: undefined,
      end: undefined,
      loading: false,
    })
    this.props.hideModal()
    this.props.form.setFieldsValue({
      startTime: undefined,
      endTime: undefined,
    })
  }
  // 清空表单
  handleReset = () => {
    this.props.form.resetFields()
  }
  handleSubmit = (e) => {
    e.preventDefault()
    if (this.state.value === null) {
      message.warning('请选择一个店铺')
    } else {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.setState({
            loading: true,
          })
          Object.assign(values, {
            startTime: values.startTime.format('YYYY-MM-DD 00:00:00'),
            endTime: values.endTime.format('YYYY-MM-DD 23:59:59'),
            shopNo: this.state.value,
            downType: 'time',
          })
          console.log('values', values)
          autoDownSave(values).then((json) => {
            if (json) {
              this.hideModal()
              message.success('订单下载成功')
              this.props.dispatch({
                type: 'search/search',
              })
            }
            this.setState({
              loading: false,
            })
          })
        }
      })
    }
  }
  checkStartTime = (rule, value, callback) => {
    if (!value) {
      this.setState({
        start: '请选择订单开始时间',
      })
      callback('error')
    } else if (this.state.endTime && new Date(value.format('YYYY-MM-DD').replace(/-/g, '\/')) >= new Date(this.state.endTime.replace(/-/g, '\/'))) {
      this.setState({
        start: '开始时间必须小于结束时间',
      })
      callback('error')
    } else if (value && this.state.endTime) {
      const separator = '-'
      const startDates = value.format('YYYY-MM-DD').split(separator)
      const endDates = this.state.endTime.split(separator)
      const startDate = new Date(startDates[0], startDates[1] - 1, startDates[2])
      const endDate = new Date(endDates[0], endDates[1] - 1, endDates[2])
      if (parseInt(Math.abs(endDate - startDate ) / 1000 / 60 / 60 /24, 10) > 1) {
        this.setState({
          start: '开始时间和结束时间不能超过1天',
          end: '',
        })
        callback('error')
        const { getFieldValue, resetFields, setFieldsValue } = this.props.form
        const endTime = getFieldValue('endTime')
        resetFields('endTime')
        setFieldsValue({ endTime })
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
    } else {
      this.setState({
        start: '',
      })
      callback()
    }
  }
  checkEndTime = (rule, value, callback) => {
    if (!value) {
      this.setState({
        end: '请选择订单结束时间',
      })
      callback('error')
    } else if (this.state.startTime && new Date(value.format('YYYY-MM-DD').replace(/-/g, '\/')) <= new Date(this.state.startTime.replace(/-/g, '\/'))) {
      this.setState({
        end: '结束时间必须大于开始时间',
      })
      callback('error')
    } else if (value && this.state.startTime) {
      const separator = '-'
      const startDates = this.state.startTime.split(separator)
      const endDates = value.format('YYYY-MM-DD').split(separator)
      const startDate = new Date(startDates[0], startDates[1] - 1, startDates[2])
      const endDate = new Date(endDates[0], endDates[1] - 1, endDates[2])
      if (parseInt(Math.abs(endDate - startDate ) / 1000 / 60 / 60 /24, 10) > 1) {
        this.setState({
          start: '',
          end: '开始时间和结束时间不能超过1天',
        })
        callback('error')
        const { getFieldValue, resetFields, setFieldsValue } = this.props.form
        const startTime = getFieldValue('startTime')
        resetFields('startTime')
        setFieldsValue({ startTime })
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
    } else {
      this.setState({
        end: '',
      })
      callback()
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    }
    const { show } = this.props
    const { shopList } = this.props.search
    return (
      <div>
        <Modal
          title="手工下载订单[按时间]"
          visible={show}
          onCancel={this.hideModal}
          footer={[
            <Button key="1" onClick={this.hideModal}>关闭</Button>,
            <Button key="2" type="primary" onClick={this.handleSubmit} loading={this.state.loading}>立即下载</Button>,
          ]}
          bodyStyle={{ maxHeight: 500, overflowX: 'hidden', padding: 0, paddingBottom: '20px' }}
          maskClosable={false}
        >
          <Alert banner showIcon={false} message="在发现订单未及时同步或出现延迟的时候,可以进行手动下载" type="warning" />
          <Col span={11} style={{ overflow: 'hidden' }}>
            <RadioGroup style={{ padding: '10px' }} onChange={this.onChange} value={this.state.value}>
              {shopList && shopList.length ? shopList.map(ele => <Radio key={ele.shopNo} style={radioStyle} value={ele.shopNo}>{ele.shopName}</Radio>) : '暂无店铺'}
            </RadioGroup>
          </Col>
          <Col span={13} style={{ paddingRight: '10px', paddingLeft: '10px' }}>
            <Form
              style={{ marginTop: 8 }}
            >
              <FormItem
                help={this.state.start}
                label="订单开始时间"
              >
                {getFieldDecorator('startTime', {
                  rules: [{
                    required: true, message: '请选择订单开始时间',
                  }, {
                    validator: this.checkStartTime,
                  }],
                })(
                  <DatePicker size="small" onChange={this.onStart} />
              )}
              </FormItem>
              <FormItem
                help={this.state.end}
                label="订单结束时间(与开始时间间隔不能超过24小时)"
              >
                {getFieldDecorator('endTime', {
                  rules: [{
                    required: true, message: '请选择订单结束时间',
                  }, {
                    validator: this.checkEndTime,
                  }],
                })(
                  <DatePicker size="small" onChange={this.onEnd} />
              )}
              </FormItem>
            </Form>
          </Col>
        </Modal>
      </div>)
  }
}
