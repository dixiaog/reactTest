/*
 * @Author: jiangteng
 * @Date: 2017-12-22 17:40:30
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-04-18 16:13:53
 * 数据字典资料维护
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Card, Button, Input, Divider, Select, Popconfirm } from 'antd'
import styles from '../System.less'
import SearchBar from '../../../components/SearchBar'
import Jtable from '../../../components/JcTable'
import AddDictionary from './AddDictionary'
import EditDictionary from './EditDictionary'
import { checkPremission } from '../../../utils/utils'
import { gitByAutoNo } from '../../../services/system'

const Option = Select.Option

const delText = '你确定要删除这行内容?'
@connect(state => ({
    dictionary: state.dictionary,
}))
export default class Dictionary extends Component {
  constructor(props) {
    super(props)
    this.state = {
        showAdd: false,
        showEdit: false,
        editRecord: {},
    }
  }

  componentDidMount() {
    this.props.dispatch({ type: 'dictionary/fetch' })
  }

  // 添加权限
  addDictionary = () => {
      this.setState({
          showAdd: true,
      })
  }

  // 删除操作
  confirm = (autoNo) => {
      this.props.dispatch({
        type: 'dictionary/delete',
        payload: autoNo,
      })
  }

   // 编辑操作
   editHandler = (record) => {
    gitByAutoNo({ autoNo: record.autoNo }).then((json) => {
      if (json) {
        this.setState({
          editRecord: json,
          showEdit: true,
      })
      }
    })
   }

  // 隐藏Modal
   hideModal = () => {
       this.setState({
           showAdd: false,
           showEdit: false,
       })
   }

   renderType = (ele) => {
    return <Option value={ele.dictType} key={ele.dictType}>{ele.typeName}</Option>
  }

  render() {
    const { list, total, loading, selectedRows, selectedRowKeys, page, searchParam, types } = this.props.dictionary
    const searchBarItem = [ // 搜索栏
      {
        decorator: 'dictType',
        components: (
          <Select style={{ marginTop: '4px' }} size="small" placeholder="请选择字典类别">
            { types.length ? types.map(ele => this.renderType(ele)) : '' }
          </Select>),
      },
      {
        decorator: 'itemName',
        components: (<Input placeholder="请选择字典名称" size="small" />),
      },
    ]
    const searchBarProps = {
      colItems: searchBarItem,
      dispatch: this.props.dispatch,
      nameSpace: 'dictionary',
      searchParam,
    }

    // 操作栏
    const tabelToolbar = [
      <Button key={1} premission="DICTIONARY_ADD" icon="plus" type="primary" size="small" onClick={this.addDictionary.bind(this)} >添加字典</Button>,
      ]
    const columns = [{
      title: '编号',
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
      title: '类别',
      dataIndex: 'typeName',
      key: 'dictType',
      width: 120,
    },
    {
      title: '自主编号',
      dataIndex: 'itemNo',
      key: 'itemNo',
      width: 120,
    },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => {
        return (
          <div>
            {
            checkPremission('DICTIONARY_DELETE') ?
              <span>
                <Popconfirm placement="top" title={delText} onConfirm={this.confirm.bind(this, record.autoNo)} okText="确定" cancelText="取消">
                  <a>删除</a>
                </Popconfirm><Divider type="vertical" />
              </span> : null
            }
            {checkPremission('DICTIONARY_EDIT') ?
              <a onClick={this.editHandler.bind(this, record)}>编辑</a> : null }
          </div>)
      },
    },
    {
      title: '名称',
      dataIndex: 'itemName',
      key: 'itemName',
      width: 120,
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 120,
      render: text => (moment(text).format('YYYY-MM-DD')),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 120,
    },
  ]
    // 表格参数
    const tableProps = {
      noSelected: true,
      rowSelection: {
        hideDefaultSelections: true,
      },
      toolbar: tabelToolbar,
      dataSource: list,
      total,
      ...page,
      loading,
      columns,
      nameSpace: 'dictionary',
      dispatch: this.props.dispatch,
      selectedRows,
      selectedRowKeys,
      rowKey: 'autoNo',
      tableName: 'dictionaryTable',
      scroll: { x: 1300 },
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
        <AddDictionary show={this.state.showAdd} hideModal={this.hideModal} />
        <EditDictionary show={this.state.showEdit} hideModal={this.hideModal} record={this.state.editRecord} />
      </div>
    )
  }
}
