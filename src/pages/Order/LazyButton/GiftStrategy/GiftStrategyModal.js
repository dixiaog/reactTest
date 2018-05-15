/*
 * @Author: tanmengjia
 * @Date: 2018-02-13 13:35:02
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-14 19:55:30
 * 添加/编辑新的规则
 */
import React, { Component } from 'react'
import moment from 'moment'
import { connect } from 'dva'
import { Modal, Select, Form, Input, Radio, notification, Col, Row, DatePicker, Checkbox, Icon, Button, InputNumber, Tooltip } from 'antd'
import config from '../../../../utils/config'
import { moneyCheck8 } from '../../../../utils/utils'
import ChooseItem from '../../../../components/ChooseItem/index'
import { saveGiftStrategy, editGiftStrategy } from '../../../../services/order/giftStrategy'

const RadioGroup = Radio.Group
const Option = Select.Option
const FormItem = Form.Item

@connect(state => ({
  giftStrategy: state.giftStrategy,
}))
@Form.create()
export default class GiftStrategyModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      shops: [],
      begin: undefined,
      end: undefined,
      item: [],
      two: false,
      eachOverNum: undefined,
      meetInventoryFlag: false,
      superposeFlag: false,
      giftDisplayFlag: false,
      isFirst: true,
      validIncluded: false,
      maxNum: undefined,
      minNum: undefined,
      maxAmount: undefined,
      minAmount: undefined,
      fromName: '',
      skus: '',
    }
  }
  componentWillMount() {
    if (this.props.editData) {
      this.props.dispatch({
        type: 'giftStrategy/getChooseData',
        payload: {
          strategyNo: this.props.editData.strategyNo,
        },
      })
    }
    this.setState({
      shops: this.props.lists,
    })
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.isFirst && nextProps.giftStrategy.chooseData) {
      this.setState({
        isFirst: false,
        meetInventoryFlag: nextProps.giftStrategy.chooseData.meetInventoryFlag === 1,
        superposeFlag: nextProps.giftStrategy.chooseData.superposeFlag === 1,
        giftDisplayFlag: nextProps.giftStrategy.chooseData.giftDisplayFlag === 1,
        eachOverNum: nextProps.giftStrategy.chooseData.eachOverNum,
        item: nextProps.giftStrategy.chooseData.giftList ? nextProps.giftStrategy.chooseData.giftList.split(',') : [],
        validIncluded: nextProps.giftStrategy.chooseData.validIncluded === 1,
        minNum: nextProps.giftStrategy.chooseData.minNum,
        maxNum: nextProps.giftStrategy.chooseData.maxNum,
        maxAmount: nextProps.giftStrategy.chooseData.maxAmount,
        minAmount: nextProps.giftStrategy.chooseData.minAmount,
        skus: nextProps.giftStrategy.chooseData.includeSku,
        begin: nextProps.giftStrategy.chooseData.beginTime ? moment(nextProps.giftStrategy.chooseData.beginTime).format('YYYY-MM-DD HH:mm:ss') : undefined,
        end: nextProps.giftStrategy.chooseData.endTime ? moment(nextProps.giftStrategy.chooseData.endTime).format('YYYY-MM-DD HH:mm:ss') : undefined,
      })
    }
  }
  onBegin = (e) => {
    this.setState({
      begin: e ? e.format('YYYY-MM-DD HH:mm:ss') : undefined,
    })
  }
  onEnd = (e) => {
    this.setState({
      end: e ? e.format('YYYY-MM-DD HH:mm:ss') : undefined,
    })
  }
  onMinNum = (e) => {
    this.setState({
      minNum: e,
    })
  }
  onMaxNum = (e) => {
    this.setState({
      maxNum: e,
    })
  }
  onMinAmount = (e) => {
    this.setState({
      minAmount: e.target.value,
    })
  }
  onMaxAmount = (e) => {
    this.setState({
      maxAmount: e.target.value,
    })
  }
  setGiftList = () => {
    this.setState({
      two: true,
      // isRadio: true,
      fromName: 'giftStrategy',
    })
  }
  handleOk = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values.specifyShopNo && values.specifyShopNo.length) {
          const specifyShopName = []
          values.specifyShopNo.forEach((ele) => {
            specifyShopName.push(this.state.shops.filter(row => row.shopNo === ele * 1)[0].shopName)
          })
          Object.assign(values, { specifyShopName: specifyShopName.join(','), specifyShopNo: values.specifyShopNo.join(',') })
        } else {
          Object.assign(values, { specifyShopName: '', specifyShopNo: '' })
        }
        Object.assign(values, { meetInventoryFlag: this.state.meetInventoryFlag ? 1 : 0,
                                superposeFlag: this.state.superposeFlag ? 1 : 0,
                                giftDisplayFlag: this.state.giftDisplayFlag ? 1 : 0 })
        Object.assign(values, { eachOverNum: this.state.eachOverNum ? this.state.eachOverNum : ''})
        if (this.state.item && this.state.item.length) {
          Object.assign(values, { giftList: this.state.item.join(',') })
        } else {
          Object.assign(values, { giftList: '' })
        }
        Object.assign(values, { beginTime: moment(values.beginTime).format('YYYY-MM-DD HH:mm:ss'), endTime: moment(values.endTime).format('YYYY-MM-DD HH:mm:ss') })
        Object.assign(values, { validIncluded: this.state.validIncluded ? 1 : 0 })
        if (values.limitOrderType && values.limitOrderType.length) {
          Object.assign(values, { limitOrderType: values.limitOrderType.join(',') })
        } else {
          Object.assign(values, { limitOrderType: '' })
        }
        // item: this.props.editData.giftList ? this.props.editData.giftList.split(',') : undefined,
        if (this.props.giftStrategy.chooseData && this.props.giftStrategy.chooseData.strategyNo) {
          Object.assign(values, { strategyNo: this.props.giftStrategy.chooseData.strategyNo })
          editGiftStrategy(values).then((json) => {
            if (json) {
              this.props.dispatch({ type: 'giftStrategy/search' })
              notification.success({
                message: '操作成功',
              })
              this.props.form.resetFields()
              this.props.itemModalHidden()
            }
          })
        } else {
          saveGiftStrategy(values).then((json) => {
            if (json) {
              this.props.dispatch({ type: 'giftStrategy/search' })
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
  checkBeginTime = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (this.state.end && moment(value).format('YYYY-MM-DD HH:mm:ss') >= moment(this.state.end).format('YYYY-MM-DD HH:mm:ss')) {
      callback('开始日期必须小于结束日期')
    } else {
      const { getFieldValue, resetFields, setFieldsValue } = this.props.form
      const endTime = getFieldValue('endTime')
      resetFields('endTime')
      setFieldsValue({ endTime })
      callback()
    }
  }
  checkEndTime = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (this.state.begin && moment(value).format('YYYY-MM-DD HH:mm:ss') <= moment(this.state.begin).format('YYYY-MM-DD HH:mm:ss')) {
      callback('结束日期必须大于开始日期')
    } else {
      const { getFieldValue, resetFields, setFieldsValue } = this.props.form
      const beginTime = getFieldValue('beginTime')
      resetFields('beginTime')
      setFieldsValue({ beginTime })
      callback()
    }
  }
  checkMaxNum = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (this.state.minNum && value < this.state.minNum) {
      callback('最大数量必须大于等于最小数量')
    } else {
      const { getFieldValue, resetFields, setFieldsValue } = this.props.form
      const minNum = getFieldValue('minNum')
      resetFields('minNum')
      setFieldsValue({ minNum })
      callback()
    }
  }
  checkMinNum = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (this.state.maxNum * 1 && value * 1 > this.state.maxNum * 1) {
      callback('最小数量必须小于等于最大数量')
    } else {
      const { getFieldValue, resetFields, setFieldsValue } = this.props.form
      const maxNum = getFieldValue('maxNum')
      resetFields('maxNum')
      setFieldsValue({ maxNum })
      callback()
    }
  }
  checkMaxAmount = (rule, value, callback) => {
    if (!value || value * 1 === 0) {
      callback()
    } else if (!moneyCheck8(value)) {
      callback('错误的金额格式')
    } else if (this.state.minAmount * 1 > 0 && value * 1 < this.state.minAmount * 1) {
      callback('最大金额必须大于等于最小金额')
    } else {
      const { getFieldValue, resetFields, setFieldsValue } = this.props.form
      const minAmount = getFieldValue('minAmount')
      resetFields('minAmount')
      setFieldsValue({ minAmount })
      callback()
    }
  }
  checkMinAmount = (rule, value, callback) => {
    if (!value || value * 1 === 0) {
      callback()
    } else if (!moneyCheck8(value)) {
      callback('错误的金额格式')
    } else if (this.state.maxAmount > 0 && value > this.state.maxAmount) {
      callback('最小金额必须小于等于最大金额')
    } else {
      const { getFieldValue, resetFields, setFieldsValue } = this.props.form
      const maxAmount = getFieldValue('maxAmount')
      resetFields('maxAmount')
      setFieldsValue({ maxAmount })
      callback()
    }
  }
  checkEachOverAmount = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (!moneyCheck8(value)) {
      callback('错误的金额格式')
    } else {
      callback()
    }
  }
  chooseModalHidden = () => {
    this.setState({
      two: false,
      // isRadio: false,
      fromName: '',
    })
  }
  eachOverNum = (e) => {
    this.setState({
      eachOverNum: e,
    })
  }
  // eachOverAmount = (e) => {
  //   this.setState({
  //     eachOverAmount: e.target.value,
  //   })
  // }
  meetInventoryFlag = (e) => {
    this.setState({
      meetInventoryFlag: e.target.checked,
    })
  }
  superposeFlag = (e) => {
    this.setState({
      superposeFlag: e.target.checked,
    })
  }
  giftDisplayFlag = (e) => {
    this.setState({
      giftDisplayFlag: e.target.checked,
    })
  }
  deleteItem = (e) => {
    this.setState({
      item: this.state.item.filter(row => row !== e),
    })
  }
  validIncluded = (e) => {
    this.setState({
      validIncluded: e.target.checked,
    })
  }
  choose = (value, callback) => {
    callback()
    const aa = []
    value.forEach((ele) => {
      aa.push(ele.skuNo)
    })
    this.setState({
        item: this.state.item.concat(aa),
      },() => {
        const value3 = []
        this.state.item.forEach((ele) => {
          if (ele) {
            let isOn = true
            if (value3.filter(e => e === ele).length) {
              isOn = false
            }
            if (isOn) {
              value3.push(ele)
            } else {
              isOn = true
            }
          }
        })
        this.setState({
          item: value3,
        })
      }
    )
  }
  changeSkus = (e) => {
    this.setState({
      skus: e.target.value,
    })
  }
  choose1 = (value, callback) => {
    callback()
    const aa = []
    value.forEach((ele) => {
      aa.push(ele.skuNo)
    })
    const skus = aa.join(',')
    if (this.state.skus) {
      this.setState(
        {
          skus: this.state.skus.concat(',').concat(skus),
        },
        () => {
          const value3 = []
          this.state.skus.split(',').forEach((ele) => {
            if (ele) {
              let isOn = true
              if (value3.filter(e => e === ele).length) {
                isOn = false
              }
              if (isOn) {
                value3.push(ele)
              } else {
                isOn = true
              }
            }
          })
          this.setState(
            {
              skus: value3.join(','),
            },
            () => {
              const { setFieldsValue } = this.props.form
              setFieldsValue({ includeSku: this.state.skus })
            }
          )
        }
      )
    } else {
      this.setState(
        {
          skus,
        },
        () => {
          const value3 = []
          this.state.skus.split(',').forEach((ele) => {
            if (ele) {
              let isOn = true
              if (value3.filter(e => e === ele).length) {
                isOn = false
              }
              if (isOn) {
                value3.push(ele)
              } else {
                isOn = true
              }
            }
          })
          this.setState(
            {
              skus: value3.join(','),
            },
            () => {
              const { setFieldsValue } = this.props.form
              setFieldsValue({ includeSku: this.state.skus })
            }
          )
        }
      )
    }
  }
  chooseItem = () => {
    this.setState({
      two: true,
      fromName: 'giftStrategy1',
    })
  }
  handleCancel = () => {
    this.props.form.resetFields()
    this.props.itemModalHidden()
  }
  checkBlank = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (value.indexOf(' ') !== -1) {
        callback('规则名称不能输入空格')
      } else {
        callback()
    }
  }
  checkBlank1 = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (value.indexOf(' ') !== -1) {
        callback('商品编码不能输入空格')
      } else {
        callback()
    }
  }
  checkBlank2 = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (value.indexOf(' ') !== -1) {
        callback('款式编码不能输入空格')
      } else {
        callback()
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const {
      strategyName,
      priorityLevel,
      beginTime,
      endTime,
      includeProduct,
      includeSku,
      maxAmount,
      minAmount,
      amountType,
      maxNum,
      minNum,
      specifyShopNo,
      limitOrderType,
      cumulativeMaxNum,
      eachOverAmount,
    } = this.props.giftStrategy.chooseData ? this.props.giftStrategy.chooseData : ''
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
        md: { span: 18 },
      },
    }
    const formItemLayout1 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 1 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 },
      },
    }
    const formItemLayout2 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 11 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 12 },
      },
    }
    const formItemLayout3 = {
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
    const formItemLayout4 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 12 },
      },
    }
    const text = <a onClick={this.chooseItem}>......</a>
    return (
      <Modal
        key="811"
        maskClosable={false}
        title="赠品规则设置"
        visible={this.props.giftStrategyVisiable}
        onCancel={this.handleCancel}
        bodyStyle={{ padding: 0 }}
        width="1000px"
        footer={[
          <Button key="789" type="primary" onClick={this.handleOk}>
            保存
          </Button>,
        ]}
      >
        <Form style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label="规则名称">
            {getFieldDecorator('strategyName', {
              initialValue: strategyName,
              rules: [
                {
                  required: true,
                  message: '规则名称',
                },
                {
                  validator: this.checkBlank,
                },
              ],
            })(<Input size={config.InputSize} maxLength="50" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="优先级">
            {getFieldDecorator('priorityLevel', {
              initialValue: priorityLevel,
              rules: [
                {
                  required: true,
                  message: '请输入优先级',
                },
              ],
            })(<InputNumber size={config.InputSize} min={0} max={127} />)}
          </FormItem>
          <Row>
            <Col span={8}>
              <FormItem {...formItemLayout4} label="开始时间">
                {getFieldDecorator('beginTime', {
                  initialValue: beginTime && moment(beginTime).format('YYYY-MM-DD HH:mm:ss') !== '1899-11-30 00:00:00' ?
                                  moment(moment(beginTime).format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss') : undefined,
                  rules: [
                    {
                      required: true,
                      message: '请选择开始时间',
                    },
                    {
                      validator: this.checkBeginTime,
                    },
                  ],
                })(
                  <DatePicker size={config.InputSize} onChange={this.onBegin} format="YYYY-MM-DD HH:mm:ss" placeholder="选择时间" showTime />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout3} label="结束时间">
                {getFieldDecorator('endTime', {
                  initialValue: endTime && moment(endTime).format('YYYY-MM-DD HH:mm:ss') !== '1899-11-30 00:00:00' ?
                                  moment(moment(endTime).format('YYYY-MM-DD HH:mm:ss'), 'YYYY-MM-DD HH:mm:ss') : undefined,
                  rules: [
                    {
                      required: true,
                      message: '请选择结束时间',
                    },
                    {
                      validator: this.checkEndTime,
                    },
                  ],
                })(
                  <DatePicker size={config.InputSize} onChange={this.onEnd} format="YYYY-MM-DD HH:mm:ss" placeholder="选择时间" showTime />
                )}
              </FormItem>
            </Col>
          </Row>
          <FormItem {...formItemLayout} label="指定商品编码">
            {getFieldDecorator('includeSku', {
              initialValue: includeSku,
              rules: [{
                  validator: this.checkBlank1,
                }],
            })(<Input size={config.InputSize} addonAfter={text} onChange={this.changeSkus} placeholder="多个商品编码以(,)分隔" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="指定款式编码">
            {getFieldDecorator('includeProduct', {
              initialValue: includeProduct,
              rules: [{
                validator: this.checkBlank2,
              }],
            })(<Input size={config.InputSize} />)}
          </FormItem>
          <Row>
            <Col span={8}>
              <FormItem {...formItemLayout4} label="最小金额">
                {getFieldDecorator('minAmount', {
                  initialValue: minAmount,
                  rules: [
                    {
                      validator: this.checkMinAmount,
                    },
                  ],
                })(<Input size={config.InputSize} onChange={this.onMinAmount} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem {...formItemLayout3} label="最大金额">
                {getFieldDecorator('maxAmount', {
                  initialValue: maxAmount,
                  rules: [
                    {
                      validator: this.checkMaxAmount,
                    },
                  ],
                })(<Input size={config.InputSize} onChange={this.onMaxAmount} />)}
              </FormItem>
            </Col>
            <Col span={8} style={{ height: '43px' }}>
              <FormItem {...formItemLayout1} label="">
                {getFieldDecorator('amountType', {
                  initialValue: amountType > -1 ? amountType * 1 : 0,
                })(
                  <RadioGroup>
                    <Radio value={0}>
                      <Tooltip title="如果勾选了【金额，数量设定计算是否只针对指定包含的商品有效】，该设定无效，强制为订单商品成交额">
                        <a style={{ color: 'red' }}>？</a>金额为订单应付金额
                      </Tooltip>
                    </Radio>
                    <Radio value={1}>
                      <Tooltip title="不计算运费及订单优惠金额，排除已退款取消的商品">
                        <a style={{ color: 'red' }}>？</a>金额为订单商品成交
                      </Tooltip>
                    </Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem {...formItemLayout4} label="最小数量">
                {getFieldDecorator('minNum', {
                  initialValue: minNum,
                  rules: [
                    {
                      validator: this.checkMinNum,
                    },
                  ],
                })(<InputNumber min={0} max={99999999999} size={config.InputSize} onChange={this.onMinNum} />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem {...formItemLayout3} label="最大数量">
                {getFieldDecorator('maxNum', {
                  initialValue: maxNum,
                  rules: [
                    {
                      validator: this.checkMaxNum,
                    },
                  ],
                })(<InputNumber min={0} max={99999999999} size={config.InputSize} onChange={this.onMaxNum} />)}
              </FormItem>
            </Col>
          </Row>
          <FormItem {...formItemLayout} label="处理规则">
            {getFieldDecorator('validIncluded')(
              <Checkbox checked={this.state.validIncluded} onChange={this.validIncluded}>
                <Tooltip
                  title="勾选=金额，数量的计算只计算指定商品范围中的商品，其中只计算指定商品的成交金额，不包括运费以及优惠券等抵扣金额等。没有指定商品或不勾选=全订单任意非赠品商品，金额为订单应付金额。"
                >
                  <span style={{ color: 'red' }}>？</span>金额，数量设定计算是否只针对指定包含的商品有效
                </Tooltip>
              </Checkbox>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="指定店铺">
            {getFieldDecorator('specifyShopNo', {
              initialValue: specifyShopNo ? specifyShopNo.split(',') : undefined,
            })(
              <Select size={config.InputSize} placeholder="店铺，不设定则全部有效" mode="multiple">
                {this.props.lists && this.props.lists.length
                  ? this.props.lists.map((ele, index) => {
                      return (
                        <Option key={index} value={String(ele.shopNo)}>
                          {ele.shopName}
                        </Option>
                      )
                    })
                  : ''}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="限定订单类型">
            <Col span={14}>
              {getFieldDecorator('limitOrderType', {
                initialValue: limitOrderType ? limitOrderType.split(',') : undefined,
              })(
                <Select size={config.InputSize} placeholder="订单类型，不设定则全部非供销+订单有效" mode="multiple">
                  <Option key={0} value='普通订单'>普通订单</Option>
                  <Option key={2} value='补发订单'>补发订单</Option>
                  <Option key={1} value='换货订单'>换货订单</Option>
                  <Option key={3} value='分销订单'>分销订单</Option>
                  <Option key={4} value='门店补货'>门店补货</Option>
                  <Option key={5} value='门店铺货'>门店铺货</Option>
                </Select>
              )}
            </Col>
            <Col span={10}>
              <div style={{ color: 'green', marginLeft: 15 }}>补发换货供销+订单送赠品，须强制指定订单类型</div>
            </Col>
          </FormItem>
          <FormItem {...formItemLayout} label="赠送商品">
            {getFieldDecorator('giftList', {
            })(
              <div>
                <Col span={24}>
                  <Button size={config.InputSize} type="primary" onClick={this.setGiftList}>
                    添加一组赠品
                  </Button>
                  <span style={{ color: 'green', marginLeft: 20 }}>每组赠品中随机一个赠送(库存多的几率高)，有多少组，会送多少个</span>
                </Col>
                {this.state.item && this.state.item.length
                  ? this.state.item.map((ele, i) => {
                      return (
                        <Col span={7} style={{ marginRight: '20px' }} key={i}>
                          <Input
                            value={ele}
                            readOnly="true"
                            addonAfter={
                              <a onClick={this.deleteItem.bind(this, ele)}>
                                <Icon type="delete" />
                              </a>
                            }
                          />
                        </Col>
                      )
                    })
                  :
                    null}
                <br />
                <Col span={24}>
                  <Checkbox checked={this.state.meetInventoryFlag} onChange={this.meetInventoryFlag}>
                    赠品必须有库存才送，没库存不送，不勾选则不管有无库存均送，如果赠品为组合商品，请不要勾选
                  </Checkbox>
                </Col>
              </div>
            )}
          </FormItem>
          <Col span={4}>
            <div />
          </Col>
          <Col span={20}>
            <Checkbox checked={this.state.superposeFlag} onChange={this.superposeFlag}>
              叠加赠送，该规则允许与其他赠送规则在同一订单中生效，不勾选有其他赠送则该规则失效
            </Checkbox>
          </Col>
          <Row>
            <Col span={5}>
              <div />
            </Col>
            <Col span={6}>
              <span style={{ color: '#262626' }}>每多少数量送一组:</span>
              <InputNumber size={config.InputSize}
                style={{ marginLeft: '5px',
                marginRight: '10px', marginTop: '7px' }}
                onChange={this.eachOverNum}
                value={this.state.eachOverNum}
                min={0}
                max={99}
              />
            </Col>
            <Col span={6}>
              <FormItem {...formItemLayout2} label="每多少金额送一组">
                {getFieldDecorator('eachOverAmount', {
                  initialValue: eachOverAmount,
                  rules: [
                    {
                      validator: this.checkEachOverAmount,
                    },
                  ],
                })(
                  <Input size={config.InputSize} style={{ width: '100px', marginLeft: '5px' }} />
                )}
              </FormItem>
            </Col>
            <Col span={7} style={{ marginTop: '10px' }}>
              <span style={{ color: 'green' }}>没设定,只会送一组,否则会多买多送</span>
            </Col>
          </Row>
          <Col span={4} style={{ marginBottom: '10px' }}>
            <div />
          </Col>
          <Col span={20} style={{ marginBottom: '10px' }}>
            <Checkbox checked={this.state.giftDisplayFlag} onChange={this.giftDisplayFlag}>
              在订单商品明细中标记为赠品(否则显示为单价为0的普通商品)
            </Checkbox>
          </Col>
          <FormItem {...formItemLayout} label="累计最大赠送数">
            {getFieldDecorator('cumulativeMaxNum', {
              initialValue: cumulativeMaxNum,
            })(<InputNumber min={0} size={config.InputSize} max={99999999999} />)}
          </FormItem>
        </Form>
        {this.state.two ? (
          <ChooseItem
            changeModalVisiable={this.state.two}
            fromName={this.state.fromName}
            itemModalHidden={this.chooseModalHidden}
            choose={this.state.fromName === 'giftStrategy' ? this.choose : this.choose1}
            chooseDataKeys={this.state.fromName === 'giftStrategy' ? (this.state.item && this.state.item.length ? this.state.item : null) : (this.state.skus ? this.state.skus.split(',') : null)}
          />
        ) : null}
      </Modal>
    )
  }
}
