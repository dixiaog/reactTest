/*
 * @Author: jiangteng
 * @Date: 2017-12-22 17:40:30
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-14 10:43:57
 * 供销-供销商主页面
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Tag } from 'antd'
import styles from '../SupplySell.less'
import Jtable from '../../../components/JcTable'
import EditRemark from './EditRemark'
import EditAcronyms from './EditAcronyms'
import { effectFetch } from '../../../utils/utils'

@connect(state => ({
  supplierlist: state.supplierlist,
}))
export default class Supplierlist extends Component {
  constructor(props) {
    super(props)
    this.state = {
      record: {},
      remark: false,
      acronyms: false,
    }
  }

  componentDidMount() {
    // const { supplierlist } = getOtherStore()
    // if (!supplierlist || supplierlist.list.length === 0) {
    //   this.props.dispatch({ type: 'supplierlist/fetch' })
    // }
    effectFetch('supplierlist', this.props.dispatch)
  }

  render() {
    const { list, total, loading, selectedRows, selectedRowKeys, page } = this.props.supplierlist
    // 操作栏
    const tabelToolbar = [
      <Button key={1} type="primary" premission="SUPPLIERLIST_REMARK" disabled={!list.length} size="small" onClick={() => { this.setState({ remark: true, record: list[0] }) }}>修改备注</Button>,
      <Button key={2} type="primary" premission="SUPPLIERLIST_ACRONYM" disabled={!list.length} size="small" onClick={() => { this.setState({ acronyms: true, record: list[0] }) }}>修改助记符</Button>,
     ]
    const columns = [{
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      width: 80,
      className: styles.columnCenter,
      render: (text, record, index) => {
        return (
          <span>
            {index + 1}
          </span>
          )
        },
    },
    {
      title: '供销商',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 120,
      className: styles.columnCenter,
    },
    {
      title: '供销商代号',
      dataIndex: 'supplierNo',
      key: 'supplierNo',
      width: 120,
      className: styles.columnCenter,
    },
    {
      title: '分销等级',
      dataIndex: 'distributorLevel',
      key: 'distributorLevel',
      width: 120,
      className: styles.columnCenter,
    },
    {
      title: '助记符',
      dataIndex: 'supplierAcronyms',
      key: 'supplierAcronyms',
      width: 120,
      className: styles.columnCenter,
    },
    {
      title: '分销商备注',
      dataIndex: 'supplierRemark',
      key: 'supplierRemark',
      width: 120,
      className: styles.columnCenter,
    },
    {
      title: '供销商备注',
      dataIndex: 'distributorRemark',
      key: 'distributorRemark',
      width: 120,
      className: styles.columnCenter,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      className: styles.columnCenter,
      render: (text) => {
        switch (text) {
        case 0:
          return <Tag color="#2db7f5">等待审核</Tag>
        case 1:
          return <Tag color="#87d068">已确认</Tag>
        case 2:
          return <Tag color="green">作废</Tag>
        case 3:
          return <Tag color="#f50">冻结</Tag>
        default:
          return <Tag color="#f50">被拒绝</Tag>
        }
      },
    },
  ]

    // 表格参数
    const tableProps = {
      toolbar: tabelToolbar,
      dataSource: list,
      total,
      ...page,
      loading,
      columns,
      nameSpace: 'supplierlist',
      dispatch: this.props.dispatch,
      selectedRows,
      selectedRowKeys,
      scroll: { x: 1000 },
      rowKey: 'autoNo',
      tableName: 'supplierlistTable',
      noSelected: true,
    }
    const remarkProps = {
      show: this.state.remark,
      hideModal: () => { this.setState({ remark: false }) },
      record: this.state.record,
    }
    const acronymsProps = {
      show: this.state.acronyms,
      hideModal: () => { this.setState({ acronyms: false }) },
      record: this.state.record,
    }
    return (
      <div>
        <div className={styles.contentBoard}>
          <div className={styles.tableList}>
            <Jtable {...tableProps} />
          </div>
        </div>
        <EditRemark {...remarkProps} />
        <EditAcronyms {...acronymsProps} />
      </div>
    )
  }
}
