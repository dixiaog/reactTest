import React, { Component } from 'react'
// import { connect } from 'dva'
import { Modal, Radio, message } from 'antd'
// import config from '../../../utils/config'
import { getAddress } from '../../../services/base/shops'

const RadioGroup = Radio.Group

export default class TaobaoAddress extends Component {
  constructor(props) {
    super(props)
    this.state = {
      addressLists: [],
      value: null,
    }
  }
  componentWillMount() {
    if (this.props.shopNo) {
      const payload = { shopNo: this.props.shopNo }
      getAddress(payload).then((json) => {
        if (json) {
          console.log('json', json)
          this.setState({
            addressLists: json,
          })
        }
      })
    }
  }
  handleOk = () => {
    this.handleSubmit()
  }
  handleCancel = () => {
    this.props.taobaoModelHidden()
  }
  handleSubmit = () => {
    if (this.state.value) {
      this.props.chooseAddress(this.state.value, () => {
        this.props.taobaoModelHidden()
      })
    } else {
      message.error('请选择地址')
    }
  }
  onChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  }
  render() {
    return (
      <Modal
        maskClosable={false}
        title="选择淘宝线上地址"
        visible={this.props.taobaoVisiable}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
        width={600}
        confirmLoading={this.state.confirmLoading}
      >
        {this.state.addressLists && this.state.addressLists.length ?
          <RadioGroup onChange={this.onChange} value={this.state.value}>
            {this.state.addressLists.map((ele, i) => {
              return (
                <div key={i} style={{ marginBottom: 10 }}>
                  <Radio value={ele} style={{ marginBottom: 10 }}>{ele.province} {ele.city} {ele.country}  {ele.addr}  {ele.contactName}</Radio>
                </div>
              )
            })}
          </RadioGroup> : <div>无可选地址</div>
        }
      </Modal>
    )
  }
}