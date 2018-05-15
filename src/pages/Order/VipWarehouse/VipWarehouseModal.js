/*
 * @Author: tanmengjia
 * @Date: 2018-04-02 14:27:49
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-04-19 10:08:25
 * 设置收货地址
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Input, notification, message } from 'antd'
import config from '../../../utils/config'
import { saveVipWarehouse } from '../../../services/vip/vipWarehouse'
import AddressCas from '../../../components/AddressCas'

const { TextArea } = Input
const FormItem = Form.Item

@connect(state => ({
  vipWarehouse: state.vipWarehouse,
}))
@Form.create()
export default class ProductLimitModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isFirst: true,
      options: [],
      position: [],
      select: [],
      addrClean: false,
      warehouse: {},
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.vipWarehouse.chooseData && this.state.isFirst) {
      this.setState({
        warehouse: nextProps.vipWarehouse.chooseData,
        isFirst: false,
      })
    }
  }
  addrSelect = (selectedOptions) => {
    const { setFieldsValue } = this.props.form
    if (selectedOptions[0]) {
      setFieldsValue({
        province: selectedOptions,
      })
      this.setState({
        select: selectedOptions,
      })
    }
  }
  handleCancel = () => {
    this.props.form.resetFields()
    this.props.limitModalHidden()
    this.setState({
      warehouse: {},
      addrClean: true,
      select: [],
    })
  }
  handleOk = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values.province && values.province.length) {
          if (values.province.length === 1) {
            Object.assign(values, { province: values.province[0] })
          } else if (values.province.length === 2) {
            Object.assign(values, { province: values.province[0], city: values.province[1] })
          } else if (values.province.length === 3) {
            Object.assign(values, { province: values.province[0], city: values.province[1], county: values.province[2] })
          }
        }
        if(this.props.vipWarehouse.chooseData) {
          Object.assign(values, { autoNo: this.props.vipWarehouse.chooseData.autoNo })
          saveVipWarehouse(values).then((json) => {
            if (json) {
              notification.success({
                message: '操作成功',
              })
              this.props.form.resetFields()
              this.props.limitModalHidden()
              this.props.dispatch({ type: 'vipWarehouse/search' })
            }
          })
        } else {
          message.error('无仓库数据，请重新选择')
        }
      }
    })
  }
  onChangeGetProvince = (value, selectedOptions) => {
    this.setState({
      position: value,
      select: selectedOptions.map(ele => ele.label),
    })
  }
  checkMobile = (rulr, value, callback) => {
    if (!value) {
      callback()
    } else {
      const isMobile = /^(((13[0-9]{1})|(16[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/
      if (!isMobile.test(value) || value.length !== 11) {
        callback('请输入正确的手机号')
      } else {
        callback()
      }
    }
  }
  checkTel = (rulr, value, callback) => {
    if (!value) {
      callback()
    } else {
      const isPhone = /^(?:(?:0\d{2,4})-)?(?:\d{7,8})(-(?:\d{3,}))?$/
      if (!isPhone.test(value)) {
        callback('请输入正确的电话号码')
      } else {
        callback()
      }
    }
  }
  checkBlank1 = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (value.indexOf(' ') !== -1) {
        callback('仓库名称不能输入空格')
      } else {
        callback()
    }
  }
  checkBlankP = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (value.indexOf(' ') !== -1) {
        callback('联系人不能输入空格')
      } else {
        callback()
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const {
      warehouseNo,
      warehouseName,
      shopName,
      province,
      city,
      county,
      address,
      contacts,
      mobileNo,
      telNo,
      remark,
    } = this.props.vipWarehouse.chooseData ? this.props.vipWarehouse.chooseData : ''
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 12 },
      },
    }
    return (
      <Modal
        maskClosable={false}
        title="设置收货地址"
        visible={this.props.itemModalVisiable}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        // bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
        width={700}
        key="997"
      >
        <Form
          key="996"
          style={{ marginTop: 8 }}
        >
          <FormItem
            {...formItemLayout}
            label="仓库编号"
          >
            {getFieldDecorator('warehouseNo', {
              initialValue: warehouseNo,
          })(
            <Input size={config.InputSize} readOnly={true} />
          )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="仓库名称"
          >
            {getFieldDecorator('warehouseName', {
              initialValue: warehouseName,
              rules: [{
                validator: this.checkBlank1,
              }],
          })(
            <Input size={config.InputSize} />
          )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="店铺名称"
          >
            {getFieldDecorator('shopName', {
              initialValue: shopName,
          })(
            <Input size={config.InputSize} readOnly={true} />
          )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="收货地址"
          >
            {getFieldDecorator('province', {
              initialValue: province ? (city ? (county ? [province, city, county] : [province, city]) : [province]) : [],
          })(
            <AddressCas doClean={this.state.addrClean} addrSelect={this.addrSelect} wh={this.state.warehouse} />
          )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="详细地址"
          >
            {getFieldDecorator('address', {
              initialValue: address,
          })(
            <Input size={config.InputSize} />
          )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="联系人"
          >
            {getFieldDecorator('contacts', {
              initialValue: contacts,
              rules: [{
                validator: this.checkBlankP,
              }],
          })(
            <Input size={config.InputSize} />
          )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="手机"
          >
            {getFieldDecorator('mobileNo', {
              initialValue: mobileNo,
              rules: [{
                validator: this.checkMobile,
              }],
          })(
            <Input size={config.InputSize} />
          )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="联系电话"
          >
            {getFieldDecorator('telNo', {
              initialValue: telNo,
              rules: [{
                validator: this.checkTel,
              }],
          })(
            <Input size={config.InputSize} />
          )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="备注"
          >
            {getFieldDecorator('remark', {
              initialValue: remark,
          })(
            <TextArea rows={4} onChange={this.changeProductNoVal} />
          )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
