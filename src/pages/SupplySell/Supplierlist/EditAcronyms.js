/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-03-20 13:36:41
 * 修改助记符
 */

import React, { Component } from 'react'
import { Modal, Form, Input } from 'antd'
import { connect } from 'dva'
import config from '../../../utils/config'
import { updateAcronyms } from '../../../services/supplySell/supplierlist'

const FormItem = Form.Item

@Form.create()
@connect(state => ({
  supplierlist: state.supplierlist,
}))
export default class EditAcronyms extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
    }
  }
  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
        if (!err) {
          this.setState({
            confirmLoading: true,
          })
          Object.assign(values, {
            autoNo: this.props.supplierlist.list[0].autoNo,
            supplierAcronyms: values.supplierAcronyms,
            supplierNo: this.props.supplierlist.list[0].supplierNo,
           })
          updateAcronyms(values).then((json) => {
            if (json) {
              this.hideModal()
              this.props.dispatch({
                type: 'supplierlist/fetch',
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
    const { hideModal } = this.props
    this.setState({
      confirmLoading: false,
    })
    hideModal()
    this.handleReset()
  }
  // 重置表单
  handleReset = () => {
    this.props.form.resetFields()
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { supplierAcronyms } = this.props.record
    const { show } = this.props
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    }
    return (
      <div>
        <Modal
          title="修改助记符"
          visible={show}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
          maskClosable={false}
          confirmLoading={this.state.confirmLoading}
        >
          <Form
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="助记符"
            >
              {getFieldDecorator('supplierAcronyms', {
                initialValue: supplierAcronyms,
                rules: [{
                  required: true, message: '请输入助记符',
                }],
              })(
                <Input maxLength="20" placeholder="请输入助记符" size={config.InputSize} />
            )}
            </FormItem>
          </Form>
        </Modal>
      </div>)
  }
}
