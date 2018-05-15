/*
 * @Author: jiangteng
 * @Date: 2018-01-22 09:34:07
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-04-19 09:53:17
 * 库存--选择采购单号搜索
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Form, Input, Button, DatePicker, Col, Select, Row, Icon } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

@connect(state => ({
  billlist: state.billlist,
  storage: state.storage,
}))
@Form.create()
export default class BillListSeaBar extends Component {
  constructor(props) {
      super(props)
      this.state = {
        collapsed: false,
        startValue: null,
        endValue: null,
        endOpen: false,
      }
  }
  onStartChange = (value) => {
    this.onChange('startValue', value)
  }

  onEndChange = (value) => {
    this.onChange('endValue', value)
  }
  onChange = (field, value) => {
    this.setState({
      [field]: value,
    })
  }
  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue
    if (!endValue || !startValue) {
      return false
    }
    return endValue.valueOf() <= startValue.valueOf()
  }

  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue
    if (!startValue || !endValue) {
      return false
    }
    return startValue.valueOf() > endValue.valueOf()
  }


  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true })
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open })
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
      Object.assign(values,
        { billDateFrom: values.createTime ? values.createTime.format('YYYY-MM-DD') : undefined },
        { billDateTo: values.endTime ? values.endTime.format('YYYY-MM-DD') : undefined },
        { billStatus: 1 },
      )
      this.props.dispatch({
        type: 'billlist/search',
        payload: { searchParam: values },
      })
      }
    })
  }
  // 清空表单
  handleReset = () => {
    this.props.form.resetFields()
    this.props.dispatch({
      type: 'billlist/search',
      payload: { searchParam: { billStatus: 1 } },
    })
  }

  toggleForm = (flag) => {
    if (flag === 1) {
        this.setState({
          collapsed: true,
        })
    } else {
        this.setState({
        collapsed: false,
        })
    }
  }

  render() {
    const { startValue, endValue, endOpen } = this.state
    const { suppliers, purUser } = this.props.storage
    const itemRow = {
        md: { span: 8, offset: 0 },
        lg: { span: 24, offset: 0 },
        xl: { span: 48, offset: 0 },
      }
    const itemFirstCol = {
        xs: { span: 24, offset: 0 },
        sm: { span: 24, offset: 0 },
        md: { span: 5, offset: 0 },
        lg: { span: 3, offset: 0 },
        xl: { span: 3, offset: 0 },
      }
    const itemCol = {
        xs: { span: 24, offset: 0 },
        sm: { span: 24, offset: 0 },
        md: { span: 5, offset: 1 },
        lg: { span: 3, offset: 1 },
        xl: { span: 3, offset: 1 },
      }
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    }
    return (
      <div>
        <Form
          onSubmit={this.handleSubmit}
        >
          { this.state.collapsed ?
            <Row {...itemRow} style={{ marginBottom: '5px' }}>
              <Col {...itemFirstCol}>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('billNo')(
                    <Input placeholder="采购单号" size="small" />
                    )}
                </FormItem>
              </Col>
              <Col {...itemCol}>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('createTime')(
                    <DatePicker
                      disabledDate={this.disabledStartDate}
                      format="YYYY-MM-DD"
                      setFieldsValue={startValue}
                      placeholder="开始时间"
                      size="small"
                      onChange={this.onStartChange}
                      onOpenChange={this.handleStartOpenChange}
                    />
                  )}
                </FormItem>
              </Col>
              <Col {...itemCol}>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('endTime')(
                    <DatePicker
                      disabledDate={this.disabledEndDate}
                      format="YYYY-MM-DD"
                      setFieldsValue={endValue}
                      placeholder="结束时间"
                      size="small"
                      onChange={this.onEndChange}
                      open={endOpen}
                      onOpenChange={this.handleEndOpenChange}
                    />
                  )}
                </FormItem>
              </Col>
              <Col {...itemCol}>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('supplierNo')(
                    <Select
                      showSearch
                      placeholder="供应商"
                      size="small"
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {suppliers.length ? suppliers.map(ele => <Option key={ele.supplierNo}>{ele.supplierName}</Option>) : ''}
                    </Select>
                    )}
                </FormItem>
              </Col>
              <Col {...itemCol}>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('purchaseUserId')(
                    <Select
                      showSearch
                      placeholder="采购员"
                      size="small"
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {purUser.length ? purUser.map(ele => <Option key={ele.userId} vlaue={ele.userId}>{ele.nickName}</Option>) : ''}
                    </Select>
                    )}
                </FormItem>
              </Col>
              <Col {...itemCol}>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('skuOrProductNo')(
                    // <Select
                    //   placeholder="包含商品/款式"
                    //   size="small"
                    // >
                    //   <Option key="0">包含商品</Option>
                    //   <Option key="1">包含款式</Option>
                    // </Select>
                    <Input size="small" placeholder="商品/款式编码" />
                    )}
                </FormItem>
              </Col>
              <Col {...itemFirstCol}>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('remark')(
                    <Input placeholder="备注" size="small" />
                    )}
                </FormItem>
              </Col>
              <Col {...itemCol}>
                <FormItem>
                  <Button size="small" type="primary" htmlType="submit">搜索</Button>
                  <Button style={{ marginLeft: 10 }} size="small" onClick={this.handleReset}>清空</Button>
                  <a style={{ marginLeft: 8 }} onClick={this.toggleForm.bind(this, 0)}>
                    收起 <Icon type="up" />
                  </a>
                </FormItem>
              </Col>
            </Row>
            :
            <Row {...itemRow} style={{ marginBottom: '5px' }}>
              <Col {...itemFirstCol}>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('billNo')(
                    <Input placeholder="采购单号" size="small" />
                    )}
                </FormItem>
              </Col>
              <Col {...itemCol}>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('createTime')(
                    <DatePicker
                      disabledDate={this.disabledStartDate}
                      format="YYYY-MM-DD"
                      setFieldsValue={startValue}
                      placeholder="开始时间"
                      size="small"
                      onChange={this.onStartChange}
                      onOpenChange={this.handleStartOpenChange}
                    />
                  )}
                </FormItem>
              </Col>
              <Col {...itemCol}>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('endTime')(
                    <DatePicker
                      disabledDate={this.disabledEndDate}
                      format="YYYY-MM-DD"
                      setFieldsValue={endValue}
                      placeholder="结束时间"
                      size="small"
                      onChange={this.onEndChange}
                      open={endOpen}
                      onOpenChange={this.handleEndOpenChange}
                    />
                  )}
                </FormItem>
              </Col>
              <Col {...itemCol}>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('supplierNo')(
                    <Select
                      showSearch
                      placeholder="供应商"
                      size="small"
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {suppliers.length ? suppliers.map(ele => <Option key={ele.supplierNo}>{ele.supplierName}</Option>) : ''}
                    </Select>
                    )}
                </FormItem>
              </Col>
              <Col {...itemCol}>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('purchaseUserId')(
                    <Select
                      showSearch
                      placeholder="采购员"
                      size="small"
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {purUser.length ? purUser.map(ele => <Option key={ele.userId} vlaue={ele.userId}>{ele.nickName}</Option>) : ''}
                    </Select>
                    )}
                </FormItem>
              </Col>
              <Col {...itemCol}>
                <FormItem>
                  <Button size="small" type="primary" htmlType="submit">搜索</Button>
                  <Button style={{ marginLeft: 10 }} size="small" onClick={this.handleReset}>清空</Button>
                  <a style={{ marginLeft: 8 }} onClick={this.toggleForm.bind(this, 1)}>
                    展开 <Icon type="down" />
                  </a>
                </FormItem>
              </Col>
            </Row>}
        </Form>
      </div>
    )
  }
}
