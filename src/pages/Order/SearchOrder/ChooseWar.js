/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-03-20 13:31:18
 * 打标签
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Radio, message, Col } from 'antd'
import { editOrderMark } from '../../../services/order/search'

const RadioGroup = Radio.Group
@connect(state => ({
  search: state.search,
}))
export default class ChooseWar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      value: '',
    }
  }
  onChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  }
  handleSubmit = () => {
    if (!this.state.value) {
      message.warning('请选择仓库')
    } else {
      this.setState({
        confirmLoading: true,
      })
      const { selectedRows } = this.props.search
      const orderNos = selectedRows.map(o => o.orderNo)
      const values = { warehouseNo: this.state.value, orderNos }
      editOrderMark(values).then((json) => {
        if (json) {
          message.success('指定仓库成功')
          this.hideModal()
          this.props.dispatch({
            type: 'search/search',
          })
          this.props.dispatch({
            type: 'search/changeState',
            payload: { selectedRowKeys: [], selectedRows: [] },
          })
        }
        this.setState({
          confirmLoading: false,
        })
      })
    }
  }
  // 关闭窗口
  hideModal = () => {
    this.props.hideModal()
    this.setState({
      confirmLoading: false,
      value: '',
    })
  }
  render() {
    const { warList } = this.props
    const { show } = this.props
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    }
    return (
      <div>
        <Modal
          title="选择仓库"
          visible={show}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          maskClosable={false}
          confirmLoading={this.state.confirmLoading}
        >
          <RadioGroup onChange={this.onChange} value={this.state.value}>
            {warList.length ? warList.map(ele => <Col span={12}><Radio style={radioStyle} key={ele.warehouseNo} value={ele.warehouseNo}>{ele.warehouseName}</Radio></Col>) : ''}
          </RadioGroup>
        </Modal>
      </div>)
  }
}
