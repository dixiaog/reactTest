/*
 * @Author: tanmengjia
 * @Date: 2018-02-08 15:26:23
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-14 20:31:57
 * 拆分策略
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Radio, notification, message, Col, Checkbox, Button, Divider, Popconfirm } from 'antd'
import { deleteSplitStrategy, doSplit } from '../../../../services/order/orderList'

const RadioGroup = Radio.Group

@connect(state => ({
  splitStrategy: state.splitStrategy,
  search: state.search,
}))
@Form.create()
export default class SplitStrategy extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
      orderType: 1,
      isShow: false,
      okVisiable: false,
    }
  }
  componentWillMount() {
    this.setState({
      orderType: this.props.orderType,
      isShow: this.props.isShow,
    })
    }
    onChange = (e) => {
      this.setState({
        value: e.target.value,
      })
    }
    setOrderType = (e) => {
      this.setState({
        orderType: e.target.value,
      })
    }
  handleOk = () => {
    const values = {}
    Object.assign(values, { orderType: this.state.orderType })
    if (this.state.orderType === 0) {
      Object.assign(values, { selectedRows: this.props.selectedRows })
    } else if (this.state.orderType === 1) {
      Object.assign(values, { searchParam: this.props.searchParam ? this.props.searchParam : null })
    }
    // Object.assign(values, { isShow: this.state.isShow ? 1 : 0 })
    Object.assign(values, { strategyNo: this.state.value })
    // this.props.dispatch({
    //   type: 'search/doSplit',
    //   payload: values,
    // })
    if (this.state.isShow) {
      doSplit(values).then((json) => {
        if (json) {
          this.props.dispatch({
            type: 'search/fetch1',
            payload: json,
          })
          notification.success({
            message: '操作成功',
          })
          this.props.form.resetFields()
          this.props.itemModalHidden()
          this.setState({
            okVisiable: false,
          })
        }
      })
    } else {
      doSplit(values).then((json) => {
        if (json) {
          this.props.dispatch({
            type: 'search/search',
          })
          notification.success({
            message: '操作成功',
          })
          this.props.form.resetFields()
          this.props.itemModalHidden()
        }
      })
    }
  }
  details = (ele) => {
    this.props.splitHidden(ele, this.state.orderType, this.state.isShow)
  }
  delete = (strategyNo) => {
    const payload = {
      strategyNo,
    }
    deleteSplitStrategy(payload).then((json) => {
      if (json) {
        message.success('删除成功')
        this.props.dispatch({ type: 'splitStrategy/fetch' })
      }
    })
  }
  batch = () => {
    this.props.presellHidden()
  }
  add = () => {
    this.props.splitHidden()
  }
  handleCancel = () => {
    this.props.form.resetFields()
    this.props.itemModalHidden()
  }
  handleCancel1 = () => {
    this.setState({
      okVisiable: false,
    })
  }

  isShow = (e) => {
    this.setState({
      isShow: e.target.checked,
    })
  }
  render() {
    return (
      <Modal
        key="811"
        maskClosable={false}
        title="订单批量拆分策略"
        visible={this.props.splitVisiable}
        onCancel={this.handleCancel}
        width="800px"
        footer={[
          <Button key="456" type="primary" onClick={this.batch}>
            预售按批次拆分
          </Button>,
          <Button key="789" type="primary" onClick={this.add}>
            添加新的策略
          </Button>,
          // <Popconfirm title={okTitle} okText="确定" onConfirm={this.handleOk} placement="left" cancelText="取消" key="993">
            <Button key="999" type="primary" disabled={!(this.state.value > 0)} onClick={() => this.setState({ okVisiable: true }) }>
              确定拆分
            </Button>,
          // </Popconfirm>,
        ]}
      >
        <RadioGroup onChange={this.setOrderType} value={this.state.orderType} >
          <Col key={444} span={23}>
            <Radio value={0} disabled={!(this.props.selectedRows && this.props.selectedRows.length)}>订单列表页勾选的订单:<span style={{ color: '#A59EA9' }} >(同时已付款且状态为异常|已付款待审核)参与计算拆分订单</span></Radio>
            <Checkbox key={446} onChange={this.isShow} checked={this.state.isShow}>拆分完成后显示拆分后的订单</Checkbox>
          </Col>
          <Col key={445} span={23}><Radio value={1}>所有符合条件的订单<span style={{ color: '#A59EA9' }} >(加入搜索条件过滤后)(同时已付款且状态为异常|已付款待审核)</span></Radio></Col>
        </RadioGroup>
        <br />
        <br />
        <br />
        <br />
        <RadioGroup onChange={this.onChange} value={this.state.value} key="821" style={{ width: '100%' }}>
          { this.props.splitStrategy.splits && this.props.splitStrategy.splits.length ?
            this.props.splitStrategy.splits.map((ele) => {
            return (
              <Col key={ele.strategyNo} style={{ marginBottom: 5 }} span={12}>
                <Radio value={ele.strategyNo}>{ele.strategyName}</Radio>
                { this.state.value === ele.strategyNo ?
                  <span>
                    <Divider type="vertical" />
                    <a onClick={this.details.bind(this, ele)}>修改或查看详情</a>
                    <Divider type="vertical" />
                    <Popconfirm title={<div>请确认需要删除策略【{ele.strategyName}】</div>} okText="确定" onConfirm={this.delete.bind(this, ele.strategyNo)} cancelText="取消">
                      <a>删除</a>
                    </Popconfirm>
                  </span> : ''
                }
              </Col>
              )
            }) : '' }
        </RadioGroup>
        <Modal
          key="812"
          maskClosable={false}
          title="提示"
          visible={this.state.okVisiable}
          onCancel={this.handleCancel1}
          onOk={this.handleOk}
          width="500px"
          // footer={[
          //   <Button key="456" type="primary" onClick={this.batch}>
          //     预售按批次拆分
          //   </Button>,
          //   <Button key="789" type="primary" onClick={this.add}>
          //     添加新的策略
          //   </Button>,
          //   <Popconfirm title={okTitle} okText="确定" onConfirm={this.handleOk} placement="left" cancelText="取消" key="993">
          //     <Button key="999" type="primary" disabled={!(this.state.value > 0)}>
          //       确定拆分
          //     </Button>
          //   </Popconfirm>,
          // ]}
        >
          <div key={999}>该策略指定：{this.state.orderType ?
            '【所有符合条件的订单】，订单列表页并非附加任何搜索过滤条件，请确认是否所有订单均参与拆分？'
            : '【订单列表页勾选的订单】，请确认是否参与拆分？'}</div>
        </Modal>
      </Modal>
      )
  }
}
