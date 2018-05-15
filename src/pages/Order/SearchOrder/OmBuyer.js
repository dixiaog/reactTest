/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-03-27 19:19:15
 * 买家选择
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, message } from 'antd'
import OmBuyerT from '../OmBuyer/index'

@connect(state => ({
  omBuyer: state.omBuyer,
}))
export default class OmBuyer extends Component {
  // 关闭窗口
  hideModal = () => {
    const { hideModalJ } = this.props
    hideModalJ()
  }
  handleSubmit = () => {
    if (!this.props.omBuyer.selectedRows.length) {
      message.warning('请选择买家')
    } else {
      const { hideModal } = this.props
      hideModal(this.props.omBuyer.selectedRows[0])
    }
  }
  render() {
    const { show } = this.props
    return (
      <div>
        <Modal
          title="买家选择"
          visible={show}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          width={1000}
          bodyStyle={{ maxHeight: 550, overflowX: 'hidden', padding: 0 }}
          maskClosable={false}
        >
          <OmBuyerT />
        </Modal>
      </div>)
  }
}
