/*
 * @Author: chenjie
 * @Date: 2017-12-16 17:15:04
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-04-19 09:38:33
 * 第三级权限分配显示
 */

import React, { Component } from 'react'
import { Checkbox, Row } from 'antd'

export default class RolePop extends Component {
  constructor(props) {
    super(props)
    this.state = {
      checkedItem: {},
    }
  }
  componentWillMount() {
    const { items, isall } = this.props
    const { checkedItem } = this.state
    if (isall) {
      items.forEach((ele) => { checkedItem[ele.key] = true })
    }
    this.setState({ checkedItem })
  }
  componentWillReceiveProps(nextProps) {
    const { items, isall, checkedItems } = nextProps
    let { checkedItem } = this.state
    if (isall) {
      items.forEach((ele) => { checkedItem[ele.key] = true })
    } else {
      checkedItem = checkedItems ? checkedItems : []
      // items.forEach((ele) => { delete checkedItem[ele.key] })
    }
    // this.props.onChange(flag, pName, checkedItem)
    this.setState({ checkedItem })
  }
  onChange = (e) => {
    const { items, pName } = this.props
    const { checkedItem } = this.state
    let flag = 1 // 1: 未选 2: 未全选 3：全选
    if (e.target.checked) {
      checkedItem[e.target.value] = e.target.checked
    } else {
      delete checkedItem[e.target.value]
    }
    if (Object.keys(checkedItem).length > 0) {
      if (items.length === Object.keys(checkedItem).length) {
        flag = 3
      } else {
        flag = 2
      }
    }
    this.props.onChange(flag, pName, checkedItem)
    this.setState({ checkedItem })
  }
  render() {
    const { items } = this.props
    const { checkedItem } = this.state
    return items.map((ele, i) => (
      <Row key={i} style={{ marginTop: 5 }}>
        <Checkbox checked={checkedItem[ele.key]} value={ele.key} onChange={this.onChange} >{ele.name}</Checkbox>
      </Row>))
  }
}
