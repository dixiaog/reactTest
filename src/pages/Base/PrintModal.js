/*
 * @Author: chenjie
 * @Date: 2017-12-16 17:15:26
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-04-19 09:38:15
 * 添加|编辑打印
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Select, Form, Input } from 'antd'
import config from '../../utils/config'
import { saveTemp, getTemp } from '../../services/api'

const { TextArea } = Input
const FormItem = Form.Item
const Option = Select.Option
@connect(state => ({
  prints: state.prints,
}))
@Form.create()
export default class PrintModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      temp: {},
    }
  }
  componentWillReceiveProps(nextProps) {
    const { autoNo } = nextProps.power
    if (autoNo && !Object.is(nextProps.power, this.props.power)) {
      getTemp({ autoNo }).then((json) => {
        this.setState({
          temp: json,
        })
      })
    }
  }
  handleOk = () => {
    this.handleSubmit()
  }
  handleCancel = () => {
    this.props.form.resetFields()
    this.props.itemModalHidden()
  }
  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          confirmLoading: true,
        })
        Object.assign(values, { autoNo: this.props.power.autoNo })
        saveTemp(values).then((json) => {
          if (json) {
            this.handleCancel()
            this.setState({
              confirmLoading: false,
            })
            this.props.dispatch({
              type: 'prints/search',
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
  render() {
    const { getFieldDecorator } = this.props.form
    const { power } = this.props
    const { templateName, templateType } = power
    const { templateFields } = this.state.temp
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        md: { span: 16 },
      },
    }
    return (
      <div>
        <Modal
          title={templateName ? '编辑模版' : '新增模板'}
          visible={this.props.itemModalVisiable}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
          confirmLoading={this.state.confirmLoading}
        >
          <Form
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="模板名称"
            >
              {getFieldDecorator('templateName', {
                initialValue: templateName,
                rules: [{
                required: true, message: '请输入模板名称',
                }],
            })(
              <Input size={config.InputSize} />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="模板类型"
            >
              {getFieldDecorator('templateType', {
                initialValue: templateType,
                rules: [{
                required: true, message: '请选择模板类型',
                }],
            })(
              <Select placeholder="请选择模板类型" size="small" style={{ marginTop: 4 }}>
                { this.props.prints.types.length ? this.props.prints.types.map((item, index) => <Option value={item.templateType} key={index}>{item.templateName}</Option>) : '' }
              </Select>
            )}
            </FormItem>
            {this.props.power.autoNo ?
              <FormItem
                {...formItemLayout}
                label="模板字段"
              >
                {getFieldDecorator('printFields', {
                  initialValue: templateFields,
              })(
                <TextArea rows={6} />
              )}
              </FormItem> : null }
          </Form>
        </Modal>
      </div>)
  }
}
