import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Input, Select, Modal } from 'antd'
import styles from '../Inventory.less'
import SearchBar from '../../../components/SearchBar'
import Jtable from '../../../components/JcTable'
import EditableItem from '../../../components/EditableItem'
import { editLocks } from '../../../services/inventory/lockInv'

const Option = Select.Option

@connect(state => ({
    editLocks: state.editLocks,
}))
export default class EditLockInvs extends Component {
    constructor(props) {
        super(props)
        this.state = {
            eidtLocks: [],
            eidtSkus: [],
        }
    }

    componentWillReceiveProps(nextProps) {
      // this.props.visiable && this.props.dispatch({
      //   type: 'editLocks/fetch',
      // })
    }
    handleOk = () => {
      editLocks({list: this.state.eidtLocks}).then((json) => {
        this.handleCancel()
      })
    }
    
    handleCancel = () => {
      this.props.dispatch({
        type: 'editLocks/clean',
      })
      this.props.hidden()
    }
    cellChange = (index, val) => {
        const { eidtLocks, eidtSkus } = this.state
        const { list } = this.props.editLocks
        if (eidtSkus.indexOf(list[index].skuNo) > -1) {
            const editIndex = eidtLocks.findIndex(e => e.skuNo === list[index].skuNo)
            eidtLocks[editIndex].editNum = val
        } else {
            eidtLocks.push({
                autoNo: list[index].autoNo,
                skuNo: list[index].skuNo,
                editNum: val,
            })
            eidtSkus.push(list[index].skuNo)
        }
    }

    render() {
    const { list, total, loading, selectedRows, selectedRowKeys, page, searchParam } = this.props.editLocks
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
        title: '平台编码',
        dataIndex: 'shopSkuNo',
        key: 'shopSkuNo',
        width: 120,
      },
      {
        title: '商品名称',
        dataIndex: 'productName',
        key: 'productName',
        width: 200,
      },
      {
        title: '锁定数',
        dataIndex: 'lockNum',
        key: 'lockNum',
        width: 100,
        render: (text, record) => {
          return record.lockNum - record.deliveredNum
        },
      },
      {
        title: '可用数',
        dataIndex: 'canUse',
        key: 'canUse',
        width: 80,
      },
      {
        title: '本次修改数',
        dataIndex: 'editNum',
        key: 'editNum',
        width: 120,
        render: (text, record, index) => {
            return <EditableItem maxError="本次修改数不可超过锁定数与可用数总和" max={Number(record.lockNum) + Number(record.canUse)} format="number" value={text} onChange={this.cellChange.bind(this, index)} />
        },
      },
      {
        title: '提示信息',
        dataIndex: 'remark',
        key: 'remark',
        width: 200,
      },
    ]
    // 操作栏
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
        decorator: 'productName',
        components: <Input placeholder="商品名称" size="small" />,
      }]
      const searchBarProps = {
        colItems: searchBarItem,
        dispatch: this.props.dispatch,
        nameSpace: 'editLocks',
        searchParam,
      }
        const tableProps = {
            noListChoose: true,
            dataSource: list,
            total,
            ...page,
            loading,
            columns,
            nameSpace: 'editLocks',
            custormTableClass: 'tablecHeightFix440',
            dispatch: this.props.dispatch,
            selectedRows,
            selectedRowKeys,
            rowKey: 'skuNo',
            tableName: 'editLocksTable',
            scroll: { y: 380 },
        }
        return (
          <div>
            <Modal
              maskClosable={false}
              title="调整库存锁定数"
              visible={this.props.visiable}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              width={1000}
              bodyStyle={{ height: 500, overflowX: 'hidden' }}
              footer={[
                <Button key="submit" type="primary" loading={this.state.submitLoading} onClick={this.handleOk}>
                    批量修改提交数据
                </Button>,
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
