/*
 * @Author: chenjie
 * @Date: 2017-12-27 09:42:20
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-04-28 13:53:46
 * 运费模版设置
 */
import React, { Component } from 'react'
import { Modal, Form, Input, Tooltip, Card, Radio, Row, Col, Alert, message } from 'antd'
import config from '../../../utils/config'
import ExpressEditFreightRule from './ExpressEditFreightRule'
import { insertFreightOrAreafreight, getInfoByExpressConfigNo } from '../../../services/base/express'
import { floatCheck } from '../../../utils/utils'

const FormItem = Form.Item
const RadioGroup = Radio.Group
@Form.create()
export default class ExpressFreightTempModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      areaSouce: [],
      freightRule: {},
      areafreightrule: [],
    }
  }
  componentWillMount() {
  }
  componentDidMount() {
    const { express, warehouseNo } = this.props
    getInfoByExpressConfigNo({
      warehouseNo,
      expressConfigNo: express.autoNo,
    }).then((json) => {
      // const areafreightrule = []
      // const repeatDto = json.areafreightruleDTO
      // if (repeatDto.length) {
      //   areafreightrule.push(repeatDto[0])
      //   for (let i = 1; i < repeatDto.length; i++) {
      //     let repeat = false
      //     for (let j = 0; j < repeatDto.length; j++) {
      //       if (repeatDto[j].destination === repeatDto[i].destination) {
      //         repeat = true
      //       }
      //       if (!repeat) {
      //         areafreightrule.push(repeatDto[j])
      //       }
      //     }
      //   }
      // }
      if (json.freightruleDTO) {
        this.setState({
          freightRule: json.freightruleDTO,
          areafreightrule: json.areafreightruleDTO,
          areaSouce: json.areafreightruleDTO,
        })
      }
    })
  }
  handleOk = () => {
    this.handleSubmit()
  }
  handleCancel = () => {
    this.props.form.resetFields()
    this.props.hidden()
  }
  handleSubmit = () => {
    const { areaSouce } = this.state
    let desFlag = false
    areaSouce.length && areaSouce.forEach(val => {
      if (val.destination === '') {
        desFlag = true
      }
    })
    if (desFlag) {
      message.error('存在未指定区域的运费，请先指定区域')
      return false
    }
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { expressCorpNo, expressCorpName, autoNo } = this.props.express
        const freightruleDTO = Object.assign(values, {
          ruleNo: this.state.freightRule.ruleNo,
          warehouseNo: this.props.warehouseNo,
          warehouseName: this.props.warehouseName,
          expressConfigNo: autoNo,
          expressCorpNo,
          expressCorpName,
        })
        insertFreightOrAreafreight({ freightruleDTO, areafreightruleDTO: areaSouce }).then((json) => {
          if (json) {
            this.props.hidden()
          }
        })
      }
    })
  }
  areaChange = (areaSouce) => {
    this.setState({ areaSouce })
  }
  formatCheck = (rule, value, callback) => {
    if (!floatCheck(value) || value.length > 10) {
        callback('格式错误')
    }
    callback()
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const {
      firstWeight,
      firstExpense,
      additionalWeight,
      additionalExpense,
      roundWeight } = this.state.freightRule

    const formItemLayout = {
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
    const formItemNoLabelLayout = {
      labelCol: {
        xs: { span: 0 },
        sm: { span: 0 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 24 },
      },
    }
    const formItemLayout1 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 },
        md: { span: 8 },
      },
    }
    const roundWeightTitle = (
      <div>
        <div>快递公司与商家计算运费可以允许稍微超过的重量。</div><br />
        <div>比如首重1KG，1.1KG的时候也允许按1KG进行计算。</div><br />
        <div>允许稍微超过的重量即舍入重量。</div><br />
        <div>也可以通过输入负数来预设包装重量（称重前计算正确，实际称重后计算运费会计算错误）</div><br />
      </div>
    )
    return (
      <div>
        <Modal
          title="运费模版设置"
          maskClosable={false}
          visible={this.props.visiable}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={1000}
          bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
        >
          <Alert message="除指定地区外,其余地区运费采用默认运费（如需根据不同重量范围，采用不同的规则，请进行详细设定）" type="info" showIcon />
          <Form >
            <Card size={config.InputSize} style={{ marginTop: 5 }}>
              <Row>
                <Col span={4}>
                  <FormItem
                    {...formItemLayout}
                    label="默认重量"
                  >
                    {getFieldDecorator('firstWeight', {
                      initialValue: firstWeight,
                      rules: [{
                        required: true, message: '请输入重量',
                      }, {
                        validator: this.formatCheck,
                      }],
                  })(
                    <Input size={config.InputSize} />
                  )}
                  </FormItem>
                </Col>
                <Col span={2} style={{ textAlign: 'left', lineHeight: '36px' }}>KG内，运费</Col>
                <Col span={2}>
                  <FormItem
                    {...formItemNoLabelLayout}
                  >
                    {getFieldDecorator('firstExpense', {
                      initialValue: firstExpense,
                      rules: [{
                        required: true, message: '价格不能为空',
                      }, {
                        validator: this.formatCheck,
                      }],
                  })(
                    <Input size={config.InputSize} />
                  )}
                  </FormItem>
                </Col>
                <Col span={2} style={{ textAlign: 'left', lineHeight: '36px' }}>元，每增加</Col>
                <Col span={2}>
                  <FormItem
                    {...formItemNoLabelLayout}
                  >
                    {getFieldDecorator('additionalWeight', {
                      initialValue: additionalWeight,
                      rules: [{
                        required: true, message: '请输入重量',
                      }, {
                        validator: this.formatCheck,
                      }],
                  })(
                    <Input size={config.InputSize} />
                  )}
                  </FormItem>
                </Col>
                <Col span={3} style={{ textAlign: 'center', lineHeight: '36px' }}>KG，增加运费</Col>
                <Col span={2}>
                  <FormItem
                    {...formItemNoLabelLayout}
                  >
                    {getFieldDecorator('additionalExpense', {
                      initialValue: additionalExpense,
                      rules: [{
                        required: true, message: '价格不能为空',
                      }, {
                        validator: this.formatCheck,
                      }],
                  })(
                    <Input size={config.InputSize} />
                  )}
                  </FormItem>
                </Col>
                <Col span={1} style={{ textAlign: 'center', lineHeight: '36px' }}>元</Col>
              </Row>
            </Card>
            <Card size={config.InputSize} style={{ marginTop: 5 }}>
              <FormItem
                {...formItemNoLabelLayout}
                label="计算方式"
              >
                {getFieldDecorator('calcMode', {
                  initialValue: '1',
                  rules: [{
                  }],
              })(
                <RadioGroup>
                  <Radio value="1">首重费用+续重费用(重量从首重开始计算)</Radio>
                  <Radio value="2">小于等于首重=首重费用；大于首重=续重费用(重量从0开始计算)</Radio>
                </RadioGroup>
              )}
              </FormItem>
            </Card>
            <Card size={config.InputSize} style={{ marginTop: 5 }}>
              <Tooltip title={roundWeightTitle} >
                <FormItem
                  {...formItemLayout1}
                  label="舍入重量"
                >
                  {getFieldDecorator('roundWeight', {
                    initialValue: roundWeight,
                    rules: [{
                      required: true, message: '舍入重量不能为空',
                    }, {
                      validator: this.formatCheck,
                    }],
                })(
                  <Input />
                )}
                </FormItem>
              </Tooltip>
            </Card>
          </Form>
          <Card style={{ marginTop: 5 }}>
            <ExpressEditFreightRule areaChange={this.areaChange} areafreightrule={this.state.areafreightrule} />
          </Card>
        </Modal>
      </div>)
  }
}
