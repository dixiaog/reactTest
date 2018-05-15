/*
 * @Author: jiangteng
 * @Date: 2018-01-22 09:34:07
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-14 16:41:56
 * 库存--采购入库
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Select, Button, Dropdown, Menu, Icon, message, Divider, Tag, Popover, Popconfirm, DatePicker, Input } from 'antd'
import moment from 'moment'
import SearchBar from '../../../components/SearchBar'
import styles from '../Inventory.less'
import Jtable from '../../../components/JcTable'
import StoragePop from './StoragePop'
import PurchaseBillList from './PurchaseBillList'
import StorageDetails from './StorageDetails'
import NoBillList from './NoBillList'
import EditStorageBill from './EditStorageBill'
import { updateInStorageStaus, exportInStorage } from '../../../services/inventory/storage'
import { checkPremission, effectFetch } from '../../../utils/utils'

const Option = Select.Option
@connect(state => ({
    storage: state.storage,
    storageDetails: state.storageDetails,
    billlist: state.billlist,
    nobill: state.nobill,
}))
export default class Storage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      record: {}, // 记录所选的单据
      billNo: undefined, // 记录点击的单据编号
      flag: true,
      billStatus: true,
      approveStatus: true,
      storageBillList: false, // 控制选择采购单
      showStorageDetails: false, // 控制新增/编辑采购入库单
      noBillList: false, // 控制无采购入库展示
      editStorageBill: false, // 控制编辑入库单页面展示
      selectFlag: true, // 记录选择的是有采购还是无采购
      startValue: null,
      endValue: null,
      endOpen: false,
      value: -1,
    }
  }

  componentDidMount() {
    // this.props.dispatch({ type: 'storage/fetch' })
    effectFetch('storage', this.props.dispatch)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.storage.disabled) {
      this.setState({
        startValue: null,
        endValue: null,
      })
      this.props.dispatch({
        type: 'storage/changeState',
        payload: { disabled: false },
      })
    }
    const data = nextProps.storage.selectedRows
    if (data.length) {
      const billStatus = data[0].billStatus === 0 ? false : !false
      const approveStatus = data[0].approveStatus === 0 && data[0].billStatus === 1 ? false : !false
      this.setState({
        billStatus,
        approveStatus,
      })
    }
  }
  onStartChange = (value) => {
    this.onChange('startValue', value)
  }

  onEndChange = (value) => {
    this.onChange('endValue', value)
  }
  onChange = (field, value) => {
    this.setState({
      [field]: value,
    })
  }
  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue
    if (!endValue || !startValue) {
      return false
    }
    return endValue.valueOf() <= startValue.valueOf()
  }

  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue
    if (!startValue || !endValue) {
      return false
    }
    return startValue.valueOf() > endValue.valueOf()
  }
  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true })
    }
  }
  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open })
  }
  // 导出
  showConfirm = (key) => {
    if (this.props.storage.delicacy) {
      message.warning('精细化管理已开启,无法导出数据')
     } else {
      if (key.key === '1') {
        if (!this.props.storage.selectedRows.length) {
          message.warning('请选择一条数据')
        } else {
          const data = this.props.storage.selectedRows[0]
          const value = {}
          Object.assign(value, {
            billNo: data.billNo,
            approveStatus: data.approveStatus,
            supplierName: data.supplierName,
            remark: data.remark,
            startTime: data.startTime ? data.startTime : null,
            endTime: data.endTime ? data.endTime : null,
          })
          exportInStorage(value)
        }
      } else {
        const value = this.props.storage.searchParam
        exportInStorage(value)
      }
     }
  }

  // 新增采购入库单
  addStorage = (key) => {
    if (this.props.storage.delicacy) {
      message.warning('精细化管理已开启,无法新增入库')
     } else {
      if (key.key === '1') {
        this.props.dispatch({ type: 'billlist/fetch', payload: { billStatus: 1 } })
        this.setState({ storageBillList: true, selectFlag: true })
      } else {
        this.setState({ noBillList: true, selectFlag: false })
        this.props.dispatch({ type: 'storage/save', payload: { purNo: '' } })
      }
     }
  }

  popContent = () => {
    return (
      <div style={{ width: 1000 }}>
        <StoragePop
          record={this.state.record}
          hideModal={() => {
            this.props.dispatch({
              type: 'storageDetails/clean',
              payload: { list: [] },
            })
            this.setState({
              flag: true,
              billNo: null,
              record: {},
            })
          }}
        />
      </div>
    )
  }

  detail = (record) => {
    this.props.dispatch({ type: 'nobill/changeState', payload: { billNo: record.relativeBillNo } })
    this.props.dispatch({ type: 'storage/save', payload: { billNo: record.billNo, purNo: record.relativeBillNo === 0 ? '' : record.relativeBillNo } })
    this.setState({
      showStorageDetails: true,
      record,
      selectFlag: record.billNo ? !false : false,
    })
    this.props.dispatch({ type: 'storageDetails/fetch', payload: { billNo: record.billNo } })
  }

  // 更新状态
  updateInStorageStaus = (status) => {
    if (this.props.storage.delicacy) {
      message.warning('精细化管理已开启,无法变更状态')
     } else {
      updateInStorageStaus(Object.assign({ billNo: this.props.storage.selectedRowKeys[0], status })).then((json) => {
        if (json && json.result) {
          this.props.dispatch({
            type: 'storage/clean',
            payload: { selectedRows: [], selectedRowKeys: [] },
          })
          this.setState({
            billStatus: true,
            approveStatus: true,
          })
          this.props.dispatch({
            type: 'storage/search',
          })
        }
      })
     }
  }
  selectChange = (e) => {
    this.setState({
      value: e,
    })
    this.props.dispatch({
      type: 'storage/changeState',
      payload: { diffSkuNo: e },
    })
  }
  render() {
    const selectAfter = (
      <Select onChange={this.selectChange} value={this.state.value} style={{ width: 100 }}>
        <Option value={-1}>不限</Option>
        <Option value={0}>包含商品</Option>
        <Option value={1}>包含款式</Option>
      </Select>
    )
    const { endOpen } = this.state
    const menu = (
      <Menu onClick={this.showConfirm.bind(this)}>
        <Menu.Item key="1">导出勾选的单据</Menu.Item>
        <Menu.Item key="2">导出所有符合条件的单据</Menu.Item>
      </Menu>
    )
    const add = (
      <Menu onClick={this.addStorage.bind(this)}>
        <Menu.Item key="1">采购入库</Menu.Item>
        <Menu.Item key="2">无采购入库</Menu.Item>
      </Menu>
    )
    const { list, total, loading, selectedRows, selectedRowKeys, page, searchParam } = this.props.storage
    const { warehouses, suppliers } = this.props.storage ? this.props.storage : null
    // 操作栏
    const tabelToolbar = [
      <Dropdown key={1} premission="STORAGE_ADD" overlay={add}>
        <Button type="primary" size="small">
          新增入库 <Icon type="down" />
        </Button>
      </Dropdown>,
      <Button key={2} premission="STORAGE_STATUS" type="primary" size="small" disabled={this.state.billStatus} onClick={this.updateInStorageStaus.bind(this, '1')}>作废</Button>,
      <Button key={3} premission="STORAGE_STATUS" type="primary" size="small" disabled={this.state.billStatus} onClick={this.updateInStorageStaus.bind(this, '2')}>确认入库</Button>,
      <Popconfirm key={4} premission="STORAGE_STATUS" placement="top" title="请确认是否财务审核?" onConfirm={this.updateInStorageStaus.bind(this, '3')} okText="确认" cancelText="取消">
        <Button type="primary" size="small" disabled={this.state.approveStatus}>财务审核</Button>
      </Popconfirm>,
      <Dropdown key={5} premission="STORAGE_EXPORT" overlay={menu}>
        <Button type="primary" size="small">
          导出 <Icon type="down" />
        </Button>
      </Dropdown>,
      ]
      const columns = [{
        title: '编号',
        dataIndex: 'key',
        key: 'key',
        width: 50,
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
        title: '入库单号',
        dataIndex: 'billNo',
        key: 'billNo',
        width: 80,
        className: styles.columnLeft,
        render: (text, record) => (
          <Popover
            visible={record.billNo === this.state.billNo ? !false : false}
            placement="bottomLeft"
            content={this.popContent()}
            trigger="click"
            onVisibleChange={() => {
              if (this.state.flag) {
                this.props.dispatch({ type: 'storageDetails/fetch', payload: { billNo: record.billNo } })
                this.props.dispatch({ type: 'nobill/changeState', payload: { billNo: record.relativeBillNo } })
                this.props.dispatch({ type: 'storage/save', payload: { billNo: record.billNo, purNo: record.relativeBillNo === 0 ? '' : record.relativeBillNo } })
                this.setState({
                  flag: false,
                  billNo: record.billNo,
                  record,
                })
              }
            }}
          >
            <a>{text}</a>
          </Popover>
        ),
      },
      {
        title: '单据日期',
        dataIndex: 'billDate',
        key: 'billDate',
        width: 100,
        className: styles.columnLeft,
        render: text => (moment(text).format('YYYY-MM-DD')),
      },
      {
        title: '采购单号',
        dataIndex: 'relativeBillNo',
        key: 'relativeBillNo',
        width: 80,
        className: styles.columnLeft,
        render: (text) => {
          switch (text) {
          case 0:
            return '无'
          default:
            return text
          }
        },
      },
      {
        title: '供应商',
        dataIndex: 'supplierName',
        key: 'supplierName',
        width: 100,
        className: styles.columnLeft,
      },
      {
        title: '详情',
        dataIndex: 'detail',
        key: 'detail',
        width: 100,
        className: styles.columnLeft,
        render: (text, record) => {
          return (
            <div>
              {
              checkPremission('STORAGE_DETAIL') ?
                <span><a onClick={() => { this.setState({ editStorageBill: true, record }) }}>详情</a><Divider type="vertical" /></span> : null
              }
              {checkPremission('STORAGE_DETAILLIST') ?
                <a onClick={this.detail.bind(this, record)}>
                  明细详情
                </a> : null }
            </div>)
        },
      },
      {
        title: '仓库',
        dataIndex: 'warehouseName',
        key: 'warehouseName',
        width: 100,
        className: styles.columnLeft,
      },
      {
        title: '单据状态',
        dataIndex: 'billStatus',
        key: 'billStatus',
        width: 80,
        className: styles.columnLeft,
        render: (text) => {
          switch (text) {
          case 0:
            return <Tag color="#87d068">待入库</Tag>
          case 1:
            return <Tag color="#2db7f5">已入库</Tag>
          default:
            return <Tag color="red">已作废</Tag>
          }
        },
      },
      {
        title: '入库人',
        dataIndex: 'confirmUser',
        key: 'confirmUser',
        width: 80,
        className: styles.columnLeft,
      },
      {
        title: '财务状态',
        dataIndex: 'approveStatus',
        key: 'approveStatus',
        width: 80,
        className: styles.columnLeft,
        render: (text) => {
          switch (text) {
          case 0:
            return <Tag color="#87d068">未审核</Tag>
          default:
            return <Tag color="#2db7f5">已审核</Tag>
          }
        },
      },
      {
        title: '财审人',
        dataIndex: 'approveUserName',
        key: 'approveUserName',
        width: 80,
        className: styles.columnLeft,
      },
      {
        title: '财审日期',
        dataIndex: 'approveTime',
        key: 'approveTime',
        width: 100,
        className: styles.columnLeft,
        render: (text) => {
          if (text && moment(text).format('YYYY-MM-DD') !== '1899-11-30') {
            return moment(text).format('YYYY-MM-DD')
          } else {
            return ''
          }
        },
      },
      {
        title: '创建人',
        dataIndex: 'createUser',
        key: 'createUser',
        width: 80,
        className: styles.columnLeft,
      },
      {
        title: '修改时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        width: 100,
        className: styles.columnLeft,
        render: (text) => {
          if (text && moment(text).format('YYYY-MM-DD') !== '1899-11-30') {
            return moment(text).format('YYYY-MM-DD')
          } else {
            return ''
          }
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 120,
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
      nameSpace: 'storage',
      dispatch: this.props.dispatch,
      selectedRows,
      selectedRowKeys,
      rowKey: 'billNo',
      tableName: 'storageTable',
      scroll: { x: 1900 },
      rowSelection: { type: 'radio' },
    }
    const searchBarItem = [ // 搜索栏
      {
        decorator: 'startTime',
        components: (<DatePicker
          disabledDate={this.disabledStartDate}
          format="YYYY-MM-DD"
          placeholder="开始时间"
          size="small"
          onChange={this.onStartChange}
          onOpenChange={this.handleStartOpenChange}
        />),
      },
      {
        decorator: 'endTime',
        components: (<DatePicker
          disabledDate={this.disabledEndDate}
          format="YYYY-MM-DD"
          placeholder="结束时间"
          size="small"
          onChange={this.onEndChange}
          open={endOpen}
          onOpenChange={this.handleEndOpenChange}
        />),
      },
      {
        decorator: 'relativeBillNo',
        components: (<Input placeholder="采购单号" size="small" />),
      },
      {
        decorator: 'billStatus',
        components: (
          <Select
            placeholder="单据状态"
            size="small"
          >
            <Option key="0">待入库</Option>
            <Option key="1">已入库</Option>
            <Option key="2">已作废</Option>
          </Select>
        ),
      },
      {
        decorator: 'approveStatus',
        components: (
          <Select
            placeholder="财务状态"
            size="small"
          >
            <Option key="0">未审核</Option>
            <Option key="1">已审核</Option>
          </Select>
        ),
      },
      {
        decorator: 'wareHouse',
        components: (
          <Select
            placeholder="仓库"
            size="small"
          >
            {warehouses && warehouses.length ? warehouses.map(ele => <Option key={ele.warehouseNo}>{ele.warehouseName}</Option>) : ''}
          </Select>
        ),
      },
      {
        decorator: 'supplierName',
        components: (
          <Select
            showSearch
            placeholder="供应商"
            size="small"
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {suppliers && suppliers.length ? suppliers.map(ele => <Option key={ele.supplierNo}>{ele.supplierName}</Option>) : ''}
          </Select>
        ),
      },
      {
        decorator: 'remark',
        components: (<Input placeholder="备注" size="small" />),
      },
      {
        decorator: 'skuNo',
        components: (
          <Input size="small" placeholder="商品/款式编码" addonAfter={selectAfter} style={{ width: 220 }} />
        ),
      },
    ]
    const searchBarProps = {
      colItems: searchBarItem,
      dispatch: this.props.dispatch,
      nameSpace: 'storage',
      searchParam,
    }
    const storageBillList = {
      show: this.state.storageBillList,
      hideModal: () => { this.setState({ storageBillList: false }) },
      showStorageDetails: (billNo) => {
        this.setState({ showStorageDetails: true })
        this.props.dispatch({ type: 'storageDetails/fetch', payload: { billNo } })
      },
    }
    const storageDetails = {
      show: this.state.showStorageDetails,
      hideModal: () => { this.setState({ showStorageDetails: false }) },
      selectFlag: this.state.selectFlag,
      record: this.state.record,
    }
    const noBillList = {
      show: this.state.noBillList,
      hideModal: () => { this.setState({ noBillList: false }) },
      showStorageDetails: (value) => {
        this.setState({ showStorageDetails: true })
        this.props.dispatch({ type: 'storage/save', payload: { billNo: value } })
        this.props.dispatch({ type: 'storage/search' })
        this.props.dispatch({ type: 'storageDetails/fetch', payload: { billNo: value } })
      },
    }
    const editStorageBill = {
      show: this.state.editStorageBill,
      hideModal: () => { this.setState({ editStorageBill: false }) },
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
        {this.state.storageBillList ? <PurchaseBillList {...storageBillList} /> : null}
        <StorageDetails {...storageDetails} />
        <NoBillList {...noBillList} />
        <EditStorageBill {...editStorageBill} />
      </div>
    )
  }
}
