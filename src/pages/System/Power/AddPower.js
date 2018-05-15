/*
 * @Author: jiangteng
 * @Date: 2017-12-26 17:03:18
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-03-20 13:56:22
 * 添加权限
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Select, Form, Input } from 'antd'
import config from '../../../utils/config'
import { savePower } from '../../../services/system'

const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input

@connect(state => ({
  power: state.power,
}))
@Form.create()
export default class AddPower extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      group: '',
      one: '',
      two: '',
      three: '',
    }
  }
  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          confirmLoading: true,
        })
        savePower(values).then((json) => {
          if (json) {
            this.hideModal()
            this.props.dispatch({
              type: 'power/search',
            })
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
      group: '',
      one: '',
      two: '',
      three: '',
    })
    const { hideModal } = this.props
    hideModal()
    this.handleReset()
  }

  // 清空表单
  handleReset = () => {
    this.props.form.resetFields()
  }

  check1 = (rule, value, callback) => {
    if (!value) {
      this.setState({
        one: '请输入权限名称',
      })
      callback('error')
    } else if (value.indexOf(' ') !== -1) {
      this.setState({
        one: '权限名称不允许输入空格',
      })
      callback('error')
    } else {
      this.setState({
        one: '',
      })
      callback()
    }
  }
  check2 = (rule, value, callback) => {
    if (!value) {
      this.setState({
        two: '请输入权限标题',
      })
      callback('error')
    } else if (value.indexOf(' ') !== -1) {
      this.setState({
        two: '权限标题不允许输入空格',
      })
      callback('error')
    } else {
      this.setState({
        two: '',
      })
      callback()
    }
  }
  check3 = (rule, value, callback) => {
    if (!value) {
      this.setState({
        three: '请输入权限路由',
      })
      callback('error')
    } else if (value.indexOf(' ') !== -1) {
      this.setState({
        three: '权限路由不允许输入空格',
      })
      callback('error')
    } else {
      this.setState({
        three: '',
      })
      callback()
    }
  }

  checkGroup = (rule, value, callback) => {
    if (!value) {
      this.setState({
        group: '请选择/输入群组',
      })
      callback('error')
    } else if (value.indexOf(' ') !== -1) {
      this.setState({
        group: '群组不允许输入空格',
      })
      callback('error')
    } else if (value.length > 20) {
      this.setState({
        group: '群组长度过长',
      })
      callback('error')
    } else {
      this.setState({
        group: '',
      })
      callback()
    }
  }
  render() {
    const { groupList } = this.props.power
    const { getFieldDecorator } = this.props.form
    const { show } = this.props
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    }
    return (
      <div>
        <Modal
          title="添加权限"
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
              help={this.state.one}
              {...formItemLayout}
              label="名称"
            >
              {getFieldDecorator('permissionName', {
                rules: [{
                    required: true, message: '请输入权限名称',
                }, {
                  validator: this.check1,
                }],
            })(
              <Input size={config.InputSize} placeholder="请输入权限名称" maxLength="20" />
            )}
            </FormItem>
            <FormItem
              help={this.state.two}
              {...formItemLayout}
              label="标题"
            >
              {getFieldDecorator('permissionTitle', {
                rules: [{
                    required: true, message: '请输入标题',
                }, {
                  validator: this.check2,
                }],
            })(
              <Input size={config.InputSize} placeholder="请输入标题" maxLength="50" />
            )}
            </FormItem>
            <FormItem
              help={this.state.three}
              {...formItemLayout}
              label="路由"
            >
              {getFieldDecorator('permissionRoute', {
                rules: [{
                    required: true, message: '请输入路由',
                }, {
                  validator: this.check3,
                }],
            })(
              <Input size={config.InputSize} placeholder="例: system/power" maxLength="250" />
            )}
            </FormItem>

            <FormItem
              help={this.state.group}
              {...formItemLayout}
              label="群组"
            >
              {getFieldDecorator('permissionGroup', {
                rules: [{
                    required: true, message: '请选择/输入群组',
                }, {
                  validator: this.checkGroup,
                }],
            })(
              <Select
                mode="combobox"
                size={config.InputSize}
                placeholder="请选择/输入群组"
                style={{ marginTop: 4 }}
              >
                { groupList.length ? groupList.map((item, index) => { return <Option key={index} value={item}>{item}</Option> }) : ''}
              </Select>
            )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="备注"
            >
              {getFieldDecorator('remark')(
                <TextArea rows={4} maxLength="200" />
            )}
            </FormItem>
          </Form>
        </Modal>
      </div>)
  }
}
