/*
 * @Author: chenjie
 * @Date: 2017-12-27 09:42:44
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-04-28 13:46:30
 * 运费模版多重量范围
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Form, Input, Button, Tooltip, Icon, Row, Col } from 'antd'
import config from '../../../utils/config'
import { floatCheck } from '../../../utils/utils'
import styles from '../Base.less'

const FormItem = Form.Item
@connect(state => ({
    diclist: state.diclist,
}))
@Form.create()
export default class ExpressEditFreightRuleForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      weightRange: [],
    }
  }
  componentWillMount() {
    this.setState({
      weightRange: this.props.weightRange,
    })
  }
  componentDidMount() {
    console.log('this did', this.props.weightRange)
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      weightRange: nextProps.weightRange,
    })
  }
  handleAdd = () => {
    const { weightRange } = this.state
    weightRange.push({
      minWeight: 0,
      maxWeight: 0,
      firstWeight: 0,
      firstExpense: 0,
      additionalWeight: 0,
      additionalExpense: 0,
    })
    this.setState({
      weightRange,
    })
  }
  handleDelete = (k) => {
    const { weightRange } = this.state
    weightRange.splice(k, 1)
    this.setState({ weightRange })
  }
  ruleFormBlur = (rule, value, callback) => {
    const { line } = this.props
    const findex = rule.field.split('[')[1].split(']')[0]
    const field = rule.field.split('[')[0]
    if (floatCheck(value)) {
      const { weightRange } = this.state
      Object.assign(weightRange[findex], { [field]: value })
      this.setState({
        weightRange,
      }, () => { this.props.weightRangeChange(line, this.state) })
      callback()
    } else {
      callback('格式错误')
    }
  }
  minWeightCheck = (rule, value, callback) => {
    const { line } = this.props
    const findex = rule.field.split('[')[1].split(']')[0]
    const field = rule.field.split('[')[0]
    if (floatCheck(value)) {
      const { weightRange } = this.state
      Object.assign(weightRange[findex], { [field]: value })
      this.setState({
        weightRange,
      }, () => { this.props.weightRangeChange(line, this.state) })
      callback()
    } else {
      callback('格式错误')
    }
  }
  maxWeightCheck = (rule, value, callback) => {
    const { getFieldValue } = this.props.form
    const { line } = this.props
    const findex = rule.field.split('[')[1].split(']')[0]
    const field = rule.field.split('[')[0]
    if (floatCheck(value)) {
      if (parseFloat(getFieldValue(rule.field.replace(/maxWeight/, 'minWeight'))) > parseFloat(value)) {
        callback('勿小于最小重量')
      } else {
      const { weightRange } = this.state
      Object.assign(weightRange[findex], { [field]: value })
      this.setState({
        weightRange,
      }, () => { this.props.weightRangeChange(line, this.state) })
        callback()
      }
    } else {
      callback('格式错误')
    }
  }
  formatCheck = (rule, value, callback) => {
    if (!floatCheck(value) || value.length > 10) {
        callback('格式错误')
    }
    callback()
  }
  render() {
    const { weightRange } = this.state
    const { getFieldDecorator } = this.props.form
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    }
     const formItems = weightRange.map((ele, k) => {
       if (k * 1 === 0) {
        return (
          <Row key={`${this.props.line}-${k}`}>
            <Col span={6} offset={2}>
              <FormItem >(默认，不区分重量)</FormItem>
            </Col>
            <Col span={3} offset={1}>
              <FormItem>
                {getFieldDecorator(`firstWeight[${k}]`, {
                  initialValue: weightRange[k].firstWeight,
                  validateTrigger: ['onBlur'],
                  rules: [{
                    required: true,
                    message: '此项不会空',
                  }, {
                    validator: this.ruleFormBlur.bind(this),
              }],
                })(
                  <Input size={config.InputSize} className={styles.moneyFormat} />
                )}
              </FormItem>
            </Col>
            <Col span={3} offset={1}>
              <FormItem>
                {getFieldDecorator(`firstExpense[${k}]`, {
                  initialValue: weightRange[k].firstExpense,
                  validateTrigger: ['onBlur'],
                  rules: [{
                    required: true,
                    message: '此项不会空',
                  }, {
                    validator: this.ruleFormBlur.bind(this),
              }],
                })(
                  <Input size={config.InputSize} className={styles.moneyFormat} />
                )}
              </FormItem>
            </Col>
            <Col span={3} offset={1}>
              <FormItem>
                {getFieldDecorator(`additionalWeight[${k}]`, {
                  initialValue: weightRange[k].additionalWeight,
                  validateTrigger: ['onBlur'],
                  rules: [{
                    required: true,
                    message: '此项不会空',
                  }, {
                    validator: this.ruleFormBlur.bind(this),
              }],
                })(
                  <Input size={config.InputSize} className={styles.moneyFormat} />
                )}
              </FormItem>
            </Col>
            <Col span={3} offset={1}>
              <FormItem>
                {getFieldDecorator(`additionalExpense[${k}]`, {
                  initialValue: weightRange[k].additionalExpense,
                  validateTrigger: ['onBlur'],
                  rules: [{
                    required: true,
                    message: '此项不会空',
                  }, {
                    validator: this.ruleFormBlur.bind(this),
              }],
                })(
                  <Input size={config.InputSize} className={styles.moneyFormat} />
                )}
              </FormItem>
            </Col>
          </Row>
        )
       } else {
        return (
          <Row key={`${this.props.line}-${k}`}>
            <Col span={1}>
              <a style={{ lineHeight: '30px' }} onClick={this.handleDelete.bind(this, k)}>
                <Icon type="minus-circle-o" />
              </a>
            </Col>
            <Col span={3}>
              <FormItem>
                <Tooltip title="最小重量">
                  {getFieldDecorator(`minWeight[${k}]`, {
                    initialValue: weightRange[k].minWeight,
                    validateTrigger: ['onBlur'],
                    rules: [{
                      required: true,
                      message: '此项不会空',
                    }, {
                      validator: this.formatCheck,
                    }, {
                      validator: this.minWeightCheck.bind(this),
                }],
                  })(
                    <Input size={config.InputSize} className={styles.moneyFormat} />
                  )}
                </Tooltip>
              </FormItem>
            </Col>
            <Col span={3} offset={1}>
              <FormItem>
                <Tooltip title="最大重量">
                  {getFieldDecorator(`maxWeight[${k}]`, {
                    initialValue: weightRange[k].maxWeight,
                    validateTrigger: ['onBlur'],
                    rules: [{
                      required: true,
                      message: '此项不会空',
                    }, {
                      validator: this.formatCheck,
                    }, {
                      validator: this.maxWeightCheck.bind(this),
                }],
                  })(
                    <Input size={config.InputSize} className={styles.moneyFormat} />
                  )}
                </Tooltip>
              </FormItem>
            </Col>
            <Col span={3} offset={1}>
              <FormItem>
                {getFieldDecorator(`firstWeight[${k}]`, {
                  initialValue: weightRange[k].firstWeight,
                  validateTrigger: ['onBlur'],
                  rules: [{
                    required: true,
                    message: '此项不会空',
                  }, {
                    validator: this.formatCheck,
                  }, {
                    validator: this.ruleFormBlur.bind(this),
              }],
                })(
                  <Input size={config.InputSize} className={styles.moneyFormat} />
                )}
              </FormItem>
            </Col>
            <Col span={3} offset={1}>
              <FormItem>
                {getFieldDecorator(`firstExpense[${k}]`, {
                  initialValue: weightRange[k].firstExpense,
                  validateTrigger: ['onBlur'],
                  rules: [{
                    required: true,
                    message: '此项不会空',
                  }, {
                    validator: this.formatCheck,
                  }, {
                    validator: this.ruleFormBlur.bind(this),
              }],
                })(
                  <Input size={config.InputSize} className={styles.moneyFormat} />
                )}
              </FormItem>
            </Col>
            <Col span={3} offset={1}>
              <FormItem>
                {getFieldDecorator(`additionalWeight[${k}]`, {
                  initialValue: weightRange[k].additionalWeight,
                  validateTrigger: ['onBlur'],
                  rules: [{
                    required: true,
                    message: '此项不会空',
                  }, {
                    validator: this.formatCheck,
                  }, {
                    validator: this.ruleFormBlur.bind(this),
              }],
                })(
                  <Input size={config.InputSize} className={styles.moneyFormat} />
                )}
              </FormItem>
            </Col>
            <Col span={3} offset={1}>
              <FormItem>
                {getFieldDecorator(`additionalExpense[${k}]`, {
                  initialValue: weightRange[k].additionalExpense,
                  validateTrigger: ['onBlur'],
                  rules: [{
                    required: true,
                    message: '此项不会空',
                  }, {
                    validator: this.formatCheck,
                  }, {
                    validator: this.ruleFormBlur.bind(this),
              }],
                })(
                  <Input size={config.InputSize} className={styles.moneyFormat} />
                )}
              </FormItem>
            </Col>
          </Row>
        )
       }
     })
    return (
      <div>
        <Form>
          {formItems}
          <Row>
            <FormItem {...formItemLayoutWithOutLabel}>
              <Button size={config.InputSize} type="dashed" onClick={this.handleAdd} style={{ width: '60%' }}>
                <Icon type="plus" /> 添加重量范围
              </Button>
            </FormItem>
          </Row>
        </Form>
      </div>
    )
  }
}
