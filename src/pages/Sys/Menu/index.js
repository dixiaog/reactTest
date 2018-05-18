/*
 * @Author: jiangteng
 * @Date: 2017-12-22 17:40:30
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-18 15:36:46
 * 菜单管理
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import PublicTable from '../../../components/PublicTable'
import { isRefresh } from '../../../utils/utils'
import styles from '../sys.less'

@connect(state => ({
  menu: state.menu,
}))
export default class Task extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menu: false,
      record: {},
    }
  }

  componentDidMount() {
    if (isRefresh()) {
      this.props.dispatch({ type: 'menu/fetch' })
    }
  }

  render() {
    const { list } = this.props.menu
    if (list && list.length) {
      list.forEach(ele => {
        Object.assign(ele, { menuName: ele.text })
        if (ele.children && ele.children.length) {
          ele.children.forEach(item => {
            Object.assign(item, { menuName: item.text, menuIcon: item.iconFont, navigatUrl: item.href })
          })
        }
      })
    }
    console.log('list', list)
    const searchBar = [ // 搜索栏
    ]
    const actionBar = [
    ]
    const columns = [
      {
        title: '名称',
        dataIndex: 'menuName',
        key: 'menuName',
        width: 120,
      },
      {
        title: '排序索引',
        dataIndex: 'sortIndex',
        key: 'sortIndex',
        width: 120,
      },
      {
        title: '图标',
        dataIndex: 'menuIcon',
        key: 'menuIcon',
        width: 120,
      },
      {
        title: '路由',
        dataIndex: 'navigatUrl',
        key: 'navigatUrl',
        width: 120,
      },
      {
        title: '操作',
        key: 'operation',
        width: 100,
        render: (text, record) => {
          return (
            <a>编辑</a>
          )
        },
      },
    ]
    // 表格参数
    const tableProps = {
      columns,
      data: list,
      rowKey: 'sortIndex',
      actionBar,
      dispatch: this.props.dispatch,
      namespace: 'menu',
      searchBar,
    }

    return (
      <div className={styles.tableList}>
        <PublicTable {...tableProps} />
      </div>
    )
  }
}
