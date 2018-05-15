import React, { Component } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Modal, Card } from 'antd'
import Jtable from '../../../components/JcTable'
import styles from './index.less'

@connect(state => ({
  batchOrder: state.batchOrder,
}))
export default class batchOrderModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentWillReceiveProps(nextProps) {
      if (this.props.visible !== nextProps.visible && nextProps.visible) {
        this.props.dispatch({
          type: 'batchOrder/fetch',
          payload: {batchNo: nextProps.billNo}, 
        })
      }
    }
    handleCancel = () => {
      this.props.hidden()
    }
 render() {
    const { list, total, loading, selectedRows, selectedRowKeys, page } = this.props.batchOrder
    // const searchBarItem = [
    //   {
    //     decorator: 'startLocationNo',
    //     components: <Input size="small" placeholder="起始仓位" />,
    //   },
    //   {
    //     decorator: 'endLocationNo',
    //     components: <Input size="small" placeholder="结束仓位" />,
    //   },
    //   {
    //     decorator: 'arrangeStatus',
    //     components: <Checkbox size="small" >未分配</Checkbox>,
    //   }]
        
    //     // 操作栏
    // const tabelToolbar = [
    //   <Select className={styles.operateUser} 
    //      onChange={this.selectOperater.bind(this)} style={{ width: 200, marginRight: 20 }} key={0} mode="multiple" placeholder="请选择分配人员" premission="OPENING_SAVEBYBILLNO" size="small">
    //     {this.props.operateUsers.map((e, i) =><Option key={e}><Tooltip title={e}>{e}</Tooltip></Option>)}
    //   </Select>,
    //   <Button
    //     key={1}
    //     type="primary"
    //     premission="OPENING_DELETE"
    //     disabled={selectedRows.length === 0}
    //     onClick={this.arrangePickTask}
    //     size="small"
    //   >
    //       分配
    //   </Button>,
    //       ]
    // // 搜索栏参数
    // const searchBarProps = {
    //     colItems: searchBarItem,
    //     dispatch: this.props.dispatch,
    //     nameSpace: 'batchOrder',
    //     searchParam,
    //   }
    const columns = [{
      title: '出库单号',
      dataIndex: 'billNo',
      key: 'billNo',
      width: 150,
    },
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 150,
    },
    {
      title: '订单时间',
      dataIndex: 'billDate',
      key: 'billDate',
      width: 150,
      render: text => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: '商品编号',
      dataIndex: 'skuNo',
      key: 'skuNo',
      width: 200,
    },
    {
      title: '款式编码',
      dataIndex: 'productNo',
      key: 'productNo',
      width: 150,
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      // orderNum && skuNo
      key: 'productName',
      width: 200,
      render: (text, record) => {
        return (
          // `${record.orderNum}*${record.skuNo}*${record.}`
          text
        )
      },
    },
    {
      title: '收货地址',
      dataIndex: 'address',
      key: 'address',
      width: 200,
      render: (text, record) => {
        return `${record.city} ${record.province} ${record.county}  ${record.address}`
      },
    },
    {
      title: '收货人',
      dataIndex: 'receiver',
      key: 'receiver',
      width: 100,
    },
    {
      title: '联系电话',
      dataIndex: 'mobileNo',
      key: 'mobileNo',
      width: 100,
    },
  ]
    // 表格参数
    const tableProps = {
        // toolbar: tabelToolbar,
        noSelected: true,
        dataSource: list,
        total,
        ...page,
        loading,
        columns,
        nameSpace: 'batchOrder',
        tableName: 'batchOrderTable',
        dispatch: this.props.dispatch,
        selectedRows,
        selectedRowKeys,
        rowKey: 'autoNo',
        custormTableClass: 'tablecHeightFix500',
    }
    return (
      <Modal
        title="销售出库单"
        visible={this.props.visible}
        footer={null}
        width={1000}
        maskClosable={false}
        onCancel={this.handleCancel}
      >
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>
              <SearchBar {...searchBarProps} />
            </div> */}
            <Jtable {...tableProps} />
          </div>
        </Card>
      </Modal>
    )
}
}
