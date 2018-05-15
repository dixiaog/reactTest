/*
 * @Author: chenjie
 * @Date: 2017-12-16 17:15:04
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-14 09:54:40
 * 角色维护
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Card, Tree, Input, Icon, Button, Divider, Checkbox, Row } from 'antd'
import { checkEmpty, effectFetch } from '../../utils/utils'
import config from '../../utils/config'
import styles from './Base.less'
import RoleCard from './RoleCard'
import RoleModal from './RoleModal'
// import { getOtherStore } from '../../utils/otherStore'

const TreeNode = Tree.TreeNode
const Search = Input.Search
const getParentKey = (key, tree) => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}
@connect(state => ({
    roles: state.roles,
}))
export default class Powers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      checkAll: false,
      indeterminate: false,
      checkedItems: {},
      cardItems: {},
      popItems: {},
      itemModalVisiable: false,
      role: {},
    }
  }
  componentDidMount() {
    // const { roles } = getOtherStore()
    // if (!roles || roles.list.length === 0) {
    //   this.props.dispatch({
    //     type: 'roles/fetch',
    //   })
    // }
    effectFetch('roles', this.props.dispatch)
  }
  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    })
  }
  onChange = (e) => {
    const value = e.target.value
    const { dataList, list } = this.props.roles
    const expandedKeys = dataList.map((item) => {
      if (!checkEmpty(value) && item.title.indexOf(value) > -1) {
        return getParentKey(item.key, list)
      }
      return null
    }).filter((item, i, self) => item && self.indexOf(item) === i)
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    })
  }
  onCheckAllChange = (e) => {
    const { rolePowers } = this.props.roles
    let { checkedItems } = this.state
    let { checkAll, indeterminate } = this.state
    if (e.target.checked) {
      checkAll = true
      rolePowers.forEach((p) => {
        if (p.children) {
          p.children.forEach((j) => { checkedItems[j.key] = true })
        }
      })
    } else {
      checkAll = false
      indeterminate = false
      checkedItems = {}
    }
    this.setState({ checkAll, checkedItems, indeterminate })
  }
  onCardChange = (cards, pops, removeItem) => {
    const { total } = this.props.roles
    const { cardItems, popItems, checkedItems } = this.state
    let checkAll = false
    let indeterminate = false
    Object.keys(cards).forEach((c) => { if (cards[c]) Object.assign(cardItems, { [c]: cards[c] }) })
    Object.assign(popItems, pops)
    if (removeItem) delete cardItems[removeItem]
    if (Object.keys(cardItems).length > 0) {
      if (Object.keys(cardItems).length < total) {
        indeterminate = true
      } else {
        checkAll = true
      }
    }
    Object.assign(checkedItems, cardItems)
    this.setState({
      checkAll,
      indeterminate,
      checkedItems: cards,
      cardItems,
      popItems,
    })
  }
  treeNodeEdit = (e) => {
    console.log(e)
  }
  render() {
    const { list, loading, rolePowers } = this.props.roles
    const { searchValue, expandedKeys, autoExpandParent } = this.state
    const loop = data => data.map((item) => {
      const index = item.title.indexOf(searchValue)
      const beforeStr = item.title.substr(0, index)
      const afterStr = item.title.substr(index + searchValue.length)
      let title = index > -1 ? (
        <span>
          {beforeStr}
          <span style={{ color: '#f50' }}>{searchValue}</span>
          {afterStr}
        </span>
      ) : <span>{item.title}</span>
      if (item.children) {
        return (
          <TreeNode key={item.key} title={title}>
            {loop(item.children)}
          </TreeNode>
        )
      }
      title = <span>{title} <a onClick={this.treeNodeEdit.bind(this, item.key)}><Icon type="form" /></a></span>
      return <TreeNode key={item.key} title={title} />
    })
    // 添加|编辑Modal参数
    const roleModalProps = {
      itemModalVisiable: this.state.itemModalVisiable,
      dispatch: this.props.dispatch,
      itemModalHidden: () => {
        this.setState({
          itemModalVisiable: false,
        })
      },
      role: this.state.role,
    }
    return (
      <div>
        <Card bordered={false} loading={loading} className={styles.roleLeftCard} style={{ width: 300 }}>
          <Button icon="plus" type="primary" style={{ marginBottom: 10 }} size={config.InputSize} onClick={() => { this.setState({ itemModalVisiable: true }) }} >添加角色</Button>
          <Search style={{ marginBottom: 8 }} placeholder="搜索角色" onChange={this.onChange} size={config.InputSize} />
          <Tree
            onExpand={this.onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
          >
            {loop(list)}
          </Tree>
        </Card>
        <Card bordered={false} loading={loading} className={styles.roleRightCard} >
          <span className={styles.rolePowers}>权限列表</span>
          <Divider style={{ marginTop: 10 }} />
          <Checkbox
            indeterminate={this.state.checkAll ? false : this.state.indeterminate}
            onChange={this.onCheckAllChange}
            checked={this.state.checkAll}
          >
            全选
          </Checkbox>
          {rolePowers.map((p, i) => {
            return (
              <Card title={p.name} key={p.key} style={{ marginTop: 10 }} hoverable >
                <Row key={i}>
                  <RoleCard powers={p.children} cardItems={this.state.checkedItems} onChange={this.onCardChange} />
                </Row>
              </Card>)
          })}
        </Card>
        <RoleModal {...roleModalProps} />
      </div>)
  }
}
