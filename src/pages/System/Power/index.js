/*
 * @Author: jiangteng
 * @Date: 2017-12-22 17:40:30
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-14 10:48:01
 * 用户列表
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Card, Button, Input, Divider, Select, Popconfirm } from 'antd'
import styles from '../System.less'
import SearchBar from '../../../components/SearchBar'
import Jtable from '../../../components/JcTable'
import AddPower from './AddPower'
import EditPower from './EditPower'
import { effectFetch } from '../../../utils/utils'

const Option = Select.Option

const text = '你确定要删除这行内容?'
@connect(state => ({
  power: state.power,
}))
export default class Power extends Component {
  constructor(props) {
    super(props)
    this.state = {
        showAdd: false,
        showEdit: false,
        editRecord: {},
    }
  }

  componentDidMount() {
    // const { power } = getOtherStore()
    // if (!power || power.list.length === 0) {
    //   this.props.dispatch({ type: 'power/search' })
    // }
    effectFetch('power', this.props.dispatch)
    // this.props.dispatch({
    //   type: 'power/search',
    // })
  }

  // 添加权限
  addPower = () => {
    this.setState({
      showAdd: true,
    })
  }

  // 删除操作
  confirm = (id) => {
    this.props.dispatch({
      type: 'power/delete',
      payload: { permissionNo: id },
    })
  }

   // 编辑操作
   editHandler = (record) => {
    this.setState({
        editRecord: record,
        showEdit: true,
    })
   }

  // 隐藏Modal
   hideModal = () => {
    this.setState({
      showAdd: false,
      showEdit: false,
    })
   }

  render() {
    const { list, total, loading, selectedRows, selectedRowKeys, page, searchParam, groupList } = this.props.power
    const searchBarItem = [ // 搜索栏
      {
        decorator: 'permissionName',
        components: (<Input placeholder="请输入权限名称" size="small" />),
      },
      {
        decorator: 'permissionGroup',
        components: (
          <Select style={{ marginTop: '4px' }} size="small" placeholder="请选择权限群组">
            { groupList.length ? groupList.map((ele, index) => { return <Option key={index} value={ele}>{ele}</Option> }) : '' }
          </Select>),
      },
    ]
    const searchBarProps = {
      colItems: searchBarItem,
      dispatch: this.props.dispatch,
      nameSpace: 'power',
      searchParam,
    }

    // 操作栏
    const tabelToolbar = [
      <Button key={1} premission="TRUE" icon="plus" type="primary" size="small" onClick={this.addPower.bind(this)} >添加权限</Button>,
    ]
    const columns = [{
      title: '权限编号',
      dataIndex: 'permissionNo',
      key: 'permissionNo',
      width: 60,
    },
    {
      title: '权限名称',
      dataIndex: 'permissionName',
      key: 'permissionName',
      width: 120,
    },
    {
      title: '权限路由',
      dataIndex: 'permissionRoute',
      key: 'permissionRoute',
      width: 120,
    },
    {
      title: '权限群组',
      dataIndex: 'permissionGroup',
      key: 'permissionGroup',
      width: 120,
    },
    {
      title: '权限标题',
      dataIndex: 'permissionTitle',
      key: 'permissionTitle',
      width: 120,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 120,
    },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      render: record => (
        <span>
          <Popconfirm placement="top" title={text} onConfirm={this.confirm.bind(this, record.permissionNo)} okText="确定" cancelText="取消">
            <a>删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a onClick={this.editHandler.bind(this, record)}>编辑</a>
        </span>

      ),
    },
  ]
    // 表格参数
    const tableProps = {
      noSelected: true,
      toolbar: tabelToolbar,
      dataSource: list,
      total,
      ...page,
      loading,
      columns,
      nameSpace: 'power',
      tableName: 'itemCapacityTable',
      dispatch: this.props.dispatch,
      selectedRows,
      selectedRowKeys,
      rowKey: 'permissionNo',
    }

    return (
      <div>
        <Card bordered={false} className={styles.contentBoard}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <SearchBar {...searchBarProps} />
            </div>
            <Jtable {...tableProps} />
          </div>
        </Card>
        <AddPower show={this.state.showAdd} hideModal={this.hideModal} />
        <EditPower show={this.state.showEdit} hideModal={this.hideModal} record={this.state.editRecord} />
      </div>
    )
  }
}
