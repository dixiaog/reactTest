/*
 * @Author: jiangteng
 * @Date: 2017-12-26 17:03:18
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-11 14:04:11
 * 售后查询左侧搜索栏目
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Form, Input, Collapse, Checkbox, Radio, Button, Card, Row, Icon } from 'antd'
import styles from '../AfterSale.less'
import { asStatus, goodStatus, asType, refundStatus } from './BaseData'

const Panel = Collapse.Panel
const RadioGroup = Radio.Group

@connect(state => ({
  afterSearch: state.afterSearch,
}))
@Form.create()
export default class SearchItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      asStatus: -1, // 售后状态
      goodStatus: -1, // 货物状态
      asType: -1, // 售后分类
      refundStatus: [], // 线上状态
    }
  }

  componentDidMount() {
    const { searchParam } = this.props.afterSearch
    this.setState({
      asStatus: searchParam.asStatus === undefined ? -1 : searchParam.asStatus,
      goodStatus: searchParam.goodStatus === undefined ? -1 : searchParam.goodStatus,
      asType: searchParam.asType === undefined ? -1 : searchParam.asType,
      refundStatus: searchParam.refundStatus === undefined ? [] : searchParam.refundStatus,
    })
    this.props.form.setFieldsValue({ ...searchParam })
  }

  // 售后状态
  asStatus = (e) => {
    this.setState({
      asStatus: e.target.value,
    })
  }

  // 货物状态
  goodStatus = (e) => {
    this.setState({
      goodStatus: e.target.value,
    })
  }

  // 售后分类
  asType = (e) => {
    this.setState({
      asType: e.target.value,
    })
  }

   // 线上状态
   refundStatus = (e) => {
    this.setState({
      refundStatus: e,
    })
  }
  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      Object.assign(values, {
        asStatus: this.state.asStatus === -1 ? undefined : this.state.asStatus, // 售后状态
        goodStatus: this.state.goodStatus === -1 ? undefined : this.state.goodStatus, // 货物状态
        asType: this.state.asType === -1 ? undefined : this.state.asType, // 售后分类
        refundStatus: this.state.refundStatus.toString(), // 线上状态
      })
      this.props.dispatch({
        type: 'afterSearch/search',
        payload: { searchParam: values },
      })
    })
  }
  handleReset = () => {
    this.props.form.resetFields()
    this.setState({
      asStatus: -1, // 售后状态
      goodStatus: -1, // 货物状态
      asType: -1, // 售后分类
      refundStatus: [], // 线上状态
    })
    this.props.dispatch({
      type: 'afterSearch/search',
      payload: { searchParam: {} },
    })
  }
  onChangeCollapse = (key) => {
    const { defaultActiveKey } = this.props.afterSearch
    const index = defaultActiveKey.findIndex(ele => ele === key)
    index === -1 ? defaultActiveKey.push(key) : defaultActiveKey.splice(index, 1)
    this.props.dispatch({
      type: 'afterSearch/changeState',
      payload: { defaultActiveKey },
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const one = <div style={{ width: 50 }}>售后单号</div>
    const two = <div style={{ width: 50 }}>快递单号</div>
    const three = <div style={{ width: 50 }}>线上订单号</div>
    const four = <div style={{ width: 50 }}>手机</div>
    const five = <div style={{ width: 50 }}>内部订单号</div>
    const six = <div style={{ width: 50 }}>买家账号</div>
    const { defaultActiveKey } =this.props.afterSearch
    return (
      <Card
        bordered
        hoverable
        style={{ height: document.body.clientHeight - 80 }}
      >
        <div style={{ marginRight: 10, marginBottom: 10 }}>
          <Button type="primary" size="small" onClick={this.handleSubmit}>
            <Icon type="search" />组合查询
          </Button>
          <Button size="small" onClick={this.handleReset} style={{ marginTop: 10, marginLeft: 10 }}>
            <Icon type="delete" />清空
          </Button>
        </div>
        <div style={{ height: document.body.clientHeight - 140, overflowX: 'hidden', paddingTop: 1 }}>
          <Form>
            {getFieldDecorator('asNo')(<Input addonAfter={one} size="small" />)}
            <div style={{ height: '10px' }} />
            {getFieldDecorator('expressNo')(<Input addonAfter={two} size="small" />)}
            <div style={{ height: '10px' }} />
            {getFieldDecorator('refundId')(<Input addonAfter={three} size="small" />)}
            <div style={{ height: '10px' }} />
            {getFieldDecorator('mobileNo')(<Input addonAfter={four} size="small" />)}
            <div style={{ height: '10px' }} />
            {getFieldDecorator('orderNo')(<Input addonAfter={five} size="small" />)}
            <div style={{ height: '10px' }} />
            {getFieldDecorator('siteBuyerNo')(<Input addonAfter={six} size="small" />)}
            <div style={{ height: '10px' }} />
            <Collapse onChange={this.onChangeCollapse.bind(this, '1')} defaultActiveKey={defaultActiveKey} bordered={false} className={styles.customPanelStyle}>
              <Panel header="售后状态" key="1">
                <RadioGroup style={{ width: '100%' }} onChange={this.asStatus} value={this.state.asStatus}>
                  <Row>
                    {asStatus.length ? asStatus.map((ele, index) => <Row key={index}><Radio style={{ marginTop: 3, marginBottom: 3 }} key={index} value={ele.key}>{ele.title}</Radio></Row>) : ''}
                  </Row>
                </RadioGroup>
              </Panel>
            </Collapse>
            <Collapse onChange={this.onChangeCollapse.bind(this, '2')} defaultActiveKey={defaultActiveKey} bordered={false} className={styles.customPanelStyle}>
              <Panel header="货物状态" key="2">
                <RadioGroup style={{ width: '100%' }} onChange={this.goodStatus} value={this.state.goodStatus}>
                  <Row>
                    {goodStatus.length ? goodStatus.map((ele, index) => <Row key={index}><Radio style={{ marginTop: 3, marginBottom: 3 }} key={index} value={ele.key}>{ele.title}</Radio></Row>) : ''}
                  </Row>
                </RadioGroup>
              </Panel>
            </Collapse>
            <Collapse onChange={this.onChangeCollapse.bind(this, '3')} defaultActiveKey={defaultActiveKey} bordered={false} className={styles.customPanelStyle}>
              <Panel header="售后分类" key="3">
                <RadioGroup style={{ width: '100%' }} onChange={this.asType} value={this.state.asType}>
                  <Row>
                    {asType.length ? asType.map((ele, index) => <Row key={index}><Radio style={{ marginTop: 3, marginBottom: 3 }} key={index} value={ele.key}>{ele.title}</Radio></Row>) : ''}
                  </Row>
                </RadioGroup>
              </Panel>
            </Collapse>
            <Collapse onChange={this.onChangeCollapse.bind(this, '4')} defaultActiveKey={defaultActiveKey} bordered={false} className={styles.customPanelStyle}>
              <Panel header="退款状态" key="4">
                <Checkbox.Group style={{ width: '100%' }} onChange={this.refundStatus} value={this.state.refundStatus}>
                  <Row>
                    {refundStatus.length ? refundStatus.map((ele, index) =>
                      <Row key={index}><Checkbox style={{ marginTop: 3, marginBottom: 3 }} key={index} value={ele.key}>{ele.title}</Checkbox></Row>
                      ) : ''}
                  </Row>
                </Checkbox.Group>
              </Panel>
            </Collapse>
          </Form>
        </div>
      </Card>
    )
  }
}
