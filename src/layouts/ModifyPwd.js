 /*
 * @Author: jiangteng
 * @Date: 2017-12-22 17:41:12
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-18 15:57:23
 * 用户修改密码
 */

import React, { Component } from 'react'
import { Input, Form, Modal, Popover, Progress } from 'antd'
import styles from './PageHeader.less'

const FormItem = Form.Item

const passwordStatusMap = {
  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  pool: <div className={styles.error}>强度：弱</div>,
}

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  pool: 'exception',
}

class ModifyPwd extends Component {
  constructor(props) {
    super(props)
    this.state = {
        visible: false,
        help: '',
        confirmLoading: false,
    }
  }

  onBlur = () => {
    this.setState({
      visible: false,
    })
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
      help: '',
      helpInit: '',
      visible: false,
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
  okHandler = (e) => {
    e.preventDefault()
    this.props.form.validateFields({ force: true },
      (err, values) => {
        if (!err) {
          console.log('values', values)
        }
      }
    )
    this.setState({
      visible: false,
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

  checkPassword = (rule, value, callback) => {
    if (!value) {
      this.setState({
        help: '请输入密码！',
      })
      callback('error')
    } else {
      this.setState({
        help: '',
      })
      if (value.length < 6 || value.length > 16) {
        this.setState({
          help: '密码长度不符(长度为6~16)',
          visible: true,
        })
        callback('error')
      } else if (/^\d+$/.test(value) || value.indexOf(' ') !== -1) {
        this.setState({
          help: '不能是纯数字，不能包含空格',
          visible: true,
        })
        callback('error')
      } else {
        const { form } = this.props
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true })
        }
        callback()
      }
    }
  }

  checkInitPwd = (rule, value, callback) => {
    if (!value) {
      this.setState({
        helpInit: '请输入原始密码！',
      })
      callback('error')
    } else if (value.length < 6 || value.length > 16) {
      this.setState({
        helpInit: '密码长度不符(长度为6~16)',
      })
      callback('error')
    } else if (/^\d+$/.test(value) || value.indexOf(' ') !== -1) {
      this.setState({
        helpInit: '不能是纯数字，不能包含空格',
      })
      callback('error')
    } else {
      this.setState({
        helpInit: '',
      })
      const { form } = this.props
      if (value && this.state.confirmDirty) {
        form.validateFields(['InitPwd'], { force: true })
      }
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
      // const userNo = getLocalStorageItem('userNo')
      // const userName = getLocalStorageItem('userName')
      const { getFieldDecorator } = this.props.form
      const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 8 },
      }
    return (
      <Modal
        title="修改密码"
        visible={show}
        onOk={this.okHandler}
        onCancel={this.hideModal}
        confirmLoading={this.state.confirmLoading}
        maskClosable={false}
      >
        <Form>
          <FormItem
            {...formItemLayout}
            label="用户名"
          >
            {getFieldDecorator('userNo', {
                // initialValue: userNo,
            })(
              // <div>{userNo}</div>
              <div>测试111</div>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="姓名"
          >
            {getFieldDecorator('userName', {
                // initialValue: userName,
            })(
              // <div>{userName}</div>
              <div>测试111</div>
            )}
          </FormItem>
          <FormItem
            help={this.state.helpInit}
            {...formItemLayout}
            label="原始密码"
          >
            {getFieldDecorator('InitPwd', {
                rules: [{
                required: true, message: '请输入原始密码',
                },
                //  {
                //   validator: this.checkInitPwd,
                // }
              ],
            })(
              <Input size="small" placeholder="请输入原始密码" type="password" maxLength="16" />
            )}
          </FormItem>
          <FormItem
            help={this.state.help}
            {...formItemLayout}
            label="新密码"
          >
            <Popover
              content={
                <div style={{ padding: '4px 0' }}>
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div style={{ marginTop: 10 }}>密码要求：由6-16位字符组成，字母区分大小写(不能是纯数字，不能包含空格)</div>
                </div>
              }
              overlayStyle={{ width: 240 }}
              placement="right"
              visible={this.state.visible}
            >
              {getFieldDecorator('password', {
                rules: [{
                  required: true, message: '请输入密码',
                }, {
                  validator: this.checkPassword,
                }],
              })(
                <Input
                  size="small"
                  type="password"
                  placeholder="请输入密码"
                  maxLength="16"
                  onBlur={this.onBlur}
                />
              )}
            </Popover>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="再次确认"
          >
            {getFieldDecorator('confirm', {
              rules: [{
                required: true, message: '请确认密码！',
              }, {
                validator: this.checkConfirm,
              }],
            })(
              <Input
                size="small"
                type="password"
                placeholder="请确认密码"
                maxLength="16"
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ModifyPwd)

