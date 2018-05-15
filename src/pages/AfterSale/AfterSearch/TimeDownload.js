/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified time: 2018-02-08 09:18:49
 * 按时间下载
 */


import React, { Component } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Modal, Alert, Button, Radio, Col, Form, DatePicker, message } from 'antd'
import { autoDownSave } from '../../../services/aftersale/afterSearch'

const RadioGroup = Radio.Group
const FormItem = Form.Item

@connect(state => ({
  afterSearch: state.afterSearch,
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
      startTime: e ? e.format('YYYY-MM-DD HH:mm:ss') : undefined,
    })
  }
  onEnd = (e) => {
    this.setState({
      endTime: e ? e.format('YYYY-MM-DD HH:mm:ss') : undefined,
    })
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
            startTime: values.startTime.format('YYYY-MM-DD HH:mm:ss'),
            endTime: values.endTime.format('YYYY-MM-DD HH:mm:ss'),
            shopNo: this.state.value,
            downType: 'time',
          })
          autoDownSave(values).then((json) => {
            if (json) {
              this.hideModal()
            } else {
              this.setState({
                loading: false,
              })
            }
          })
        }
      })
    }
  }
  checkStartTime = (rule, value, callback) => {
    if (!value) {
      this.setState({
        start: '请选择订单申请时间',
      })
      callback('error')
    } else if (value && this.state.endTime) {
      const startTime = this.state.endTime.split(' ')
      const endTime = value.format('YYYY-MM-DD HH:mm:ss').split(' ')
      const header = startTime[0].split('-')
      const footer = startTime[1].split(':')
      const header1 = endTime[0].split('-')
      const footer1 = endTime[1].split(':')
      const a = moment([Number(header[0]), Number(header[1]), Number(header[2]), Number(footer[0]), Number(footer[1]), Number(footer[2])])
      const b = moment([Number(header1[0]), Number(header1[1]), Number(header1[2]), Number(footer1[0]), Number(footer1[1]), Number(footer1[2])])
      if (Math.abs(b.diff(a)) > 86400000 || a.diff(b) < 0) {
        this.setState({
          start: a.diff(b) < 0 ? '申请时间不能大于结束时间' : '申请时间和结束时间不能超过1天',
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
    } else if (value && this.state.startTime) {
      const startTime = this.state.startTime.split(' ')
      const endTime = value.format('YYYY-MM-DD HH:mm:ss').split(' ')
      const header = startTime[0].split('-')
      const footer = startTime[1].split(':')
      const header1 = endTime[0].split('-')
      const footer1 = endTime[1].split(':')
      const a = moment([Number(header[0]), Number(header[1]), Number(header[2]), Number(footer[0]), Number(footer[1]), Number(footer[2])])
      const b = moment([Number(header1[0]), Number(header1[1]), Number(header1[2]), Number(footer1[0]), Number(footer1[1]), Number(footer1[2])])
      if (Math.abs(b.diff(a)) > 86400000 || b.diff(a) < 0) {
        this.setState({
          start: '',
          end: b.diff(a) < 0 ? '结束时间不能小于申请时间' : '申请时间和结束时间不能超过1天',
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
    const { shopList } = this.props.afterSearch
    return (
      <div>
        <Modal
          title="手工下载售后单[按时间]"
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
              {shopList.length ? shopList.map(ele => <Radio key={ele.shopNo} style={radioStyle} value={ele.shopNo}>{ele.shopName}</Radio>) : null}
            </RadioGroup>
          </Col>
          <Col span={13} style={{ paddingRight: '10px', paddingLeft: '10px' }}>
            <Form
              style={{ marginTop: 8 }}
            >
              <FormItem
                help={this.state.start}
                label="申请时间"
              >
                {getFieldDecorator('startTime', {
                  rules: [{
                    required: true, message: '请选择申请时间',
                  }, {
                    validator: this.checkStartTime,
                  }],
                })(
                  <DatePicker
                    format="YYYY-MM-DD HH:mm:ss"
                    size="small"
                    onChange={this.onStart}
                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  />
              )}
              </FormItem>
              <FormItem
                help={this.state.end}
                label="结束时间(与申请时间间隔不能超过24小时)"
              >
                {getFieldDecorator('endTime', {
                  rules: [{
                    required: true, message: '请选择结束时间',
                  }, {
                    validator: this.checkEndTime,
                  }],
                })(
                  <DatePicker
                    format="YYYY-MM-DD HH:mm:ss"
                    size="small"
                    onChange={this.onEnd}
                    showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                  />
              )}
              </FormItem>
            </Form>
          </Col>
        </Modal>
      </div>)
  }
}
