/*
 * @Author: jiangteng
 * @Date: 2017-12-22 17:40:30
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-14 10:40:33
 * 供销-财务-授信管理
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Input, Tag, Select, Popconfirm } from 'antd'
import moment from 'moment'
import styles from '../SupplySell.less'
import SearchBar from '../../../components/SearchBar'
import Jtable from '../../../components/JcTable'
import AuthorizedModal from './AuthorizedModal'
import { editAutStatus, exportData, getCreditLineByAutoNo } from '../../../services/supplySell/authorized'
import { checkPremission, checkNumeral, effectFetch } from '../../../utils/utils'

const Option = Select.Option

@connect(state => ({
  authorized: state.authorized,
}))
export default class AuthorizedCredit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      one: true,
      two: true,
      three: true,
      four: true,
      five: true,
      record: {},
    }
  }
  componentDidMount() {
    // this.props.dispatch({ type: 'authorized/fetch' })
    effectFetch('authorized', this.props.dispatch)
  }
  componentWillReceiveProps(nextProps) {
    const data = nextProps.authorized.selectedRows
    if (data.length) {
      const one = data[0].status === 0 ? false : !false
      const two = data[0].status === 0 ? false : !false
      const three = data[0].status === 1 ? false : !false
      const four = data[0].status === 2 ? false : !false
      const five = (data[0].status === 0 || data[0].status === 1 || data[0].status === 2) ? false : !false
      this.setState({
        one,
        two,
        three,
        four,
        five,
      })
    }
  }
  editStatus = (status) => {
    editAutStatus(Object.assign({ status, autoNo: this.props.authorized.selectedRows[0].autoNo })).then((json) => {
      if (json) {
        this.setState({
          one: true,
          two: true,
          three: true,
          four: true,
          five: true,
        })
        this.props.dispatch({
          type: 'authorized/changeState',
          payload: { selectedRowKeys: [], selectedRows: [] },
        })
        this.props.dispatch({
          type: 'authorized/search',
        })
      }
    })
  }
  exportData = () => {
    exportData(this.props.authorized.searchParam)
  }
  render() {
    const { list, total, loading, selectedRows, selectedRowKeys, page, searchParam } = this.props.authorized
    const searchBarItem = [ // 搜索栏
      {
        decorator: 'distributorName',
        components: (<Input placeholder="分销商名称" size="small" />),
      },
      {
        decorator: 'status',
        components: (
          <Select placeholder="选择状态" size="small">
            <Option value="0">待审核</Option>
            <Option value="1">已生效</Option>
            <Option value="2">已冻结</Option>
            <Option value="3">已作废</Option>
            <Option value="4">审核未通过</Option>
          </Select>),
      },
    ]

    const searchBarProps = {
      colItems: searchBarItem,
      dispatch: this.props.dispatch,
      nameSpace: 'authorized',
      searchParam,
    }

    // 操作栏
    const tabelToolbar = [
      <Button premission="SUPPLYSELL_AUTHORIZE" type="primary" size="small" onClick={() => { this.setState({ authorizedModal: true }) }}>新增授信</Button>,
      <Popconfirm premission="SUPPLYSELL_STATUS" onConfirm={this.editStatus.bind(this, '1')} placement="top" title="确定审核生效?" okText="确定" cancelText="取消">
        <Button type="primary" size="small" disabled={this.state.one}>审核生效</Button>
      </Popconfirm>,
      <Popconfirm premission="SUPPLYSELL_STATUS" onConfirm={this.editStatus.bind(this, '4')} placement="top" title="确定审核拒绝?" okText="确定" cancelText="取消">
        <Button type="primary" size="small" disabled={this.state.two}>审核拒绝</Button>
      </Popconfirm>,
      <Popconfirm premission="SUPPLYSELL_STATUS" onConfirm={this.editStatus.bind(this, '2')} placement="top" title="确定冻结?" okText="确定" cancelText="取消">
        <Button type="primary" size="small" disabled={this.state.three}>冻结</Button>
      </Popconfirm>,
      <Popconfirm premission="SUPPLYSELL_STATUS" onConfirm={this.editStatus.bind(this, '1')} placement="top" title="确定解除冻结?" okText="确定" cancelText="取消">
        <Button type="primary" size="small" disabled={this.state.four}>解除冻结</Button>
      </Popconfirm>,
      <Popconfirm premission="SUPPLYSELL_STATUS" onConfirm={this.editStatus.bind(this, '3')} placement="top" title="确定作废单据?" okText="确定" cancelText="取消">
        <Button type="primary" size="small" disabled={this.state.five}>作废</Button>
      </Popconfirm>,
      <Button premission="SUPPLYSELL_EXPORT" type="primary" onClick={this.exportData} size="small">导出</Button>,
    ]
    const columns = [{
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      width: 40,
      className: styles.columnLeft,
      render: (text, record, index) => {
        return (
          <span>
            {index + 1}
          </span>
          )
        },
    },
    {
      title: '分销商编号',
      dataIndex: 'distributorNo',
      key: 'distributorNo',
      width: 65,
      className: styles.columnLeft,
    },
    {
      title: '分销商名称',
      dataIndex: 'distributorName',
      key: 'distributorName',
      width: 120,
      className: styles.columnLeft,
    },
    {
      title: '操作',
      key: 'operation',
      className: styles.columnLeft,
      width: 40,
      render: (text, record) => {
        return (
          <div>
            {checkPremission('SUPPLYSELL_EDIT') ?
              <a onClick={() => {
                getCreditLineByAutoNo({ autoNo: record.autoNo }).then((json) => {
                  if (json) {
                    this.setState({ authorizedModal: true, record: json })
                  }
                })
              }}
              >
              编辑
              </a> : null }
          </div>)
      },
    },
    {
      title: '授信日期',
      dataIndex: 'creditTime',
      key: 'creditTime',
      className: styles.columnLeft,
      width: 80,
      render: text => (moment(text).format('YYYY-MM-DD')),
    },
    {
      title: '过期日期',
      dataIndex: 'expireTime',
      key: 'expireTime',
      width: 80,
      className: styles.columnLeft,
      render: text => (moment(text).format('YYYY-MM-DD')),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      className: styles.columnLeft,
      render: (text) => {
        switch (text) {
        case 0:
          return <Tag color="#87d068">等待审核</Tag>
        case 1:
          return <Tag color="#2db7f5">已生效</Tag>
        case 2:
          return <Tag color="green">已冻结</Tag>
        case 3:
          return <Tag color="#f50">已作废</Tag>
        default:
          return <Tag color="#f50">审核未通过</Tag>
        }
      },
    },
    {
      title: '授信金额',
      dataIndex: 'creditAmount',
      key: 'creditAmount',
      width: 100,
      className: styles.columnLeft,
      render: (text) => {
        return checkNumeral(text)
      },
    },
    {
      title: '自动过期',
      dataIndex: 'autoExpire',
      key: 'autoExpire',
      width: 60,
      className: styles.columnLeft,
      render: (text) => {
        switch (text) {
        case 0:
          return '否'
        default:
          return '是'
        }
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 150,
      className: styles.columnLeft,
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
      nameSpace: 'authorized',
      dispatch: this.props.dispatch,
      selectedRows,
      selectedRowKeys,
      rowKey: 'autoNo',
      tableName: 'authorizedTable',
      rowSelection: { type: 'radio' },
      scroll: { x: 1100 },
    }
    const authorizedModalProps = {
      show: this.state.authorizedModal,
      hideModal: () => { this.setState({ authorizedModal: false, record: {} }) },
      record: this.state.record,
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
        <AuthorizedModal {...authorizedModalProps} />
      </div>
    )
  }
}
