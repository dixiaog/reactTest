/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-03-20 13:36:53
 * 修改我方备注
 */

import React, { Component } from 'react'
import { Modal, Form, Input } from 'antd'
import { connect } from 'dva'
import config from '../../../utils/config'
import { updateRemark } from '../../../services/supplySell/supplierlist'

const FormItem = Form.Item
const { TextArea } = Input

@Form.create()
@connect(state => ({
  supplierlist: state.supplierlist,
}))
export default class EditRemark extends Component {
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
            supplierRemark: values.remark,
            supplierNo: this.props.supplierlist.list[0].supplierNo,
           })
           delete values.remark
           updateRemark(values).then((json) => {
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
    const { supplierRemark } = this.props.record
    const { show } = this.props
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    }
    return (
      <div>
        <Modal
          title="修改备注"
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
              label="我方备注"
            >
              {getFieldDecorator('remark', {
                initialValue: supplierRemark,
                rules: [{
                  required: true, message: '请输入我方备注',
                }],
              })(
                <TextArea maxLength="200" row={4} placeholder="请输入我方备注" size={config.InputSize} />
            )}
            </FormItem>
          </Form>
        </Modal>
      </div>)
  }
}
