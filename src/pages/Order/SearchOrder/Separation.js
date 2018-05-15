/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-14 09:46:46
 * 拆开组合装商品
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Radio, message, Alert, Input } from 'antd'
import AddGood from '../../../components/ChooseItem/index'
import { splitOrderCombo } from '../../../services/order/search'

const RadioGroup = Radio.Group
@connect(state => ({
  search: state.search,
  chooseItem: state.chooseItem,
}))
export default class Separation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      value: 0,
      skuNo: [],
      showModal: false,
      unable: false,
      productType: false,
    }
  }
  onChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  }
  handleSubmit = () => {
    const params = {}
    if (!this.state.value && !this.props.search.selectedRows.length) {
      message.warning('主页面至少勾选一笔订单')
    } else {
      if (!this.state.value) {
        Object.assign(params, { calcChecked: true, orderNos: this.props.search.selectedRowKeys, combos: this.state.skuNo })
      } else {
        Object.assign(params, { calcChecked: false, omOrderDTO: this.props.search.searchParam, combos: this.state.skuNo })
      }
      this.setState({
        confirmLoading: true,
      })
      splitOrderCombo(params).then((json) => {
        if (json) {
          this.hideModal()
        }
        this.props.dispatch({
          type: 'search/search',
        })
        this.setState({
          confirmLoading: false,
        })
      })
    }
  }
  couple = () => {
    this.setState({ showModal: true, unable: true, productType: true })
    this.props.dispatch({
      type: 'chooseItem/changeState',
      payload: { searchParam: { enableStatus: '1', productType: '1'}, searchParamT: true, searchParamComb: true, jt: true, forbid: this.props.search.forbidList },
    })
    this.props.dispatch({
      type: 'chooseItem/fetch',
      payload: { enableStatus: '1', productType: '1' },
    })
  }
  handleChange = (e) => {
    this.setState({
      skuNo: e.target.value.split(','),
    })
  }
  // 关闭窗口
  hideModal = () => {
    this.props.hideModal()
    this.setState({
      confirmLoading: false,
      value: 0,
      skuNo: [],
      showModal: false,
      unable: false,
    })
    this.props.dispatch({
      type: 'chooseItem/changeState',
      payload: { searchParam: {}, searchParamComb: false, searchParamT: false },
    })
  }
  render() {
    const { show } = this.props
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    }
    const addProps = {
      fromName: 'jt',
      unable: this.state.unable,
      productTypeT: this.state.productType,
      changeModalVisiable: this.state.showModal,
      productType: this.state.productType ? '1' : undefined,
      enableStatus: '1',
      itemModalHidden: () => { this.setState({ showModal: false, productType: false }) },
      chooseDataKeys: this.state.skuNo,
      chooseData: (rows, keys, callback) => {
        callback()
        const skuNos = this.state.skuNo
        keys.forEach((ele) => {
          if (skuNos.indexOf(ele) === -1) {
            skuNos.push(ele)
          }
        })
        this.setState({
          skuNo: skuNos,
        })
      },
    }
    return (
      <div>
        <Modal
          title="拆开组合装商品"
          visible={show}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          maskClosable={false}
          confirmLoading={this.state.confirmLoading}
          width={800}
        >
          <Alert message="请确认需要拆开组合装商品，该操作不可撤销" type="warning" />
          <RadioGroup onChange={this.onChange} value={this.state.value}>
            <Radio style={radioStyle} key={0} value={0}>拆开订单列表页勾选的订单</Radio>
            <Radio style={radioStyle} key={1} value={1}>拆开所有符合条件的订单（加入搜索条件过滤后）</Radio>
          </RadioGroup>
          <p>拆开指定商品编码的组合装商品，如果不指定，则拆开全部的组合装商品</p>
          <Input onChange={this.handleChange} value={this.state.skuNo.toString()} size="small" style={{ width: 600 }} />
          <span style={{ color: '#55d4fd' }}><a onClick={this.couple} style={{ fontWeight: 'bold', marginLeft: '10px' }}>挑选组合装</a></span>
        </Modal>
        <AddGood {...addProps} />
      </div>)
  }
}
