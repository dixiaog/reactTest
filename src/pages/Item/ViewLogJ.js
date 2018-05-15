/*
 * @Author: jiangteng
 * @Date: 2018-01-02 17:26:21
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-01-02 17:51:44
 * 查看日志
 */


import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal } from 'antd'


@connect(state => ({
    dictionary: state.dictionary,
}))
export default class ViewLogJ extends Component {
  // 确认
  onCancle = () => {
    const { hideModal } = this.props
    hideModal()
  }

  render() {
    const { show } = this.props
    return (
      <Modal
        title="日志查看"
        visible={show}
        footer={null}
        onCancel={this.onCancle}
      >
        <div>这里显示日志</div>
      </Modal>
    )
  }
}

