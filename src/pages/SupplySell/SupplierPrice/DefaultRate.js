/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-12 13:32:57
 * 设定默认供销折扣率
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Input, Col, Tooltip, Icon, Radio, Alert, message } from 'antd'
import config from '../../../utils/config'
import { addDefaultRate } from '../../../services/supplySell/supplierPrice'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const text = (
  <span>
    <div style={{ color: 'red', fontSize: 14, lineHeight: '20px' }}>
      折扣请填写小数,比如0.85=8.5折。所有折扣价均参考<span style={{ color: 'blue' }}>商品资料</span>中的
      基本售价。当对应的分销商没有为指定商品专门指定供销价时,则参考折扣率进行计算。
    </div>
    <div style={{ color: 'red', fontSize: 14, lineHeight: '20px' }}>
      分销商分级建议级别越高,折扣率越低。
    </div>
  </span>
)
@Form.create()
@connect(state => ({
  supplierPrice: state.supplierPrice,
}))
export default class DefaultRate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      supplyDiscount1: '',
      supplyDiscount2: '',
      supplyDiscount3: '',
      supplyDiscount4: '',
      supplyDiscount5: '',
      distributionDiscount1: '',
      distributionDiscount2: '',
      distributionDiscount3: '',
      distributionDiscount4: '',
      distributionDiscount5: '',
    }
  }
  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
        if (!err) {
          this.setState({
            confirmLoading: true,
          })
          message.warning('数据量过大,系统正在处理,请耐心等待...', 0)
          addDefaultRate(values).then((json) => {
            if (json) {
              message.destroy()
              this.hideModal()
              this.props.dispatch({
                type: 'supplierPrice/search',
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
    message.destroy()
    const { hideModal } = this.props
    this.setState({
      confirmLoading: false,
      supplyDiscount1: '',
      supplyDiscount2: '',
      supplyDiscount3: '',
      supplyDiscount4: '',
      supplyDiscount5: '',
      distributionDiscount1: '',
      distributionDiscount2: '',
      distributionDiscount3: '',
      distributionDiscount4: '',
      distributionDiscount5: '',
    })
    hideModal()
    this.handleReset()
  }
  // 重置表单
  handleReset = () => {
    this.props.form.resetFields()
  }
  checkNum = (flag, rule, value, callback) => {
    const bool = value ? (value.toString().indexOf('.') !== -1 ? (value.toString().split('.')[1].length > 3 ? !false : false) : false) : false
    if (value) {
      if (isNaN(value)) {
        this.setState({
          [flag]: '价格请输入数字',
        })
        callback('error')
      } else if (value < -1 || value > 2) {
        this.setState({
          [flag]: '价格请输入-1到2的数字',
        })
        callback('error')
      } else if (value.toString().charAt(0) === '.') {
        this.setState({
          [flag]: '价格不能以.开始',
        })
        callback('error')
      } else if (value.toString().charAt([value.length - 1]) === '.') {
        this.setState({
          [flag]: '价格不能以.结尾',
        })
        callback('error')
      } else if (value.toString().indexOf(' ') !== -1) {
        this.setState({
          [flag]: '价格不能输入空格',
        })
        callback('error')
      } else if (bool) {
        this.setState({
          [flag]: '小数位数不允许超过3位',
        })
        callback('error')
      } else {
        this.setState({
          [flag]: '',
        })
        callback()
      }
    } else {
      this.setState({
        [flag]: '请输入供销价格',
      })
      callback('error')
    }
  }
  checkdistributionDiscount = (flag, rule, value, callback) => {
    const bool = value ? (value.toString().indexOf('.') !== -1 ? (value.toString().split('.')[1].length > 3 ? !false : false) : false) : false
    if (value) {
      if (isNaN(value)) {
        this.setState({
          [flag]: '价格请输入数字',
        })
        callback('error')
      } else if (value <= 0 || value >= 1) {
        this.setState({
          [flag]: '请输入大于0小于1的数字',
        })
        callback('error')
      } else if (value.toString().charAt(0) === '.') {
        this.setState({
          [flag]: '小数不能以.开始',
        })
        callback('error')
      } else if (value.toString().charAt([value.length - 1]) === '.') {
        this.setState({
          [flag]: '价格不能以.结尾',
        })
        callback('error')
      } else if (value.toString().indexOf(' ') !== -1) {
        this.setState({
          [flag]: '价格不能输入空格',
        })
        callback('error')
      } else if (bool) {
        this.setState({
          [flag]: '小数位数不允许超过3位',
        })
        callback('error')
      } else {
        this.setState({
          [flag]: '',
        })
        callback()
      }
    } else {
      this.setState({
        [flag]: '',
      })
      callback()
    }
  }
  render() {
    const {
    supplyDiscount1,
    supplyDiscount2,
    supplyDiscount3,
    supplyDiscount4,
    supplyDiscount5,
    distributionDiscount1,
    distributionDiscount2,
    distributionDiscount3,
    distributionDiscount4,
    distributionDiscount5,
    roundingRules } = this.props.supplierPrice.defaultData
    const { getFieldDecorator } = this.props.form
    const { show } = this.props
    const formItemLayout = {
        labelCol: { span: 7 },
        wrapperCol: { span: 14 },
    }
    const formItemLayoutT = {
      labelCol: { span: 24 },
    }
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    }
    return (
      <div>
        <Modal
          title="设定默认供销折扣率"
          visible={show}
          width={540}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          bodyStyle={{ maxHeight: 500, overflowX: 'hidden', padding: '25px' }}
          maskClosable={false}
          confirmLoading={this.state.confirmLoading}
        >
          <span>
            <Alert message={text} type="warning" style={{ marginBottom: '20px' }} />
            <span>
              <Col span={4} />
              <Col span={10}>
                <span>
                  <Tooltip placement="top" title="分销商向供销商支付的价格">
                    <Icon type="exclamation-circle" />
                  </Tooltip>
                </span>
                <span style={{ marginLeft: 5 }}>供销价格</span>
              </Col>
              <Col span={4}>
                <span>
                  <Tooltip placement="top" title="供销商允许分销商销售的最低价格,没有设置则不进行管控">
                    <Icon type="exclamation-circle" />
                  </Tooltip>
                </span>
                <span style={{ marginLeft: 5 }}>管控分销价</span>
              </Col>
            </span>
            <Form
              style={{ marginTop: 8 }}
            >
              <Col span={14}>
                <FormItem
                  help={this.state.supplyDiscount1}
                  {...formItemLayout}
                  label="1级分销商"
                >
                  {getFieldDecorator('supplyDiscount1', {
                    initialValue: supplyDiscount1,
                    rules: [{
                      required: true, message: '请输入供销价格',
                    }, {
                      validator: this.checkNum.bind(this, 'supplyDiscount1'),
                    }],
                  })(
                    <Input suffix={<div style={{ color: 'red' }}>*</div>} maxLength="4" size={config.InputSize} />
                )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem
                  help={this.state.distributionDiscount1}
                  {...formItemLayout}
                >
                  {getFieldDecorator('distributionDiscount1', {
                    initialValue: distributionDiscount1,
                    rules: [{
                      validator: this.checkdistributionDiscount.bind(this, 'distributionDiscount1'),
                    }],
                  })(
                    <Input maxLength="4" size={config.InputSize} />
                )}
                </FormItem>
              </Col>
              <Col span={14}>
                <FormItem
                  help={this.state.supplyDiscount2}
                  {...formItemLayout}
                  label="2级分销商"
                >
                  {getFieldDecorator('supplyDiscount2', {
                    initialValue: supplyDiscount2,
                    rules: [{
                      required: true, message: '请输入供销价格',
                    }, {
                      validator: this.checkNum.bind(this, 'supplyDiscount2'),
                    }],
                  })(
                    <Input suffix={<div style={{ color: 'red' }}>*</div>} maxLength="4" size={config.InputSize} />
                )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem
                  help={this.state.distributionDiscount2}
                  {...formItemLayout}
                >
                  {getFieldDecorator('distributionDiscount2', {
                    initialValue: distributionDiscount2,
                    rules: [{
                      validator: this.checkdistributionDiscount.bind(this, 'distributionDiscount2'),
                    }],
                  })(
                    <Input maxLength="4" size={config.InputSize} />
                )}
                </FormItem>
              </Col>
              <Col span={14}>
                <FormItem
                  help={this.state.supplyDiscount3}
                  {...formItemLayout}
                  label="3级分销商"
                >
                  {getFieldDecorator('supplyDiscount3', {
                    initialValue: supplyDiscount3,
                    rules: [{
                      required: true, message: '请输入供销价格',
                    }, {
                      validator: this.checkNum.bind(this, 'supplyDiscount3'),
                    }],
                  })(
                    <Input suffix={<div style={{ color: 'red' }}>*</div>} maxLength="4" size={config.InputSize} />
                )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem
                  help={this.state.distributionDiscount3}
                  {...formItemLayout}
                >
                  {getFieldDecorator('distributionDiscount3', {
                    initialValue: distributionDiscount3,
                    rules: [{
                      validator: this.checkdistributionDiscount.bind(this, 'distributionDiscount3'),
                    }],
                  })(
                    <Input maxLength="4" size={config.InputSize} />
                )}
                </FormItem>
              </Col>
              <Col span={14}>
                <FormItem
                  help={this.state.supplyDiscount4}
                  {...formItemLayout}
                  label="4级分销商"
                >
                  {getFieldDecorator('supplyDiscount4', {
                    initialValue: supplyDiscount4,
                    rules: [{
                      required: true, message: '请输入供销价格',
                    }, {
                      validator: this.checkNum.bind(this, 'supplyDiscount4'),
                    }],
                  })(
                    <Input suffix={<div style={{ color: 'red' }}>*</div>} maxLength="4" size={config.InputSize} />
                )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem
                  help={this.state.distributionDiscount4}
                  {...formItemLayout}
                >
                  {getFieldDecorator('distributionDiscount4', {
                    initialValue: distributionDiscount4,
                    rules: [{
                      validator: this.checkdistributionDiscount.bind(this, 'distributionDiscount4'),
                    }],
                  })(
                    <Input maxLength="4" size={config.InputSize} />
                )}
                </FormItem>
              </Col>
              <Col span={14}>
                <FormItem
                  help={this.state.supplyDiscount5}
                  {...formItemLayout}
                  label="5级分销商"
                >
                  {getFieldDecorator('supplyDiscount5', {
                    initialValue: supplyDiscount5,
                    rules: [{
                      required: true, message: '请输入供销价格',
                    }, {
                      validator: this.checkNum.bind(this, 'supplyDiscount5'),
                    }],
                  })(
                    <Input suffix={<div style={{ color: 'red' }}>*</div>} maxLength="4" size={config.InputSize} />
                )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem
                  help={this.state.distributionDiscount5}
                  {...formItemLayout}
                >
                  {getFieldDecorator('distributionDiscount5', {
                    initialValue: distributionDiscount5,
                    rules: [{
                      validator: this.checkdistributionDiscount.bind(this, 'distributionDiscount5'),
                    }],
                  })(
                    <Input maxLength="4" size={config.InputSize} />
                )}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem
                  {...formItemLayoutT}
                  label={<div style={{ fontSize: 16 }}>价格修正方案(避免实际价格产生小数位)</div>}
                />
              </Col>
              <Col span={24}>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('roundingRules', {
                    initialValue: roundingRules !== undefined ? roundingRules : 0,
                  })(
                    <RadioGroup>
                      <Radio style={radioStyle} value={0}>保留二位小数</Radio>
                      <Radio style={radioStyle} value={1}>四舍五入取整</Radio>
                      <Radio style={radioStyle} value={2}>向上取整(如¥10.23 -> ¥11)</Radio>
                      <Radio style={radioStyle} value={3}>向下取整(如¥10.54 -> ¥10)</Radio>
                    </RadioGroup>
                )}
                </FormItem>
              </Col>
            </Form>
          </span>
        </Modal>
      </div>)
  }
}
