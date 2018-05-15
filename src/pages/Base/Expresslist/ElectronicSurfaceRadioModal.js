/*
 * @Author: chenjie
 * @Date: 2017-12-26 09:09:21
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-05-05 16:02:52
 * 选择电子面单方式
 */
import React, { Component } from 'react'
import { Input, Row, Col, Radio, Card } from 'antd'
import update from 'immutability-helper'
import { getCnWayBillSubscription } from '../../../services/base/express'

const RadioGroup = Radio.Group
const plainOptions = [
  { label: '使用快递自身电子面单', value: 1 },
  { label: '使用菜鸟电子面单', value: 2 },
  { label: '不使用电子面单', value: 0 },
]
export default class ElectronicSurfaceRadioModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: 0,
      inputDisabled: false,
      param: {
        appNo: '',
        appKey: '',
      },
    }
  }
  componentWillMount() {
    this.setState({
      selected: this.props.electric.expressType,
      param: {
        appNo: this.props.electric.appNo,
        appKey: this.props.electric.appKey,
      },
    })
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      selected: nextProps.electric.expressType,
      param: {
        appNo: nextProps.electric.appNo,
        appKey: nextProps.electric.appKey,
      },
    })
    const { electric } = nextProps
    if (nextProps.electric.expressType === 2) {
      getCnWayBillSubscription({
        cpCorp: electric.expressCorpNo,
        warehouseNo: electric.warehouseNo,
      }).then((json) => {
        if (json.success) {
          this.setState({
            inputDisabled: false,
          })
        } else {
          this.setState({
            inputDisabled: true,
          })
        }
      })
    }
  }
  onChange = (e) => {
    const { electric } = this.props
    this.setState({ selected: e.target.value }, () => {
      this.props.changeElectricSureface({ [electric.expressCorpNo]: this.state })
    })
  }
  inputOnChange = (k, e) => {
    const { electric } = this.props
    this.setState(
      update(this.state, {
        param: {
          $merge: { [k]: e.target.value },
      },
      }), () => {
        this.props.changeElectricSureface({ [electric.expressCorpNo]: this.state })
      }
  )
  }
  renderDom = (selected) => {
    switch (selected) {
      case 1:
      return (
        <Row style={{ marginTop: 10, marginBottom: 10 }}>
          <Col span={8}>
            <Card>
              <Row style={{ marginBottom: 5 }}><Input defaultValue={this.state.param.appNo} placeholder="商家代码" onChange={this.inputOnChange.bind(this, 'appNo')} /></Row>
              <Row style={{ marginBottom: 5 }}><Input defaultValue={this.state.param.appKey} placeholder="商家密钥" onChange={this.inputOnChange.bind(this, 'appKey')} /></Row>
            </Card>
          </Col>
        </Row>
        )
      case 2:
          return (
            <Row style={{ marginTop: 10, marginBottom: 10 }}>
              <Col span={8} offset={8}>
                <Card>
                  <Row style={{ marginBottom: 5 }}>
                    <Input disabled={this.state.inputDisabled} defaultValue={this.state.param.appNo} placeholder="菜鸟代码" onChange={this.inputOnChange.bind(this, 'appNo')} />
                  </Row>
                  <Row style={{ marginBottom: 5 }}>
                    <Input disabled={this.state.inputDisabled} defaultValue={this.state.param.appKey} placeholder="菜鸟密钥" onChange={this.inputOnChange.bind(this, 'appKey')} />
                  </Row>
                </Card>
              </Col>
            </Row>
            )
      case 0:
      return null
      default:
      break
    }
  }
  render() {
    const { electric } = this.props
    return (
      <div style={{ marginBottom: 10 }}>
        <Row><h4>{electric.expressCorpName}</h4></Row>
        <Row><RadioGroup options={plainOptions} value={this.state.selected} onChange={this.onChange} /></Row>
        {this.renderDom(this.state.selected)}
      </div>)
  }
}
