/*
 * @Author: tanmengjia
 * @Date: 2018-02-10 16:34:51
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-02 09:18:53
 * 订单自动确认规则设置
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Modal, Select, Form, Input, Col, Row, DatePicker, Checkbox, notification, InputNumber } from 'antd'
import config from '../../../../utils/config'
import { saveApprove } from '../../../../services/order/approveStrategy'

const FormItem = Form.Item
const Option = Select.Option
const CheckboxGroup = Checkbox.Group

@connect(state => ({
  approveStrategy: state.approveStrategy,
}))
@Form.create()
export default class ApproveStrategyModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isIn: false,
      begin: undefined,
      end: undefined,
      begin1: undefined,
      end1: undefined,
    }
  }
  componentDidMount() {
    this.props.dispatch({ type: 'approveStrategy/getShopName' })
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.approveStrategy.chooseData) {
      this.setState({
        isIn: nextProps.approveStrategy.chooseData.ignoreBuyerMessage,
      })
    }
  }
  onBegin = (e) => {
    this.setState({
      begin: e ? e.format('YYYY-MM-DD') : undefined,
    })
  }
  onEnd = (e) => {
    this.setState({
      end: e ? moment(e).format('YYYY-MM-DD') : undefined,
    })
  }
  onBegin1 = (e) => {
    this.setState({
      begin1: e ? moment(e).format('YYYY-MM-DD') : undefined,
    })
  }
  onEnd1 = (e) => {
    this.setState({
      end1: e ? moment(e).format('YYYY-MM-DD') : undefined,
    })
  }
  isIn = (e) => {
    this.setState({
      isIn: e.target.checked,
    })
  }
  handleCancel = () => {
    this.props.form.resetFields()
    this.props.itemModalHidden()
    this.setState({
      isIn: false,
      begin: undefined,
      end: undefined,
      begin1: undefined,
      end1: undefined,
    })
  }
  handleOk = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        Object.assign(values, { beginTime: moment(values.beginTime).format('YYYY-MM-DD'), endTime: moment(values.endTime).format('YYYY-MM-DD') })
        Object.assign(values, {
          beginOrderTime: values.beginOrderTime ? moment(values.beginOrderTime).format('YYYY-MM-DD') : '',
          endOrderTime: values.endOrderTime ? moment(values.endOrderTime).format('YYYY-MM-DD') : '' })
        Object.assign(values, { ignoreBuyerMessage: this.state.isIn ? 1 : 0 })
        if (this.props.approveStrategy.chooseData && this.props.approveStrategy.chooseData.strategyNo) {
          Object.assign(values, { strategyNo: this.props.approveStrategy.chooseData.strategyNo })
        }
        if (values.specifyFlag.length) {
          Object.assign(values, { specifyFlag: values.specifyFlag.join(',') })
        } else {
          Object.assign(values, { specifyFlag: 0 })
        }
        if (values.specifyShop && values.specifyShop.length) {
          Object.assign(values, { specifyShop: values.specifyShop.join(',') })
        } else {
          Object.assign(values, { specifyShop: '' })
        }
        if (values.limitOrderType === undefined) {
          Object.assign(values, { limitOrderType: 99 })
        }
        saveApprove(values).then((json) => {
          if (json) {
            this.props.form.resetFields()
            this.props.itemModalHidden()
            this.props.dispatch({ type: 'approveStrategy/fetch' })
            notification.success({
              message: '操作成功',
            })
            this.setState({
              isIn: false,
              begin: undefined,
              end: undefined,
              begin1: undefined,
              end1: undefined,
            })
          }
        })
      }
    })
  }
  checkBeginTime = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (this.state.end && new Date(value.format('YYYY-MM-DD').replace(/-/g, '\/')) >= new Date(this.state.end.replace(/-/g, '\/'))) {
      callback('开始日期必须小于结束日期')
    } else {
      const { getFieldValue, resetFields, setFieldsValue } = this.props.form
      const endTime = getFieldValue('endTime')
      resetFields('endTime')
      setFieldsValue({ endTime })
      callback()
    }
  }
  checkEndTime = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (this.state.begin && new Date(value.format('YYYY-MM-DD').replace(/-/g, '\/')) <= new Date(this.state.begin.replace(/-/g, '\/'))) {
      callback('结束日期必须大于开始日期')
    } else {
      const { getFieldValue, resetFields, setFieldsValue } = this.props.form
      const beginTime = getFieldValue('beginTime')
      resetFields('beginTime')
      setFieldsValue({ beginTime })
      callback()
    }
  }
  checkBeginTime1 = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (this.state.end1 && new Date(value.format('YYYY-MM-DD').replace(/-/g, '\/')) >= new Date(this.state.end1.replace(/-/g, '\/'))) {
      callback('开始下单时间必须小于截止下单时间')
    } else {
      const { getFieldValue, resetFields, setFieldsValue } = this.props.form
      const endOrderTime = getFieldValue('endOrderTime')
      resetFields('endOrderTime')
      setFieldsValue({ endOrderTime })
      callback()
    }
  }
  checkEndTime1 = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (this.state.begin1 && new Date(value.format('YYYY-MM-DD').replace(/-/g, '\/')) <= new Date(this.state.begin1.replace(/-/g, '\/'))) {
      callback('截止下单时间必须大于开始下单时间')
    } else {
      const { getFieldValue, resetFields, setFieldsValue } = this.props.form
      const beginOrderTime = getFieldValue('beginOrderTime')
      resetFields('beginOrderTime')
      setFieldsValue({ beginOrderTime })
      callback()
    }
  }
  checkBlank = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (value.indexOf(' ') !== -1) {
        callback('规则名称不能输入空格')
      } else {
        callback()
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const {
      strategyName,
      beginTime,
      endTime,
      beginOrderTime,
      endOrderTime, specifyShop, limitOrderType, delayApprove, specifyFlag } = this.props.approveStrategy.chooseData ? this.props.approveStrategy.chooseData : ''
    const specifyFlag1 = specifyFlag && specifyFlag !== '0' ? specifyFlag.split(',') : []
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
        md: { span: 18 },
      },
    }
    const formItemLayout1 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 12 },
      },
    }
    const formItemLayout4 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 12 },
      },
    }
    const formItemLayout2 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
        md: { span: 20 },
      },
    }

    return (
      <Modal
        maskClosable={false}
        title="订单自动确认规则设置"
        visible={this.props.approveModalVisiable}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
        width={1000}
        key="997"
      >
        <Form
          key="996"
          style={{ marginTop: 8 }}
        >
          <Row>
            <Col span={16}>
              <FormItem
                {...formItemLayout}
                label="规则名称"
              >
                {getFieldDecorator('strategyName', {
                  initialValue: strategyName,
                  rules: [{
                    required: true, message: '请输入规则名称',
                  },
                  {
                    validator: this.checkBlank,
                  }],
              })(
                <Input size={config.InputSize} maxLength="50" />
              )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem
                {...formItemLayout1}
                label="开始时间"
              >
                {getFieldDecorator('beginTime', {
                  initialValue: beginTime && moment(moment(beginTime).format('YYYY-MM-DD'), 'YYYY-MM-DD') !== '1899-11-30' ? moment(moment(beginTime).format('YYYY-MM-DD'), 'YYYY-MM-DD') : undefined,
                  rules: [{
                    required: true, message: '请选择开始时间',
                  }, {
                    validator: this.checkBeginTime,
                  }],
              })(
                // <Input size={config.InputSize} />
                <DatePicker size={config.InputSize} onChange={this.onBegin} />
              )}
              </FormItem>
            </Col>
            <Col span={16}>
              <FormItem
                {...formItemLayout4}
                label="结束时间"
              >
                {getFieldDecorator('endTime', {
                  initialValue: endTime && moment(moment(beginTime).format('YYYY-MM-DD'), 'YYYY-MM-DD') !== '1899-11-30' ? moment(moment(endTime).format('YYYY-MM-DD'), 'YYYY-MM-DD') : undefined,
                  rules: [{
                    required: true, message: '请选择结束时间',
                  }, {
                    validator: this.checkEndTime,
                  }],
              })(
                // <Input size={config.InputSize} />
                <DatePicker size={config.InputSize} onChange={this.onEnd} />
                // onChange={this.onEnd}
              )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem
                {...formItemLayout1}
                label="开始下单时间"
              >
                {getFieldDecorator('beginOrderTime', {
                  initialValue: beginOrderTime && moment(beginOrderTime).format('YYYY-MM-DD') !== '1899-11-30' ? moment(moment(beginOrderTime).format('YYYY-MM-DD'), 'YYYY-MM-DD') : undefined,
                  rules: [{
                    validator: this.checkBeginTime1,
                  }],
              })(
                // <Input size={config.InputSize} />
                <DatePicker size={config.InputSize} onChange={this.onBegin1} />
                // onChange={this.onBegin}
              )}
              </FormItem>
            </Col>
            <Col span={16}>
              <FormItem
                {...formItemLayout4}
                label="截止下单时间"
              >
                {getFieldDecorator('endOrderTime', {
                  initialValue: endOrderTime && moment(endOrderTime).format('YYYY-MM-DD')!== '1899-11-30' ? moment(moment(endOrderTime).format('YYYY-MM-DD'), 'YYYY-MM-DD') : undefined,
                  rules: [{
                    validator: this.checkEndTime1,
                  }],
              })(
                <DatePicker size={config.InputSize} onChange={this.onEnd1} />
              )}
              </FormItem>
            </Col>
          </Row>
          <Col span={2}>
            <div style={{ marginTop: 5 }} />
          </Col>
          <Col span={4} style={{ marginLeft: 25 }} >
            <Checkbox onChange={this.isIn} style={{ marginTop: 5 }} checked={this.state.isIn}>订单含有买家留言</Checkbox>
          </Col>
          <div style={{ color: 'green', marginTop: 5 }} >默认不自动审核含有留言的订单，如果勾选，将会忽略买家留言的订单，也一并审核</div>
          <br />
          <Row>
            <Col span={16}>
              <FormItem
                {...formItemLayout}
                label="指定店铺"
              >
                {getFieldDecorator('specifyShop', {
                  initialValue: specifyShop ? specifyShop.split(',') : [],
              })(
                <Select size={config.InputSize} mode="multiple" placeholder="店铺,不设定则全部有效">
                  {this.props.approveStrategy.lists && this.props.approveStrategy.lists.length ?
                    this.props.approveStrategy.lists.map(ele => <Option key={ele.shopNo} value={String(ele.shopNo)}>{ele.shopName}</Option>) : ''}
                </Select>
              )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={16}>
              <FormItem
                {...formItemLayout}
                label="限定订单类型"
              >
                {getFieldDecorator('limitOrderType', {
                  initialValue: limitOrderType,
              })(
                <Select size={config.InputSize} placeholder="订单类型,不设定则全部有效">
                  <Option value={99}>全部生效</Option>
                  <Option value={0}>普通订单</Option>
                  <Option value={1}>补发订单</Option>
                  <Option value={2}>换货订单</Option>
                  <Option value={3}>天猫分销</Option>
                  <Option value={4}>天猫供销</Option>
                  <Option value={5}>协同订单</Option>
                </Select>
              )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={16}>
              <FormItem
                {...formItemLayout}
                label="指定小旗"
              >
                {getFieldDecorator('specifyFlag', {
                  initialValue: specifyFlag1,
              })(
                <CheckboxGroup key="992">
                  <Checkbox value="1"><img alt="" src={require('../../../../images/redFlag.png')} style={{ width: '18px', height: '18px' }} /></Checkbox>
                  <Checkbox value="2"><img alt="" src={require('../../../../images/yellowFlag.png')} style={{ width: '18px', height: '18px' }} /></Checkbox>
                  <Checkbox value="3"><img alt="" src={require('../../../../images/greenFlag.png')} style={{ width: '18px', height: '18px' }} /></Checkbox>
                  <Checkbox value="4"><img alt="" src={require('../../../../images/blueFlag.png')} style={{ width: '18px', height: '18px' }} /></Checkbox>
                  <Checkbox value="5"><img alt="" src={require('../../../../images/purpleFlag.png')} style={{ width: '18px', height: '18px' }} /></Checkbox>
                </CheckboxGroup>
              )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={16}>
              <FormItem
                {...formItemLayout2}
                label="支付后延时审核"
              >
                {getFieldDecorator('delayApprove', {
                  initialValue: delayApprove,
                  rules: [{
                    required: true, message: '请输入延迟时间',
                  }],
              })(
                <InputNumber size={config.InputSize} min={0} max={99999999999} />
              )}
                <span style={{ color: 'green', marginLeft: 25 }}>单位:分,如果0表示不自动审核,当>=1的时候，会自动延迟时间值审核订单</span>
              </FormItem>
            </Col>

          </Row>
        </Form>
      </Modal>
        )
  }
}
