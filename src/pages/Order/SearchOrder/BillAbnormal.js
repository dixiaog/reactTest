/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-04-25 16:46:04
 * 订单异常
 */

import React, { Component } from 'react'
import { Modal, Radio, Col, message, Input, Button } from 'antd'
import { connect } from 'dva'
import DefineAbnormal from './DefineAbnormal'
import { updateTurnException } from '../../../services/order/search'

const RadioGroup = Radio.Group
@connect(state => ({
  search: state.search,
}))
export default class BillAbnormal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      value: '',
      defineAbnormal: false,
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
    if (!this.state.value) {
      message.warning('请选择一种异常类型')
    } else {
      this.setState({
        confirmLoading: true,
      })
      const { abnormalList } = this.props.search
      updateTurnException(Object.assign({
        listOrderNo: this.props.record ? [this.props.record.orderNo] : this.props.search.selectedRowKeys,
        abnormalNo: this.state.value,
        abnormalName: abnormalList.filter(ele => ele.abnormalNo === this.state.value)[0].abnormalName,
        abnormalDesc: this.state.onChangeText,
      })).then((json) => {
        if (json.review) {
          if (this.props.record) {
            // message.success('标记异常成功')
            this.props.callback(abnormalList.filter(ele => ele.abnormalNo === this.state.value)[0].abnormalName)
          }
          if (this.props.listLog) {
            this.props.listLog()
          }
          this.props.dispatch({
            type: 'search/search',
          })
          this.props.dispatch({
            type: 'search/changeState',
            payload: { selectedRowKeys: [], selectedRows: [] },
          })
          this.hideModal()
        }
        if (json.errorMessage) {
          message.warning(json.errorMessage.split('!').map((e, i) => {
            if (i !== json.errorMessage.split('!').length - 1 && i === 0) {
              return <span key={i}><br />{`${e}!`}<br /></span>
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
  renderRadio = (ele) => {
    if (ele.companyNo !== 0) {
      return <Col key={ele.abnormalNo} span={6} style={{ marginBottom: '5px' }}>
               <Radio value={ele.abnormalNo}><span style={{ color: 'gray', textDecoration: 'underline' }}>{ele.abnormalName}</span></Radio>
             </Col>
    } else {
      return <Col key={ele.abnormalNo} span={6} style={{ marginBottom: '5px' }}><Radio value={ele.abnormalNo}><span>{ele.abnormalName}</span></Radio></Col>
    }
  }
  render() {
    const { show } = this.props
    const { abnormalList } = this.props.search
    return (
      <div>
        <Modal
          title="订单转异常"
          visible={show}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          width={800}
          maskClosable={false}
          confirmLoading={this.state.confirmLoading}
        >
          <RadioGroup onChange={this.onChange} value={this.state.value}>
            {abnormalList.map(ele => this.renderRadio(ele))}
          </RadioGroup>
          <p style={{ marginTop: '20px' }}>异常描述:<Input onChange={this.onChangeText} value={this.state.onChangeText} size="small" style={{ width: '600px', marginLeft: '10px' }} /></p>
          <Button size="small" type="primary" onClick={() => { this.setState({ defineAbnormal: true }) }}>维护自定义异常</Button>
        </Modal>
        <DefineAbnormal
          show={this.state.defineAbnormal}
          hideModal={() => { this.setState({ defineAbnormal: false }) }}
        />
      </div>)
  }
}
