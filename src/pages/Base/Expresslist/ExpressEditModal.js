/*
 * @Author: chenjie
 * @Date: 2017-12-27 09:42:44
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-04-26 14:47:55
 * 物流快递编辑
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Select, Form, Input, Switch, Divider, InputNumber, Card, Radio, Row, Col } from 'antd'
import config from '../../../utils/config'
import { moneyCheck, checkEmpty } from '../../../utils/utils'
import { updateExpress } from '../../../services/base/express'
import { getAllProvinceEnum } from '../../../services/base/warehouse'
import { getAllShop } from '../../../services/utils'

const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group
@connect(state => ({
    diclist: state.diclist,
}))
@Form.create()
export default class ExpressEditModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      provinces: [],
      shops: [],
      checkSwitch: true,
    }
  }
  componentWillMount() {
  }
  componentDidMount() {
    getAllShop({
      enableStatus: 1,
    }).then((json) => {
      this.setState({
        shops: json,
      })
    })
    getAllProvinceEnum().then((json) => {
      this.setState({
        provinces: json,
      })
    })
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.exConfig.autoNo !== nextProps.exConfig.autoNo) {
      this.setState({
        checkSwitch: nextProps.exConfig.enableStatus,
      })
    }
  }
  onSwitch = (checked) => {
    this.setState({
      checkSwitch: checked,
    })
  }
  handleOk = () => {
    this.handleSubmit()
  }
  handleCancel = () => {
    this.props.form.resetFields()
    this.props.eidtModalHidden()
  }
  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { autoNo } = this.props.exConfig
        Object.assign(values, {
          enableStatus: this.state.checkSwitch ? 1 : 0,
        })
        if (values.limitShop && values.limitShop.length) {
          Object.assign(values, { limitShop: values.limitShop.join(',') })
        } else {
          Object.assign(values, { limitShop: '' })
        }
        if (values.priorityProvince && values.priorityProvince.length) {
          Object.assign(values, { priorityProvince: values.priorityProvince.join(',') })
        } else {
          Object.assign(values, { priorityProvince: '' })
        }
        if (!values.upperLimit) {
          Object.assign(values, { upperLimit: 0 })
        }
        if (!values.lowerLimit) {
          Object.assign(values, { lowerLimit: 0 })
        }
        updateExpress(Object.assign(values, { autoNo })).then((json) => {
          if (json) {
            this.props.dispatch({
              type: 'expresslist/search',
            })
            this.handleCancel()
          }
        })
      }
    })
  }

  minMoneyCheck = (rule, value, callback) => {
    const { getFieldValue, resetFields, setFieldsValue } = this.props.form
    const upperLimit = getFieldValue('upperLimit')
    if (moneyCheck(value)) {
      if (parseFloat(upperLimit) < parseFloat(value)) {
        callback('勿大于最大金额')
      } else {
        resetFields('upperLimit')
        setFieldsValue({ upperLimit })
        callback()
      }
    } else {
      if (checkEmpty(value)) {
        callback()
      } else {
        callback('格式错误')
      }
    }
  }
  maxMoneyCheck = (rule, value, callback) => {
    const { getFieldValue, resetFields, setFieldsValue } = this.props.form
    const lowerLimit = getFieldValue('lowerLimit')
    if (moneyCheck(value)) {
      if (parseFloat(lowerLimit) > parseFloat(value)) {
        callback('勿小于最小金额')
      } else {
        resetFields('lowerLimit')
        setFieldsValue({ lowerLimit })
        callback()
      }
    } else {
      if (checkEmpty(value)) {
        callback()
      } else {
        callback('格式错误')
      }
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { exConfig } = this.props
    const {
      expressCorpName,
      carriagePriority,
      priorityLevel,
      lowerLimit,
      upperLimit,
      limitShop,
      priorityProvince } = exConfig
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 8 },
      },
    }
    return (
      <div>
        <Modal
          title="快递公司设置"
          maskClosable={false}
          visible={this.props.visiable}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={600}
          bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
        >
          <Form
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="仓库名称"
            >
              {getFieldDecorator('warehouseName', {
                initialValue: this.props.warehouseName,
                rules: [{
                }],
            })(
              <Input size={config.InputSize} readOnly />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="快递公司"
            >
              {getFieldDecorator('expressCorpName', {
                initialValue: expressCorpName,
                rules: [{
                  required: true, message: '请输入快递名称',
                }],
            })(
              <Input size={config.InputSize} readOnly />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="启用/禁用"
            >
              {getFieldDecorator('enableStatus')(
                <Switch size={config.InputSize} checked={this.state.checkSwitch} onChange={this.onSwitch} />
              )}
            </FormItem>
            <Divider>以下为系统自动匹配计算订单所采用的快递公司的规则与策略</Divider>
            <Card hoverable>
              <FormItem
                {...formItemLayout}
                label="优先级"
              >
                {getFieldDecorator('priorityLevel', {
                  initialValue: priorityLevel,
                  rules: [{
                    required: true,
                    message: '请输入优先级',
                  }],
              })(
                <InputNumber size={config.InputSize} min={1} max={100000} />
              )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="运费优先"
              >
                {getFieldDecorator('carriagePriority', {
                  initialValue: carriagePriority ? carriagePriority : 0,
                })(
                  <RadioGroup>
                    <Radio value={0}>不计算运费,该快递不考虑运费优先</Radio>
                    <Radio value={1}>计算运费,低价优先</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Card>
            <Row style={{ marginTop: 10 }}>
              <Col span={8}>
                <FormItem
                  labelCol={{
                    xs: { span: 24 },
                    sm: { span: 12 },
                  }}
                  wrapperCol={{
                    xs: { span: 24 },
                    sm: { span: 12 },
                    md: { span: 12 },
                  }}
                  label="订单金额范围"
                >
                  {getFieldDecorator('lowerLimit', {
                    initialValue: lowerLimit,
                    validateTrigger: ['onBlur'],
                    rules: [{
                      validator: this.minMoneyCheck.bind(this),
                   }],
                  })(
                    <Input size={config.InputSize} placeholder="金额大于等于" />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  wrapperCol={{
                    xs: { span: 24 },
                    sm: { offset: 1, span: 12 },
                    md: { offset: 1, span: 12 },
                  }}
                >
                  {getFieldDecorator('upperLimit', {
                    initialValue: upperLimit,
                   validateTrigger: ['onBlur'],
                   rules: [{
                      validator: this.maxMoneyCheck.bind(this),
                   }],
                  })(
                    <Input size={config.InputSize} placeholder="金额小于等于" />
                  )}
                </FormItem>
              </Col>
            </Row>
            <FormItem
              {...formItemLayout}
              label="限定店铺"
            >
              {getFieldDecorator('limitShop', {
                initialValue: limitShop ? limitShop.split(',') : undefined,
            })(
              <Select
                mode="multiple"
                style={{ width: '100%', marginTop: '10px', maxHeight: 50, overflowX: 'hidden' }}
                placeholder="请选择店铺"
                size={config.InputSize}
              >
                {this.state.shops.map(ele => <Option key={ele.shopName}>{ele.shopName}</Option>)}
              </Select>
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="优先省份"
            >
              {getFieldDecorator('priorityProvince', {
                initialValue: priorityProvince ? priorityProvince.split(',') : undefined,
            })(
              <Select
                size={config.InputSize}
                mode="multiple"
                style={{ width: '100%', marginTop: '10px', maxHeight: 50, overflowX: 'hidden' }}
                placeholder="请选择省份"
              >
                {this.state.provinces.map(ele => <Option key={ele.regionName}>{ele.regionName}</Option>)}
              </Select>
            )}
            </FormItem>
          </Form>
        </Modal>
      </div>)
  }
}
