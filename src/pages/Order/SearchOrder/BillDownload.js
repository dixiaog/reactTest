/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified time: 2018-02-08 09:18:49
 * 按单号下载
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Alert, Button, Radio, Col, Input, message } from 'antd'
import { autoDownSave } from '../../../services/order/search'

const RadioGroup = Radio.Group
const { TextArea } = Input

@connect(state => ({
  search: state.search,
}))
export default class BillDownload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: null,
      billList: '',
      loading: false,
    }
  }
  onChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  }
  input = (e) => {
    this.setState({
      billList: e.target.value,
    })
  }
  // 关闭窗口
  hideModal = () => {
    this.setState({
      value: null,
      billList: '',
      loading: false,
    })
    this.props.hideModal()
  }
  handleSubmit = (e) => {
    e.preventDefault()
    if (this.state.value === null) {
      message.warning('请选择一个店铺')
    } else if (!this.state.billList) {
      message.warning('请至少输入一个订单号')
    } else {
      this.setState({
        loading: true,
      })
      const param = {}
      Object.assign(param, { shopNo: this.state.value, orderNos: this.state.billList, downType: 'orderno' })
      autoDownSave(param).then((json) => {
        if (json) {
          this.hideModal()
          message.success('订单下载成功')
          this.props.dispatch({
            type: 'search/search',
          })
        }
        this.setState({
          loading: false,
        })
      })
    }
  }
  render() {
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    }
    const { show } = this.props
    const { shopList } = this.props.search
    return (
      <div>
        <Modal
          title="手工下载订单[按单号]"
          visible={show}
          onCancel={this.hideModal}
          footer={[
            <Button key="1" onClick={this.hideModal}>关闭</Button>,
            <Button key="2" type="primary" onClick={this.handleSubmit} loading={this.state.loading}>立即下载</Button>,
          ]}
          bodyStyle={{ maxHeight: 500, overflowX: 'hidden', padding: 0, paddingBottom: '20px' }}
          maskClosable={false}
        >
          <Alert banner showIcon={false} message="在发现订单未及时同步或出现延迟的时候,可以进行手动下载" type="warning" />
          <Col span={10} style={{ overflow: 'hidden' }}>
            <RadioGroup style={{ padding: '10px' }} onChange={this.onChange} value={this.state.value}>
              {shopList && shopList.length ? shopList.map(ele => <Radio key={ele.shopNo} style={radioStyle} value={ele.shopNo}>{ele.shopName}</Radio>) : '暂无店铺'}
            </RadioGroup>
          </Col>
          <Col span={14} style={{ paddingRight: '10px', paddingTop: '18px', paddingLeft: '10px' }}>
            <p>线上订单号(<span style={{ color: 'green' }}>每行1个订单号,最多100个</span>)</p>
            <TextArea rows={10} onChange={this.input} value={this.state.billList} />
          </Col>
        </Modal>
      </div>)
  }
}
