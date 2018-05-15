/*
 * @Author: jiangteng
 * @Date: 2018-01-22 09:34:07
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-14 13:44:39
 * 库存--采购管理
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Dropdown, Menu, Icon, message, Divider, Tag, Popover } from 'antd'
import moment from 'moment'
import SearchBar from './SearchBar'
import styles from '../Inventory.less'
import Jtable from '../../../components/JcTable'
import PurModal from './PurModal'
import GoodModal from './GoodModal'
import ProductPop from './ProductPop'
import { updateStatus, purchaseExport, exportAllSku, upload } from '../../../services/inventory/manager'
import { checkPremission, checkNumeral } from '../../../utils/utils'

@connect(state => ({
    manager: state.manager,
    goodModal: state.goodModal,
    productPop: state.productPop,
}))
export default class Manager extends Component {
  constructor(props) {
    super(props)
    this.state = {
      buyModal: false, // 新增采购
      goodModal: false, // 点击完新增后跳出商品界面
      flag1: true, // 控制按钮是否禁用/启用
      flag2: true,
      flag3: true,
      flag: true,
      record: {}, // 记录采购单数据
      billNo: null,
      upload: false,
    }
  }

  componentDidMount() {
    this.props.dispatch({ type: 'manager/fetch' })
  }

  componentWillReceiveProps(nextProps) {
    const data = nextProps.manager.selectedRows
    if (data.length) {
      const flag1 = (data[0].billStatus === 2 || data[0].billStatus === 3 || data[0].forceComplete === 1) ? !false : false
      const flag2 = (data[0].billStatus === 0) ? !false : false
      const flag3 = (data[0].billStatus === 1) ? !false : false
      this.setState({
        flag1,
        flag2,
        flag3,
      })
    } else {
      this.setState({
        flag1: true,
        flag2: true,
        flag3: true,
      })
    }
  }

  // 导出
  showConfirm = (key) => {
    if (key.key === '1') {
      if (!this.props.manager.selectedRows.length) {
        message.warning('请选择一条单据')
      } else {
        purchaseExport({ billNo: this.props.manager.selectedRows[0].billNo })
      }
    } else {
      const params = this.props.manager.searchParam
      if (this.props.manager.searchParam.timeStatus === undefined || this.props.manager.searchParam.timeStatus === '0') {
        Object.assign(params, {
          billDateFrom: this.props.manager.searchParam.createTime ? this.props.manager.searchParam.createTime.format('YYYY-MM-DD') : undefined,
          billDateTo: this.props.manager.searchParam.endTime ? this.props.manager.searchParam.endTime.format('YYYY-MM-DD') : undefined,
        })
        delete params.approveTimeFrom
        delete params.approveTimeTo
      } else {
        Object.assign(params, {
          approveTimeFrom: this.props.manager.searchParam.createTime ? this.props.manager.searchParam.createTime.format('YYYY-MM-DD') : undefined,
          approveTimeTo: this.props.manager.searchParam.endTime ? this.props.manager.searchParam.endTime.format('YYYY-MM-DD') : undefined,
        })
        delete params.billDateFrom
        delete params.billDateTo
      }
      delete params.createTime
      delete params.endTime
      exportAllSku(params)
    }
  }

  popContent = () => {
    return (
      <div style={{ width: 1000 }}>
        <ProductPop
          record={this.state.record}
          hideModal={() => {
            this.props.dispatch({
              type: 'productPop/clean',
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
  changeStatus = (status) => {
    updateStatus(Object.assign({ billNo: this.props.manager.selectedRows[0].billNo, billStatus: status })).then((json) => {
      if (json) {
        this.props.dispatch({
          type: 'manager/search',
        })
        this.props.dispatch({
          type: 'manager/changeState',
          payload: { selectedRowKeys: [], selectedRows: [] },
        })
      }
    })
  }
  upload = () => {
    this.setState({
      upload: true,
    })
    upload({ billNo: this.props.manager.selectedRowKeys[0] }).then((json) => {
      console.log('json', json)
      this.setState({
        upload: false,
      })
      if (json) {
        this.props.dispatch({
          type: 'manager/search',
        })
      }
    })
  }
  render() {
    const menu = (
      <Menu onClick={this.showConfirm.bind(this)}>
        <Menu.Item key="1">导出勾选的单据</Menu.Item>
        <Menu.Item key="2">导出所有符合条件的单据</Menu.Item>
      </Menu>
    )
    const { list, total, loading, selectedRows, selectedRowKeys, page } = this.props.manager
    // 操作栏
    const tabelToolbar = [
      <Button key={1} premission="PURCHASE_MANAGER1" type="primary" size="small" onClick={() => this.setState({ buyModal: true })} >新增采购</Button>,
      <Button key={2} premission="PURCHASE_MANAGER_STA" type="primary" size="small" disabled={this.state.flag1} onClick={this.changeStatus.bind(this, 3)} >作废</Button>,
      <Button key={3} premission="PURCHASE_MANAGER_STA" type="primary" size="small" disabled={this.state.flag1 || this.state.flag3} onClick={this.changeStatus.bind(this, 1)} >审核生效</Button>,
      <Button key={4} premission="PURCHASE_MANAGER_STA" type="primary" size="small" disabled={this.state.flag1 || this.state.flag2} onClick={this.changeStatus.bind(this, 0)} >变更修改</Button>,
      <Button key={5} premission="PURCHASE_MANAGER_STA" type="primary" size="small" disabled={this.state.flag1 || this.state.flag2} onClick={this.changeStatus.bind(this, 2)} >强制完成</Button>,
      <Dropdown key={6} premission="PURCHASE_EXPORTPRO" overlay={menu}>
        <Button type="primary" size="small">
          导出 <Icon type="down" />
        </Button>
      </Dropdown>,
       <Button key={7} premission="PURCHASE_MANAGER_UPL" type="primary" size="small" disabled={!selectedRows.length} onClick={this.upload} loading={this.state.upload}>上传</Button>,
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
        title: '采购单号',
        dataIndex: 'billNo',
        key: 'billNo',
        className: styles.columnLeft,
        width: 80,
        render: (text, record) => (
          <Popover
            visible={record.billNo === this.state.billNo ? !false : false}
            placement="bottomLeft"
            trigger="click"
            content={this.popContent()}
            onVisibleChange={() => {
              if (this.state.flag) {
                this.props.dispatch({ type: 'productPop/fetch', payload: { billNo: record.billNo } })
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
        title: '供应商',
        dataIndex: 'supplierName',
        key: 'supplierName',
        width: 80,
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
              checkPremission('PURCHASE_EDITPURCHAS') ?
                <span><a onClick={() => { this.setState({ buyModal: true, record }) }}>详情</a><Divider type="vertical" /></span> : null
              }
              {checkPremission('PURCHASE_EDITPURCHAS') ?
                <a onClick={() => {
                  this.props.dispatch({ type: 'goodModal/fetch', payload: { billNo: record.billNo } })
                  this.setState({ goodModal: true, record })
                  this.props.dispatch({
                    type: 'goodModal/changeState',
                    payload: { billNo: record.billNo },
                  })
                  }}
                >
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
        title: '状态',
        dataIndex: 'billStatus',
        key: 'billStatus',
        width: 80,
        className: styles.columnLeft,
        render: (text) => {
          switch (text) {
          case 0:
            return <Tag color="#87d068">待审核</Tag>
          case 1:
            return <Tag color="#2db7f5">已审核</Tag>
          case 2:
            return <Tag color="green">已完成</Tag>
          default:
            return <Tag color="#f50">已作废</Tag>
          }
        },
      },
      {
        title: '采购总数',
        dataIndex: 'billNum',
        key: 'billNum',
        width: 100,
        className: styles.columnLeft,
        render: (text) => {
          return checkNumeral(text)
        },
      },
      {
        title: '采购总金额',
        dataIndex: 'billAmount',
        key: 'billAmount',
        width: 100,
        className: styles.columnLeft,
        render: (text) => {
          return checkNumeral(text)
        },
      },
      {
        title: '税率',
        dataIndex: 'taxRate',
        key: 'taxRate',
        width: 60,
        className: styles.columnLeft,
      },
      {
        title: '溢出率',
        dataIndex: 'exceedRate',
        key: 'exceedRate',
        width: 60,
        className: styles.columnLeft,
      },
      {
        title: '采购员',
        dataIndex: 'purchaseUserName',
        key: 'purchaseUserName',
        width: 80,
        className: styles.columnLeft,
      },
      {
        title: '送货地址',
        dataIndex: 'address',
        key: 'address',
        width: 120,
        className: styles.columnLeft,
      },
      {
        title: '审核人',
        dataIndex: 'approveUserName',
        key: 'approveUserName',
        width: 80,
        className: styles.columnLeft,
      },
      {
        title: '审核日期',
        dataIndex: 'approveTime',
        key: 'approveTime',
        width: 80,
        className: styles.columnLeft,
        render: (text, record) => {
          if (record.approveUserName) {
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
      nameSpace: 'manager',
      dispatch: this.props.dispatch,
      selectedRows,
      selectedRowKeys,
      rowKey: 'billNo',
      tableName: 'managerTable',
      scroll: { x: 1900 },
      rowSelection: { type: 'radio' },
    }
    // 新增采购
    const modalProps = {
      show: this.state.buyModal,
      hideModal: () => {
        this.setState({ buyModal: false, record: {} })
        this.props.dispatch({ type: 'goodModal/clean', payload: { selectedRows: [], selectedRowKeys: [], list: [], total: 0, initKey: [] } })
      },
      showGood: () => this.setState({ goodModal: true }),
      record: this.state.record,
    }
    // 商品界面
    const goodProps = {
      show: this.state.goodModal,
      hideModal: () => {
        this.setState({ goodModal: false, record: {} })
        this.props.dispatch({
          type: 'goodModal/changeState',
          payload: { billNo: '', searchParam: {} },
        })
      },
      record: this.state.record,
    }
    const props = {
      nameSpace: 'manager',
      dispatch: this.props.dispatch,
      searchParam: this.props.manager.searchParam,
    }
    return (
      <div>
        <div className={styles.contentBoard}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <SearchBar {...props} />
            </div>
            <Jtable {...tableProps} />
          </div>
        </div>
        <PurModal {...modalProps} />
        {this.state.goodModal ? <GoodModal {...goodProps} /> : null}
      </div>
    )
  }
}
