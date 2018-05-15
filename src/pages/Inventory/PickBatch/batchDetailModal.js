/*
 * @Author: chenjie 
 * @Date: 2018-04-11 09:53:55 
 * 拣货批次条码明细
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Modal, Card, Button} from 'antd'
import Jtable from '../../../components/JcTable'
import styles from './index.less'
import { exportBatchDetail } from '../../../services/inventory/pickBatch'

@connect(state => ({
  batchDetail: state.batchDetail,
}))
export default class BatchDetailModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentWillReceiveProps(nextProps) {
      if (this.props.visible !== nextProps.visible && nextProps.visible) {
        this.props.dispatch({
          type: 'batchDetail/fetch',
          payload: {billNo: nextProps.billNo}, 
        })
      }
    }
    handleCancel = () => {
      this.props.hidden()
    }
    handleExport = () => {
      exportBatchDetail({
        fileName: '商品总数.xls',
        billNo: this.props.billNo,
      })
    }
 render() {
    const { list, total, loading, selectedRows, selectedRowKeys, page } = this.props.batchDetail
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
    const tabelToolbar = [
      <Button
        key={1}
        type="primary"
        premission="OPENING_DELETE"
        onClick={this.handleExport}
        size="small"
      >
          导出
      </Button>,
          ]
    // // 搜索栏参数
    // const searchBarProps = {
    //     colItems: searchBarItem,
    //     dispatch: this.props.dispatch,
    //     nameSpace: 'batchOrder',
    //     searchParam,
    //   }
    const columns = [
    {
      title: '商品编号',
      dataIndex: 'skuNo',
      key: 'skuNo',
      width: 150,
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
      key: 'productName',
      width: 150,
    },
    {
      title: '规格',
      dataIndex: 'productSpec',
      key: 'productSpec',
      width: 100,
    },
    {
      title: '单据数量',
      dataIndex: 'billNum',
      key: 'billNum',
      className: styles.columnRight,
      width: 100,
    },
    {
      title: '已拣数',
      dataIndex: 'pickedNum',
      key: 'pickedNum',
      className: styles.columnRight,
      width: 100,
    },
    {
      title: '未拣数',
      dataIndex: 'unPickedNum',
      key: 'unPickedNum',
      className: styles.columnRight,
      width: 100,
    },
    {
      title: '缺货数',
      dataIndex: 'stockoutNum',
      key: 'stockoutNum',
      className: styles.columnRight,
      width: 100,
    },
    {
      title: '仓库名称',
      dataIndex: 'warehouseName',
      key: 'warehouseName',
      width: 120,
    },
    {
      title: '仓位编号',
      dataIndex: 'locationNo',
      key: 'locationNo',
      width: 100,
    },
    {
      title: '仓位顺序',
      dataIndex: 'locationOrder',
      key: 'locationOrder',
      width: 100,
    },
    {
      title: '拣货员',
      dataIndex: 'operateUser',
      key: 'operateUser',
      width: 80,
    },
    {
      title: '拣货时间',
      dataIndex: 'operateTime',
      key: 'operateTime',
      width: 100,
      render: text => moment(text).format('YYYY-MM-DD'),
    },
  ]
    // 表格参数
    const tableProps = {
        toolbar: tabelToolbar,
        noSelected: true,
        dataSource: list,
        total,
        ...page,
        loading,
        columns,
        nameSpace: 'batchDetail',
        tableName: 'batchDetailTable',
        dispatch: this.props.dispatch,
        selectedRows,
        selectedRowKeys,
        rowKey: 'autoNo',
        custormTableClass: 'tablecHeightFix500',
    }
    return (
      <Modal
        title="拣货批次条码明细"
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
