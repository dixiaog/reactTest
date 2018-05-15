/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-04-28 17:00:52
 * 售后单详情
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import numeral from 'numeral'
import moment from 'moment'
import { Modal, Select, Form, Col, Row, Input, Avatar } from 'antd'
import { detailPageEdit } from '../../../services/aftersale/afterSearch'

const Option = Select.Option
const FormItem = Form.Item
const { TextArea } = Input

@Form.create()
@connect(state => ({
  afterSearch: state.afterSearch,
}))
export default class AfterDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      num: '',
      buyer: '',
      seller: '',
      checkMoney: null, // 退货金额
      productPrice: null, // 商品单价
      actualReturnAmount: null, // 实退金额
      sellerCompensate: null, // 卖家应补
      buyerCompensate: null, // 卖家应补
      exchangeAmount: null, // 换货金额
      init: true,
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.init && nextProps.record.asType !== undefined) {
      this.setState({
        checkMoney: nextProps.record.returnNum * nextProps.record.productPrice,
        productPrice: nextProps.record.productPrice,
        actualReturnAmount: nextProps.record.actualReturnAmount,
        sellerCompensate: nextProps.record.sellerCompensate,
        buyerCompensate: nextProps.record.buyerCompensate,
        exchangeAmount: nextProps.record.exchangeAmount,
        init: false,
      })
    }
  }
  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        Object.assign(values, { asNo: this.props.record.asNo })
        detailPageEdit(values).then((json) => {
          if (json) {
            this.props.hideModal()
            this.props.dispatch({
              type: 'afterSearch/search',
            })
          }
          this.setState({
            confirmLoading: false,
          })
        })
      }
    })
  }
  // 关闭窗口
  hideModal = () => {
    this.setState({
      confirmLoading: false,
      init: true,
    })
    this.handleReset()
    this.props.hideModal()
  }
  // 清空表单
  handleReset = () => {
    this.props.form.resetFields()
  }
  checkNum = (rule, value, callback) => {
    if (value) {
      if (isNaN(value) || !/^\d+$/.test(value)) {
        this.setState({
          num: '数量请输入整数(不带小数点)',
        })
        callback('error')
      } else if (value.toString().charAt(0) === '.') {
        this.setState({
          num: '数量不能以.开始',
        })
        callback('error')
      } else if (value.toString().charAt([value.length - 1]) === '.') {
        this.setState({
          num: '数量不能以.结尾',
        })
        callback('error')
      } else if (value < 0) {
        this.setState({
          num: '数量请输入不小于0的数字',
        })
        callback('error')
      } else if (value >= 100000000000) {
        this.setState({
          num: '数量请输入小于100000000000的数字',
        })
        callback('error')
      } else if (value.toString().indexOf(' ') !== -1) {
        this.setState({
          num: '数量不能输入空格',
        })
        callback('error')
      } else {
        this.setState({
          num: '',
          checkMoney: value * this.state.productPrice,
          actualReturnAmount: value * this.state.productPrice + Number(this.state.sellerCompensate) - Number(this.state.buyerCompensate),
        })
        callback()
      }
    } else {
      this.setState({
        num: '',
        checkMoney: 0,
        actualReturnAmount: Number(this.state.sellerCompensate) - Number(this.state.buyerCompensate),
      })
      callback()
    }
  }
  checkNumber = (flag, rule, value, callback) => {
    if (value) {
      if (isNaN(value)) {
        this.setState({
          [flag]: '补偿金额请输入数字',
        })
        callback('error')
      } else if (value.toString().charAt(0) === '.') {
        this.setState({
          [flag]: '补偿金额不能以.开始',
        })
        callback('error')
      } else if (value < 0) {
        this.setState({
          [flag]: '补偿金额不能小于0',
        })
        callback('error')
      } else if (value >= 100000) {
        this.setState({
          [flag]: '补偿金额必须小于100000',
        })
        callback('error')
      } else if (value.toString().charAt([value.length - 1]) === '.') {
        this.setState({
          [flag]: '补偿金额不能以.结尾',
        })
        callback('error')
      } else if (value.toString().indexOf(' ') !== -1) {
        this.setState({
          [flag]: '补偿金额不能输入空格',
        })
        callback('error')
      } else {
        this.setState({
          [flag]: '',
        })
        callback()
        if (flag === 'seller') {
          this.setState({
            sellerCompensate: value,
            actualReturnAmount: Number(this.state.checkMoney) + Number(value) - Number(this.state.exchangeAmount) - Number(this.state.buyerCompensate),
          })
        } else {
          this.setState({
            buyerCompensate: value,
            actualReturnAmount: Number(this.state.checkMoney) + Number(this.state.sellerCompensate) - Number(this.state.exchangeAmount) - Number(value),
          })
        }
      }
    } else {
      this.setState({
        [flag]: '',
      })
      callback()
      if (flag === 'seller') {
        this.setState({
          actualReturnAmount: Number(this.state.checkMoney) - Number(this.state.exchangeAmount) - Number(this.state.buyerCompensate),
        })
      } else {
        this.setState({
          actualReturnAmount: Number(this.state.checkMoney) + Number(this.state.sellerCompensate) - Number(this.state.exchangeAmount),
        })
      }
    }
  }
  render() {
    const { warehouseList, refundReasonList } = this.props.afterSearch
    const { show } = this.props
    const { asNo, orderNo, shopName, asStatus, goodStatus, refundId, siteBuyerNo, receiver,
      asDate, telNo, mobileNo, asType, refundReason, returnNum, sellerCompensate, productName,
      buyerCompensate, expressCorpNo, skuNo, productSpec, warehouseNo, inNum, expressNo, remark } = this.props.record
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }
    const formItemLayoutRemark = {
      labelCol: { span: 3 },
      wrapperCol: { span: 14 },
    }
    return (
      <div>
        <Modal
          title="售后单基本信息"
          visible={show}
          onOk={this.handleSubmit.bind(this, asStatus, inNum)}
          onCancel={this.hideModal}
          width={1200}
          bodyStyle={{ maxHeight: 550, overflowX: 'hidden' }}
          maskClosable={false}
          confirmLoading={this.state.confirmLoading}
        >
          <Form
            style={{ marginTop: 8, float: 'left', width: '900px' }}
          >
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="售后单号"
              >
                <span>{asNo}</span>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="订单号"
              >
                <span>{orderNo < 0 ? '无信息件' : orderNo}</span>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="店铺"
              >
                <span>{shopName}</span>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="状态"
              >
                <span>{asStatus === 0 ? '待确认' : asStatus === 1 ? '已确认' : asStatus === 2 ? '已作废' : '强制确认' }</span>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="货物状态"
              >
                <span>
                  {goodStatus === 'BUYER_NOT_RECEIVED' ?
                    '买家未收到货' : goodStatus === 'BUYER_RECEIVED' ?
                      '买家已收到货' : goodStatus === 'BUYER_RETURNED_GOODS' ?
                        '买家已退货' : goodStatus === 'SELLER_RECEIVED' ? '卖家已收到货' : '卖家未收到货' }
                </span>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="线上单号"
              >
                <span>{refundId}</span>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="买家账号"
              >
                <span>{siteBuyerNo}</span>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="收货人"
              >
                <span>{receiver}</span>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label="创建时间"
              >
                <span>{asDate < 0 ? '' : moment(asDate).format('YYYY-MM-DD')}</span>
              </FormItem>
            </Col>
            <Row>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label="电话"
                >
                  <span>{telNo ? telNo.substr(0, 3).concat('****').concat(telNo.substr(telNo.length - 4, 4)) : ''}</span>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label="手机"
                >
                  <span>{mobileNo ? mobileNo.substr(0, 3).concat('****').concat(mobileNo.substr(6, 4)) : ''}</span>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label="售后类型"
                >
                  {getFieldDecorator('asType', {
                    initialValue: asType,
                  })(
                    <Select disabled={!(asStatus === 0 && inNum === 0)} size="small" onChange={this.onChange}>
                      <Option value={0}>退货</Option>
                      <Option value={1}>换货</Option>
                      <Option value={2}>补发</Option>
                      <Option value={3}>其他</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label="退款原因"
                >
                  {getFieldDecorator('refundReason', {
                    initialValue: refundReason,
                  })(
                    <Select size="small">
                      {refundReasonList.length ? refundReasonList.map((ele, index) => <Option value={ele.itemName} key={index}>{ele.itemName}</Option>) : ''}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  help={this.state.num}
                  {...formItemLayout}
                  label="申请数量"
                >
                  {getFieldDecorator('returnNum', {
                    initialValue: returnNum,
                    rules: [{
                      validator: this.checkNum,
                    }],
                  })(
                    <Input maxLength="11" size="small" />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label="退货金额"
                >
                  <span>{numeral(this.state.checkMoney).format('0,0.00')}</span>
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  help={this.state.seller}
                  {...formItemLayout}
                  label="卖家应补"
                >
                  {getFieldDecorator('sellerCompensate', {
                    initialValue: numeral(sellerCompensate).format('0,0.00'),
                    rules: [{
                      validator: this.checkNumber.bind(this, 'seller'),
                    }],
                  })(
                    <Input readOnly={asStatus === 1} maxLength="8" size="small" />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label="换货金额"
                >
                  <span>{numeral(this.state.exchangeAmount).format('0,0.00')}</span>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem
                  help={this.state.buyer}
                  {...formItemLayout}
                  label="买家应补"
                >
                  {getFieldDecorator('buyerCompensate', {
                    initialValue: numeral(buyerCompensate).format('0,0.00'),
                    rules: [{
                      validator: this.checkNumber.bind(this, 'buyer'),
                    }],
                  })(
                    <Input readOnly={asStatus === 1} maxLength="8" size="small" />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label="实退金额"
                >
                  <span>{numeral(this.state.actualReturnAmount).format('0,0.00')}</span>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label="仓库"
                >
                  {getFieldDecorator('warehouseNo', {
                    initialValue: warehouseNo,
                  })(
                    <Select disabled={goodStatus === 'SELLER_RECEIVED'} size="small">
                      {warehouseList.length ? warehouseList.map(ele => <Option key={ele.warehouseNo} value={ele.warehouseNo}>{ele.warehouseName}</Option>) : '' }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label="快递公司"
                >
                  {getFieldDecorator('expressCorpNo', {
                    initialValue: expressCorpNo,
                  })(
                    <Input maxLength="10" size="small" />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label="快递单号"
                >
                  {getFieldDecorator('expressNo', {
                    initialValue: expressNo,
                  })(
                    <Input maxLength="20" size="small" />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Col span={16}>
              <FormItem
                {...formItemLayoutRemark}
                label="备注"
              >
                {getFieldDecorator('remark', {
                  initialValue: remark,
                })(
                  <TextArea size="small" maxLength="250" />
                )}
              </FormItem>
            </Col>
          </Form>
          <div style={{ float: 'left', width: '200px', marginTop: '8px', marginLeft: '30px' }}>
            <Avatar style={{ width: 200, height: 200 }} shape="square" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
            <p style={{ fontWeight: 'bold' }}>{productName}</p>
            <p>
              <span style={{ color: '#666', marginRight: 10 }}>{skuNo}</span>
              <span style={{ color: '#666', marginRight: 10 }}>{productSpec}</span>
              <span style={{ color: 'blue' }}>{`×${inNum}`}</span>
            </p>
          </div>
        </Modal>
      </div>)
  }
}
