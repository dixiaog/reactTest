/*
 * @Author: chenjie 
 * @Date: 2018-04-21 08:59:32 
 * 生成补货批次
 */

import React, { Component } from "react"
import { connect } from "dva"
import { Modal, Card, Button, Select, InputNumber, Row } from "antd"
import Jtable from "../../../components/JcTable"
import SearchBar from "../../../components/SearchBar"
import SelectInput from "../../../components/SelectInput"
import styles from "./index.less"
import SelectBatchModal from "./selectBatchModal"
import { createRestocking } from "../../../services/inventory/pickBatch"

const Option = Select.Option
@connect(state => ({
  createReplenish: state.createReplenish,
}))
export default class CreateReplenishModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectBatchModalVisible: false,
      unfilledNum: null,
      status: 1,
    }
  }
  componentWillMount() {}
  componentWillReceiveProps(nextProps) {
    if (this.props.visible !== nextProps.visible && nextProps.visible) {
      this.props.dispatch({
        type: "createReplenish/fetch",
        payload: {
          billNoList: nextProps.billNoList,
          status: 1,
        },
      })
    }
  }
  handleCancel = () => {
    this.props.hidden()
  }
  handleStatus = e => {
    this.setState({
      status: e,
    })
  }
  selectbatchs = () => {
    this.setState({
        selectBatchModalVisible: true,
    })
  }
  hidden = () => {
    this.setState({
      selectBatchModalVisible: false,
    })
  }
  handleSelect = (billNoList) => {
    this.setState({
        selectBatchModalVisible: false,
      }) 
    this.props.dispatch({
        type: 'createReplenish/select',
        payload: { billNoList },
    })
  }
  handleSubmit = () => {
    createRestocking({
      restockDTOList: this.props.createReplenish.selectedRows,
      eachBatchOfSku: this.state.unfilledNum,
    }).then((json) => {
      console.log('-->', json)
    })
  }
  numChange = (e) => {
    this.setState({
      unfilledNum: e,
    })
  }
  render() {
    const { list, total, loading, selectedRows, selectedRowKeys, searchParam } = this.props.createReplenish
    const searchBarItem = [
      {
        decorator: "status",
        components: (
          <Select size="small" onChange={this.handleStatus.bind(this)} placeholder="补货类型">
            <Option key={1} value={1}>
              紧急补货
            </Option>
            <Option key={2} value={2}>
              日常补货
            </Option>
          </Select>
        ),
      },
      {
        decorator: "billNoList",
        components: <SelectInput disabled={this.state.status !== 1} onClick={this.selectbatchs} size="small" placeholder="指定拣货批次" />,
      },
    ]

    // 搜索栏参数
    const searchBarProps = {
      colItems: searchBarItem,
      dispatch: this.props.dispatch,
      nameSpace: "createReplenish",
      searchParam,
      requestParam: {
        billNoList: this.props.billNoList,
        status: 1,
      },
    }
    const columns = [
      {
        title: "商品编码",
        dataIndex: "skuNo",
        key: "skuNo",
        width: 160,
      },
      {
        title: "商品名称",
        dataIndex: "productName",
        key: "productName",
        width: 100,
      },
      {
        title: "品牌名称",
        dataIndex: "brandName",
        key: "brandName",
        width: 100,
      },
      {
        title: "商品类目",
        dataIndex: "categoryName",
        key: "categoryName",
        width: 100,
      },
      {
        title: "规格",
        dataIndex: "productSpec",
        key: "productSpec",
        width: 200,
      },
      {
        title: "订单数",
        dataIndex: "orderNum",
        key: "orderNum",
        width: 80,
        className: styles.columnRight,
      },
      {
        title: "整存库存",
        dataIndex: "fullStorageNum",
        key: "fullStorageNum",
        className: styles.columnRight,
        width: 100,
      },
      {
        title: "现有库容",
        dataIndex: "existingCapacity",
        key: "existingCapacity",
        className: styles.columnRight,
        width: 100,
      },
      {
        title: "待执行数",
        dataIndex: "unfilledNum",
        key: "unfilledNum",
        className: styles.columnRight,
        width: 100,
        render: (text, record) => {
          return Math.min.apply(null, [record.fullStorageNum, record.orderNum, record.existingCapacity])
        },
      },
    ]
    // 表格参数
    const tableProps = {
      noSelected: false,
      dataSource: list,
      pagination: true,
      total,
      loading,
      columns,
      nameSpace: "createReplenish",
      tableName: "createReplenishTable",
      dispatch: this.props.dispatch,
      selectedRows,
      selectedRowKeys,
      rowKey: "autoNo",
      scroll: { y: 300 },
      custormTableClass: "tablecHeightFix500",
    }
    return (
      <Modal
        title={this.props.title}
        visible={this.props.visible}
        footer={<Row><InputNumber
                      value={this.state.unfilledNum}
                      onChange={this.numChange.bind(this)}
                      style={{ width: 200, marginRight: 10 }}
                      placeholder="每批次商品数" />
                      <Button onClick={this.handleSubmit}>确定生成</Button></Row>}
        width={1000} maskClosable={false} onCancel={this.handleCancel}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <SearchBar {...searchBarProps} />
            </div>
            <Jtable {...tableProps} />
          </div>
        </Card>
        <SelectBatchModal
            handleSelect={this.handleSelect}
            operateUsers={this.props.operateUsers}
            billNoList={searchParam.billNoList}
            visible={this.state.selectBatchModalVisible}
            hidden={this.hidden}
        />
      </Modal>
    )
  }
}
