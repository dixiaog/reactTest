/*
 * @Author: jiangteng
 * @Date: 2018-01-22 09:34:07
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-14 09:23:01
 * 库存--采购管理搜索
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Form, Input, Button, DatePicker, Col, Select, Row, Icon } from 'antd'
import moment from 'moment'

const FormItem = Form.Item
const Option = Select.Option

@connect(state => ({
    manager: state.manager,
}))
@Form.create()
export default class SearchBar extends Component {
  constructor(props) {
      super(props)
      this.state = {
        collapsed: false,
        startValue: moment().subtract(7, 'days'),
        endValue: moment().subtract(0, 'days'),
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
      this.setState({ endOpen: false })
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open })
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'manager/search',
          payload: { searchParam: values },
        })
        this.props.dispatch({
          type: 'manager/changeState',
          payload: { searchParam: values,  searchParamJ: values },
        })
      }
    })
  }

  // 清空表单
  handleReset = () => {
    this.props.form.resetFields()
    this.setState({
      startValue: null,
      endValue: null,
    })
    this.props.dispatch({
      type: 'manager/search',
      payload: { searchParam: {} },
    })
    this.props.dispatch({
      type: 'manager/changeState',
      payload: { searchParamJ: {}, searchParam: {} },
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
    const selectAfter = (
      <Select defaultValue={0} style={{ width: 100 }}>
        <Option value={0}>包含商品</Option>
        <Option value={1}>包含款式</Option>
      </Select>
    )
    const { endOpen } = this.state
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
    const { warehouses, suppliers, purUser, searchParam, searchParamJ } = this.props.manager
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
                  {getFieldDecorator('billNo', {
                    initialValue: searchParam.billNo,
                  })(
                    <Input placeholder="请输入采购单号" size="small" />
                    )}
                </FormItem>
              </Col>
              <Col {...itemCol}>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('timeStatus', {
                    initialValue: searchParam.timeStatus,
                  })(
                    <Select
                      placeholder="下单/审核时间(默认下单)"
                      size="small"
                    >
                      <Option value="0">下单时间</Option>
                      <Option value="1">审核时间</Option>
                    </Select>
                    )}
                </FormItem>
              </Col>
              <Col {...itemCol}>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('createTime', {
                        initialValue: searchParamJ.createTime,
                    })(
                      <DatePicker
                        disabledDate={this.disabledStartDate}
                        format="YYYY-MM-DD"
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
                  {getFieldDecorator('endTime', {
                    initialValue: searchParamJ.endTime,
                  })(
                    <DatePicker
                      disabledDate={this.disabledEndDate}
                      format="YYYY-MM-DD"
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
                  {getFieldDecorator('billStatus', {
                    initialValue: searchParam.billStatus,
                  })(
                    <Select
                      placeholder="单据状态"
                      size="small"
                    >
                      <Option key="0">待审核</Option>
                      <Option key="1">已审核</Option>
                      <Option key="2">已完成</Option>
                      <Option key="3">已作废</Option>
                    </Select>
                    )}
                </FormItem>
              </Col>
              <Col {...itemCol}>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('warehouseNo', {
                    initialValue: searchParam.warehouseNo,
                  })(
                    <Select
                      placeholder="仓库"
                      size="small"
                    >
                      {warehouses.length ? warehouses.map(ele => <Option key={ele.warehouseNo}>{ele.warehouseName}</Option>) : ''}
                    </Select>
                    )}
                </FormItem>
              </Col>
              <Col {...itemFirstCol}>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('supplierNo', {
                    initialValue: searchParam.supplierNo,
                  })(
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
                  {getFieldDecorator('purchaseUserId', {
                    initialValue: searchParam.purchaseUserId,
                  })(
                    <Select
                      showSearch
                      placeholder="采购员"
                      size="small"
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      {purUser.length ? purUser.map((ele, index) => <Option key={index} value={ele.userId}>{ele.nickName}</Option>) : ''}
                    </Select>
                    )}
                </FormItem>
              </Col>
              <Col {...itemCol}>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('remark', {
                    initialValue: searchParam.remark,
                  })(
                    <Input placeholder="备注" size="small" />
                    )}
                </FormItem>
              </Col>
              <Col {...itemCol}>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('skuOrProductNo', {
                    initialValue: searchParam.skuOrProductNo,
                  })(
                    <Input size="small" placeholder="商品/款式编码" addonAfter={selectAfter} style={{ width: 220 }} />
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
            <Row style={{ marginBottom: '5px' }}>
              <Col {...itemFirstCol}>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('billNo', {
                    initialValue: searchParam.billNo,
                  })(
                    <Input placeholder="请输入采购单号" size="small" />
                  )}
                </FormItem>
              </Col>
              <Col {...itemCol}>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('timeStatus', {
                    initialValue: searchParam.timeStatus,
                  })(
                    <Select
                      placeholder="下单/审核时间(默认下单)"
                      size="small"
                    >
                      <Option key="0">下单时间</Option>
                      <Option key="1">审核时间</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...itemCol}>
                <FormItem
                  {...formItemLayout}
                >
                  {getFieldDecorator('createTime', {
                      initialValue: searchParamJ.createTime,
                  })(
                    <DatePicker
                      disabledDate={this.disabledStartDate}
                      format="YYYY-MM-DD"
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
                  {getFieldDecorator('endTime', {
                    initialValue: searchParamJ.endTime,
                  })(
                    <DatePicker
                      disabledDate={this.disabledEndDate}
                      format="YYYY-MM-DD"
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
                  {getFieldDecorator('billStatus', {
                    initialValue: searchParam.billStatus,
                  })(
                    <Select
                      placeholder="单据状态"
                      size="small"
                    >
                      <Option key="0">待审核</Option>
                      <Option key="1">已审核</Option>
                      <Option key="2">已完成</Option>
                      <Option key="3">作废</Option>
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
