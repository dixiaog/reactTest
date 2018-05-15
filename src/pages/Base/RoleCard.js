/*
 * @Author: chenjie
 * @Date: 2017-12-16 17:15:04
 * @Last Modified by: chenjie
 * @Last Modified time: 2017-12-19 16:53:02
 * 权限卡片
 */

import React, { Component } from 'react'
import { Icon, Checkbox, Col, Popover } from 'antd'
import RolePop from './RolePop'

export default class RoleCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      indeters: {},
      checkAlls: {},
      checkedItems: {},
    }
  }
  componentWillMount() {
    // const { checkAlls } = this.state
    // const { powers } = this.props
    // console.log('componentWillMount', this.props.checked)
    // if (this.props.checked) {
    //   powers.forEach((ele) => { checkAlls[ele.key] = true })
    // } else {
    //   powers.forEach((ele) => { checkAlls[ele.key] = false })
    // }
    // this.setState({
    //   checkAlls,
    // })
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    // const { checkAlls } = this.state
    const { cardItems } = nextProps
    // if (nextProps.checked) {
    //   powers.forEach((ele) => { checkAlls[ele.key] = true })
    // } else {
    //   powers.forEach((ele) => { checkAlls[ele.key] = false })
    // }
    this.setState({
      checkAlls: cardItems,
    })
  }
  popOnChange = (flag, pName, checkedItem) => {
    const { indeters, checkAlls, checkedItems } = this.state
    let removeItem
    if (flag === 2) {
      indeters[pName] = true
    } else {
      delete indeters[pName]
    }
    if (flag === 3) {
      checkAlls[pName] = true
    } else {
      delete checkAlls[pName]
      removeItem = pName
    }
    checkedItems[pName] = checkedItem
    this.props.onChange(checkAlls, checkedItems, removeItem)
    this.setState({
      indeters,
      checkAlls,
      checkedItems,
    })
  }
  checkAllChange = (e) => {
    const { powers } = this.props
    const { checkAlls, indeters, checkedItems } = this.state
    let removeItem
    if (e.target.checked) {
      checkAlls[e.target.value] = true
      powers.forEach((p) => {
        if (p.key === e.target.value) {
          const ii = []
          if (p.children && p.children.length) {
            p.children.forEach((c) => { ii.push({ [c.key]: true }) })
            checkedItems[p.key] = ii
          }
        }
      })
    } else {
      delete checkAlls[e.target.value]
      indeters[e.target.value] = false
      checkedItems[e.target.value] = []
      removeItem = e.target.value
    }
    this.props.onChange(checkAlls, checkedItems, removeItem)
    this.setState({
      checkAlls,
      indeters,
      checkedItems,
    })
  }
  render() {
    const { powers } = this.props
    const { indeters, checkAlls, checkedItems } = this.state
    return powers.map((ele, i) => (
      <Col span={4} key={i} style={{ marginTop: 5 }}>
        <Checkbox
          value={ele.key}
          onChange={this.checkAllChange.bind(this)}
          checked={checkAlls[ele.key]}
          indeterminate={checkAlls[ele.key] ? false : indeters[ele.key]}
        >{ele.name} {ele.children ?
          <Popover
            content={<RolePop
              items={ele.children}
              checkedItems={checkedItems[ele.key]}
              pName={ele.key}
              onChange={this.popOnChange}
              isall={checkAlls[ele.key]}
            />}
            style={{ width: 120 }}
          >
            <Icon type="down-circle-o" />
          </Popover>
          : null }
        </Checkbox>
      </Col>))
  }
}
