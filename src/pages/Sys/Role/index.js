/*
 * @Author: tanmengjia
 * @Date: 2018-05-16 09:25:23
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-18 13:35:35
 * 角色列表
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import PublicTable from '../../../components/PublicTable'
import { Button, Input, Divider } from 'antd'
import { shouldUpdate } from '../../../utils/utils'
import AddRoles from './AddRoles'
import DistributePower from './DistributePower'

@connect(state => ({
  role: state.role,
}))
export default class Role extends Component {
  constructor(props) {
    super(props)
    this.state = {
      roleVisible: false,
      record: null,
      powerVisible: false,
    }
  }
  componentDidMount() {
    if (shouldUpdate()) {
      this.props.dispatch({ type: 'role/fetch' })
    }
  }
  distribute = (record) => {
    console.log('分配资源', record)
    this.setState({
      record,
      powerVisible: true,
    })
  }
  details = (record) => {
    console.log('详情', record)
    this.setState({
      record,
      roleVisible: true,
    })
  }
  render() {
    const { list, total, page, loading, searchParam } = this.props.role
    //  selectedRows,
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
        title: '角色简称',
        dataIndex: 'roleName',
        key: 'roleName',
        width: 60,
      },
      {
        title: '角色名称',
        dataIndex: 'title',
        key: 'title',
        width: 100,
      },
      {
        title: '资源',
        dataIndex: 'powerlist',
        key: 'powerlist',
        width: 600,
      },
      {
        title: '操作',
        dataIndex: 'do',
        key: 'do',
        width: 100,
        render: (text, record) => {
          return(
            <div>
              <span>
                <a onClick={this.distribute.bind(this, record)}>分配资源</a>
                <Divider type="vertical" />
                <a onClick={this.details.bind(this, record)}>详情</a>
              </span>
            </div>
          )
        }
      },
    ]
    const actionBar = [
      <Button type="primary" size="small" onClick={() => this.setState({ roleVisible: true })}>添加角色</Button>,
    ]
    const searchBar = [
      {
        decorator: 'title',
        components: (<Input placeholder="角色名称" size="small" />),
      },
      {
        decorator: 'roleName',
        components: (<Input placeholder="角色简称" size="small" />),
      },
    ]
    const tableProps = {
      total,
      ...page,
      columns,
      data: list,
      rowKey: 'autoNo',
      actionBar,
      dispatch: this.props.dispatch,
      loading,
      namespace: 'role',
      searchParam,
      searchBar,
    }
    return (
      <div>
        <PublicTable {...tableProps} />
        {this.state.roleVisible ? <AddRoles roleVisible={this.state.roleVisible} record={this.state.record} hideModal={() => this.setState({ roleVisible: false, record: null })} /> : null}
        {this.state.powerVisible ? <DistributePower powerVisible={this.state.powerVisible} record={this.state.record} hideModal={() => this.setState({ powerVisible: false, record: null })} /> : null}
      </div>
    )
  }
}
