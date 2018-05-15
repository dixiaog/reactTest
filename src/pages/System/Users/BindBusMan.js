/*
 * @Author: jiangteng
 * @Date: 2017-12-24 08:51:54
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-03-20 14:10:16
 * 批量绑定分销商
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Radio, Modal } from 'antd'

const RadioGroup = Radio.Group

@connect(state => ({
  users: state.users,
}))
export default class BindBusMan extends Component {
  constructor(props) {
    super(props)
    this.state = {
        busMan: null,
        init: false,
        confirmLoading: false,
        no: null,
    }
  }

  onChangeCustomer = (e) => {
    this.setState({
      init: true,
      busMan: e.target.value,
      no: Number(e.target.title),
    })
  }

    // 关闭弹窗
    hideModal = () => {
      const { hideModal } = this.props
      hideModal()
    }

  // 确认
  okHandler = () => {
    // 没有选中分销商
    if (this.state.busMan !== null) {
      const values = {}
      Object.assign(values, { distributorNo: this.state.no, userId: this.props.users.selectedRowKeys })
      this.setState({
        confirmLoading: true,
      })
    } else {
      this.setState({
        init: true,
      })
    }
  }

  render() {
    const { show } = this.props
    const { shopList } = this.props.users
    return (
      <Modal
        title="批量绑定分销商"
        visible={show}
        onOk={this.okHandler}
        onCancel={this.hideModal}
        confirmLoading={this.state.confirmLoading}
        maskClosable={false}
      >
        <RadioGroup onChange={this.onChangeCustomer} value={this.state.busMan}>
          { shopList.length ? shopList.map((ele, index) => { return <Radio style={{ margin: '5px' }} value={ele.value} key={index} title={String(ele.title)}>{ele.value}</Radio> }) : '' }
        </RadioGroup>
        {!this.state.busMan && this.state.init ? <div style={{ color: 'red' }}>至少选择一个分销商</div> : ''}
      </Modal>
    )
  }
}
