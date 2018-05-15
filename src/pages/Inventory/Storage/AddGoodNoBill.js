/*
 * @Author: jiangteng
 * @Date: 2018-01-24 10:33:28
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-03-27 17:26:20
 * 请勾选本次入库的采购商品
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Input, Avatar, Card, message } from 'antd'
import styles from '../Inventory.less'
import Jtable from '../../../components/JcTable'
import SearchBar from '../../../components/SearchBar'

const columns = [{
    title: '图片',
    dataIndex: 'imageUrl',
    key: 'imageUrl',
    width: 80,
    render: (text) => {
      return (<Avatar shape="square" src={text} />)
      },
  }, {
    title: '商品编号',
    dataIndex: 'skuNo',
    key: 'skuNo',
    width: 100,
  }, {
    title: '商品名称',
    dataIndex: 'productName',
    key: 'productName',
    width: 100,
    className: styles.columnCenter,
  }, {
    title: '颜色及规格',
    dataIndex: 'productSpec',
    key: 'productSpec',
    width: 100,
    className: styles.columnCenter,
  }, {
    title: '采购数量',
    dataIndex: 'billNum',
    key: 'billNum',
    width: 100,
    className: styles.columnCenter,
  }, {
    title: '已入库数量',
    dataIndex: 'inNum',
    key: 'inNum',
    width: 100,
    className: styles.columnCenter,
  }, {
    title: '待入库数量',
    dataIndex: 'waitInNum',
    key: 'waitInNum',
    width: 100,
    className: styles.columnCenter,
  }]

@connect(state => ({
  nobill: state.nobill,
  storageDetails: state.storageDetails,
}))
export default class AddGoodNoBill extends Component {
    constructor(props) {
        super(props)
        this.state = {
          confirmLoading: false,
        }
      }
    handleOk = (rows, keys) => {
      if (rows.length === 0) {
        message.warn('请选择商品')
      } else {
        this.setState({
          confirmLoading: true,
        })
        // 上级页面获取最新数据
        const { getGoods } = this.props
        getGoods(rows, keys, () => { this.handleCancel() }, () => { this.setState({ confirmLoading: false }) })
      }
    }
    handleCancel = () => {
      this.setState({
        confirmLoading: false,
      })
      this.props.hideModal()
      this.props.dispatch({
        type: 'nobill/clean',
        payload: { selectedRows: [], selectedRowKeys: [], page: {}, searchParam: {}, list: [] },
      })
    }
  render() {
    const { list, loading, searchParam, total, page, selectedRowKeys, selectedRows } = this.props.nobill
    const tableProps = {
        noListChoose: true,
        noSelected: false,
        dataSource: list,
        total,
        isPart: true,
        ...page,
        loading,
        columns,
        nameSpace: 'nobill',
        tableName: 'nobillTable',
        dispatch: this.props.dispatch,
        custormTableClass: 'tablecHeightFix340',
        selectedRows,
        selectedRowKeys,
        rowKey: 'skuNo',
        rowSelection: {
          type: this.state.radio,
          getCheckboxProps: record => ({
            disabled: this.props.storageDetails.initKey.indexOf(record.skuNo) > -1,
          }) },
    }
      const searchBarItem = [{
        decorator: 'skuNo',
        components: <Input placeholder="商品编号" size="small" />,
        }, {
          decorator: 'productName',
          components: <Input placeholder="商品名称" size="small" />,
        },
        ]
        const searchBarProps = {
          colItems: searchBarItem,
          dispatch: this.props.dispatch,
          nameSpace: 'nobill',
          searchParam,
          rowKey: 'skuNo',
        }
    return (
      <div>
        <Modal
          maskClosable={false}
          title="请勾选本次入库的采购商品"
          visible={this.props.show}
          onCancel={this.handleCancel}
          onOk={this.handleOk.bind(this, selectedRows, selectedRowKeys)}
          width={1200}
          okText="返回选中的商品"
          confirmLoading={this.state.confirmLoading}
          bodyStyle={{
            minHeight: 500,
            padding: 0,
          }}
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

