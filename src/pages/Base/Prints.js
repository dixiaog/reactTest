/*
 * @Author: chenjie
 * @Date: 2017-12-16 17:15:04
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-10 10:34:33
 * 打印模版
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Select, Button, Input, Divider, Checkbox } from 'antd'
import styles from './Base.less'
import Jtable from '../../components/JcTable'
import SearchBar from '../../components/SearchBar'
import PrintModal from './PrintModal'
import { getLocalStorageItem } from '../../utils/utils'

const Option = Select.Option
@connect(state => ({
    prints: state.prints,
    printModifyView: state.printModifyView,
}))
export default class Prints extends Component {
  constructor(props) {
    super(props)
    this.state = {
      itemModalVisiable: false,
      power: {},
    }
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'prints/fetch',
    })
  }
  editModal = (power) => {
    this.setState({
      itemModalVisiable: true,
      power,
    })
  }
  editTemp = (record) => {
    this.props.dispatch({
      type: 'prints/temp',
      payload: { autoNo: record.autoNo },
    })
  }
  popConfirm = (e) => {
    this.props.dispatch({
      type: 'prints/delete',
        payload: {
          id: e.id,
        },
    })
  }

  render() {
    const { list, total, loading, selectedRows, selectedRowKeys, page, searchParam, types } = this.props.prints
    const searchBarItem = [
      {
        decorator: 'templateName',
        components: <Input placeholder="模板名称" size="small" />,
      },
      {
        decorator: 'templateType',
        components: (
          <Select placeholder="模版类型" size="small" style={{ marginTop: 4 }}>
            { types.length ? types.map((item, index) => <Option value={item.templateType} key={index}>{item.templateName}</Option>) : '' }
          </Select>),
      },
    ]
    // 操作栏
    const tabelToolbar = [
      <Button key={2} premission="PRINT_SAVE_EDIT" icon="plus" type="primary" size="small" onClick={() => { this.setState({ itemModalVisiable: true }) }} >新增模版</Button>,
      <Button
        key={1}
        premission="PRINT_ISDEFAULT"
        type="primary"
        size="small"
        onClick={() => {
          this.props.dispatch({
            type: 'prints/isDefault',
            payload: {
              templateType: selectedRows[0].templateType,
            },
          })
        }} >设为默认模版</Button>,
    ]
    const columns = [{
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      width: 80,
      render: (text, record, index) => {
        return (<span>{index + 1}</span>)
      },
    }, {
      title: '模板名称',
      dataIndex: 'templateName',
      key: 'templateName',
      width: 140,
    }, {
      title: '模板类型',
      dataIndex: 'templateType',
      key: 'templateType',
      width: 140,
      render: (text) => {
        return this.props.prints.types.filter(e=>e.templateType * 1 === text * 1)[0].templateName
      },
    }, {
      title: '默认模板',
      dataIndex: 'isDefault',
      key: 'isDefault',
      width: 140,
      render: (text) => {
        return <Checkbox checked={text} />
      },
    },
    // {
    //   title: '属性',
    //   dataIndex: 'companyNo',
    //   key: 'companyNo',
    //   width: 140,
    //   className: styles.columnLeft,
    //   render: (text) => {
    //     if (text === 0) {
    //       return <Tag color="#108ee9">系统模版</Tag>
    //     } else {
    //       return <Tag color="#87d068">自定义模版</Tag>
    //     }
    //   },
    // }, 
    {
      title: '操作',
      dataIndex: 'opreation',
      key: 'opreation',
      width: 140,
      className: styles.columnCenter,
      render: (text, record) => {
        return (
          <span>
            <a href={`/#/print/printModifyView?autoNo=${record.autoNo}`} target="_blank" onClick={this.editTemp.bind(this, record)}>编辑打印模板</a>
            {getLocalStorageItem('companyNo') * 1 === 0 ? <span><Divider type="vertical" /><a onClick={this.editModal.bind(this, record)}>编辑</a></span> : null}
          </span>
        )
      },
    }]
    // 表格参数
    const tableProps = {
      toolbar: tabelToolbar,
      dataSource: list,
      total,
      ...page,
      loading,
      columns,
      nameSpace: 'prints',
      tableName: 'printsTable',
      dispatch: this.props.dispatch,
      selectedRows,
      selectedRowKeys,
      rowKey: 'autoNo',
      rowSelection: { type: 'radio' },
    }
    // 搜索栏参数
    const searchBarProps = {
      colItems: searchBarItem,
      dispatch: this.props.dispatch,
      nameSpace: 'prints',
      searchParam,
    }
    // 添加|编辑Modal参数
    const powerModalProps = {
      itemModalVisiable: this.state.itemModalVisiable,
      dispatch: this.props.dispatch,
      itemModalHidden: () => {
        this.setState({
          itemModalVisiable: false,
          power: {},
        })
      },
      power: this.state.power,
    }
    return (
      <div>
        <div className={styles.contentBoard}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <SearchBar {...searchBarProps} />
            </div>
            <Jtable {...tableProps} />
          </div>
        </div>
        <PrintModal {...powerModalProps} />
      </div>)
  }
}
