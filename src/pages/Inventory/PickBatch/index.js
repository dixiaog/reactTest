/*
 * @Author: chenjie 
 * @Date: 2018-04-08 15:17:07 
 * 拣货批次管理
 */

import React, { Component } from "react"
import { connect } from "dva"
import { Select, Button, Dropdown, Menu, Icon, Tag, DatePicker, Input, Checkbox, Modal, Tooltip, Spin } from "antd"
import moment from "moment"
import SearchBar from "../../../components/SearchBar"
import styles from "./index.less"
import Jtable from "../../../components/JcTable"
import { effectFetch } from '../../../utils/utils'
// import { checkPremission } from '../../../utils/utils'
// import { getOtherStore } from "../../../utils/otherStore"
import CreateBatchModal from "./createBatchModal"
import ShopReplenishment from "./shopReplenishmentModal"
import ArrangeBatchModal from "./arrangeBatchModal"
import LowerFrameModal from "./IowerFrame/iowerFrameModal"
import RepairModal from "./Repair/RepairModal"
import BatchOrderModal from "./batchOrderModal"
import SingleProductInfoModal from "./singleProductInfoModal"
import BatchDetailModal from "./batchDetailModal"
import CreateReplenishModal from "./createReplenishModal"
import { endTask, updateBatchMark, exportOrderInfo, exportPickInfo, toRelay } from "../../../services/inventory/pickBatch"

const Option = Select.Option
@connect(state => ({
  pickBatch: state.pickBatch,
}))
export default class PickBatch extends Component {
  constructor(props) {
    super(props)
    this.state = {
      startValue: null,
      endValue: null,
      createBatchModalTitle: "",
      createBatchModalVisible: false,
      ShopReplenishmentvis: false,
      arrangeBatchModalVisible: false,
      iowerFrameModalvis: false,
      repairModalvis: false,
      batchOrderModalVisible: false,
      singleProductInfoModalVisible: false,
      batchDetailModalVisible: false,
      createReplenishVisible: false,
      editMarkVisible: false,
      batchType: 0,
      billNo: 0,
      billNoList: [],
      mark: "",
      relayBillNo: 0,
    }
  }

  componentDidMount() {
    // const { pickBatch } = getOtherStore()
    // if (!pickBatch || pickBatch.list.length === 0) {
    //   this.props.dispatch({ type: 'pickBatch/fetch' })
    // }
    effectFetch('pickBatch', this.props.dispatch)
    // this.props.dispatch({ type: "pickBatch/fetch" })
  }

  componentWillReceiveProps(nextProps) {}
  onStartChange = value => {
    this.onChange("startValue", value)
  }

  onEndChange = value => {
    this.onChange("endValue", value)
  }
  onChange = (field, value) => {
    this.setState({
      [field]: value,
    })
  }
  disabledEndDate = endValue => {
    const startValue = this.state.startValue
    if (!endValue || !startValue) {
      return false
    }
    return endValue.valueOf() <= startValue.valueOf()
  }

