/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-04 14:02:10
 * 重新计算并添加赠品
 */

import React, { Component } from 'react'
import { Modal, Alert, Radio, Checkbox, Row, Col, message } from 'antd'
import { connect } from 'dva'
import { calcOrderGift } from '../../../services/order/search'

const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group
@connect(state => ({
  search: state.search,
}))
export default class GiftCalculation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      checkedValues: [],
      one: 0,
      two: 0,
    }
  }
  onChange = (checkedValues) => {
    this.setState({
      checkedValues,
    })
  }
  onChangeOne = (e) => {
    this.setState({
      one: e.target.value,
    })
  }
  onChangeTwo = (e) => {
    this.setState({
      two: e.target.value,
    })
  }
  handleSubmit = () => {
    const params = {}
    if (!this.state.one) {
      Object.assign(params, {
        calcChecked: this.state.one ? false : true,
        orderByPayTime: this.state.two ? true : false,
        orderNos: this.props.search.selectedRowKeys,
        includeSplit: this.state.checkedValues.indexOf(0) !== -1,
        clearOld: this.state.checkedValues.indexOf(1) !== -1,
        clearZero: this.state.checkedValues.indexOf(2) !== -1,
      })
    } else {
      Object.assign(params, {
        calcChecked: this.state.one ? false : true,
        orderByPayTime: this.state.two ? true : false,
        orderNos: this.props.search.selectedRowKeys,
        includeSplit: this.state.checkedValues.indexOf(0) !== -1,
        clearOld: this.state.checkedValues.indexOf(1) !== -1,
        clearZero: this.state.checkedValues.indexOf(2) !== -1,
        omOrderDTO: this.props.search.searchParam,
      })
    }
    if (!this.props.search.selectedRows.length && !this.state.one) {
      message.warning('主页面至少选择一笔订单')
    } else {
      calcOrderGift(params).then((json) => {
        if (json) {
          message.success('重新计算并添加赠品成功')
          this.hideModal()
          this.props.dispatch({
            type: 'search/search',
          })
        }
      })
    }
  }
  // 关闭窗口
  hideModal = () => {
    this.props.hideModal()
    this.setState({
      confirmLoading: false,
      one: 0,
      two: 0,
      checkedValues: [],
    })
  }
  render() {
    const { show } = this.props
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    }
    return (
      <div>
        <Modal
          title="重新计算并添加赠品"
          visible={show}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          maskClosable={false}
          confirmLoading={this.state.confirmLoading}
          width={600}
        >
          <Alert showIcon={false} type="success" message="系统只会计算未进入发货流程(待付款,已付款待审核,已审核待配快递,异常)的订单" banner />
          <div style={{ marginTop: '10px' }}>选择重算范围:</div>
          <div>
            <RadioGroup onChange={this.onChangeOne} value={this.state.one}>
              <Radio style={radioStyle} value={0}>计算列表页勾选的订单</Radio>
              <Radio style={radioStyle} value={1}>计算所有符合条件的订单:(加入搜索条件过滤后)</Radio>
            </RadioGroup>
          </div>
          <div>选择重算顺序:</div>
          <div>
            <RadioGroup onChange={this.onChangeTwo} value={this.state.two}>
              <Radio style={radioStyle} value={0}>按下单时间先后计算</Radio>
              <Radio style={radioStyle} value={1}>按付款时间先后计算</Radio>
            </RadioGroup>
          </div>
          <div style={{ marginBottom: '10px' }}>以下可选条件:</div>
          <CheckboxGroup style={{ width: '100%' }} onChange={this.onChange} value={this.state.checkedValues}>
            <Row>
              <Col span={24} style={{ marginBottom: '5px' }}><Checkbox value={0}>排除已拆分的订单(拆分前的订单送的赠品拆分后可能不符合条件不送,或者作为多个订单多送)</Checkbox></Col>
              <Col span={24} style={{ marginBottom: '5px' }}><Checkbox value={1}>删除原有赠品,即订单商品带有赠品标记的赠品(线上送的将不会自动删除)</Checkbox></Col>
              <Col span={24}><Checkbox value={2}>删除未标记为赠品,但实际销售单价为0的商品(线下下的商品改价为0也不会自动删除)</Checkbox></Col>
            </Row>
          </CheckboxGroup>
        </Modal>
      </div>)
  }
}
