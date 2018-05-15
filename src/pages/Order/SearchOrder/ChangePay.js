/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-11 15:30:58
 * 作废支付单
 */

import React, { Component } from 'react'
import { Modal, Button } from 'antd'

export default class ChangePay extends Component {
  handleSubmit = () => {
    this.props.sure()
    this.props.hideModal()
  }
  // 关闭窗口
  hideModal = () => {
    this.props.hideModal()
  }
  render() {
    const { show } = this.props
    return (
      <div>
        <Modal
          title="请确认?"
          visible={show}
          maskClosable={false}
          onCancel={this.hideModal}
          width={600}
          footer={[
            <Button key="1" onClick={this.hideModal}>取消</Button>,
            <Button key="2" type="primary" onClick={this.handleSubmit}>确认作废</Button>,
          ]}
        >
          <strong style={{ fontSize: 14 }}>请确认该支付单是一张无效的支付单</strong>
        </Modal>
      </div>)
  }
}
