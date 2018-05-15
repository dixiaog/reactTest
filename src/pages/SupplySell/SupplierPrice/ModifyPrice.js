/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-03-27 10:57:00
 * 批量调整分销价格
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Input, Col, Tooltip, Icon, Radio, Alert } from 'antd'
import config from '../../../utils/config'
import { batchEdit } from '../../../services/supplySell/supplierPrice'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const text = (
  <span>
    <div style={{ color: 'red', fontSize: 14, lineHeight: '20px' }}>
      如果价格或折扣率为0,则清除对应的价格(以后通过默认折扣率计算)。
    </div>
    <div style={{ color: 'red', fontSize: 14, lineHeight: '20px' }}>
      不设定值的分销商价格不变。
    </div>
  </span>
)
@Form.create()
@connect(state => ({
  supplierPrice: state.supplierPrice,
}))
export default class ModifyPrice extends Component {
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
      title: '单价',
    }
  }
  onChange = (e) => {
    this.props.form.validateFields({ force: true })
    if (e.target.value === 0) {
      this.setState({
        title: '单价',
      }, () => {
        this.props.form.validateFields({ force: true })
      })
    } else {
      this.setState({
        title: '折扣率',
      }, () => {
        this.props.form.validateFields({ force: true })
      })
    }
  }
  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
        if (!err) {
          this.setState({
            confirmLoading: true,
          })
          const data = []
          this.props.supplierPrice.selectedRows.forEach((ele) => {
            data.push(Object.assign({
              tagPrice: ele.tagPrice,
              autoNo: ele.autoNo,
              skuNo: ele.skuNo,
              companyNo: ele.companyNo,
              supplyPrice1: ele.supplyPrice1,
              supplyPrice2: ele.supplyPrice2,
              supplyPrice3: ele.supplyPrice3,
              supplyPrice4: ele.supplyPrice4,
              supplyPrice5: ele.supplyPrice5,
              distributionPrice1: ele.distributionPrice1,
              distributionPrice2: ele.distributionPrice2,
              distributionPrice3: ele.distributionPrice3,
              distributionPrice4: ele.distributionPrice4,
              distributionPrice5: ele.distributionPrice5,
            }))
          })
          Object.assign(values, {
            supplyDiscount1: values.supplyDiscount1 ? values.supplyDiscount1 : undefined,
            supplyDiscount2: values.supplyDiscount2 ? values.supplyDiscount2 : undefined,
            supplyDiscount3: values.supplyDiscount3 ? values.supplyDiscount3 : undefined,
            supplyDiscount4: values.supplyDiscount4 ? values.supplyDiscount4 : undefined,
            supplyDiscount5: values.supplyDiscount5 ? values.supplyDiscount5 : undefined,
            distributionDiscount1: values.distributionDiscount1,
            distributionDiscount2: values.distributionDiscount2,
            distributionDiscount3: values.distributionDiscount3,
            distributionDiscount4: values.distributionDiscount4,
            distributionDiscount5: values.distributionDiscount5,
          })
          console.log('11', data, values)
          batchEdit(Object.assign({ IDList: data, dmPriceDiscount: values })).then((json) => {
            if (json) {
              this.hideModal()
              this.props.dispatch({ type: 'supplierPrice/search' })
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
      title: '单价',
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
      } else if (value.charAt(0) === '.') {
        this.setState({
          [flag]: '小数不能以.开始',
        })
        callback('error')
      } else if (value < -99999) {
        this.setState({
          [flag]: '价格不能小于-99999',
        })
        callback('error')
      } else if (value >= 100000) {
        this.setState({
          [flag]: '价格必须小于100000',
        })
        callback('error')
      } else if (value.charAt([value.length - 1]) === '.') {
        this.setState({
          [flag]: '价格不能以.结尾',
        })
        callback('error')
      } else if (value.indexOf(' ') !== -1) {
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
  checkNumT = (flag, rule, value, callback) => {
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
      } else if (value.charAt(0) === '.') {
        this.setState({
          [flag]: '价格不能以.开始',
        })
        callback('error')
      } else if (value.charAt([value.length - 1]) === '.') {
        this.setState({
          [flag]: '价格不能以.结尾',
        })
        callback('error')
      } else if (value.indexOf(' ') !== -1) {
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
  checkdistributionDiscount = (flag, rule, value, callback) => {
    const bool = value ? (value.toString().indexOf('.') !== -1 ? (value.toString().split('.')[1].length > 3 ? !false : false) : false) : false
    if (value) {
      if (isNaN(value)) {
        this.setState({
          [flag]: '价格请输入数字',
        })
        callback('error')
      } else if (value.charAt(0) === '.') {
        this.setState({
          [flag]: '价格不能以.开始',
        })
        callback('error')
      } else if (value.charAt([value.length - 1]) === '.') {
        this.setState({
          [flag]: '价格不能以.结尾',
        })
        callback('error')
      } else if (value < -99999) {
        this.setState({
          [flag]: '价格不能小于-99999',
        })
        callback('error')
      } else if (value >= 100000) {
        this.setState({
          [flag]: '价格必须小于100000',
        })
        callback('error')
      } else if (value.indexOf(' ') !== -1) {
        this.setState({
          [flag]: '价格不能输入空格',
        })
        callback('error')
      } else if (bool) {
        this.setState({
          [flag]: '价格小数位数不允许超过3位',
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
  checkdistributionDiscountT = (flag, rule, value, callback) => {
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
      } else if (value.charAt(0) === '.') {
        this.setState({
          [flag]: '价格不能以.开始',
        })
        callback('error')
      } else if (value.charAt([value.length - 1]) === '.') {
        this.setState({
          [flag]: '价格不能以.结尾',
        })
        callback('error')
      } else if (value.indexOf(' ') !== -1) {
        this.setState({
          [flag]: '价格不能输入空格',
        })
        callback('error')
      } else if (bool) {
        this.setState({
          [flag]: '价格小数位数不允许超过3位',
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
    const { getFieldDecorator } = this.props.form
    const { show } = this.props
    const formItemLayout = {
        labelCol: { span: 10 },
        wrapperCol: { span: 14 },
    }

    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    }
    return (
      <div>
        <Modal
          title="批量调整分销价格"
          visible={show}
          width={540}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          bodyStyle={{ maxHeight: 500, overflowX: 'hidden', padding: '25px' }}
          maskClosable={false}
          confirmLoading={this.state.confirmLoading}
        >
          <span>
            <Alert message={text} type="warning" />
            <Form
              style={{ marginTop: 8 }}
            >
              <Col span={24}>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('roundingRules', {
                    initialValue: 0,
                  })(
                    <RadioGroup onChange={this.onChange}>
                      <Radio style={radioStyle} value={0}>直接设定分销结算价格</Radio>
                      <Radio style={radioStyle} value={1}>通过折扣率计算分销价格</Radio>
                    </RadioGroup>
                )}
                </FormItem>
              </Col>
              <span>
                <Col span={6} />
                <Col span={9}>
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
              <Col span={14}>
                <FormItem
                  help={this.state.supplyDiscount1}
                  {...formItemLayout}
                  label={`1级分销商 ${this.state.title}`}
                >
                  {getFieldDecorator('supplyDiscount1', {
                    rules: [{
                      validator: this.state.title === '单价' ? this.checkNum.bind(this, 'supplyDiscount1') : this.checkNumT.bind(this, 'supplyDiscount1'),
                    }],
                  })(
                    <Input style={{ width: '120px' }} maxLength="8" size={config.InputSize} />
                )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem
                  help={this.state.distributionDiscount1}
                  {...formItemLayout}
                >
                  {getFieldDecorator('distributionDiscount1', {
                    rules: [{
                      validator: this.state.title === '单价' ? this.checkdistributionDiscount.bind(this, 'distributionDiscount1') : this.checkdistributionDiscountT.bind(this, 'distributionDiscount1'),
                    }],
                  })(
                    <Input maxLength="8" size={config.InputSize} />
                )}
                </FormItem>
              </Col>
              <Col span={14}>
                <FormItem
                  help={this.state.supplyDiscount2}
                  {...formItemLayout}
                  label={`2级分销商 ${this.state.title}`}
                >
                  {getFieldDecorator('supplyDiscount2', {
                    rules: [{
                      validator: this.state.title === '单价' ? this.checkNum.bind(this, 'supplyDiscount2') : this.checkNumT.bind(this, 'supplyDiscount2'),
                    }],
                  })(
                    <Input style={{ width: '120px' }} maxLength="8" size={config.InputSize} />
                )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem
                  help={this.state.distributionDiscount2}
                  {...formItemLayout}
                >
                  {getFieldDecorator('distributionDiscount2', {
                    rules: [{
                      validator: this.state.title === '单价' ? this.checkdistributionDiscount.bind(this, 'distributionDiscount2') : this.checkdistributionDiscountT.bind(this, 'distributionDiscount2'),
                    }],
                  })(
                    <Input maxLength="8" size={config.InputSize} />
                )}
                </FormItem>
              </Col>
              <Col span={14}>
                <FormItem
                  help={this.state.supplyDiscount3}
                  {...formItemLayout}
                  label={`3级分销商 ${this.state.title}`}
                >
                  {getFieldDecorator('supplyDiscount3', {
                    rules: [{
                      validator: this.state.title === '单价' ? this.checkNum.bind(this, 'supplyDiscount3') : this.checkNumT.bind(this, 'supplyDiscount3'),
                    }],
                  })(
                    <Input style={{ width: '120px' }} maxLength="8" size={config.InputSize} />
                )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem
                  help={this.state.distributionDiscount3}
                  {...formItemLayout}
                >
                  {getFieldDecorator('distributionDiscount3', {
                    rules: [{
                      validator: this.state.title === '单价' ? this.checkdistributionDiscount.bind(this, 'distributionDiscount3') : this.checkdistributionDiscountT.bind(this, 'distributionDiscount3'),
                    }],
                  })(
                    <Input maxLength="8" size={config.InputSize} />
                )}
                </FormItem>
              </Col>
              <Col span={14}>
                <FormItem
                  help={this.state.supplyDiscount4}
                  {...formItemLayout}
                  label={`4级分销商 ${this.state.title}`}
                >
                  {getFieldDecorator('supplyDiscount4', {
                    rules: [{
                      validator: this.state.title === '单价' ? this.checkNum.bind(this, 'supplyDiscount4') : this.checkNumT.bind(this, 'supplyDiscount4'),
                    }],
                  })(
                    <Input style={{ width: '120px' }} maxLength="8" size={config.InputSize} />
                )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem
                  help={this.state.distributionDiscount4}
                  {...formItemLayout}
                >
                  {getFieldDecorator('distributionDiscount4', {
                    rules: [{
                      validator: this.state.title === '单价' ? this.checkdistributionDiscount.bind(this, 'distributionDiscount4') : this.checkdistributionDiscountT.bind(this, 'distributionDiscount4'),
                    }],
                  })(
                    <Input maxLength="8" size={config.InputSize} />
                )}
                </FormItem>
              </Col>
              <Col span={14}>
                <FormItem
                  help={this.state.supplyDiscount5}
                  {...formItemLayout}
                  label={`5级分销商 ${this.state.title}`}
                >
                  {getFieldDecorator('supplyDiscount5', {
                    rules: [{
                      validator: this.state.title === '单价' ? this.checkNum.bind(this, 'supplyDiscount5') : this.checkNumT.bind(this, 'supplyDiscount5'),
                    }],
                  })(
                    <Input style={{ width: '120px' }} maxLength="8" size={config.InputSize} />
                )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem
                  help={this.state.distributionDiscount5}
                  {...formItemLayout}
                >
                  {getFieldDecorator('distributionDiscount5', {
                    rules: [{
                      validator: this.state.title === '单价' ? this.checkdistributionDiscount.bind(this, 'distributionDiscount5') : this.checkdistributionDiscountT.bind(this, 'distributionDiscount5'),
                    }],
                  })(
                    <Input maxLength="8" size={config.InputSize} />
                )}
                </FormItem>
              </Col>
            </Form>
          </span>
        </Modal>
      </div>)
  }
}
