/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-03-20 11:53:20
 * 无采购入库页面
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Radio, Input, Form, Select } from 'antd'
import config from '../../../utils/config'
import { addUnPurchaseInStorage } from '../../../services/inventory/storage'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
const Search = Input.Search

@connect(state => ({
  storage: state.storage,
}))
@Form.create()
export default class NoBillList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      supplierList: [],
      supplierListT: [],
      flag: true,
      supplier: undefined,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.flag && nextProps.storage.suppliers.length) {
      const data = []
      nextProps.storage.suppliers.forEach((ele) => {
        data.push(Object.assign({ label: ele.supplierName, value: ele.supplierNo }))
      })
      this.setState({
        supplierList: data,
        supplierListT: data,
        flag: false,
      })
    }
  }

  // 确定按钮
  onOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          confirmLoading: true,
        })
        const findName = this.props.storage.suppliers.filter(ele => ele.supplierNo === values.supplierName)
        Object.assign(values, {
          supplierNo: findName[0].supplierNo,
          supplierName: findName[0].supplierName,
          warehouseNo: values.warehouseName.key,
          warehouseName: values.warehouseName.label,
        })
        addUnPurchaseInStorage(values).then((json) => {
          if (json || json === 0) {
            this.hideModal()
            this.props.showStorageDetails(json)
          } else {
            this.setState({
              confirmLoading: false,
            })
          }
        })
      }
    })
  }

  // 查询供应商
  onChange = (e) => {
    const data = this.state.supplierList
    const newArray = []
    data.forEach((ele) => {
      const flag = ele.label.indexOf(e.target.value)
      if (flag !== -1) {
        newArray.push(ele)
      }
    })
    this.setState({
      supplierListT: newArray,
      supplier: e.target.value,
    })
  }

  // 关闭窗口
  hideModal = () => {
    const { hideModal } = this.props
    hideModal()
    this.setState({
      confirmLoading: false,
      flag: true,
      supplier: undefined,
    })
    this.handleReset()
  }

  // 清空表单
  handleReset = () => {
    this.props.form.resetFields()
  }

  render() {
    const { warehouses } = this.props.storage
    const { show } = this.props
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    }
    return (
      <div>
        <Modal
          title="无采购入库"
          visible={show}
          onOk={this.onOk}
          onCancel={this.hideModal}
          bodyStyle={{ maxHeight: 500, overflowX: 'hidden', padding: 0 }}
          maskClosable={false}
          confirmLoading={this.state.confirmLoading}
        >
          <Form
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="选择仓库"
            >
              {getFieldDecorator('warehouseName', {
                rules: [{
                  required: true, message: '请选择仓库',
                }],
              })(
                <Select labelInValue placeholder="请选择仓库" size={config.InputSize}>
                  {warehouses.length ? warehouses.map(ele => <Option key={ele.warehouseNo} label={ele.warehouseName}>{ele.warehouseName}</Option>) : null}
                </Select>
            )}
            </FormItem>
            { this.state.supplierListT.length ?
              <FormItem
                {...formItemLayout}
                label="选择供应商"
              >
                {getFieldDecorator('supplierName', {
                  rules: [{
                    required: true, message: '请选择供应商',
                  }],
                })(
                  <RadioGroup options={this.state.supplierListT} />
              )}
              </FormItem> :
              <FormItem
                {...formItemLayout}
                label="选择供应商"
              >
                {getFieldDecorator('supplierName', {
                  rules: [{
                    required: true, message: '请选择供应商',
                  }],
                })(
                  <span>未查找到供应商</span>
              )}
              </FormItem> }
            <Search
              placeholder="查询供应商名称"
              onChange={this.onChange}
              value={this.state.supplier}
              style={{ width: 200, marginLeft: 130, marginBottom: 15 }}
              size={config.InputSize}
            />
          </Form>
        </Modal>
      </div>)
  }
}
