/*
 * @Author: tanmengjia
 * @Date: 2018-05-16 14:28:36
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-16 15:24:59
 * 添加/编辑资源
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Input, Select } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option

@connect(state => ({
  power: state.power,
}))
@Form.create()
export default class PowerModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // confirmLoading: false,
    }
  }
  componentDidMount() {
    if (this.props.record) {
      this.props.dispatch({
        type: 'power/getChooseData',
        payload: this.props.record.id,
      })
    }
  }
  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.props.record) {
          Object.assign(values, { id: this.props.record.id})
        }
        console.log('values', values)
      }
    })
  }

  hideModal = () => {
    this.props.form.resetFields()
    this.props.hideModal()
    this.props.dispatch({
      type: 'power/clean',
    })
  }
  render() {
    const { powerVisible } = this.props
    const { id, groupname, menuId, powerName, title, routeUrl, remark } = this.props.record ? this.props.record : ''
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }
    return (
      <div>
        <Modal
          title={id > -1 ? '详情' : '添加资源'}
          visible={powerVisible}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          maskClosable={false}
          // confirmLoading={this.state.confirmLoading}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label="资源群组"
            >
              {getFieldDecorator('groupname', {
                initialValue: groupname,
                rules: [{
                  required: true, message: '请输入角色名称',
                }],
            })(
              <Input size="small" placeholder="请输入角色名称" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="父菜单"
            >
              {getFieldDecorator('menuId', {
                initialValue: menuId,
                rules: [{
                  required: true, message: '请输入角色简称',
                }],
            })(
              <Select size="small" style={{ marginTop: 4 }}>
                <Option key={0} value={0}>父0</Option>
                <Option key={1} value={1}>父1</Option>
                <Option key={2} value={2}>父2</Option>
              </Select>
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="资源名称"
            >
              {getFieldDecorator('powerName', {
                initialValue: powerName,
                rules: [{
                  required: true, message: '请输入角色简称',
                }],
            })(
              <Input size="small" placeholder="请输入角色简称" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="资源简称"
            >
              {getFieldDecorator('title', {
                initialValue: title,
                rules: [{
                  required: true, message: '请输入角色简称',
                }],
            })(
              <Input size="small" placeholder="请输入角色简称" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="菜单路由"
            >
              {getFieldDecorator('routeUrl', {
                initialValue: routeUrl,
                rules: [{
                  required: true, message: '请输入角色简称',
                }],
            })(
              <Input size="small" placeholder="请输入角色简称" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="备注"
            >
              {getFieldDecorator('remark', {
                initialValue: remark,
            })(
              <TextArea size="small" rows={4} />
            )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}
