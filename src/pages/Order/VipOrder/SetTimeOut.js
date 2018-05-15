/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-09 13:38:39
 * 定时器页面
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Button } from 'antd'
import styles from '../Order.less'

@connect(state => ({
  vipOrder: state.vipOrder,
}))
export default class WarehouseOrder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      minute: 0, // 分钟
      second: 0, // 秒
      init: true,
      loop: 0,
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.other) {
      this.hideModal()
    }
    if (this.state.init && nextProps.show) {
      this.setState({
        minute: nextProps.time, // 分钟
        second: 0, // 秒
        init: false,
      })
      this.timerID = setInterval(
        () => this.tick(),
        1000
      )
    }
  }
  // 定时器任务
  tick = () => {
    let all = 0
    this.setState({
      loop: this.state.loop + 1,
    }, () => {
      all = this.props.time * 60 - this.state.loop
    })
    this.setState({
      minute: Math.floor(all/60),
      second: all%60,
    }, () => {
      if (all === 0) {
        this.setState({
          loop: 0,
        })
        this.props.getData(1)
      }
    })
  }
  // 关闭窗口
  hideModal = () => {
    this.setState({
      init: true,
      loop: 0,
    })
    clearInterval(this.timerID)
    this.props.hideModal()
  }
  render() {
    const { show } = this.props
    return (
      <div>
        <Modal
          title="定时刷新PO列表"
          visible={show}
          maskClosable={false}
          width={600}
          closable={false}
          footer={[<Button key="1" onClick={this.hideModal}>关闭</Button>]}
        >
          <div className={styles.center}>
            <span className={styles.time}>{this.state.minute}</span><span style={{ fontWeight: 'bold', fontSize: 20, marginLeft: 10, marginRight: 10, display: 'block', float: 'left' }}>分</span>
            <span className={styles.time}>{this.state.second}</span><span style={{ fontWeight: 'bold', fontSize: 20, marginLeft: 10, display: 'block', float: 'left' }}>秒</span>
          </div>
        </Modal>
      </div>)
  }
}
