/*
 * @Author: tanmengjia
 * @Date: 2018-04-02 10:29:47
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-14 10:33:12
 * 唯品会送货仓设置
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Card, Input, Popconfirm, notification } from 'antd'
import Jtable from '../../../components/JcTable'
import SearchBar from '../../../components/SearchBar'
import styles from '../Vip.less'
import { checkPremission, effectFetch } from '../../../utils/utils'
import VipWarehouseModal from './VipWarehouseModal'
import { deleteAll, reset } from '../../../services/vip/vipWarehouse'

@connect(state => ({
  vipWarehouse: state.vipWarehouse,
}))
export default class VipWarehouse extends Component {
  constructor(props) {
    super(props)
    this.state = {
      itemModalVisiable: false,
    }
  }
  componentDidMount() {
    // const { vipWarehouse } = getOtherStore()
    // if (!vipWarehouse || vipWarehouse.list.length === 0) {
    //   this.props.dispatch({ type: 'vipWarehouse/fetch' })
    // }
    effectFetch('vipWarehouse', this.props.dispatch)
  }
  editModal = (record) => {
    this.props.dispatch({ type: 'vipWarehouse/getChooseData', payload: { autoNo: record.autoNo } })
    this.setState({
      itemModalVisiable: true,
    })
  }
  deleteAll = () => {
    const ids = []
    this.props.vipWarehouse.selectedRows.forEach((ele) => {
      ids.push(ele.autoNo)
    })
    deleteAll(ids).then((json) => {
      if (json) {
        notification.success({
          message: '操作成功',
        })
        this.props.dispatch({ type: 'vipWarehouse/search' })
      }
    })
  }
  reset = () => {
    reset().then((json) => {
      if (json) {
        notification.success({
          message: '操作成功',
        })
        this.props.dispatch({ type: 'vipWarehouse/fetch' })
      }
    })
  }
  render() {
    const { list, loading, searchParam, total, page, selectedRowKeys, selectedRows } = this.props.vipWarehouse
    const columns = [{
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        width: 80,
        render: (text, record, index) => {
          return (
            <span>
              {index + 1}
            </span>)
          },
      }, {
        title: '店铺',
        dataIndex: 'shopName',
        key: 'shopName',
        width: 120,
    }, {
        title: '仓库编号',
        dataIndex: 'warehouseNo',
        key: 'warehouseNo',
        width: 120,
      },
      {
          title: '操作',
          dataIndex: 'opreation',
          key: 'opreation',
          width: 80,
          className: styles.columnCenter,
          render: (text, record) => {
            if (checkPremission('VIP_WAREHOUSE_EDIT')) {
              return (
                <a onClick={this.editModal.bind(this, record)}>编辑</a>
              )
            }
          },
    }, {
        title: '仓库名称',
        dataIndex: 'warehouseName',
        key: 'warehouseName',
        width: 80,
      // }, {
      //   title: '说明',
      //   dataIndex: 'remark',
      //   key: 'remark',
      //   width: 120,
      }, {
        title: '省',
        dataIndex: 'province',
        key: 'province',
        width: 80,
      }, {
        title: '市',
        dataIndex: 'city',
        key: 'city',
        width: 80,
      }, {
        title: '区',
        dataIndex: 'county',
        key: 'county',
        width: 80,
      }, {
        title: '地址',
        dataIndex: 'address',
        key: 'address',
        width: 200,
      }, {
        title: '联系人',
        dataIndex: 'contacts',
        key: 'contacts',
        width: 120,
      }, {
        title: '手机',
        dataIndex: 'mobileNo',
        key: 'mobileNo',
        width: 120,
      }, {
        title: '电话',
        dataIndex: 'telNo',
        key: 'telNo',
        width: 120,
      }]
    const itemModalProps = {
        itemModalVisiable: this.state.itemModalVisiable,
        dispatch: this.props.dispatch,
        limitModalHidden: () => {
          this.props.dispatch({ type: 'vipWarehouse/clean' })
          this.setState({
            itemModalVisiable: false,
          })
        },
      }
    const tabelToolbar = [
      <Popconfirm key={1} title="请确认是否删除，删除后将无法恢复" premission="VIP_WAREHOUSE_DELETE" okText="确定" onConfirm={this.deleteAll} cancelText="取消">
        <Button type="primary" size="small" disabled={!(selectedRows && selectedRows.length)} premission="VIP_WAREHOUSE_DELETE">批量删除</Button>
      </Popconfirm>,
      <Popconfirm key={2} title="重新下载后,以往的数据会被清空,是否继续?" premission="VIP_WAREHOUSE_LOAD" okText="确定" onConfirm={this.reset} cancelText="取消">
        <Button size="small" type="primary" premission="VIP_WAREHOUSE_LOAD">重新下载</Button>
      </Popconfirm>,
     ]
    const tableProps = {
        toolbar: tabelToolbar,
        noSelected: false,
        dataSource: list,
        total,
        ...page,
        loading,
        columns,
        nameSpace: 'vipWarehouse',
        tableName: 'vipWarehouseTable',
        dispatch: this.props.dispatch,
        selectedRows,
        selectedRowKeys,
        rowKey: 'autoNo',
        class: styles.tableEllipsis,
        scroll: { x: 1280 },
    }
    const searchBarItem = [{
      decorator: 'warehouseNo',
      components: <Input placeholder="仓库编号" size="small" />,
    }, {
      decorator: 'warehouseName',
      components: <Input placeholder="仓库名称" size="small" />,
    // }, {
    //   decorator: 'remark',
    //   components: <Input placeholder="说明" size="small" />,
    },
    ]
    const searchBarProps = {
      colItems: searchBarItem,
      dispatch: this.props.dispatch,
      nameSpace: 'vipWarehouse',
      searchParam,
    }
    return (
      <div>
        <Card bordered={false} className={styles.contentBoard}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <SearchBar {...searchBarProps} />
            </div>
            <Jtable {...tableProps} />
          </div>
        </Card>
        { this.state.itemModalVisiable ? <VipWarehouseModal {...itemModalProps} /> : null }
      </div>
    )
  }
}
