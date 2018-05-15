/*
 * @Author: tanmengjia
 * @Date: 2018-05-09 11:03:09
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-14 21:12:18
 * 选择PO
 */
import React, { Component } from 'react'
import moment from 'moment'
import { connect } from 'dva'
import { Modal, Form, Card, message, Button, Select } from 'antd'
import SearchBar from '../../../components/SearchBar'
import styles from './VipOutWh.less'
import Jtable from '../../../components/JcTable'

const { Option } = Select

@connect(state => ({
  // vipOutWh: state.vipOutWh,
  // vipOutWhModal: state.vipOutWhModal,
  choosePO: state.choosePO,
}))
@Form.create()
export default class ChoosePO extends Component {
  constructor(props) {
      super(props)
      this.state = {
        radio: 'checkbox',
        isOpen: false,
        supplierList: [],
        brands: [],
        haveChoose: [],
      }
    }
    // this.props.productType
    componentWillMount() {
      // if (this.props.record) {
        this.props.dispatch({ type: 'choosePO/fetch' })
      // }
      // this.props.dispatch({ type: 'chooseItem/fetch', payload: this.props })
      // getAllSupplier().then(json => this.setState({ supplierList: json }))
      // getAllBrand().then(json => this.setState({ brands: json }))
    }
  componentWillReceiveProps(nextProps) {

  }
  handleOk = () => {
    const { selectedRows } = this.props.choosePO
    if (selectedRows && selectedRows.length) {
      const warehouseNames = []
      selectedRows.forEach((ele) => {
        warehouseNames.push(ele.warehouseName)
      })
      let name = null
      let isSame = true
      warehouseNames.forEach((row) => {
        if (name) {
          if (name !== row) {
            isSame = false
          }
        } else {
          name = row
        }
      })
      if (isSame) {
        this.props.choosePOs(selectedRows, () => {
          this.props.POHidden()
          this.props.dispatch({
            type: 'choosePO/clear'
          })
        })
      } else {
        message.error('只能选择一个仓库的数据')
      }
    } else {
      message.error('请选择PO')
    }
  }
  handleCancel = () => {
    this.props.dispatch({
      type: 'choosePO/clear'
    })
    this.props.POHidden()
  }
  render() {
    const { list, loading, total, page, selectedRowKeys, selectedRows, searchParam } = this.props.choosePO
    const { shops, warehouses } = this.props
    const columns = [{
      title: '仓库',
      dataIndex: 'warehouseNo',
      key: 'warehouseNo',
      width: 100,
    }, {
      title: 'PO',
      dataIndex: 'poNo',
      key: 'poNo',
      width: 100,
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 100,
      render: text => (text && moment(text).format('YYYY-MM-DD HH:mm:ss') !== '1899-11-30 00:00:00' ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null)
    }, {
      title: '状态',
      dataIndex: 'billStatus',
      key: 'billStatus',
      width: 100,
      render: (text) => {
        if (text * 1 === 0) {
          return '未下载'
        } else if (text * 1 === 1) {
          return '已下载'
        } else if (text * 1 === 2) {
          return '部分发货'
        } else if (text * 1 === 3) {
          return '已发货'
        }
      },
    }, {
      title: '线上订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 100,
    }, {
      title: '店铺',
      dataIndex: 'shopName',
      key: 'shopName',
      width: 100,
    }]
    const tableProps = {
        // toolbar: tabelToolbar,
        noListChoose: true,
        noSelected: false,
        dataSource: list,
        total,
        isPart: true,
        ...page,
        loading,
        columns,
        nameSpace: 'choosePO',
        tableName: 'choosePOTable',
        custormTableClass: 'tablecHeightFix340',
        dispatch: this.props.dispatch,
        selectedRows,
        selectedRowKeys,
        rowKey: 'autoNo',
        scroll: { y: 300 },
        // rowSelection: {
        //   getCheckboxProps: record => ({
        //     disabled: this.state.haveChoose && this.state.haveChoose.length && this.state.haveChoose.indexOf(record.poNo) > -1,
        //   }) },
    }
    const searchBarItem = [{
      decorator: 'shopNo',
      components: (
        <Select placeholder="店铺" size="small" style={{ marginTop: 4 }}>
          {shops && shops.length ? shops.map(ele => <Option key={ele.shopNo} value={ele.shopNo}>{ele.shopName}</Option>) : ''}
        </Select>
      ),
    }, {
      decorator: 'warehouseNo',
      components: (
        <Select placeholder="送货仓库" size="small" style={{ marginTop: 4 }}>
          {warehouses && warehouses.length ? warehouses.map(ele => <Option key={ele.warehouseNo} value={ele.warehouseNo}>{ele.warehouseName}</Option>) : ''}
        </Select>
      ),
    }]
    const searchBarProps = {
      colItems: searchBarItem,
      dispatch: this.props.dispatch,
      nameSpace: 'choosePO',
      searchParam,
    }
    return (
      <div>
        <Modal
          maskClosable={false}
          title="选择PO"
          visible={this.props.choosePO1}
          onCancel={this.handleCancel}
          onOk={this.handleOk}
          width={1000}
          bodyStyle={{
            minHeight: 500,
          }}
          footer={[
            <Button key={0} type="primary" onClick={this.handleOk}>
              确定并返回
            </Button>,
            <Button key={1} onClick={this.handleCancel}>
              取消
            </Button>,
          ]}
        >
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>
                <SearchBar {...searchBarProps} />
              </div>
              <Jtable {...tableProps} />
            </div>
          </Card>
        </Modal>
      </div>
    )
  }
}
