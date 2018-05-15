/*
 * @Author: tanmengjia
 * @Date: 2018-02-09 16:45:11
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-12 13:27:21
 * 财务审核
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, notification, Col, Checkbox, Button } from 'antd'
import styles from '../../Order.less'
import { saveFApproveStrategy } from '../../../../services/order/orderList'

const CheckboxGroup = Checkbox.Group

@connect(state => ({
  fApproveStrategy: state.fApproveStrategy,
}))
@Form.create()
export default class FApproveStrategy extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isGift: false,
      orderType: [],
      isUpdate: false,
      isFirst: true,
      isOpen: false,
    }
  }
    componentWillMount() {
      this.props.dispatch({ type: 'fApproveStrategy/getData' })
    }
    componentWillReceiveProps(nextProps) {
      if (this.state.isFirst && nextProps.fApproveStrategy.data) {
        this.setState({
          isFirst: false,
          isUpdate: nextProps.fApproveStrategy.data.isUpdate === 1,
          isGift: nextProps.fApproveStrategy.data.isGift === 1,
          orderType: nextProps.fApproveStrategy.data.orderType ? nextProps.fApproveStrategy.data.orderType.split(',') : [],
          isOpen: nextProps.fApproveStrategy.data.enableStatus === 1,
        })
      }
    }
    setOrderType = (e) => {
      this.setState({
        orderType: e,
      })
    }
    setIsGift = (e) => {
      this.setState({
        isGift: e.target.checked,
      })
    }
    setIsUpdate = (e) => {
      this.setState({
        isUpdate: e.target.checked,
      })
    }
    setIsOpen = (e) => {
      this.setState({
        isOpen: e.target.checked,
      })
    }
  handleOk = () => {
    const payload = {}
    Object.assign(payload, { isUpdate: this.state.isUpdate ? 1 : 0 })
    Object.assign(payload, { isGift: this.state.isGift ? 1 : 0 })
    Object.assign(payload, { orderType: this.state.orderType.join(',') })
    Object.assign(payload, { enableStatus: this.state.isOpen ? 1 : 0 })
    if (this.props.fApproveStrategy.data && this.props.fApproveStrategy.data.strategyNo) {
      Object.assign(payload, { strategyNo: this.props.fApproveStrategy.data.strategyNo })
    }
    saveFApproveStrategy(payload).then((json) => {
      if (json) {
      this.props.dispatch({
        type: 'fApproveStrategy/clean',
      })
        notification.success({
          message: '操作成功',
        })
        this.props.form.resetFields()
        this.props.itemModalHidden()
      }
    })
  }
  handleCancel = () => {
    this.props.form.resetFields()
    this.props.itemModalHidden()
  }
  render() {
    return (
      <Modal
        key="811"
        maskClosable={false}
        title="开启财务审核"
        visible={this.props.approveVisiable}
        onCancel={this.handleCancel}
        bodyStyle={{ padding: 0 }}
        width="600px"
        footer={[
          <Button key="789" type="primary" onClick={this.handleOk}>
            保存
          </Button>,
        ]}
      >
        <Col span={1}><div /></Col><Col span={21}><Checkbox onChange={this.setIsOpen} checked={this.state.isOpen}><span style={{ color: 'green' }}><b>开启财务审核</b></span></Checkbox></Col>
        <br />
        <br />
        <Col span={1}><div /></Col><Col span={23}><div>符合以下任意条件的订单需要财务审核(如果不设定任何条件，则全部订单):</div></Col>
        <br />
        <br />
        <CheckboxGroup key={666} style={{ width: '100%' }} onChange={this.setOrderType} value={this.state.orderType} className={styles.bian}>
          <Col span={2} style={{ marginBottom: 10, marginTop: 10 }}>
            <div />
          </Col>
          <Col span={22} style={{ marginBottom: 10, marginTop: 10 }}>
            <Checkbox value="0" ><span style={{ color: '#262626' }}>普通订单</span></Checkbox>
          </Col>
          <Col span={2} style={{ marginBottom: 10 }}><div /></Col><Col span={22} style={{ marginBottom: 10 }}><Checkbox value="1" ><span style={{ color: '#262626' }}>换货订单</span></Checkbox></Col>
          <Col span={2} style={{ marginBottom: 10 }}><div /></Col><Col span={22} style={{ marginBottom: 10 }}><Checkbox value="2" ><span style={{ color: '#262626' }}>手工创建的订单</span></Checkbox></Col>
          {/* <Col span={2}
            style={{ marginBottom: 10 }}><div /></Col><Col span={22} style={{ marginBottom: 10 }}><Checkbox value="3" ><span style={{ color: '#262626' }}>导入的订单</span></Checkbox></Col> */}
        </CheckboxGroup>
        <br />
        <br />
        <div className={styles.bian}>
          <br />
          <Col span={1}><div /></Col><Col span={23}><div style={{ marginLeft: 20 }}>修改过的订单</div></Col>
          <br />
          <br />
          <Col span={2}><div /></Col><Col span={22}><Checkbox onChange={this.setIsUpdate} checked={this.state.isUpdate}><span style={{ color: '#262626' }}>商品改价，修改数量，换商品</span></Checkbox></Col>
          <br />
          <br />
          <Col span={2}><div /></Col><Col span={22}><Checkbox onChange={this.setIsGift} checked={this.state.isGift}><span style={{ color: '#262626' }}>手工加赠品(通过赠品规则赠送的不算)</span></Checkbox></Col>
          <br />
          <br />
        </div>
        {/* <br /> */}
        {/* <CheckboxGroup key={644} style={{ width: '100%' }}> */}
        {/* onChange={this.choose1} value={this.state.chooseSell} disabled={this.state.isOpen1} */}
        {/* <div className={styles.bian}>
          <br />
          <Col span={2}><div /></Col><Col span={22}><Checkbox><span style={{ color: '#262626' }}>手工添加支付(有手工添加的支付订单)</span></Checkbox></Col> */}
        {/* </CheckboxGroup> */}
        {/* <br />
        <br />
        </div> */}
      </Modal>
      )
  }
}
