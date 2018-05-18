/*
 * @Author: jiangteng
 * @Date: 2017-12-22 17:40:30
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-18 15:38:25
 * 数据字典
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Input } from 'antd'
import PublicTable from '../../../components/PublicTable'
import { isRefresh } from '../../../utils/utils'
import DicModal from './DicModal'
import styles from '../base.less'

@connect(state => ({
    dictionary: state.dictionary,
}))
export default class Dictionary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      record: {},
    }
  }

  componentDidMount() {
    if (isRefresh()) {
      this.props.dispatch({ type: 'dictionary/fetch' })
    }
  }

  render() {
    const { list, total, loading, page, searchParam } = this.props.dictionary
    const searchBar = [ // 搜索栏
      {
        decorator: 'name',
        components: (<Input placeholder="请输入字典名称" size="small" />),
      },
    ]

    const columns = [{
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      width: 120,
      render: (text, record, index) => {
        return (
          <span>
            {index + 1}
          </span>
          )
        },
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '说明',
      dataIndex: 'description',
      key: 'description',
      width: 120,
    },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return (
          <a onClick={() => this.setState({ show: true, record })}>编辑</a>
        )
      },
    },
  ]
  const actionBar = [
    <Button type="primary" size="small" onClick={() => this.setState({ show: true })}>添加字典</Button>,
  ]
    // 表格参数
    const tableProps = {
      total,
      ...page,
      columns,
      data: list,
      rowKey: 'autoNo',
      actionBar,
      dispatch: this.props.dispatch,
      loading,
      namespace: 'dictionary',
      searchParam,
      searchBar,
    }

    return (
      <div>
        <div className={styles.tableList}>
          <PublicTable {...tableProps} />
        </div>
        <DicModal show={this.state.show} record={this.state.record} hideModal={() => this.setState({ show: false, record: {} })} />
      </div>
    )
  }
}
