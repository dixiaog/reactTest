/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-05-10 10:21:35
 * 多个订单
 */

import React, { Component } from 'react'
import { Modal, Row, Button } from 'antd'
import { connect } from 'dva'
// import OrderDetail from './OrderDetail'
import OrderDetail from '../../../components/OrderDetail'
import { selectOrderNo } from '../../../services/order/search'

@connect(state => ({
  orderDetail: state.orderDetail,
}))
export default class OrderNos extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orderDetail: false,
      record: {},
    }
  }
  // 关闭窗口
  hideModal = () => {
    this.props.hideModal()
  }
  orderDetail = (record) => {
    selectOrderNo(record.orderNo).then((json) => {
      if (json) {
        Object.assign(json, { moneyCheck: this.props.moneyCheck })
        this.setState({ orderDetail: true, record: json })
        this.props.dispatch({
          type: 'orderDetail/fetch',
          payload: { orderNo: record.orderNo, warehouseNo: record.warehouseNo },
        })
      }
    })
  }
  orderStatus = (orderStatus) => {
    switch (orderStatus) {
      case 0:
        return '(待付款)'
      case 1:
        return '(已付款待审核)'
      case 2:
        return '(发货中)'
      case 3:
        return '(已发货)'
      case 4:
        return '(异常)'
      case 10:
        return '(已客审待财审)'
      case 20:
        return '(等待第三方发货)'
      case 40:
        return '(已取消)'
      case 41:
        return '(被合并)'
      default:
        return '(被拆分)'
    }
  }
  render() {
    return (
      <div>
        <Modal
          title="合并的订单"
          visible={this.props.show}
          onCancel={this.hideModal}
          maskClosable={false}
          footer={[<Button onClick={this.hideModal}>关闭</Button>]}
        >
          {this.props.orderNos.length && this.props.orderNos.map((ele, index) => 
            <Row key={index} style={{ marginBottom: 10 }} ><a onClick={this.orderDetail.bind(this, ele)}><span>{`${ele.siteOrderNo}${this.orderStatus(ele.orderStatus)}`}</span></a></Row>
          )}
        </Modal>
        <OrderDetail show={this.state.orderDetail} hideModal={() => this.setState({ orderDetail: false, record: {} })} record={this.state.record} />
      </div>)
  }
}
