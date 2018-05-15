/*
 * @Author: jiangteng
 * @Date: 2017-12-26 17:03:18
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-04-12 14:46:18
 * 添加角色
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Input } from 'antd'
import config from '../../../utils/config'
import { editRole } from '../../../services/system'

const FormItem = Form.Item

@connect(state => ({
    roles: state.roles,
}))
@Form.create()
export default class EditRole extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      roleName: '',
    }
  }
  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
        if (!err) {
          const params = {}
          Object.assign(params, { roleName: values.roleName, roleNo: this.props.roleNo })
          this.setState({
            confirmLoading: true,
          })
          editRole(params).then((json) => {
            if (json) {
              this.hideModal()
              this.props.update(values.roleName)
            } else {
              this.setState({
                confirmLoading: false,
              })
            }
          })
        }
      })
  }
  // 关闭窗口
  hideModal = () => {
    this.setState({
      confirmLoading: false,
      roleName: '',
    })
    const { hideModal } = this.props
    hideModal()
    this.handleReset()
  }

  // 清空表单
  handleReset = () => {
    this.props.form.resetFields()
  }

  checkRoleName = (rule, value, callback) => {
    const data = this.props.roles.list
    let status = false
    for (const index in data) {
      if (data[index].roleName === value) {
        status = true
        break
      }
    }
    if (!value) {
      this.setState({
        roleName: '请输入角色名称',
      })
      callback('error')
    } else if (value.indexOf(' ') !== -1) {
      this.setState({
        roleName: '角色名不允许输入空格',
      })
      callback('error')
    } else if (status) {
      this.setState({
        roleName: '角色名称重复,请修改',
      })
      callback('error')
    } else {
      this.setState({
        roleName: '',
      })
      callback()
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { show, roleName } = this.props
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    }

    return (
      <div>
        <Modal
          title="编辑角色"
          visible={show}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
          confirmLoading={this.state.confirmLoading}
          maskClosable={false}
        >
          <Form
            style={{ marginTop: 8 }}
          >
            <FormItem
              help={this.state.roleName}
              {...formItemLayout}
              label="名称"
            >
              {getFieldDecorator('roleName', {
                initialValue: roleName,
                rules: [{
                    required: true, message: '请输入角色名称',
                }, {
                  validator: this.checkRoleName,
                }],
            })(
              <Input size={config.InputSize} placeholder="请输入角色名称" maxLength="50" />
            )}
            </FormItem>
          </Form>
        </Modal>
      </div>)
  }
}
