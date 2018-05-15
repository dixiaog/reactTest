/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-14 09:39:19
 * 打标签
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Alert, Radio, message } from 'antd'
import { editOrderMark } from '../../services/order/search'

const RadioGroup = Radio.Group
const label = [
  { color: 'redFlag', name: '红色标签', value: 1 },
  { color: 'yellowFlag', name: '黄色标签', value: 2  },
  { color: 'greenFlag', name: '绿色标签' , value: 3 },
  { color: 'blueFlag', name: '蓝色标签', value: 4  },
  { color: 'purpleFlag', name: '紫色标签', value: 5  },
  { color: 'blackFlag', name: '黑色标签', value: 6  },
  { color: 'clean', name: '清除现有标签', value: 0  },
]
const text = (
  <div>
    <div>标签系统只对没有发货或没有进入发货节点的订单有效</div>
    <div>该标签与淘宝卖家备注旗帜无关</div>
  </div>
)
@connect(state => ({
  search: state.search,
}))
export default class Label extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      value: null,
    }
  }
  onChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  }
  handleSubmit = () => {
    if (this.state.value === null) {
      message.warning('请选择标签')
    } else {
      this.setState({
        confirmLoading: true,
      })
      const { selectedRows } = this.props.search
      const orderNos =  this.props.btnModify ? [this.props.record.orderNo] : selectedRows.map(o => o.orderNo)
      const values = { orderLabel: this.state.value, orderNos }
      editOrderMark(values).then((json) => {
        if (json) {
          message.success('打标签修改成功')
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
      value: null,
    })
  }
  render() {
    const { show } = this.props
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    }
    return (
      <div>
        <Modal
          title="打标签"
          visible={show}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          maskClosable={false}
          confirmLoading={this.state.confirmLoading}
        >
          <Alert showIcon={false} message={text} banner />
          <RadioGroup onChange={this.onChange} value={this.state.value}>
            { label.map((ele, index) => 
              <Radio key={index} style={radioStyle} value={ele.value}><img alt="" src={require(`../../images/${ele.color}.png`)} style={{ width: '20px', height: '20px' }} />{ele.name}</Radio>
            ) }
          </RadioGroup>
        </Modal>
      </div>)
  }
}
