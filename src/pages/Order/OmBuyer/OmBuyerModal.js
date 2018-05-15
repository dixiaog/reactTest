/*
 * @Author: tanmengjia
 * @Date: 2018-02-05 14:58:10
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-04 15:20:24
 * 添加新的客户信息
 */
import React, { Component } from 'react'
// import { connect } from 'dva'
import { Modal, Select, Form, Input, notification } from 'antd'
import config from '../../../utils/config'
import { moneyCheck5 } from '../../../utils/utils'
import { getAllProvinceEnum, getAllRegionEnum } from '../../../services/base/warehouse'
import { addOmBuyer, editOmBuyer } from '../../../services/order/omBuyer'
import AddressCas from '../../../components/AddressCas'

const FormItem = Form.Item
const Option = Select.Option

@Form.create()
export default class OmBuyerModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
        options: [],
        position: [],
        select: [],
        addrClean: false,
    }
  }
    componentWillMount() {
        getAllProvinceEnum().then((json) => {
            const options = json.map((ele) => {
              return {
                value: ele.regionNo,
                label: ele.regionName,
                isLeaf: false,
              }
            })
            this.setState({
                options,
              })
          })
    }
    onChangeGetProvince = (value, selectedOptions) => {
        this.setState({
          position: value,
          select: selectedOptions.map(ele => ele.label),
        })
      }
    loadData = (selectedOptions) => {
        const { position } = this.state
        const targetOption = selectedOptions[selectedOptions.length - 1]
        targetOption.loading = true
        getAllRegionEnum(targetOption.value).then((json) => {
          targetOption.loading = false
          targetOption.children = json.map((e) => {
            return {
              value: e.regionNo,
              label: e.regionName,
              isLeaf: position.length === 1,
            }
          })
          this.setState({
            options: [...this.state.options],
          })
        })
      }
  handleOk = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const site = this.props.sites
          if (values.siteName) {
            Object.assign(values, { siteShortName: site.filter(ele => ele.siteName === values.siteName)[0].shortName })
          }
          if (this.props.selectData) {
            Object.assign(values, { buyerNo: this.props.selectData.buyerNo })
            editOmBuyer(values).then((json) => {
              if (json) {
                notification.success({
                  message: '操作成功',
                })
                this.props.dispatch({ type: 'omBuyer/search' })
                this.props.form.resetFields()
                this.props.itemModalHidden()
              }
            })
          } else {
            addOmBuyer(values).then((json) => {
              if (json) {
                this.props.dispatch({
                  type: 'omBuyer/search',
                })
                notification.success({
                  message: '操作成功',
                })
                this.props.form.resetFields()
                this.props.itemModalHidden()
              }
            })
          }
        }
    })
  }
  handleCancel = () => {
    this.props.form.resetFields()
    this.props.itemModalHidden()
    this.setState({
      addrClean: true,
      select: [],
    })
  }

  checkPrice = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (!moneyCheck5(value)) {
          callback('金额格式错误或超出长度')
        } else {
          callback()
      }
  }
  addrSelect = (selectedOptions) => {
    const { setFieldsValue } = this.props.form
    // if (selectedOptions[0]) {
      setFieldsValue({
        addressList: selectedOptions,
      })
      this.setState({
        select: selectedOptions,
      })
    // }
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
  checkBlank = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (value.indexOf(' ') !== -1) {
        callback('买家账号不能输入空格')
      } else {
        callback()
    }
  }
  checkBlank1 = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (value.indexOf(' ') !== -1) {
        callback('用户姓名不能输入空格')
      } else {
        callback()
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { siteBuyerNo, siteName, receiver, address, telNo, mobileNo, province, city, county } = this.props.selectData ? this.props.selectData : ''
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
          maskClosable={false}
          title={this.props.add ? '添加新的客户信息' : '编辑客户信息'}
          visible={this.props.buyerModalVisiable}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
        >
          <Form
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="买家账号"
            >
              {getFieldDecorator('siteBuyerNo', {
                initialValue: siteBuyerNo,
                rules: [{
                  required: true, message: '请输入买家账号',
                  },
                  {
                    validator: this.checkBlank,
                  }],
            })(
              <Input size={config.InputSize} maxLength="50" placeholder="请输入买家账号" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="商店站点"
            >
              {getFieldDecorator('siteName', {
                initialValue: siteName,
                rules: [{
                  required: true, message: '请选择商店站点',
                  }],
            })(
              <Select size={config.InputSize} style={{ marginTop: 4 }} placeholder="请选择商店站点" >
                {this.props.sites.length ? this.props.sites.map((ele, index) => { return <Option key={index} value={ele.siteName}>{ele.siteName}</Option> }) : ''}
                {/* { this.props.brands.map(brand => <Option key={brand.brandNo} value={brand.brandNo}>{brand.brandName}</Option>)} */}
              </Select>
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="用户姓名"
            >
              {getFieldDecorator('receiver', {
                initialValue: receiver,
                rules: [
                  {
                    validator: this.checkBlank1,
                  }],
            })(
              <Input size={config.InputSize} maxLength="20" placeholder="请输入用户姓名" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="联系地址"
            >
              {getFieldDecorator('addressList', {
                initialValue: province ? (city ? (county ? [province, city, county] : [province, city]) : [province]) : [],
                // rules: [{
                //   required: true, message: '请选择联系地址',
                //   }],
            })(
              <AddressCas doClean={this.state.addrClean} addrSelect={this.addrSelect} wh={this.props.selectData ? this.props.selectData : {}} />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="详细地址"
            >
              {getFieldDecorator('address', {
                initialValue: address,
            })(
              <Input size={config.InputSize} placeholder="请输入详细地址" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="电话"
            >
              {getFieldDecorator('telNo', {
                initialValue: telNo,
                rules: [{
                  validator: this.checkTel,
                }],
            })(
              <Input size={config.InputSize} placeholder="请输入电话" />
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
              <Input size={config.InputSize} placeholder="请输入手机" />
            )}
            </FormItem>
          </Form>
        </Modal>
      </div>)
  }
}
