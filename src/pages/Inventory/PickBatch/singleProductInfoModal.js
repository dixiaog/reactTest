import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Card, Button} from 'antd'
import Jtable from '../../../components/JcTable'
// import SearchBar from '../../../components/SearchBar'
import styles from './index.less'

@connect(state => ({
  batchSignProductInfo: state.batchSignProductInfo,
}))
export default class SingleProductInfoModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    componentWillReceiveProps(nextProps) {
      if (this.props.visible !== nextProps.visible && nextProps.visible) {
        this.props.dispatch({
          type: 'batchSignProductInfo/fetch',
          payload: {billNo: nextProps.billNo}, 
        })
      }
    }
    export = () => {
      this.props.dispatch({
        type: 'batchSignProductInfo/export',
        payload: {
          billNo: this.props.billNo,
          fileName: '拣货明细.xls',
        }, 
      })
    }
    handleCancel = () => {
      this.props.hidden()
    }
 render() {
    const { list, total, loading, selectedRows, selectedRowKeys, page } = this.props.batchSignProductInfo
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
        onClick={this.export}
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
      width: 200,
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
      title: '数量',
      dataIndex: 'billNum',
      key: 'billNum',
      className: styles.columnRight,
      width: 80,
    },
    {
      title: '已拣数',
      dataIndex: 'pickedNum',
      key: 'pickedNum',
      className: styles.columnRight,
      width: 80,
    },
    {
      title: '未拣数',
      dataIndex: 'unPickedNum',
      key: 'unPickedNum',
      className: styles.columnRight,
      width: 80,
    },
    {
      title: '缺货数',
      dataIndex: 'stockoutNum',
      key: 'stockoutNum',
      className: styles.columnRight,
      width: 80,
    },
    {
      title: '已出库',
      dataIndex: 'deliveryNum',
      key: 'deliveryNum',
      className: styles.columnRight,
      width: 100,
    },
    {
      title: '款式编码',
      dataIndex: 'productNo',
      key: 'productNo',
      width: 150,
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
        nameSpace: 'batchSignProductInfo',
        tableName: 'batchSignProductInfoTable',
        dispatch: this.props.dispatch,
        selectedRows,
        selectedRowKeys,
        rowKey: 'skuNo',
        custormTableClass: 'tablecHeightFix500',
    }
    console.log(this.props)
    return (
      <Modal
        title="单品种类明细"
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
