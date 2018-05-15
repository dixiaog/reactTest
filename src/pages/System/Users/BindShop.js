/*
 * @Author: jiangteng
 * @Date: 2017-12-24 08:51:54
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-03-20 14:09:22
 * 批量修改角色
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Checkbox, Modal } from 'antd'
import { bindShop } from '../../../services/system'

const CheckboxGroup = Checkbox.Group

@connect(state => ({
  users: state.users,
}))
export default class ModifyRole extends Component {
  constructor(props) {
    super(props)
    this.state = {
      shopList: [],
      init: false,
      confirmLoading: false,
    }
  }

  onChange = (e) => {
    this.setState({
      shopList: e,
      init: true,
    })
  }

  // 关闭弹窗
  hideModal = () => {
    const { hideModal } = this.props
    hideModal()
  }

  // 确认
  okHandler = () => {
    // 没有选中店铺
    const values = {}
    const storeNo = []
    const { shopList, selectedRowKeys } = this.props.users
    if (this.state.shopList.length) {
      this.state.shopList.forEach((ele) => {
        for (const t in shopList) {
          if (shopList[t].value === ele) {
            storeNo.push(shopList[t].title)
            break
          }
        }
      })
      Object.assign(values, { storeList: storeNo.toString(), userId: selectedRowKeys })
      this.setState({
        confirmLoading: true,
      })
      bindShop(values).then((json) => {
        if (json) {
          this.setState({
            confirmLoading: false,
          })
          this.hideModal()
          this.props.dispatch({
            type: 'users/search',
          })
        } else {
          this.setState({
            confirmLoading: false,
          })
        }
      })
    } else {
      this.setState({
        init: true,
      })
    }
  }

  render() {
    const { shopList } = this.props.users
    const { show } = this.props
    return (
      <Modal
        title="批量绑定店铺"
        visible={show}
        onOk={this.okHandler}
        onCancel={this.hideModal}
        confirmLoading={this.state.confirmLoading}
        maskClosable={false}
      >
        <CheckboxGroup value={this.state.shopList} onChange={this.onChange}>
          { shopList ? shopList.map((ele, index) => { return <Checkbox style={{ margin: '5px' }} value={ele.label} key={index}>{ele.label}</Checkbox> }) : '' }
        </CheckboxGroup>
        {!this.state.shopList.length && this.state.init ? <div style={{ color: 'red' }}>至少选择一个店铺</div> : ''}
      </Modal>
    )
  }
}
