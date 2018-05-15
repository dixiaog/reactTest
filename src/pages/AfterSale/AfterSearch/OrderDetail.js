/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-10 18:47:53
 * 生成换货订单-订单详情页面
 */

import React, { Component } from 'react'
import numeral from 'numeral'
import moment from 'moment'
import { Modal, Avatar, Card, Form, Col, Row, Radio, Input, Button, Table } from 'antd'
import styles from '../AfterSale.less'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const { TextArea } = Input

@Form.create()
export default class OrderDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
    this.columns = [{
      title: '图片',
      dataIndex: 'productImage',
      key: 'productImage',
      width: 120,
      render: (text) => {
        return <Avatar shape="square" src={text} />
      },
    }, {
      title: '商品名称',
      dataIndex: 'productName',
      key: 'productName',
      width: 120,
    }, {
      title: '订单数量',
      dataIndex: 'orderNum',
      key: 'orderNum',
      width: 120,
    }, {
      title: '单价',
      dataIndex: 'salePrice',
      key: 'salePrice',
      width: 120,
      render: (text) => {
         return numeral(text).format('0,0.00')
      },
    }, {
      title: '原价',
      dataIndex: 'retailPrice',
      key: 'retailPrice',
      width: 120,
      render: (text) => {
        return numeral(text).format('0,0.00')
      },
    }, {
      title: '成交金额',
      dataIndex: 'saleAmount',
      key: 'saleAmount',
      width: 120,
      render: (text) => {
        return numeral(text).format('0,0.00')
      },
    }, {
      title: '可配货库存',
      dataIndex: 'waitNum',
      key: 'waitNum',
      width: 120,
    }]
  }
  hideModal = () => {
    this.props.hideModal()
  }
  render() {
    const { show } = this.props
    const { expressCorpName, orderNo, shopName, orderDate, siteOrderNo, siteBuyerNo, payTime,
      sellerRemark, expressAmount, buyerRemark, invoiceType, invoiceTitle, invoiceTaxNo, address,
            receiver, mobileNo, telNo, orderLabel, orderOrigin } = this.props.record
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }
    const formItemLayoutRow = {
      labelCol: { span: 3 },
      wrapperCol: { span: 20 },
    }
    const formItemLayoutT = {
      labelCol: { span: 3 },
      wrapperCol: { span: 18 },
    }
    return (
      <div>
        <Modal
          title="订单详情"
          visible={show}
          onCancel={this.hideModal}
          width={850}
          bodyStyle={{ maxHeight: 550, overflowX: 'hidden' }}
          maskClosable={false}
          footer={[
            <Button key="back" onClick={this.hideModal}>关闭</Button>,
          ]}
        >
          <Form
            style={{ marginTop: 8, float: 'left' }}
            onSubmit={this.handleSubmit}
          >
            <Card type="inner" title="订单基本信息" style={{ width: '787px' }}>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label="订单编号"
                >
                  <span>{orderNo}</span>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label="店铺"
                >
                  <span>{shopName}</span>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label="下单时间"
                >
                  <span>{moment(orderDate).format('YYYY-MM-DD')}</span>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label="订单来源"
                >
                  <span>{orderOrigin === 0 ? '线上订单' : '手工订单'}</span>
                </FormItem>
              </Col>
              <Row>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label="线上订单号"
                  >
                    <span>{siteOrderNo}</span>
                  </FormItem>
                </Col>
              </Row>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label="买家账号"
                >
                  <span>{siteBuyerNo}</span>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label="付款时间"
                >
                  <span>{payTime > 0 ? moment(payTime).format('YYYY-MM-DD') : ''}</span>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label="快递公司"
                >
                  <span>{expressCorpName}</span>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  {...formItemLayout}
                  label="快递单号"
                >
                  <span>{orderNo}</span>
                </FormItem>
              </Col>
              <Row>
                <Col span={12}>
                  <FormItem
                    {...formItemLayout}
                    label="运费"
                  >
                    <span>{expressAmount}</span>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FormItem
                    {...formItemLayoutT}
                    label="买家留言"
                    className={styles.formItem}
                  >
                    <span>{buyerRemark}</span>
                  </FormItem>
                </Col>
              </Row>
              <Row style={{ paddingLeft: '9px' }}>
                <Col span={24}>
                  <FormItem
                    {...formItemLayoutRow}
                    label="订单标签"
                  >
                    {getFieldDecorator('orderLabel', {
                      initialValue: orderLabel,
                    })(
                      <RadioGroup>
                        <Radio disabled={!false} value={0}>无</Radio>
                        <Radio disabled={!false} value={1}><img alt="" src={require('../../../images/redFlag.png')} style={{ width: '20px', height: '20px' }} /></Radio>
                        <Radio disabled={!false} value={2}><img alt="" src={require('../../../images/yellowFlag.png')} style={{ width: '20px', height: '20px' }} /></Radio>
                        <Radio disabled={!false} value={3}><img alt="" src={require('../../../images/greenFlag.png')} style={{ width: '20px', height: '20px' }} /></Radio>
                        <Radio disabled={!false} value={4}><img alt="" src={require('../../../images/blueFlag.png')} style={{ width: '20px', height: '20px' }} /></Radio>
                        <Radio disabled={!false} value={5}><img alt="" src={require('../../../images/purpleFlag.png')} style={{ width: '20px', height: '20px' }} /></Radio>
                        <Radio disabled={!false} value={6}><img alt="" src={require('../../../images/blackFlag.png')} style={{ width: '20px', height: '20px' }} /></Radio>
                      </RadioGroup>
                    )}
                    <TextArea readOnly={!false} value={sellerRemark} rows={4} />
                  </FormItem>
                </Col>
              </Row>
              <Row style={{ paddingLeft: '9px' }}>
                <Col span={24}>
                  <FormItem
                    {...formItemLayoutRow}
                    label="发票类型"
                  >
                    {getFieldDecorator('invoiceType', {
                      initialValue: invoiceType,
                    })(
                      <RadioGroup>
                        <Radio disabled={!false} value={1}>个人</Radio>
                        <Radio disabled={!false} value={2}>公司</Radio>
                        {/* <Radio value={3}>无</Radio> */}
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row style={{ paddingLeft: '9px' }}>
                <Col span={24}>
                  <FormItem
                    {...formItemLayoutRow}
                    label="发票抬头"
                  >
                    <span>{invoiceTitle}</span>
                  </FormItem>
                </Col>
              </Row>
              <Row style={{ paddingLeft: '9px' }}>
                <Col span={24}>
                  <FormItem
                    {...formItemLayoutRow}
                    label="发票税号"
                  >
                    <span>{invoiceTaxNo}</span>
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Card type="inner" title="收货地址信息" style={{ width: '787px', marginTop: '20px' }}>
              <FormItem
                {...formItemLayoutT}
                label="收货地址"
              >
                <span>江苏省/常熟市/虞山镇</span>
              </FormItem>
              <FormItem
                {...formItemLayoutT}
                label="具体地址"
              >
                <span>{address}</span>
              </FormItem>
              <FormItem
                {...formItemLayoutT}
                label="收件人名"
              >
                <span>{receiver}</span>
              </FormItem>
              <FormItem
                {...formItemLayoutT}
                label="联系电话"
              >
                <span>{telNo}</span>
              </FormItem>
              <FormItem
                {...formItemLayoutT}
                label="联系手机"
              >
                <span>{mobileNo}</span>
              </FormItem>
            </Card>
          </Form>
          <div style={{ clear: 'both' }} />
          <Card
            style={{ marginTop: '30px' }}
            type="inner"
            title="订单商品"
          >
            <Table
              dataSource={[]}
              columns={this.columns}
              pagination={false}
              rowKey={record => record.autoNo}
            />
          </Card>
        </Modal>
      </div>)
  }
}
