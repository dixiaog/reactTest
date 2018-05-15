/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-09 14:38:14
 * 取消订单
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Radio, Col, message, Input, Alert } from 'antd'
import { updateOrderNoCancel } from '../../../services/order/search'

const RadioGroup = Radio.Group
const text = '您正在取消订单,注意订单一旦取消将会同步到线上,请仔细考虑操作'
@connect(state => ({
  search: state.search,
}))
export default class BillCancel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      value: '',
      onChangeText: '',
    }
  }
  onChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  }
  onChangeText = (e) => {
    this.setState({
      onChangeText: e.target.value,
    })
  }
  handleSubmit = () => {
    if (this.state.value === '') {
      message.warning('请选择取消原因')
    } else {
      this.setState({
        confirmLoading: true,
      })
      const cancelName = this.props.cancelJT.filter(ele => ele.autoNo === this.state.value)[0].itemName
      const params = {}
      Object.assign(params, {
        listOrderNo: this.props.record ? [this.props.record.orderNo] : this.props.search.selectedRowKeys,
        autoNo: String(this.state.value),
        itemName: cancelName,
        cancelWhy: this.state.onChangeText,
      })
      updateOrderNoCancel(params).then((json) => {
        if (json.review) {
          message.success('取消订单成功')
          this.props.dispatch({
            type: 'search/search',
          })
          if (this.props.listLog) {
            this.props.listLog()
          }
          this.props.dispatch({
            type: 'search/changeState',
            payload: { selectedRowKeys: [], selectedRows: [] },
          })
          this.hideModal()
        } else {
          message.warning(json.errorMessage.split('!').map((e, i) => {
            if (i !== json.errorMessage.split('!').length - 1 && i === 0) {
              return <span key={i}>订单取消失败<br />{`${e}!`}<br /></span>
            } else if (i !== json.errorMessage.split('!').length - 1) {
              return <span key={i}>{`${e}!`}<br /></span>
            } else {
              return null
            }
          }))
        }
        this.setState({
          confirmLoading: false,
        })
      })
    }
  }
  // 关闭窗口
  hideModal = () => {
    this.props.hideModal()
    this.setState({
      confirmLoading: false,
      value: '',
      onChangeText: '',
    })
  }
  render() {
    const { show, cancelJT } = this.props
    return (
      <div>
        <Modal
          title="取消描述"
          visible={show}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          width={700}
          maskClosable={false}
          confirmLoading={this.state.confirmLoading}
        >
          <Alert showIcon={false} message={text} banner style={{ marginBottom: '20px' }} />
          <RadioGroup style={{ width: '100%' }} onChange={this.onChange} value={this.state.value}>
            {cancelJT && cancelJT.length ?
              cancelJT.map((ele, index) => <Col key={index} span={6} style={{ marginBottom: '5px' }}><Radio value={ele.autoNo}><span>{ele.itemName}</span></Radio></Col>)
              :
              '暂无取消描述'
            }
          </RadioGroup>
          <p style={{ marginTop: '20px' }}>取消原因说明:<Input onChange={this.onChangeText} value={this.state.onChangeText} size="small" style={{ width: '560px', marginLeft: '10px' }} /></p>
        </Modal>
      </div>)
  }
}
