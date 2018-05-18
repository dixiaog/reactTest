import React, { Component } from 'react'
import { connect } from 'dva'
import PublicTable from '../../../components/PublicTable'
import { Tag, Button, Input } from 'antd'
import { isRefresh } from '../../../utils/utils'
import Role from './Role'
import styles from '../base.less'

@connect(state => ({
  user: state.user,
}))
export default class User extends Component {
  constructor(props) {
    super(props)
    this.state = {
      role: false,
    }
  }
  componentDidMount() {
    if (isRefresh()) {
      this.props.dispatch({ type: 'user/fetch' })
    }
  }

  render() {
    const { list, total, page, selectedRows, loading, searchParam } = this.props.user
    const columns = [{
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        width: 60,
        render: (text, record, index) => {
          return (
            <span>
              {index + 1}
            </span>
            )
          },
      },
      {
        title: '人员编号',
        dataIndex: 'id',
        key: 'id',
        width: 60,
      },
      {
        title: '昵称',
        dataIndex: 'nickName',
        key: 'nickName',
        width: 100,
      },
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
        width: 100,
      },
      {
        title: '角色',
        dataIndex: 'rolelist',
        key: 'rolelist',
        width: 100,
      },
      {
        title: '部门',
        dataIndex: 'deptId',
        key: 'deptId',
        width: 100,
      },
      {
        title: '手机',
        dataIndex: 'mobile',
        key: 'mobile',
        width: 100,
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
        width: 100,
      },
      {
        title: '状态',
        dataIndex: 'enable',
        key: 'enable',
        width: 80,
        render: (text) => {
          if (text) {
            return <Tag color="#108ee9">启用</Tag>
          } else {
            return <Tag color="#f50">禁用</Tag>
          }
        },
      },
    ]
    const actionBar = [
      <Button type="primary" size="small" disabled={!selectedRows.length} onClick={() => this.setState({ role: true })}>角色分配</Button>,
    ]
    const searchBar = [
      {
        decorator: 'username',
        components: (<Input placeholder="请输入用户名" size="small" />),
      },
    ]
    const tableProps = {
      total,
      ...page,
      columns,
      data: list,
      rowKey: 'id',
      actionBar,
      dispatch: this.props.dispatch,
      loading,
      namespace: 'user',
      searchParam,
      searchBar,
    }
    return (
      <div>
        <div className={styles.tableList}>
          <PublicTable {...tableProps} />
        </div>
        <Role show={this.state.role} hideModal={() => this.setState({ role: false })} />
      </div>
    )
  }
}
