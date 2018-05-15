/*
 * @Author: tanmengjia
 * @Date: 2018-01-25 13:12:47
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-14 15:40:33
 * 分销商品限制列表页
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Input, Popconfirm, Checkbox, Divider, notification } from 'antd'
import Jtable from '../../../components/JcTable'
import SearchBar from '../../../components/SearchBar'
import styles from '../SupplySell.less'
import ProductLimitModal from './ProductLimitModal'
import { checkPremission, effectFetch } from '../../../utils/utils'
import { deleteProductLimit } from '../../../services/supplySell/productLimit'

const limitType = (record) => {
    if (record.limitType * 1 === 0) {
      return '允许销售'
    } else if (record.limitType * 1 === 1) {
      return '禁止销售'
    }
  }

@connect(state => ({
    productLimit: state.productLimit,
}))
export default class ProductLimit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      itemModalVisiable: false,
      add: false,
      selectData: null,
    }
  }
  componentDidMount() {
    this.props.dispatch({ type: 'productLimit/getDistributor' })
    // const { productLimit } = getOtherStore()
    // if (!productLimit || productLimit.list.length === 0) {
    //   this.props.dispatch({ type: 'productLimit/fetch' })
    // }
    effectFetch('productLimit', this.props.dispatch)
  }
  editModal = (record) => {
    this.setState({
      itemModalVisiable: true,
      selectData: record,
      add: false,
    })
  }
  confirm = (record) => {
    deleteProductLimit(record).then((json) => {
      if (json) {
        notification.success({
          message: '操作成功',
        })
        this.props.dispatch({
          type: 'productLimit/fetch',
         })
      }
    })
  }
  render() {
    const { list, loading, searchParam, total, page, selectedRowKeys, selectedRows } = this.props.productLimit
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
        title: '分销商编号',
        dataIndex: 'distributorNo',
        key: 'distributorNo',
        width: 150,
    }, {
        title: '分销商名称',
        dataIndex: 'distributorName',
        key: 'distributorName',
        width: 150,
      },
      {
          title: '操作',
          dataIndex: 'opreation',
          key: 'opreation',
          width: 130,
          className: styles.columnCenter,
          render: (text, record) => {
            if (checkPremission('PRODUCTLIMIT_SAVE')) {
              return (
                <span>
                  <a onClick={this.editModal.bind(this, record)}>编辑</a>
                  <Divider type="vertical" />
                  <Popconfirm placement="top" title="你确定要删除这行内容?" onConfirm={this.confirm.bind(this, record)}okText="确定" cancelText="取消">
                    <a>删除</a>
                  </Popconfirm>
                </span>
              )
            }
          },
    }, {
        title: '启用',
        dataIndex: 'enableStatus',
        key: 'enableStatus',
        width: 80,
        className: styles.columnCenter,
        render: (text, record) => (
          <Checkbox checked={record.enableStatus} />
        ),
      }, {
        title: '款式编号',
        dataIndex: 'productNo',
        key: 'productNo',
        width: 270,
          render: (text) => {
            return <div style={{ width: 200, textOverflow: 'ellipsis', wordBreak: 'keep-all', whiteSpace: 'nowrap', overflow: 'hidden', height: 15 }}>{text}</div>
          },
      }, {
        title: '限定类型',
        dataIndex: 'limitType',
        key: 'limitType',
        // width: 120,
        render: (text, record) => (
            limitType(record)
        ),
    }]
    const itemModalProps = {
        distributor: this.props.productLimit.distributor,
        itemModalVisiable: this.state.itemModalVisiable,
        dispatch: this.props.dispatch,
        add: this.state.add,
        selectData: this.state.selectData,
        limitModalHidden: () => {
          this.props.dispatch({ type: 'productLimit/clear' })
          this.setState({
            itemModalVisiable: false,
            add: false,
            selectData: null,
          })
        },
      }
    const tabelToolbar = [
      <Button key="toolbar" type="primary" size="small" onClick={() => { this.setState({ itemModalVisiable: true, add: true }) }} premission="PRODUCTLIMIT_SAVE">添加新的分销商品限制</Button>,
     ]
    const tableProps = {
        toolbar: tabelToolbar,
        noSelected: false,
        dataSource: list,
        total,
        ...page,
        loading,
        columns,
        nameSpace: 'productLimit',
        tableName: 'productLimitTable',
        dispatch: this.props.dispatch,
        selectedRows,
        selectedRowKeys,
        rowKey: 'autoNo',
        class: styles.tableEllipsis,
        scroll: { x: 1000 },
    }
    const searchBarItem = [{
      decorator: 'productNo',
      components: <Input placeholder="款式编号" size="small" />,
    },
    ]
    const searchBarProps = {
      colItems: searchBarItem,
      dispatch: this.props.dispatch,
      nameSpace: 'productLimit',
      searchParam,
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
        { this.state.itemModalVisiable ? <ProductLimitModal {...itemModalProps} /> : null }
      </div>
    )
  }
}
