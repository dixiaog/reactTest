/*
 * @Author: tanmengjia
 * @Date: 2018-05-16 09:25:23
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-22 15:37:37
 * 角色列表
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import PublicTable from '../../../components/PublicTable'
import { Input, Divider, message } from 'antd'
import { isRefresh } from '../../../utils/utils'
import AddRoles from './AddRoles'
import DistributePower from './DistributePower'
import styles from '../sys.less'
import ButtonExt from '../../../components/ButtonExt/index'

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
    if (isRefresh()) {
      this.props.dispatch({ type: 'role/search' })
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
    const { list, total, page, loading, searchParam, selectedRows, selectedRowKeys } = this.props.role
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
        width: 120,
      },
      {
        title: '角色名称',
        dataIndex: 'title',
        key: 'title',
        width: 120,
      },
      {
        title: '资源',
        dataIndex: 'powerlist',
        key: 'powerlist',
        width: 550,
      },
      {
        title: '操作',
        dataIndex: 'do',
        key: 'do',
        // width: 100,
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
    const buttonValues = {
      name: '删除角色',
      clickAct: () => message.success(`删除角色${selectedRowKeys}`),
      isAlert: !selectedRows.length,
      alertMsg: '请选择角色',
      type: 'default'
    }
    const buttonRole = {
      name: '添加角色',
      clickAct: () => this.setState({ roleVisible: true }),
    }
    const actionBar = [
      <ButtonExt {...buttonRole}/>,
      <ButtonExt {...buttonValues}/>,
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
      scoll: { x: 950 }
    }
    return (
      <div>
        <div className={styles.tableList}>
          <PublicTable {...tableProps} />
        </div>
        {this.state.roleVisible ? <AddRoles roleVisible={this.state.roleVisible} record={this.state.record} hideModal={() => this.setState({ roleVisible: false, record: null })} /> : null}
        {this.state.powerVisible ? <DistributePower powerVisible={this.state.powerVisible} record={this.state.record} hideModal={() => this.setState({ powerVisible: false, record: null })} /> : null}
      </div>
    )
  }
}
