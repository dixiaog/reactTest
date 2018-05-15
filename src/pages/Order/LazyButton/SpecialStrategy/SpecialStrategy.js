/*
 * @Author: tanmengjia
 * @Date: 2018-02-07 10:38:27
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-04-19 10:03:33
 * 特殊订单标识
 */
import React, { Component } from 'react'
import moment from 'moment'
import { connect } from 'dva'
import { Modal, Select, Form, Input, notification, Col, Row, DatePicker, Checkbox, Alert } from 'antd'
import config from '../../../../utils/config'
import { saveSpecialStrategy } from '../../../../services/order/orderList'

const FormItem = Form.Item
const Option = Select.Option
const CheckboxGroup = Checkbox.Group

@connect(state => ({
  specialStrategy: state.specialStrategy,
}))
@Form.create()
export default class SpecialStrategy extends Component {
  constructor(props) {
    super(props)
    this.state = {
      begin: undefined,
      end: undefined,
      isFirst: true,
    }
  }
    componentWillMount() {
      this.props.dispatch({ type: 'specialStrategy/fetch' })
      this.props.dispatch({ type: 'specialStrategy/getData' })
      this.props.dispatch({ type: 'specialStrategy/getShopName' })
    }
    componentWillReceiveProps(nextProps) {
      if (this.state.isFirst && nextProps.specialStrategy.data) {
        this.setState({
          isFirst: false,
          begin: nextProps.specialStrategy.data.beginTime ? moment(nextProps.specialStrategy.data.beginTime).format('YYYY-MM-DD') : undefined,
          end: nextProps.specialStrategy.data.endTime ? moment(nextProps.specialStrategy.data.endTime).format('YYYY-MM-DD') : undefined,
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
        end: e ? e.format('YYYY-MM-DD') : undefined,
      })
    }
  handleOk = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          Object.assign(values, { beginTime: values.beginTime ? moment(values.beginTime).format('YYYY-MM-DD') : undefined,
                                  endTime: values.endTime ? moment(values.endTime).format('YYYY-MM-DD') : undefined })
          if (values.specifyFlag.length) {
            Object.assign(values, { specifyFlag: values.specifyFlag.join(',') })
          } else {
            Object.assign(values, { specifyFlag: 0 })
          }
          if (values.specifyShop.length) {
            Object.assign(values, { specifyShop: values.specifyShop.join(',') })
          } else {
            Object.assign(values, { specifyShop: '' })
          }
          if (this.props.specialStrategy.data) {
            if (this.props.specialStrategy.data.strategyNo) {
              Object.assign(values, { strategyNo: this.props.specialStrategy.data.strategyNo })
            }
          }
          saveSpecialStrategy(values).then((json) => {
              if (json) {
                this.props.dispatch({
                  type: 'specialStrategy/clean',
                })
                notification.success({
                  message: '操作成功',
                })
                this.props.form.resetFields()
                this.props.itemModalHidden()
              }
            })
        }
    })
  }
  handleCancel = () => {
    this.props.form.resetFields()
    this.props.itemModalHidden()
  }
  checkBeginTime = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (this.state.end && moment(value).format('YYYY-MM-DD') > moment(this.state.end).format('YYYY-MM-DD')) {
      callback('开始日期必须小于等于结束日期')
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
    } else if (this.state.begin && moment(value).format('YYYY-MM-DD') < moment(this.state.begin).format('YYYY-MM-DD')) {
      callback('结束日期必须大于等于开始日期')
    } else {
      const { getFieldValue, resetFields, setFieldsValue } = this.props.form
      const beginTime = getFieldValue('beginTime')
      resetFields('beginTime')
      setFieldsValue({ beginTime })
      callback()
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { data } = this.props.specialStrategy
    const { specifyShop, beginTime, endTime, buyerKeyword, sellerKeyword, addressKeyword, specifyFlag } = data ? data : ''
    const specifyFlag1 = specifyFlag && specifyFlag !== '0' ? specifyFlag.split(',') : []
    const specifyShop1 = specifyShop ? specifyShop.split(',') : []
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
    const formItemLayout2 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
        md: { span: 10 },
      },
    }
    const formItemLayout1 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 12 },
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
        sm: { span: 0 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 12 },
      },
    }
    const description = (
      <div>
        <div>
          <span style={{ color: '#A14715' }}>符合以下任何条件的订单在下载到ERP时会自动标记异常(异常类型:特殊单)，并自动在订单中打上黑色(特殊单)标签</span>
          <img alt='' src={require('../../../../images/tag.png')} style={{ width: '15px', height: '15px' }} />
        </div>
        <div style={{ color: '#A14715' }}>异常单由商家自行处理，也可以修改标签</div>
      </div>
    )
    return (
      <Modal
        maskClosable={false}
        title="特殊单订单识别"
        visible={this.props.specialStrategyVisiable}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        width="800px"
      >
        <Form>
          <FormItem
            {...formItemLayout2}
            label="适用店铺"
          >
            {getFieldDecorator('specifyShop', {
              initialValue: specifyShop1,
          })(
            <Select size={config.InputSize} placeholder="店铺，不设定则全部有效" mode="multiple" >
              {this.props.specialStrategy.lists && this.props.specialStrategy.lists.length ?
                this.props.specialStrategy.lists.map((ele, index) => { return <Option key={index} value={String(ele.shopNo)}>{ele.shopName}</Option> }) : null}
            </Select>
          )}
          </FormItem>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout1}
                label="有效期"
              >
                {getFieldDecorator('beginTime', {
                  initialValue: beginTime && moment(beginTime).format('YYYY-MM-DD') !== '1899-11-30' ? moment(moment(beginTime).format('YYYY-MM-DD'), 'YYYY-MM-DD') : undefined,
                  rules: [
                    {
                      validator: this.checkBeginTime,
                    },
                  ],
              })(
                <DatePicker onChange={this.onBegin} size={config.InputSize} placeholder="开始有效期" />
              )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout4}
                label=""
              >
                {getFieldDecorator('endTime', {
                  initialValue: endTime && moment(endTime).format('YYYY-MM-DD') !== '1899-11-30' ? moment(moment(endTime).format('YYYY-MM-DD'), 'YYYY-MM-DD') : undefined,
                  rules: [
                    {
                      validator: this.checkEndTime,
                    },
                  ],
              })(
                <DatePicker onChange={this.onEnd} size={config.InputSize} placeholder="结束有效期" />
              )}
              </FormItem>
            </Col>
          </Row>
          <Alert
            description={description}
            type="warning"
          />
          <FormItem
            {...formItemLayout}
            label="买家留言包含关键字"
          >
            {getFieldDecorator('buyerKeyword', {
              initialValue: buyerKeyword,
          })(
            <Input size={config.InputSize} placeholder="多个关键字试用逗号分隔，关键字本身请勿使用逗号" />
          )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="卖家备注包含关键字"
          >
            {getFieldDecorator('sellerKeyword', {
              initialValue: sellerKeyword,
          })(
            <Input size={config.InputSize} placeholder="多个关键字试用逗号分隔，关键字本身请勿使用逗号" />
          )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="收货地址包含关键字"
          >
            {getFieldDecorator('addressKeyword', {
              initialValue: addressKeyword,
          })(
            <Input size={config.InputSize} placeholder="多个关键字试用逗号分隔，关键字本身请勿使用逗号" />
          )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="备注中有以下小旗"
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
        </Form>
      </Modal>
      )
  }
}
