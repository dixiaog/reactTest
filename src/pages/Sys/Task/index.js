/*
 * @Author: jiangteng
 * @Date: 2017-12-22 17:40:30
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-16 15:19:26
 * 任务管理
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Input, Tag } from 'antd'
import PublicTable from '../../../components/PublicTable'
import { shouldUpdate } from '../../../utils/utils'
import TaskModal from './TaskModal'

@connect(state => ({
  task: state.task,
}))
export default class Task extends Component {
  constructor(props) {
    super(props)
    this.state = {
      task: false,
      record: {},
    }
  }

  componentDidMount() {
    if (shouldUpdate()) {
      this.props.dispatch({ type: 'task/fetch' })
    }
  }

  render() {
    const { list, total, loading, page, searchParam } = this.props.task
    const searchBar = [ // 搜索栏
      {
        decorator: 'jobname',
        components: (<Input placeholder="请输入任务名称" size="small" />),
      },
    ]
    const actionBar = [
      <Button type="primary" size="small" onClick={() => this.setState({ task: true })}>添加任务</Button>,
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
      title: '任务名称',
      dataIndex: 'jobname',
      key: 'jobname',
      width: 120,
    },
    {
      title: '任务组',
      dataIndex: 'jobgroup',
      key: 'jobgroup',
      width: 120,
    },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return (
          <a onClick={() => this.setState({ task: true, record })}>编辑</a>
        )
      },
    },
    {
      title: '启用状态',
      dataIndex: 'enable',
      key: 'enable',
      width: 100,
      render: (text) => {
        if (text) {
          return <Tag color="#108ee9">启用</Tag>
        } else {
          return <Tag color="#f50">禁用</Tag>
        }
      },
    },
    {
      title: '表达式',
      dataIndex: 'cronexpression',
      key: 'cronexpression',
      width: 120,
    },
    {
      title: '类名',
      dataIndex: 'classname',
      key: 'classname',
      width: 120,
    },
    {
      title: '方法名',
      dataIndex: 'methodname',
      key: 'methodname',
      width: 120,
    },
  ]
    // 表格参数
    const tableProps = {
      total,
      ...page,
      columns,
      data: list,
      rowKey: 'id',
      actionBar,
      dispatch: this.props.dispatch,
      loading,
      namespace: 'task',
      searchParam,
      searchBar,
    }

    return (
      <div>
        <PublicTable {...tableProps} />
        <TaskModal show={this.state.task} record={this.state.record} hideModal={() => this.setState({ task: false, record: {} })} />
      </div>
    )
  }
}
