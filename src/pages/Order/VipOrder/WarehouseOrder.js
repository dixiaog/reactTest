/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-10 12:49:49
 * 创建拣货单
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Row, Col, Checkbox, message } from 'antd'

const CheckboxGroup = Checkbox.Group

@connect(state => ({
  vipOrder: state.vipOrder,
}))
export default class WarehouseOrder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      checkedList: [],
    }
  }
  handleSubmit = () => {
    if (!this.state.checkedList.length) {
      message.warning('至少选择一个仓库')
    } else {
      this.setState({
        confirmLoading: true,
      })
    }
  }
  // 关闭窗口
  hideModal = () => {
    this.props.hideModal()
    this.setState({
      confirmLoading: false,
      checkedList: [],
    })
  }
  onChange = (checkedList) => {
    this.setState({
      checkedList,
    })
  }
  render() {
    const { show, warehouseList } = this.props
    const { selectedRowKeys } = this.props.vipOrder
    return (
      <div>
        <Modal
          title={`创建拣货单PO:${selectedRowKeys[0]}`}
          visible={show}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          maskClosable={false}
          confirmLoading={this.state.confirmLoading}
          width={600}
        >
          <Row style={{ fontWeight: 'bold' }}>
            <Col span={8}>仓库</Col>
            <Col span={8}>未拣货数</Col>
            <Col span={8}>补货数</Col>
          </Row>
            <CheckboxGroup style={{ width: '100%' }} value={this.state.checkedList} onChange={this.onChange}>  
              {warehouseList && warehouseList.length ? warehouseList.map(ele =>
                <Row style={{ marginTop: 10 }}>
                  <Col span={8}>北京</Col>
                  <Col span={8}><Checkbox value={2}>80</Checkbox></Col>
                  <Col span={8}><Checkbox value={3}>20</Checkbox></Col>
                </Row>
              ) : '暂无数据'}
            </CheckboxGroup>
        </Modal>
      </div>)
  }
}
