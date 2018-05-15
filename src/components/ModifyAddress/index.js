/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-12 14:02:49
 * 修改收货地址
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Input, message } from 'antd'
import AddressCas from '../../components/AddressCas'
import { editOrderMark } from '../../services/order/search'

const FormItem = Form.Item

@Form.create()
@connect(state => ({
  search: state.search,
}))
export default class ModifyAddress extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentRecord: undefined,
      confirmLoading: false,
      phone: '',
      telNo: '',
      addrClean: false,
      warehouse: { province: undefined, city: undefined, county: undefined },
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.btnModify) {
      if (this.state.addrClean) {
        this.setState({ currentRecord: nextProps.record, addrClean: false })
      } else {
        this.setState({ currentRecord: nextProps.record })
      }
    } else {
      const { selectedRows } = nextProps.search
      if (selectedRows.length) {
        if (this.state.addrClean) {
          this.setState({ currentRecord: selectedRows[0], addrClean: false })
        } else {
          this.setState({ currentRecord: selectedRows[0] })
        }
      }
    }
  }
  // 获取省市区地址
  addrSelect = (selectedOptions) => {
    const [province, city, county] = selectedOptions
    this.setState({ warehouse: { province, city, county } })
    const { setFieldsValue } = this.props.form
    setFieldsValue({
      warehouseDesc: selectedOptions,
    })
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          confirmLoading: true,
        })
        Object.assign(values, this.state.warehouse, { orderNos: [this.state.currentRecord.orderNo] })
        editOrderMark(values).then((json) => {
          if (json) {
            message.success('收货地址修改成功')
            this.hideModal()
            this.props.dispatch({
              type: 'search/search',
            })
            this.props.dispatch({
              type: 'search/changeState',
              payload: { selectedRowKeys: [], selectedRows: [] },
            })
          }
          this.setState({
            confirmLoading: false,
          })
        })
      }
    })
  }
  // 关闭窗口
  hideModal = () => {
    const { hideModal } = this.props
    this.setState({
      confirmLoading: false,
      addrClean: true,
      phone: '',
      telNo: '',
    })
    this.props.form.setFields({
      mobileNo: {
        errors: '',
      },
    })
    this.props.form.setFields({
      telNo: {
        errors: '',
      },
    })
    hideModal()
    this.handleReset()
  }
   // 重置表单
   handleReset = () => {
    this.props.form.resetFields()
  }

  checkWarehouse = (rule, value, callback) => {
    if (this.state.warehouse.province === undefined ||
      this.state.warehouse.city === undefined ||
      this.state.warehouse.county === undefined) {
      callback('warehouse is error')
    }
    callback()
  }
   // 检验座机--TelNo
   checkTelNo = (rule, value, callback) => {
    const { getFieldValue, getFieldError } = this.props.form
    const mobileNo = getFieldValue('mobileNo')
    const errorM = getFieldError('mobileNo')
    if (!value && !mobileNo) {
      this.setState({
        telNo: '联系电话,联系手机必填一项',
        phone: '联系电话,联系手机必填一项',
      })
      callback('error')
      this.props.form.setFields({
        mobileNo: {
          errors: [new Error()],
        },
      })
    } else if (value && mobileNo && !(/^([0-9]{3,4}-)?[0-9]{7,8}$/.test(value))) {
        this.setState({
          telNo: '请输入正确的联系电话',
        })
        callback('error')
        this.props.form.setFields({
          mobileNo: {
            value: mobileNo,
            errors: errorM,
          },
        })
      } else if (value && !mobileNo && !(/^([0-9]{3,4}-)?[0-9]{7,8}$/.test(value))) {
        this.setState({
          telNo: '请输入正确的联系电话',
          phone: '',
        })
        callback('error')
        this.props.form.setFields({
          mobileNo: {
            value: '',
            errors: '',
          },
        })
      } else {
        this.setState({
          telNo: '',
        })
        callback()
        this.props.form.setFields({
          mobileNo: {
            value: mobileNo,
            errors: errorM,
          },
        })
    }
  }
  // 检验手机--MobileNo
  checkMobileNo = (rule, value, callback) => {
    const { getFieldValue, getFieldError } = this.props.form
    const errorM = getFieldError('telNo')
    const telNo = getFieldValue('telNo')
    if (!value && !telNo) {
      this.setState({
        telNo: '联系电话,联系手机必填一项',
        phone: '联系电话,联系手机必填一项',
      })
      callback('error')
      this.props.form.setFields({
        telNo: {
          errors: [new Error()],
        },
      })
    } else if (value && telNo && value.length !== 11) {
        this.setState({
          phone: '请输入11位手机号码',
        })
        callback('error')
        this.props.form.setFields({
          telNo: {
            value: telNo,
            errors: errorM,
          },
        })
      } else if (value && !telNo && value.length !== 11) {
        this.setState({
          phone: '请输入11位手机号码',
          telNo: '',
        })
        callback('error')
        this.props.form.setFields({
          telNo: {
            value: '',
            errors: '',
          },
        })
      } else if (value && telNo && !(/^1[345678]\d{9}$/.test(value))) {
        this.setState({
          phone: '请输入正确的手机号码',
        })
        callback('error')
        this.props.form.setFields({
          telNo: {
            value: telNo,
            errors: errorM,
          },
        })
      } else if (value && !telNo && !(/^1[345678]\d{9}$/.test(value))) {
        this.setState({
          phone: '请输入正确的手机号码',
          telNo: '',
        })
        callback('error')
        this.props.form.setFields({
          telNo: {
            value: '',
            errors: '',
          },
        })
      } else {
        this.setState({
          phone: '',
        })
        callback()
        this.props.form.setFields({
          telNo: {
            value: telNo,
            errors: errorM,
          },
        })
    }
  }
  render() {
    const { show } = this.props
    const { getFieldDecorator } = this.props.form
    const formItemLayoutT = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    }
    let wh = {}
    let address = ''
    let receiver = ''
    let telNo = ''
    let mobileNo = ''
    if (this.state.currentRecord) {
      wh = { province: this.state.currentRecord.province, city: this.state.currentRecord.city, county: this.state.currentRecord.county }
      address = this.state.currentRecord.address
      receiver = this.state.currentRecord.receiver
      telNo = this.state.currentRecord.telNo
      mobileNo = this.state.currentRecord.mobileNo
    }
    return (
      <div>
        <Modal
          title="修改收货地址"
          visible={show}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          maskClosable={false}
          width={700}
          confirmLoading={this.state.confirmLoading}
        >
          <Form
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayoutT}
              label="收货地址"
            >
              {getFieldDecorator('warehouseDesc', {
                rules: [{
                  required: true,
                  message: '请选择收货地址',
                }, {
                  validator: this.checkWarehouse, message: '请选择收货地址',
                }],
              })(
                <AddressCas doClean={this.state.addrClean} addrSelect={this.addrSelect} wh={wh} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayoutT}
              label="具体地址"
            >
              {getFieldDecorator('address', {
                  initialValue: address,
                  rules: [{
                    required: true,
                    message: '请输入具体地址',
                  }],
                })(
                  <Input maxLength="250" size="small" style={{ width: '300px' }} placeholder="请输入具体地址" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayoutT}
              label="收件人名"
            >
              {getFieldDecorator('receiver', {
                initialValue: receiver,
                rules: [{
                  required: true, message: '请输入收件人',
                }],
              })(
                <Input maxLength="20" style={{ width: '200px' }} size="small" placeholder="请输入收件人" />
            )}
            </FormItem>
            <FormItem
              help={this.state.telNo}
              {...formItemLayoutT}
              label="联系电话"
            >
              {getFieldDecorator('telNo', {
                initialValue: telNo,
                rules: [{
                  validator: this.checkTelNo,
                }],
              })(
                <Input maxLength="25" style={{ width: '150px' }} size="small" />
            )}
              <span style={{ color: '#55d4fd', fontWeight: 'bold', marginLeft: '5px' }}>更改才输入，如果不更改，不要输入，要删除原号码，则输入空格</span>
            </FormItem>
            <FormItem
              help={this.state.phone}
              {...formItemLayoutT}
              label="联系手机"
            >
              {getFieldDecorator('mobileNo', {
                initialValue: mobileNo,
                rules: [{
                  validator: this.checkMobileNo,
                }],
              })(
                <Input maxLength="11" style={{ width: '150px' }} size="small" />
            )}
              <span style={{ color: '#55d4fd', fontWeight: 'bold', marginLeft: '5px' }}>更改才输入，如果不更改，不要输入，要删除原号码，则输入空格</span>
            </FormItem>
          </Form>
        </Modal>
      </div>)
  }
}
