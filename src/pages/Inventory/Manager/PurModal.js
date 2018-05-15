/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-04-20 09:10:06
 * 新增采购
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Select, Form, Input, DatePicker, Button } from 'antd'
import moment from 'moment'
import config from '../../../utils/config'
import { savePurchase, editPurchase } from '../../../services/inventory/manager'
import { getLocalStorageItem } from '../../../utils/utils'
import { GetViewData } from '../../../services/base/warehouse'
import AddressCas from '../../../components/AddressCas'

const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input

@connect(state => ({
  manager: state.manager,
}))
@Form.create()
export default class PurModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      tax: '', // 税率错误信息
      exceed: '', // 溢出比例错误信息
      warehouse: {},
      addrClean: false,
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      warehouse: { province: nextProps.record.province, city: nextProps.record.city, county: nextProps.record.county },
    })
  }
  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
        if (!err) {
          this.setState({
            confirmLoading: true,
          })
          if (!this.props.record.billNo) {
            Object.assign(values,
              { arrivalTime: values.arrivalTime.format('YYYY-MM-DD') },
              { billDate: values.billDate.format('YYYY-MM-DD') },
              { province: values.addressDetail[0] },
              { city: values.addressDetail[1] },
              { county: values.addressDetail[2] },
              { purchaseUserName: values.purchaseUserId.label },
              { purchaseUserId: values.purchaseUserId.key },
              { warehouseName: values.warehouseNo.label },
              { warehouseNo: values.warehouseNo.key },
              { supplierName: values.supplierNo.label },
              { supplierNo: values.supplierNo.key },
              { exceedRate: values.exceedRate ? values.exceedRate / 100 : '' },
              { taxRate: values.taxRate ? values.taxRate / 100 : '' },
            )
            delete values.addressDetail
            delete values.billNo
            savePurchase(values).then((json) => {
              if (json || json === 0) {
                this.hideModalAndShow()
                this.props.dispatch({
                  type: 'manager/search',
                })
                this.props.dispatch({
                  type: 'manager/changeState',
                  payload: { billNo: json },
                })
              } else {
                this.setState({
                  confirmLoading: false,
                })
              }
            })
          } else {
            Object.assign(values,
              { arrivalTime: values.arrivalTime.format('YYYY-MM-DD') },
              { billDate: values.billDate.format('YYYY-MM-DD') },
              { province: values.addressDetail[0] },
              { city: values.addressDetail[1] },
              { county: values.addressDetail[2] },
              { purchaseUserName: values.purchaseUserId.label },
              { purchaseUserId: values.purchaseUserId.key },
              { warehouseName: values.warehouseNo.label },
              { warehouseNo: values.warehouseNo.key },
              { supplierName: values.supplierNo.label },
              { supplierNo: values.supplierNo.key },
              { exceedRate: values.exceedRate ? values.exceedRate / 100 : '' },
              { taxRate: values.taxRate ? values.taxRate / 100 : '' },
            )
            delete values.addressDetail
            editPurchase(values).then((json) => {
              if (json) {
                this.hideModal()
                this.props.dispatch({
                  type: 'manager/search',
                })
              } else {
                this.setState({
                  confirmLoading: false,
                })
              }
            })
          }
        }
      })
  }

  addrSelect = (selectedOptions) => {
    const { setFieldsValue } = this.props.form
    if (selectedOptions[0] === undefined) {
      setFieldsValue({
        addressDetail: [],
      })
    } else {
      setFieldsValue({
        addressDetail: selectedOptions,
      })
    }
    this.setState({
      addrClean: false,
    })
  }
  GetViewData = (value) => {
    GetViewData({ warehouseNo: value.key }).then((json) => {
      const { setFieldsValue } = this.props.form
      setFieldsValue({
        addressDetail: [json.province, json.city, json.county],
        address: json.address,
      })
      this.setState({
        warehouse: json,
      })
    })
  }
  // 关闭窗口并打开商品列表
  hideModalAndShow = () => {
    const { setFieldsValue } = this.props.form
    setFieldsValue({
      addressDetail: [],
    })
    const { hideModal, showGood } = this.props
    hideModal()
    showGood()
    this.handleReset()
    this.setState({
      confirmLoading: false,
      warehouse: {},
      addrClean: true,
    })
  }

  // 关闭窗口
  hideModal = () => {
    const { setFieldsValue } = this.props.form
    setFieldsValue({
      addressDetail: undefined,
    })
    const { hideModal } = this.props
    hideModal()
    this.handleReset()
    this.setState({
      confirmLoading: false,
      warehouse: {},
      addrClean: true,
    })
  }

  // 清空表单
  handleReset = () => {
    this.props.form.resetFields()
  }

  // 检查比例
  checkTax = (rule, value, callback) => {
    if (!value) {
      this.setState({
        tax: '',
      })
      callback()
    } else if (value > 100) {
      this.setState({
        tax: '税率不能大于100',
      })
      callback('error')
    } else if (value % 1 !== 0 || value.toString().indexOf('.') !== -1) {
      this.setState({
        tax: '税率必须为整数(不带小数位)',
      })
      callback('error')
    } else if (!isNaN(value) && value > 0) {
      this.setState({
        tax: '',
      })
      callback()
    } else {
      this.setState({
        tax: '税率必须为大于0的数字',
      })
      callback('error')
    }
  }

  // 检查溢出比例
  checkExceed = (rule, value, callback) => {
    if (!value) {
      this.setState({
        exceed: '',
      })
      callback()
    } else if (value > 100) {
      this.setState({
        exceed: '溢出比例不能大于100',
      })
      callback('error')
    } else if (value % 1 !== 0 || value.toString().indexOf('.') !== -1) {
      this.setState({
        exceed: '溢出比例必须为整数(不带小数位)',
      })
      callback('error')
    } else if (!isNaN(value) && value > 0) {
      this.setState({
        exceed: '',
      })
      callback()
    } else {
      this.setState({
        exceed: '溢出比例必须为大于0的数字',
      })
      callback('error')
    }
  }

  render() {
    const { warehouses, suppliers, purUser } = this.props.manager
    const { getFieldDecorator } = this.props.form
    const { billStatus, billNo, arrivalTime, billDate,
      remark, supplierName, purchaseUserName, purchaseUserId, taxRate, supplierNo, warehouseNo, warehouseName, address, exceedRate } = this.props.record
    const flag = (billStatus !== 0 && billStatus !== undefined) ? !false : false
    const { show } = this.props
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    }
    return (
      <div>
        <Modal
          title={billNo ? '编辑普通采购单' : '添加普通采购单'}
          visible={show}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
          maskClosable={false}
          footer={!flag ?
            [
              <Button key="cancel" onClick={this.hideModal}>取消</Button>,
              <Button key="submit" loading={this.state.confirmLoading} type="primary" onClick={this.handleSubmit}>
                确认
              </Button>,
             ] : [
               <Button key="close" onClick={this.hideModal}>关闭</Button>,
             ]
          }
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label="采购单号"
            >
              {getFieldDecorator('billNo', {
                initialValue: billNo,
              })(
                <Input placeholder="自动生成" size={config.InputSize} readOnly={!false} />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="采购日期"
            >
              {getFieldDecorator('billDate', {
                initialValue: billDate ? moment(billDate) : moment(),
                rules: [{
                  required: true, message: '请选择采购日期',
                }],
            })(
              <DatePicker disabled={flag} size={config.InputSize} placeholder="请选择采购日期" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="预计到货日期"
            >
              {getFieldDecorator('arrivalTime', {
                initialValue: arrivalTime ? moment(arrivalTime) : moment(),
                rules: [{
                  required: true, message: '请选择预计到货日期',
                }],
            })(
              <DatePicker disabled={flag} size={config.InputSize} placeholder="请选择预计到货日期" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="供应商"
            >
              {getFieldDecorator('supplierNo', {
                initialValue: supplierName ? { key: supplierNo, label: supplierName } : undefined,
                rules: [{
                  required: true, message: '请选择供应商',
                }],
              })(
                <Select
                  disabled={flag}
                  placeholder="请选择供应商"
                  size="small"
                  labelInValue
                >
                  {suppliers.length ? suppliers.map((ele, index) => <Option key={index} value={ele.supplierNo}>{ele.supplierName}</Option>) : ''}
                </Select>
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="采购员"
            >
              {getFieldDecorator('purchaseUserId', {
                initialValue: purchaseUserName ? { key: purchaseUserId, label: purchaseUserName } : { key: `${getLocalStorageItem('userId')}`, label: `${getLocalStorageItem('userName')}` },
                rules: [{
                  required: true, message: '请选择采购员',
                }],
              })(
                <Select
                  disabled={flag}
                  labelInValue
                  placeholder="请选择采购员"
                  size="small"
                >
                  {purUser.length ? purUser.map((ele, index) => <Option key={index} value={ele.userId}>{ele.nickName}</Option>) : ''}
                </Select>
            )}
            </FormItem>
            <FormItem
              help={this.state.tax}
              {...formItemLayout}
              label="税率"
            >
              {getFieldDecorator('taxRate', {
                initialValue: taxRate !== undefined ? taxRate * 100 : undefined,
                rules: [{
                  validator: this.checkTax,
                }],
              })(
                <Input readOnly={flag} size={config.InputSize} placeholder="请输入税率" suffix={<span>%</span>} />
            )}
            </FormItem>
            <FormItem
              help={this.state.exceed}
              {...formItemLayout}
              label="溢出比例"
            >
              {getFieldDecorator('exceedRate', {
                initialValue: exceedRate !== undefined ? exceedRate * 100 : undefined,
                rules: [{
                  validator: this.checkExceed,
                }],
              })(
                <Input readOnly={flag} size={config.InputSize} placeholder="请输入溢出比例" suffix={<span>%</span>} />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="仓储方"
            >
              {getFieldDecorator('warehouseNo', {
                initialValue: warehouseName ? { key: warehouseNo, label: warehouseName } : undefined,
                rules: [{
                  required: true, message: '请选择仓库',
                }],
              })(
                <Select onChange={this.GetViewData} labelInValue size={config.InputSize} placeholder="请选择仓库" disabled={flag} >
                  {warehouses.length ? warehouses.map((ele, index) => <Option key={index} value={ele.warehouseNo}>{ele.warehouseName}</Option>) : ''}
                </Select>
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="收货地址"
            >
              {getFieldDecorator('addressDetail', {
                rules: [{
                  required: true, message: '请选择收货地址',
                }],
              })(
                <AddressCas disabled={flag} doClean={this.state.addrClean} addrSelect={this.addrSelect} wh={this.state.warehouse} />
                // <Cascader disabled={flag} size={config.InputSize} options={options} placeholder="请选择收货地址" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="具体地址"
            >
              {getFieldDecorator('address', {
                initialValue: address,
                rules: [{
                  required: true, message: '请输入具体地址',
                }],
              })(
                <Input readOnly={flag} size={config.InputSize} placeholder="请输入具体地址" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="备注"
            >
              {getFieldDecorator('remark', {
                initialValue: remark,
              })(
                <TextArea rows={4} readOnly={flag} maxLength="250" />
            )}
            </FormItem>
          </Form>
        </Modal>
      </div>)
  }
}
