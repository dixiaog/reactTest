/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-04-20 18:55:46
 * 采购单列表
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Card, message } from 'antd'
import moment from 'moment'
import BillListSeaBar from './BillListSeaBar'
import styles from '../Inventory.less'
import Jtable from '../../../components/JcTable'
import { addInStorage } from '../../../services/inventory/storage'

@connect(state => ({
  billlist: state.billlist,
  storage: state.storage,
}))
export default class PurchaseBillList extends Component {
  // 关闭窗口并打开新增列表
  hideModalAndShow = () => {
    if (this.props.billlist.selectedRows.length) {
      const purNo = this.props.billlist.selectedRows[0].billNo
      const { hideModal, showStorageDetails } = this.props
      addInStorage(Object.assign({ billNo: this.props.billlist.selectedRows[0].billNo })).then((json) => {
        if (json) {
          const billNo = json
          this.props.dispatch({ type: 'storage/search' })
          this.props.dispatch({
            type: 'billlist/clean',
            payload: { list: [], selectedRows: [], selectedRowKeys: [], searchParam: {}, page: {}, total: 0 },
          })
          hideModal()
          showStorageDetails(billNo)
          this.props.dispatch({
            type: 'storage/saveT',
            payload: { billNo, purNo },
          })
        }
      })
    } else {
      message.warning('请选择采购单')
    }
  }

  // 关闭窗口
  hideModal = () => {
    const { hideModal } = this.props
    this.props.dispatch({
      type: 'billlist/clean',
      payload: { list: [], selectedRows: [], selectedRowKeys: [], searchParam: {}, page: {}, total: 0 },
    })
    hideModal()
  }

  render() {
    const { show } = this.props
    const { list, total, loading, selectedRows, selectedRowKeys, page } = this.props.billlist
    const columns = [{
      title: '编号',
      dataIndex: 'key',
      key: 'key',
      width: 50,
      render: (text, record, index) => {
        return (
          <span>
            {index + 1}
          </span>
          )
        },
    }, {
      title: '采购单号',
      dataIndex: 'billNo',
      key: 'billNo',
      width: 120,
    }, {
      title: '采购日期',
      dataIndex: 'billDate',
      key: 'billDate',
      width: 120,
      render: text => (moment(text).format('YYYY-MM-DD')),
    }, {
      title: '供应商',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 120,
    }, {
      title: '类型',
      dataIndex: 'warehouseName',
      key: 'warehouseName',
      width: 120,
    }, {
      title: '采购员',
      dataIndex: 'purchaseUserName',
      key: 'purchaseUserName',
      width: 120,
    }, {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 120,
    }]
    // 表格参数
    const tableProps = {
      dataSource: list,
      total,
      ...page,
      loading,
      columns,
      nameSpace: 'billlist',
      dispatch: this.props.dispatch,
      selectedRows,
      selectedRowKeys,
      rowKey: 'billNo',
      tableName: 'billlistTable',
      scroll: { y: 300 },
      rowSelection: { type: 'radio' },
      custormTableClass: 'tablecHeightFix340',
    }
    return (
      <div>
        <Modal
          width={1250}
          title="选择采购单"
          visible={show}
          onOk={this.hideModalAndShow}
          onCancel={this.hideModal}
          bodyStyle={{ overflowY: 'hidden', overflowX: 'hidden', padding: 0 }}
          maskClosable={false}
        >
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>
                <BillListSeaBar />
              </div>
              <Jtable {...tableProps} />
            </div>
          </Card>
        </Modal>
      </div>)
  }
}
