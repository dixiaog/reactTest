import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Input, Select, Icon, Tag, Modal } from 'antd'
import styles from '../Inventory.less'
import SearchBar from '../../../components/SearchBar'
import Jtable from '../../../components/JcTable'
import { unLockSku } from '../../../services/inventory/lockInv'

const Option = Select.Option
@connect(state => ({
    getLocks: state.getLocks,
}))
export default class GetLocksModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentWillMount() {
      // this.props.visiable && this.props.dispatch({
      //   type: 'getLocks/fetch',
      // })
    }
    componentDidMount() {
    }
    componentWillReceiveProps(nextProps) {
      if (this.props.billNo !== nextProps.billNo) {
        const { searchParam } = this.props.getLocks
        this.props.dispatch({
          type: 'getLocks/search',
          payload: {
            searchParam: Object.assign(searchParam, { billNo: nextProps.billNo }),
          },
        })
      }
    }
    handleCancel = () => {
      this.props.dispatch({
        type: 'getLocks/clean',
      })
      this.props.hidden()
    }
    unLockBySku = (autoNo) => {
      unLockSku({ autoNo }).then((json) => {
        if (json) {
          this.props.dispatch({
            type: 'getLocks/search',
          })
        }
      })
    }
    exportLocks = () => {
      const $this = this
      this.props.dispatch({
        type: 'getLocks/export',
        payload: {
          fileName: '锁定库存.xls',
          ...$this.props.searchParam,
        },
      })
    }
    render() {
    const { list, total, loading, selectedRows, selectedRowKeys, page, searchParam } = this.props.getLocks
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
      },
      {
        title: '商品编码',
        dataIndex: 'skuNo',
        key: 'skuNo',
        width: 120,
      },
      {
        title: '商品名称',
        dataIndex: 'productName',
        key: 'productName',
        width: 200,
      },
      {
        title: '手工解锁',
        dataIndex: 'isUnlock',
        key: 'isUnlock',
        width: 100,
        render: (text, record) => {
            if (text === 0) {
                return <a onClick={this.unLockBySku.bind(this, record.autoNo)}>[解锁]</a>
            } else {
                return <span>已解锁</span>
            }
        },
      },
      {
        title: '平台商品编号',
        dataIndex: 'shopSkuNo',
        key: 'shopSkuNo',
        width: 100,
      },
      {
        title: '锁定数',
        dataIndex: 'lockNum',
        key: 'lockNum',
        width: 100,
      },
      {
        title: '订单使用',
        dataIndex: 'usedLockNum',
        key: 'usedLockNum',
        width: 200,
      },
      {
        title: '发货使用',
        dataIndex: 'deliveredNum',
        key: 'deliveredNum',
        width: 200,
      },
      {
        title: '上传状态',
        dataIndex: 'uploadStatus',
        key: 'uploadStatus',
        width: 100,
        render: (text) => {
          if (text === 0) {
            return <Tag color="#f50">上传失败</Tag>
          } else {
            return <Tag color="#2db7f5" >上传成功</Tag>
          }
        },
      },
      {
        title: '解锁时间',
        dataIndex: 'unlockTime',
        key: 'unlockTime',
        width: 200,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 200,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 150,
      },
    ]
    // 操作栏
    const tabelToolbar = [
      <Button type="primary" size="small" onClick={this.exportLocks} ><Icon type="search" />导出查询数据</Button>,
    ]
      const searchBarItem = [{
        decorator: 'shopNo',
        components: (
          <Select placeholder="店铺" size="small" style={{ marginTop: 4 }}>
            {this.props.shops.map(e => <Option key={e.shopNo}>{e.shopName}</Option>)}
          </Select>
        ),
      }, {
        decorator: 'skuNo',
        components: <Input placeholder="商品编码" size="small" />,
      }, {
        decorator: 'shopSkuNo',
        components: <Input placeholder="平台商品编号" size="small" />,
      }, {
        decorator: 'isUnlock',
        components: (
          <Select placeholder="锁定状态" size="small" style={{ marginTop: 4 }}>
            <Option value={0}>未解锁</Option>
            <Option value={1}>已解锁</Option>
          </Select>
        ),
      }]
      const searchBarProps = {
        colItems: searchBarItem,
        dispatch: this.props.dispatch,
        nameSpace: 'getLocks',
        searchParam,
        requestParam: { billNo: this.props.billNo },
      }
        const tableProps = {
            rowSelection: {
            hideDefaultSelections: true,
            },
            toolbar: tabelToolbar,
            dataSource: list,
            total,
            ...page,
            loading,
            columns,
            nameSpace: 'getLocks',
            dispatch: this.props.dispatch,
            selectedRows,
            selectedRowKeys,
            rowKey: 'autoNo',
            tableName: 'getLocksTable',
            custormTableClass: 'tablecHeightFix440',
            scroll: { y: 380, x: 1800 },
        }
        return (
          <div>
            <Modal
              maskClosable={false}
              title="查看锁定数据"
              visible={this.props.visiable}
              onCancel={this.handleCancel}
              width={1000}
              bodyStyle={{ height: 500, overflowX: 'hidden' }}
              footer={[
            ]}
            >
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>
                  <SearchBar {...searchBarProps} />
                </div>
                <Jtable {...tableProps} />
              </div>
            </Modal>
          </div>
        )
    }
}
