/*
 * @Author: jchen
 * @Date: 2017-10-17 15:44:33
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-03-29 10:46:07
 * 禁用/启用 组件化
 */
import React, { Component } from 'react'
import { Menu, Icon, Dropdown, Button, message, Modal } from 'antd'
import PropTypes from 'prop-types'
import styles from './index.less'

class Enable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      enableModal: false,
      enableStatus: 0,
    }
  }
  static propTypes = {
    query: PropTypes.string,
    selectedRow: PropTypes.array,
  }
  enableChage = (e) => {
    console.log('enable', e)
    const { query, selectedRow, dispatch, rowKey } = this.props
    const values = { Enable: this.state.enableStatus }

    const ids = []
    selectedRow.forEach((ele) => {
        ids.push(ele[rowKey])
    })
    if (ids.length === 0) {
      message.warn('未选择菜单或状态无需变更')
    } else {
      Object.assign(values, {
        IDLst: ids,
      })
      dispatch({
        type: query,
        payload: values,
      })
      this.setState({
        enableModal: false,
        enableStatus: 0,
      })
    }
  }
  use = (e) => {
    switch (e.key * 1) {
      case 0:
      this.setState({
        enableModal: true,
        enableStatus: 0,
      })
      break
      case 1:
      this.setState({
        enableModal: true,
        enableStatus: 1,
      })
      break
      case 2:
      this.setState({
        enableModal: true,
        enableStatus: 2,
      })
      break
      default:
      break
    }
  }
  hideModal = () => {
    this.setState({
      enableModal: false,
      enableStatus: 0,
    })
  }
  render() {
    const menu = (
      <Menu onClick={this.use.bind(this)}>
        <Menu.Item key={1}>
          {/* <Popconfirm title="确定启用嘛？" onConfirm={this.enableChage.bind(this, 1)} okText="确定" cancelText="取消"> */}
            <Icon type="check-circle-o" /> 启用
          {/* </Popconfirm> */}
        </Menu.Item>
        <Menu.Item key={0}>
          {/* <Popconfirm title="确定禁用嘛？" onConfirm={this.enableChage.bind(this, 0)} okText="确定" cancelText="取消"> */}
            <Icon type="close-circle-o" /> 禁用
          {/* </Popconfirm> */}
        </Menu.Item>
        <Menu.Item key={2}>
          {/* <Popconfirm title="确定备用嘛？" onConfirm={this.enableChage.bind(this, 2)} okText="确定" cancelText="取消"> */}
            <Icon type="minus-circle-o" /> 备用
          {/* </Popconfirm> */}
        </Menu.Item>
      </Menu>
    )
    return (
      <span>
        <Dropdown disabled={this.props.disabled} overlay={menu}>
          <Button type="primary" size="small" className={styles.btn_jiange}>
              启用/禁用 <Icon type="down" />
          </Button>
        </Dropdown>
        <Modal
          title={this.state.enableStatus === 0 ? '确定禁用？' : this.state.enableStatus === 1 ? '确定启用？' : '确定备用？'}
          visible={this.state.enableModal}
          onOk={this.enableChage}
          onCancel={this.hideModal}
          okText="确认"
          cancelText="取消"
          closable={false}
          maskClosable={false}
        >
          <p style={{ fontSize: 16, textAlign: 'center' }}>
            {this.state.enableStatus === 0 ?
              <span><Icon type="close-circle-o" style={{ color: 'red' }} />确定要禁用吗？</span>
              :
              this.state.enableStatus === 1 ?
                <span><Icon type="check-circle-o" style={{ color: 'green' }} />确定要启用吗？</span>
                :
                <span><Icon type="minus-circle-o" style={{ color: 'blue' }} />确定要备用吗？</span>
            }
          </p>
        </Modal>
      </span>
    )
  }
}

export default Enable
