/*
 * @Author: chenjie
 * @Date: 2017-12-22 17:40:30
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-14 10:30:03
 * 收款管理
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import numeral from 'numeral'
import update from 'immutability-helper'
import { Button, Divider, Popconfirm, Tag, Input, DatePicker, Select } from 'antd'
import SearchBar from '../../../components/SearchBar'
import Jtable from '../../../components/JcTable'
import config from '../../../utils/config'
import styles from '../Order.less'
import ReceivablesModal from './ReceivablesModal'
import {  updateStatusPass, updateStatusNotPass, repealStatus, selectByAutoNo } from '../../../services/order/receivables'
import { effectFetch } from '../../../utils/utils'

const Option = Select.Option
@connect(state => ({
  receivables: state.receivables,
}))
export default class Power extends Component {
  constructor(props) {
    super(props)
    this.state = {
      startValue: null,
      endValue: null,
      modalVisible: false,
      record: {},
      list: [],
    }
  }

  componentDidMount() {
    // this.props.dispatch({ type: 'receivables/fetch' })
    // const { receivables } = getOtherStore()
    // if (!receivables || receivables.list.length === 0) {
    //   this.props.dispatch({ type: 'receivables/fetch' })
    // }
    effectFetch('receivables', this.props.dispatch)
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.receivables.list.length) {
      this.setState({
        list: nextProps.receivables.list,
      })
    } else {
      this.setState({
        list: [],
      })
    }
    const { startValue, endValue} = this.state
    const { billDateFirst, billDateEnd } = nextProps.receivables.searchParam
    if (moment(startValue).format('YYYY-MM-DD') !== billDateFirst ||
      moment(endValue).format('YYYY-MM-DD') !== billDateEnd){
        this.setState({
          startValue: moment(billDateFirst),
          endValue: moment(billDateEnd),
        })
    }
    
  }
  onStartChange = (value) => {
    this.setState({
      startValue: value,
    })
  }
  onEndChange = (value) => {
    this.setState({
      endValue: value,
    })
  }
  handdlePass = () => {
    const { selectedRowKeys } = this.props.receivables
    updateStatusPass({
      autoNo: selectedRowKeys[0],
      status: 1,
     }).then((json) => {
       const index = this.state.list.findIndex(e => e.autoNo === selectedRowKeys[0])
       if (json) {
        this.setState(update(this.state, {
          list: { [index] :{ $merge: { status: 1 } }},
        }))
       }
     })
    // this.props.dispatch({
    //   type: 'receivables/pass',
    //   payload: {
    //     autoNo: selectedRowKeys[0],
    //     status: 1,
    //    },
    // })
  }
  handdleNotPass = () => {
    const { selectedRowKeys } = this.props.receivables
    updateStatusNotPass({
      autoNo: selectedRowKeys[0],
      status: 2,
     }).then((json) => {
       const index = this.state.list.findIndex(e => e.autoNo === selectedRowKeys[0])
       if (json) {
        this.setState(update(this.state, {
          list: { [index] :{ $merge: { status: 2 } }},
        }))
       }
     })
    // this.props.dispatch({
    //   type: 'receivables/notPass',
    //   payload: {
    //     autoNo: selectedRowKeys[0],
    //     status: 2,
    //    },
    // })
  }
  handdleRepeal = () => {
    const { selectedRowKeys } = this.props.receivables
    repealStatus({
      autoNo: selectedRowKeys[0],
      status: 3,
     }).then((json) => {
       const index = this.state.list.findIndex(e => e.autoNo === selectedRowKeys[0])
       if (json) {
        this.setState(update(this.state, {
          list: { [index] :{ $merge: { status: 2 } }},
        }))
       }
     })
    // this.props.dispatch({
    //   type: 'receivables/repeal',
    //   payload: {
    //     autoNo: selectedRowKeys[0],
    //     status: 3,
    //    },
    // })
  }
  editHandler = (record) => {
    selectByAutoNo({
      autoNo: record.autoNo,
    }).then((data) => {
      this.setState({
        modalVisible: true,
        record: data,
      })
    })
  }
  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue
    if (!startValue || !endValue) {
      return false
    }
    return startValue.valueOf() > endValue.valueOf()
  }

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue
    if (!endValue || !startValue) {
      return false
    }
    return endValue.valueOf() <= startValue.valueOf()
  }

  // 删除操作
  confirm = (id) => {
    this.props.dispatch({
      type: 'receivables/delete',
      payload: { autoNos: [id] },
    })
  }
  render() {
    const { list } = this.state
    const { total, loading, selectedRows, selectedRowKeys, page, searchParam } = this.props.receivables
    const searchBarItem = [
      // 搜索栏
      {
        decorator: 'innerNo',
        components: <Input placeholder="订单编号" size="small" />,
      },
      {
        decorator: 'siteBuyerNo',
        components: <Input placeholder="付款方" size="small" />,
      },
      {
        decorator: 'billDateFirst',
        components: (
          <DatePicker
            size={config.InputSize}
            disabledDate={this.disabledStartDate}
            placeholder="单据日期起"
            onChange={this.onStartChange}
            // onOpenChange={this.handleStartOpenChange}
          />
        ),
      },
      {
        decorator: 'billDateEnd',
        components: (
          <DatePicker
            size={config.InputSize}
            disabledDate={this.disabledEndDate}
            placeholder="单据日期讫"
            onChange={this.onEndChange}
            // onOpenChange={this.handleStartOpenChange}
          />
        ),
      },
      {
        decorator: 'status',
        components: (
          <Select placeholder="请选择状态" size="small" style={{ marginTop: 4 }}>
            <Option value={0}>待审核</Option>
            <Option value={1}>已审核</Option>
            <Option value={3}>作废</Option>
            <Option value={2}>审核不通过</Option>
          </Select>
        ),
      },
    ]
    const searchBarProps = {
      colItems: searchBarItem,
      dispatch: this.props.dispatch,
      nameSpace: 'receivables',
      searchParam,
      requestParam: {
        fundType: '0',
      },
    }

    // 操作栏
    const tabelToolbar = [
      <Popconfirm key={1} premission="ORDRECEIVE_PASS" placement="top" title="确定审核通过该数据？" onConfirm={this.handdlePass} okText="确定" cancelText="取消">
        <Button disabled={selectedRowKeys.length === 0 || selectedRows[0].status * 1 !== 0} size={config.InputSize} type="primary">
          审核通过
        </Button>
      </Popconfirm>,
      <Popconfirm key={2} premission="ORDRECEIVE_NOT_PASS" placement="top" title="确定审核不通过该数据？" onConfirm={this.handdleNotPass} okText="确定" cancelText="取消">
        <Button disabled={selectedRowKeys.length === 0 || selectedRows[0].status * 1 !== 0} size={config.InputSize} type="primary">
          审核不通过
        </Button>
      </Popconfirm>,
      <Popconfirm key={3} premission="ORDRECEIVE_REPEAL" placement="top" title="确定作废该数据？" onConfirm={this.handdleRepeal} okText="确定" cancelText="取消">
        <Button disabled={selectedRowKeys.length === 0 || selectedRows[0].status * 1 !== 0} size={config.InputSize} type="primary">
          作废
        </Button>
      </Popconfirm>,
    ]
    const columns = [
      {
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        width: 120,
        render: (text, record, index) => {
          return <span>{index + 1}</span>
        },
      },
      {
        title: '单据编号',
        dataIndex: 'billNo',
        key: 'billNo',
        width: 200,
      },
      {
        title: '单据时间',
        dataIndex: 'billDate',
        key: 'billDate',
        width: 120,
        render: text => moment(text).format('YYYY-MM-DD'),
      },
      {
        title: '操作',
        key: 'operation',
        width: 100,
        render: record => {
          if (record.status === 0) {
            return (
              <span>
                <Popconfirm placement="top" title="确定要删除这行嘛？" onConfirm={this.confirm.bind(this, record.autoNo)} okText="确定" cancelText="取消">
                  <a>删除</a>
                </Popconfirm>
                <Divider type="vertical" />
                <a onClick={this.editHandler.bind(this, record)}>编辑</a>
              </span>
            )
          } else {
            return null
          }
        }, 
      },
      {
        title: '订单号',
        dataIndex: 'innerNo',
        key: 'innerNo',
        width: 120,
      },
      {
        title: '付款方',
        dataIndex: 'siteBuyerNo',
        key: 'siteBuyerNo',
        width: 120,
      },
      {
        title: '金额',
        dataIndex: 'amount',
        key: 'amount',
        width: 120,
        className: styles.columnRight,
        render: (text) => {
          return numeral(text).format('0,0.00')
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 150,
        render: (text) => {
          switch (text * 1) {
            case 0:
              return <Tag>待审核</Tag>
            case 1:
              return <Tag>已审核</Tag>
            case 2:
              return <Tag>审核未通过</Tag>
            case 3:
              return <Tag>作废</Tag>
            default:
              break
          }
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 200,
      },
      {
        title: '创建人',
        dataIndex: 'createUser',
        key: 'createUser',
        width: 120,
      },
      {
        title: '修改时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        width: 120,
        render: text => moment(text).format('YYYY-MM-DD'),
      },
    ]
    // 表格参数
    const tableProps = {
      // noSelected: true,
      rowSelection: {
        type: 'radio',
      },
      toolbar: tabelToolbar,
      dataSource: list,
      total,
      ...page,
      loading,
      columns,
      nameSpace: 'receivables',
      tableName: 'receivablesTable',
      dispatch: this.props.dispatch,
      selectedRows,
      selectedRowKeys,
      rowKey: 'autoNo',
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
        <ReceivablesModal
          dispatch={this.props.dispatch}
          visible={this.state.modalVisible}
          hidden={() => {
            this.setState({ modalVisible: false })
          }}
          record={this.state.record}
        />
      </div>
    )
  }
}