  disabledStartDate = startValue => {
    const endValue = this.state.endValue
    if (!startValue || !endValue) {
      return false
    }
    return startValue.valueOf() > endValue.valueOf()
  }
  handleStartOpenChange = open => {
    if (!open) {
      this.setState({ endOpen: true })
    }
  }
  handleEndOpenChange = open => {
    this.setState({ endOpen: open })
  }
  handleExport = e => {
    switch (e.key * 1) {
      case 1:
        exportOrderInfo({
          billNoList: this.props.pickBatch.selectedRowKeys,
          fileName: `批次订单 ${moment().format("YYYY-MM-DD HH:mm:ss")}.xls`,
        })
        break
      case 2:
        exportPickInfo({
          billNoList: this.props.pickBatch.selectedRowKeys,
          fileName: `拣货批次信息 ${moment().format("YYYY-MM-DD HH:mm:ss")}.xls`,
        })
        break
      default:
        break
    }
  }
  createBatch = e => {
    let title = ""
    switch (e.key * 1) {
      case 1:
        title = "生成单件(整存)"
        this.setState({
          createBatchModalTitle: title,
          createBatchModalVisible: true,
          batchType: e.key,
        })
        break
      case 2:
        title = "生成单件(零拣)"
        this.setState({
          createBatchModalTitle: title,
          createBatchModalVisible: true,
          batchType: e.key,
        })
        break
      case 3:
        title = "生成多件"
        this.setState({
          createBatchModalTitle: title,
          createBatchModalVisible: true,
          batchType: e.key,
        })
        break
      case 4:
        title = "生成现场取货或大订单"
        this.setState({
          createBatchModalTitle: title,
          createBatchModalVisible: true,
          batchType: e.key,
        })
        break
      case 5:
        title = "生成补货批次"
        const stockoutBatchs = this.props.pickBatch.selectedRows.length ? this.props.pickBatch.selectedRows.filter(e => e.stockoutNum > 0) : []
        this.setState({
          createBatchModalTitle: title,
          createReplenishVisible: true,
          billNoList: stockoutBatchs.map(e => e.billNo),
        })
        break
      case 6:
        title = "生成唯品会批次"
        this.setState({
          createBatchModalTitle: title,
          createBatchModalVisible: true,
          batchType: e.key,
        })
        break
      case 7:
        title = "生成门店补货"
        break
      case 8:
        title = "生成移货下架"
        break
      case 9:
        title = "生成整补任务"
        break
      default:
        break
    }
    if (e.key === "7") {
      this.setState({
        createBatchModalTitle: title,
        ShopReplenishmentvis: true,
        batchType: e.key,
      })
    } else if (e.key === "8") {
      this.setState({
        createBatchModalTitle: title,
        iowerFrameModalvis: true,
        batchType: e.key,
      })
    } else if (e.key === "9") {
      this.setState({
        createBatchModalTitle: title,
        repairModalvis: true,
        batchType: e.key,
      })
    } else {
      this.setState({
        createBatchModalTitle: title,
        createBatchModalVisible: true,
        batchType: e.key,
      })
    }
  }
  hiddenModel = () => {
    this.setState({
      createBatchModalVisible: false,
      arrangeBatchModalVisible: false,
      batchOrderModalVisible: false,
      singleProductInfoModalVisible: false,
      batchDetailModalVisible: false,
      createReplenishVisible: false,
    })
  }
  batchOrderDetail = record => {
    this.setState({
      batchOrderModalVisible: true,
      billNo: record.billNo,
    })
  }
  singleProductInfo = record => {
    this.setState({
      singleProductInfoModalVisible: true,
      billNo: record.billNo,
    })
  }
  batchDetail = record => {
    this.setState({
      batchDetailModalVisible: true,
      billNo: record.billNo,
    })
  }
  handleEndTask = () => {
    endTask({
      billNoList: this.props.pickBatch.selectedRowKeys,
    }).then(json => {
      if (json) {
        this.props.dispatch({ type: "pickBatch/search" })
      }
    })
  }
  handleEditMark = () => {
    updateBatchMark({
      billNoList: this.props.pickBatch.selectedRowKeys,
      batchMark: this.state.mark,
    }).then(json => {
      if (json) {
        this.props.dispatch({ type: "pickBatch/search" })
        this.setState({
          editMarkVisible: false,
        })
      }
    })
  }
  handleRelay = (record) => {
    this.setState({
      relayBillNo: record.billNo,
    })
    toRelay({
      billNo: record.billNo,
      billType: record.billType,
      billStatus: record.billStatus,
    }).then((json) => {
      if (json) {
        this.props.dispatch({ type: "pickBatch/search" })
      }
      this.setState({
        relayBillNo: 0,
      })
    })
  }
  render() {
    const {
      endOpen,
      createBatchModalTitle,
      createBatchModalVisible,
      arrangeBatchModalVisible,
      batchOrderModalVisible,
      singleProductInfoModalVisible,
      batchDetailModalVisible,
      createReplenishVisible,
      billNoList,
      batchType,
    } = this.state
    const buildBatch = (
      <Menu onClick={this.createBatch.bind(this)}>
        <Menu.Item key="1">生成单件(整存)</Menu.Item>
        <Menu.Item key="2">生成单件(零拣)</Menu.Item>
        <Menu.Item key="3">生成多件</Menu.Item>
        <Menu.Item key="4">生成现场取货或大订单</Menu.Item>
        <Menu.Item key="5">生成补货</Menu.Item>
        <Menu.Item key="6">生成唯品会批次</Menu.Item>
        <Menu.Item key="7">生成门店补货</Menu.Item>
        <Menu.Item key="8">生成移货下架</Menu.Item>
        <Menu.Item key="9">生成整补任务</Menu.Item>
      </Menu>
    )
    const exportSelect = (
      <Menu onClick={this.handleExport.bind(this)}>
        <Menu.Item key="1">导出勾选批次订单</Menu.Item>
        <Menu.Item key="2">导出勾选批次拣货信息</Menu.Item>
      </Menu>
    )
    const { list, total, loading, selectedRows, selectedRowKeys, page, searchParam, operateUsers } = this.props.pickBatch
    // 操作栏
    const tabelToolbar = [
      <Dropdown key={0} premission="PICKBATCH_CREATE" overlay={buildBatch}>
        <Button type="primary" size="small">
          生成拣货批次 <Icon type="down" />
        </Button>
      </Dropdown>,
      <Button
        key={1}
        premission="PICKBATCH_GETPICK"
        type="primary"
        size="small"
        disabled={selectedRowKeys.length === 0 || selectedRowKeys.length > 1 || selectedRows[0].billStatus * 1 > 1}
        onClick={() => {
          this.setState({
            arrangeBatchModalVisible: true,
            billNo: selectedRows[0].billNo,
          })
        }}
      >
        安排|重新安排拣货任务
      </Button>,
      <Tooltip key={2} premission="PICKBATCH_END" title="只有未完成批次可操作">
        <Button type="primary" size="small" disabled={selectedRows.length === 0 || selectedRows.filter(e => e.billStatus > 1).length > 0} onClick={this.handleEndTask.bind(this)}>
          结束任务
        </Button>
      </Tooltip>,
      <Button
        key={3}
        premission="PICKBATCH_CHANGEICON"
        type="primary"
        size="small"
        disabled={selectedRows.length === 0}
        onClick={() => {
          this.setState({
            editMarkVisible: true,
          })
        }}
      >
        修改标志
      </Button>,
      <Dropdown key={4} premission="PICKBATCH_EXPORTORD" overlay={exportSelect} disabled={selectedRowKeys.length === 0}>
        <Button type="primary" size="small" disabled={selectedRowKeys.length === 0}>
          导出与统计 <Icon type="down" />
        </Button>
      </Dropdown>,
    ]
    const columns = [
      {
        title: "编号",
        dataIndex: "key",
        key: "key",
        width: 50,
        render: (text, record, index) => {
          return <span>{index + 1}</span>
        },
      },
      {
        title: "拣货批次",
        dataIndex: "billNo",
        key: "billNo",
        width: 100,
        // render: (text, record) => <a >{text}</a>,
      },
      {
        title: "类型",
        dataIndex: "billType",
        key: "billType",
        width: 100,
        render: text => {
          switch (text * 1) {
            case 0:
              return <Tag color="green">单件批次</Tag>
            case 1:
              return <Tag color="volcano">多件批次</Tag>
            case 2:
              return <Tag color="orange">现场大单</Tag>
            case 3:
              return <Tag color="magenta">补货批次</Tag>
            case 4:
              return <Tag color="gold">唯品会批次</Tag>
            case 5:
              return <Tag color="cyan">移库下架</Tag>
            case 6:
              return <Tag color="blue">门店补货</Tag>
            default:
              return <Tag color="red">未知</Tag>
          }
        },
      },
      {
        title: "订单数",
        dataIndex: "numberOfOrders",
        key: "numberOfOrders",
        width: 70,
        className: styles.columnRight,
        render: (text, record) => <a onClick={this.batchOrderDetail.bind(this, record)}>{text}</a>,
      },
      {
        title: "单品种类数",
        dataIndex: "singleSkuNum",
        key: "singleSkuNum",
        width: 120,
        className: styles.columnRight,
        render: (text, record) => <a onClick={this.singleProductInfo.bind(this, record)}>{text}</a>,
      },
      {
        title: "商品总数",
        dataIndex: "billNum",
        key: "billNum",
        width: 120,
        className: styles.columnRight,
        render: (text, record) => <a onClick={this.batchDetail.bind(this, record)}>{text}</a>,
      },
      {
        title: "已拣数",
        dataIndex: "pickedNum",
        key: "pickedNum",
        width: 70,
        className: styles.columnRight,
      },
      {
        title: "未拣数",
        dataIndex: "unPickedNum",
        key: "unPickedNum",
        width: 70,
        className: styles.columnRight,
      },
      {
        title: "缺货数",
        dataIndex: "stockoutNum",
        key: "stockoutNum",
        width: 70,
        className: styles.columnRight,
      },
      {
        title: "接力",
        dataIndex: "again",
        key: "again",
        width: 50,
        render: (text, record) => {
            if ([1,2,4,6].indexOf(record.billType * 1) > -1 && record.billStatus === 1 && record.stockoutNum > 0) {
              if (record.billNo === this.state.relayBillNo) {
                return <Spin />
              } else { 
                return <a onClick={this.handleRelay.bind(this,record)}>接力</a>
              }
            } else {
              return null
            }
          
        },
      },
      {
        title: "状态",
        dataIndex: "billStatus",
        key: "billStatus",
        width: 120,
        render: text => {
          switch (text * 1) {
            case 0:
              return <Tag color="#87d068">等待拣货</Tag>
            case 1:
              return <Tag color="#2db7f5">正在拣货</Tag>
            case 2:
              return <Tag color="magenta">终止拣货</Tag>
            case 3:
              return <Tag color="#108ee9">已完成</Tag>
            default:
              return <Tag color="red">未知</Tag>
          }
        },
      },
      {
        title: "安排情况",
        dataIndex: "arrangeStatus",
        key: "arrangeStatus",
        width: 120,
        render: text => {
          switch (text * 1) {
            case 0:
              return <Tag color="#87d068">未安排</Tag>
            case 1:
              return <Tag color="magenta">部分安排</Tag>
            case 2:
              return <Tag color="#108ee9">已安排</Tag>
            default:
              return <Tag color="red">未知</Tag>
          }
        },
      },
      {
        title: "生成日期",
        dataIndex: "billDate",
        key: "billDate",
        width: 120,
        render: e => moment(e).format("YYYY-MM-DD"),
      },
      {
        title: "标志",
        dataIndex: "batchMark",
        key: "batchMark",
      },
      {
        title: "混合拣货",
        dataIndex: "isMixed",
        key: "isMixed",
        width: 120,
        render: e => <Checkbox checked={e} />,
      },
    ]
    // 表格参数
    const tableProps = {
      toolbar: tabelToolbar,
      dataSource: list,
      total,
      ...page,
      loading,
      columns,
      nameSpace: "pickBatch",
      dispatch: this.props.dispatch,
      selectedRows,
      selectedRowKeys,
      rowKey: "billNo",
      tableName: "pickBatchTable",
      scroll: { x: 1600 },
    }
    const searchBarItem = [
      // 搜索栏
      {
        decorator: "billNo",
        components: <Input placeholder="批次号" size="small" />,
      },
      {
        decorator: "startBillDate",
        components: (
          <DatePicker disabledDate={this.disabledStartDate} format="YYYY-MM-DD" placeholder="开始时间" size="small" onChange={this.onStartChange} onOpenChange={this.handleStartOpenChange} />
        ),
      },
      {
        decorator: "endBillDate",
        components: (
          <DatePicker disabledDate={this.disabledEndDate} format="YYYY-MM-DD" placeholder="结束时间" size="small" onChange={this.onEndChange} open={endOpen} onOpenChange={this.handleEndOpenChange} />
        ),
      },
      {
        decorator: "batchMark",
        components: <Input placeholder="标志" size="small" />,
      },
      {
        decorator: "operateUser",
        components: (
          <Select className={styles.operateUser} mode="multiple" placeholder="拣货员" size="small">
            {operateUsers.length
              ? operateUsers.map((e, i) => (
                  <Option key={i} value={e}>
                    {e}
                  </Option>
                ))
              : null}
          </Select>
        ),
      },
      {
        decorator: "skuNo",
        components: <Input placeholder="商品编码" size="small" />,
      },
      {
        decorator: "billType",
        components: (
          <Select placeholder="拣货类型" size="small">
            <Option key="0">单件批次</Option>
            <Option key="1">多件批次</Option>
            <Option key="2">直发批次</Option>
            <Option key="3">现场大单</Option>
            <Option key="4">补货批次</Option>
            <Option key="5">唯品会批次</Option>
            <Option key="6">移库下架</Option>
            <Option key="7">门店补货</Option>
          </Select>
        ),
      },
      {
        decorator: "billStatus",
        components: (
          <Select placeholder="批次状态" size="small">
            <Option key="0">等待拣货</Option>
            <Option key="1">正在拣货</Option>
            <Option key="2">终止拣货</Option>
            <Option key="3">已完成</Option>
          </Select>
        ),
      },
      {
        decorator: "arrangeStatus",
        components: (
          <Select placeholder="安排情况" size="small">
            <Option key="0">未安排</Option>
            <Option key="1">部分安排</Option>
            <Option key="2">已安排</Option>
          </Select>
        ),
      },
    ]
    const searchBarProps = {
      colItems: searchBarItem,
      dispatch: this.props.dispatch,
      nameSpace: "pickBatch",
      searchParam,
    }
    const ShopReplenishmentData = {
      visible: this.state.ShopReplenishmentvis,
      hidden: () => {
        this.setState({
          ShopReplenishmentvis: false,
        })
      },
      batchType: this.state.batchType,
      title: createBatchModalTitle,
    }
    const LowerFrameModalData = {
      visible: this.state.iowerFrameModalvis,
      hidden: () => {
        this.setState({
          iowerFrameModalvis: false,
        })
      },
      batchType: this.state.batchType,
      title: createBatchModalTitle,
      // 导入生成移货下架 生成批次成功刷新页面
      Refresh: () => {
        this.setState({
          iowerFrameModalvis: false,
        }, () => {
          this.props.dispatch({ type: "pickBatch/fetch" })
        })
      },
    }
    const RepairModalData = {
      visible: this.state.repairModalvis,
      hidden: () => {
        this.setState({
          repairModalvis: false,
        })
      },
      batchType: this.state.batchType,
      title: createBatchModalTitle,
      // 导入生成批次成功刷新页面
      Refresh: () => {
        this.setState({
          repairModalvis: false,
        }, () => {
          this.props.dispatch({ type: "pickBatch/fetch" })
        })
      },
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
        <CreateBatchModal batchType={batchType} title={createBatchModalTitle} visible={createBatchModalVisible} hidden={this.hiddenModel} />
        {this.state.ShopReplenishmentvis ? <ShopReplenishment {...ShopReplenishmentData} /> : null}
        <ArrangeBatchModal operateUsers={operateUsers} visible={arrangeBatchModalVisible} hidden={this.hiddenModel} billNo={this.state.billNo} />
        {this.state.iowerFrameModalvis ? <LowerFrameModal {...LowerFrameModalData} /> : null}
        {this.state.repairModalvis ? <RepairModal {...RepairModalData} /> : null}
        <BatchOrderModal visible={batchOrderModalVisible} hidden={this.hiddenModel} billNo={this.state.billNo} />
        <SingleProductInfoModal visible={singleProductInfoModalVisible} hidden={this.hiddenModel} billNo={this.state.billNo} />
        <BatchDetailModal visible={batchDetailModalVisible} hidden={this.hiddenModel} billNo={this.state.billNo} />
        <CreateReplenishModal
          visible={createReplenishVisible}
          hidden={this.hiddenModel}
          billNoList={billNoList}
          operateUsers={this.props.operateUsers}
          // billNo={this.state.billNo}
        />
        <Modal
          title="修改标志"
          visible={this.state.editMarkVisible}
          width={500}
          maskClosable={false}
          onOk={this.handleEditMark.bind(this)}
          onCancel={() => {
            this.setState({ editMarkVisible: false })
          }}
        >
          <Input
            placeholder="请输入标志"
            onChange={e => {
              this.setState({ mark: e.target.value })
            }}
          />
        </Modal>
      </div>
    )
  }
}
