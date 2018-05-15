/*
 * @Author: jiangteng
 * @Date: 2017-12-22 17:41:12
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-10 12:13:17
 * 用户新增编辑
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Form, Modal, Progress, Icon, message } from 'antd'
import styles from './CheckPwd.less'
import { resetPwd } from '../../../services/system'

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  pool: 'exception',
}

@connect(state => ({
  users: state.users,
}))
class ForceModify extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
    }
  }

  getPasswordStatus = () => {
    const { form } = this.props
    const value = form.getFieldValue('password')
    if (value && value.length > 9) {
      return 'ok'
    }
    if (value && value.length > 5) {
      return 'pass'
    }
    return 'pool'
  }

  // 关闭弹窗
  hideModal = () => {
    this.setState({
      confirmLoading: false,
    })
    const { hideModal } = this.props
    hideModal()
    this.handleReset()
  }

  // 清空表单
  handleReset = () => {
    this.props.form.resetFields()
  }

  // 确认
  okHandler = () => {
    this.setState({
      confirmLoading: true,
    })
    resetPwd({ userId: this.props.users.selectedRows[0].userIdJson }).then((json) => {
      console.log('json', json)
      if (json) {
        this.hideModal()
        message.success(`重置密码成功,重置后的初始密码为${'bsd123456'}`)
      } else {
        this.setState({
          confirmLoading: false,
        })
      }
    })
  }

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不匹配!')
    } else {
      callback()
    }
  }

  renderPasswordProgress = () => {
    const { form } = this.props
    const value = form.getFieldValue('password')
    const passwordStatus = this.getPasswordStatus()
    return value && value.length ?
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div> : null
  }

  render() {
      const { show } = this.props
    return (
      <Modal
        title="重置密码"
        visible={show}
        onOk={this.okHandler}
        onCancel={this.hideModal}
        confirmLoading={this.state.confirmLoading}
        maskClosable={false}
      >
        <p style={{ fontSize: 16 }}><Icon type="question-circle-o" style={{ color: '#08c', fontWeight: 'bold', marginRight: 10 }} />是否重置此用户密码？</p>
      </Modal>
    )
  }
}

export default Form.create()(ForceModify)

