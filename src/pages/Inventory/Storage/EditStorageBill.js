/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-04-20 18:41:37
 * 编辑入库单
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Select, Form, Input, Button, message } from 'antd'
import moment from 'moment'
import config from '../../../utils/config'
import { updateInStorage } from '../../../services/inventory/storage'

const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input

@connect(state => ({
  storage: state.storage,
}))
@Form.create()
export default class EditStorageBill extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
    }
  }
  handleSubmit = () => {
    if (this.props.storage.delicacy) {
      message.warning('精细化管理已开启,无法修改数据')
     } else {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.setState({
            confirmLoading: true,
          })
          updateInStorage(Object.assign(values, { supplierNo: this.props.record.supplierNo, warehouseName: values.warehouseName.label, warehouseNo: values.warehouseName.key })).then((json) => {
            if (json) {
              this.hideModal()
              this.props.dispatch({ type: 'storage/search' })
            } else {
              this.setState({
                confirmLoading: false,
              })
            }
          })
        }
      })
     }
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

  // 清空表单
  handleReset = () => {
    this.props.form.resetFields()
  }

  render() {
    const { warehouses } = this.props.storage
    const { getFieldDecorator } = this.props.form
    const { billNo, billDate, relativeBillNo, warehouseNo, supplierName, warehouseName, remark } = this.props.record
    const { show } = this.props
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    }
    return (
      <div>
        <Modal
          title="修改入库单"
          visible={show}
          onCancel={this.hideModal}
          bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
          maskClosable={false}
          footer={this.props.record.billStatus === 0 ?
            [
              <Button key="cancel" onClick={this.hideModal}>取消</Button>,
              <Button key="submit" loading={this.state.confirmLoading} type="primary" onClick={this.handleSubmit}>
                确认
              </Button>,
             ] : [
               <Button key="1" onClick={this.hideModal}>关闭</Button>,
             ]
          }
        >
          <Form
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="单据编号"
            >
              {getFieldDecorator('billNo', {
                initialValue: billNo,
              })(
                <Input size={config.InputSize} readOnly={!false} />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="单据日期"
            >
              {getFieldDecorator('billDate', {
                initialValue: moment(billDate).format('YYYY-MM-DD'),
            })(
              <Input size={config.InputSize} readOnly={!false} />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="关联单据号"
            >
              {getFieldDecorator('relativeBillNo', {
                initialValue: relativeBillNo,
            })(
              <Input readOnly={!false} size={config.InputSize} />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="供应商"
            >
              {getFieldDecorator('supplierName', {
                initialValue: supplierName,
              })(
                <Input readOnly={!false} size={config.InputSize} />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="收货仓"
            >
              {getFieldDecorator('warehouseName', {
                initialValue: { key: warehouseNo, label: warehouseName },
                rules: [{
                  required: true, message: '请选择仓库',
                }],
              })(
                <Select labelInValue size={config.InputSize} placeholder="请选择仓库" disabled={this.props.record.billStatus !== 0} >
                  {warehouses.length ? warehouses.map(ele => <Option key={ele.warehouseNo} label={ele.warehouseName}>{ele.warehouseName}</Option>) : ''}
                </Select>
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="备注"
            >
              {getFieldDecorator('remark', {
                initialValue: remark,
              })(
                <TextArea rows={4} readOnly={this.props.record.billStatus !== 0} maxLength="500" />
            )}
            </FormItem>
          </Form>
        </Modal>
      </div>)
  }
}
