/*
 * @Author: tanmengjia
 * @Date: 2018-05-08 16:31:18
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-14 21:27:37
 * 唯品会出仓单
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Button, Select, Input, notification, Popconfirm } from 'antd'
import Jtable from '../../../components/JcTable'
import SearchBar from '../../../components/SearchBar'
import styles from './VipOutWh.less'
import VipOutWhModal from './VipOutWhModal.js'
import AddVipOut from './AddVipOut'
import { effectFetch } from '../../../utils/utils'
import { upload, okDelivery, cancel, deleteNoSelect } from '../../../services/order/vipOutWh'

const { Option } = Select

@connect(state => ({
  vipOutWh: state.vipOutWh,
}))
export default class VipOutWh extends Component {
  constructor(props) {
    super(props)
    this.state = {
      vipModalVisiable: false,
      record: null,
    }
  }
  componentDidMount() {
    // const { vipShopSku } = getOtherStore()
    // if (!vipShopSku || vipShopSku.list.length === 0) {
    //   this.props.dispatch({ type: 'vipOutWh/fetch' })
    // }
    effectFetch('vipShopSku', this.props.dispatch)
    this.props.dispatch({ type: 'vipOutWh/getShopName' })
    this.props.dispatch({ type: 'vipOutWh/getWarehouse' })
  }
  componentWillReceiveProps(nextProps) {
  }
  detail = (record) => {
    this.setState({
      vipModalVisiable: true,
      record,
    })
  }
  editModal = (record) => {
    this.setState({
      vipAddVisiable: true,
      record,
    })
  }
  upload = () => {
    const { selectedRowKeys } = this.props.vipOutWh
    const payload = {
      billNo: selectedRowKeys[0],
    }
    upload(payload).then((json) => {
      if (json) {
        this.props.dispatch({
          type: 'vipOutWh/search',
        })
        notification.success({
          message: '操作成功',
        })
      }
    })
  }
  okDelivery = () => {
    const { selectedRowKeys } = this.props.vipOutWh
    const payload = {
      billNo: selectedRowKeys[0],
    }
    okDelivery(payload).then((json) => {
      if (json) {
        this.props.dispatch({
          type: 'vipOutWh/search',
        })
        notification.success({
          message: '操作成功',
        })
      }
    })
  }
  cancel = () => {
    const { selectedRowKeys } = this.props.vipOutWh
    const payload = {
      billNos: selectedRowKeys,
    }
    cancel(payload).then((json) => {
      if (json) {
        this.props.dispatch({
          type: 'vipOutWh/search',
        })
        notification.success({
          message: '操作成功',
        })
      }
    })
  }
  deleteNoSelect = () => {
    const { selectedRowKeys } = this.props.vipOutWh
    deleteNoSelect(selectedRowKeys[0]).then((json) => {
      if (json) {
        this.props.dispatch({
          type: 'vipOutWh/search',
        })
        notification.success({
          message: '操作成功',
        })
      }
    })
  }
  render() {
    const { list, loading, searchParam, total, page, selectedRowKeys, selectedRows, lists, warehouses } = this.props.vipOutWh
    const columns = [{
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        width: 60,
        render: (text, record, index) => {
          return (
            <span>
              {index + 1}
            </span>)
          },
      }, {
        title: 'PO号',
        dataIndex: 'poNo',
        key: 'poNo',
        width: 150,
        // onClick={() => this.setState({ vipModalVisiable: true })}
        render: (text, record) => {
          return (
            <span>
              <a onClick={this.detail.bind(this, record)} >{text}</a>
            </span>
          )
        },
      }, {
        title: '仓库',
        dataIndex: 'warehouseName',
        key: 'warehouseName',
        width: 120,
      }, {
        title: 'VIP入库单号',
        dataIndex: 'vipInNo',
        key: 'vipInNo',
        width: 150,
      }, {
        title: '操作',
        dataIndex: 'opreation',
        key: 'opreation',
        width: 80,
        render: (text, record) => {
          if (record.billStatus === 0 || record.billStatus === 1 || record.billStatus === 2) {
            return (
              <span>
                <a onClick={this.editModal.bind(this, record)} >编辑</a>
              </span>
            )
          }
        },
      }, {
        title: '承运商',
        dataIndex: 'expressCorpName',
        key: 'expressCorpName',
        width: 120,
      }, {
        title: '承运单号',
        dataIndex: 'expressNo',
        key: 'expressNo',
        width: 150,
      }, {
        title: '联系电话',
        dataIndex: 'expressTel',
        key: 'expressTel',
        width: 120,
      }, {
        title: '送货时间',
        dataIndex: 'deliveryTime',
        key: 'deliveryTime',
        width: 100,
        render: text => (text && moment(text).format('YYYY-MM-DD') !== '1899-11-30' ? moment(text).format('YYYY-MM-DD') : null)
      }, {
        title: '预计到货时间',
        dataIndex: 'arrivalTime',
        key: 'arrivalTime',
        width: 160,
        render: text => (text && moment(text).format('YYYY-MM-DD HH:mm:ss') !== '1899-11-30 00:00:00' ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null)
      }, {
        title: '状态',
        dataIndex: 'billStatus',
        key: 'billStatus',
        width: 100,
        render: (text) => {
          if (text * 1 === 0) {
            return '待出库'
          } else if (text * 1 === 1) {
            return '部分上传'
          } else if (text * 1 === 2) {
            return '已上传'
          } else if (text * 1 === 3) {
            return '已出库'
          } else if (text * 1 === 4) {
            return '取消'
          } else if (text * 1 === 5) {
            return '作废'
          }
        },
      }, {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 100,
      }, {
        title: '店铺',
        dataIndex: 'shopName',
        key: 'shopName',
        width: 100,
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 160,
        render: text => (text && moment(text).format('YYYY-MM-DD HH:mm:ss') !== '1899-11-30 00:00:00' ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null)
      }]
    const tabelToolbar = [
      <Button key={0} type="primary" size="small" premission="TRUE" onClick={() => this.setState({ vipAddVisiable: true })}>创建VIP发货单</Button>,
      <Popconfirm key={1} title="确认上传明细?" premission="TRUE" okText="确定" cancelText="取消" onConfirm={this.upload}>
        <Button
          type="primary"
          size="small"
          disabled={!(selectedRows && selectedRows.length && selectedRows[0].billStatus === 0)}>上传明细</Button>
      </Popconfirm>,
      <Button key={2}
      type="primary"
      size="small"
      premission="TRUE"
      disabled={!(selectedRows && selectedRows.length && selectedRows[0].billStatus === 2)}
      onClick={this.okDelivery}>确认发货</Button>,
      <Button key={3}
      type="primary"
      size="small"
      premission="TRUE"
      disabled={!(selectedRows && selectedRows.length && selectedRows[0].billStatus === 0)}
      onClick={this.cancel}>取消</Button>,
      // <Button key={4}
      // type="primary"
      // size="small"
      // premission="TRUE"
      // disabled={!(selectedRows && selectedRows.length && selectedRows[0].billStatus === 0)}
      // onClick={this.deleteNoSelect}>作废并下次不选</Button>,
    ]
    const tableProps = {
        toolbar: tabelToolbar,
        noSelected: false,
        dataSource: list,
        total,
        ...page,
        loading,
        columns,
        nameSpace: 'vipOutWh',
        tableName: 'vipOutWhTable',
        dispatch: this.props.dispatch,
        selectedRows,
        selectedRowKeys,
        rowKey: 'billNo',
        scroll: { x: 1670 },
        rowSelection: {
          type: 'radio',
        },
    }
    const searchBarItem = [{
      decorator: 'vipInNo',
      components: <Input placeholder="VIP入库单号" size="small" />,
    }, {
    //   decorator: 'skuNo',
    //   components: <Input placeholder="PO号" size="small" />,
    // }, {
    //   decorator: 'skuNo',
    //   components: <Input placeholder="内部订单号" size="small" />,
    // }, {
      decorator: 'shopNo',
      components: (
        <Select placeholder="店铺" size="small" style={{ marginTop: 4 }}>
          {lists && lists.length ? lists.map(ele => <Option key={ele.shopNo} value={ele.shopNo}>{ele.shopName}</Option>) : ''}
        </Select>
      ),
    }, {
      decorator: 'warehouseNo',
      components: (
        <Select placeholder="送货仓库" size="small" style={{ marginTop: 4 }}>
          {warehouses && warehouses.length ? warehouses.map(ele => <Option key={ele.warehouseNo} value={ele.warehouseNo}>{ele.warehouseName}</Option>) : ''}
        </Select>
      ),
    }, {
      decorator: 'billStatus',
      components: (
        <Select placeholder="出库状态" size="small" style={{ marginTop: 4 }}>
          <Option key={0} value={0}>待出库</Option>
          <Option key={1} value={1}>部分上传</Option>
          <Option key={2} value={2}>已上传</Option>
          <Option key={3} value={3}>已出库</Option>
          <Option key={4} value={4}>取消</Option>
          <Option key={5} value={5}>作废</Option>
        </Select>
      ),
    }]
    const searchBarProps = {
      colItems: searchBarItem,
      dispatch: this.props.dispatch,
      nameSpace: 'vipOutWh',
      searchParam,
    }
    const vipModalProps = {
      vipModalVisiable: this.state.vipModalVisiable,
      vipModalHidden: () => {
        this.setState({
          vipModalVisiable: false,
          record: null,
        })
      },
      record: this.state.record,
      shops: lists,
    }
    const vipAddProps = {
      vipAddVisiable: this.state.vipAddVisiable,
      vipAddHidden: () => {
        this.setState({
          vipAddVisiable: false,
          record: null,
        })
      },
      record: this.state.record,
      shops: lists,
      warehouses,
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
        {this.state.vipModalVisiable ? <VipOutWhModal {...vipModalProps}/> : null}
        {this.state.vipAddVisiable ? <AddVipOut {...vipAddProps}/> : null}
      </div>
    )
  }
}
