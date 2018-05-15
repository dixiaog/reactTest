/*
 * @Author: tanmengjia
 * @Date: 2018-02-03 09:02:01
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-27 15:48:41
 * 主仓库存进出明细流水
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Modal, Form, Select, Card, DatePicker, Button } from 'antd'
import styles from '../Inventory.less'
import Jtable from '../../../components/JcTable'
import SearchBar from '../../../components/SearchBar'
import config from '../../../utils/config'
import { getLocalStorageItem } from '../../../utils/utils'

const Option = Select.Option

const columns = [{
    title: '业务类型',
    dataIndex: 'billType',
    key: 'billType',
    width: 100,
    render: (text) => {
        switch (text) {
        case (0):
        return '采购入库'
        case (1):
        return '销售出库'
        case (2):
        return '盘点'
        case (3):
        return '期初'
        case (4):
        return '门店补货'
        case (5):
        return '退货入库'
        default:
    }
    },
    }, {
    title: '日期',
    dataIndex: 'billDate',
    key: 'billDate',
    width: 90,
    render: text => (moment(text).format('YYYY-MM-DD')),
    }, {
    title: '仓库增减数',
    dataIndex: 'billNum',
    key: 'billNum',
    width: 100,
    className: styles.columnRight,
    render: (text, record) => {
        return (
          <div>{record.ioType === -1 ? <div style={{ color: 'red' }}>-{text}</div> : <div>{text}</div> }</div>
        )
      },
    }, {
    title: '进出单仓号',
    dataIndex: 'billNo',
    key: 'billNo',
    width: 100,
    }, {
    title: '内部订单号',
    dataIndex: 'exBillNo',
    key: 'exBillNo',
    width: 100,
    }, {
    title: '仓储方',
    dataIndex: 'warehouseName',
    key: 'warehouseNo',
    width: 100,
    }, {
    title: '店铺',
    dataIndex: 'shopName',
    key: 'shopName',
    width: 100,
    }, {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    width: 100,
    }, {
    title: '操作人',
    dataIndex: 'createUser',
    key: 'createUser',
    width: 100,
  }]

@connect(state => ({
    mainStorehouse: state.mainStorehouse,
  }))
  @Form.create()
export default class MainStorehouse extends Component {
    constructor(props) {
        super(props)
        this.state = {
          startValue: null,
          endValue: null,
          endOpen: false,
          childer: [],
          warehouseNo: null,
        }
      }
      componentWillMount() {
        console.log(this.props)
        if (this.props.type === 1) {
          this.props.dispatch({ type: 'mainStorehouse/fetch', payload: { skuNo: this.props.skuNo } })
        } else if (this.props.type === 2) {
          this.props.dispatch({ type: 'mainStorehouse/fetch1', payload: { skuNo: this.props.skuNo, warehouseNo: this.props.warehouseNo } })
        }
        this.props.dispatch({ type: 'mainStorehouse/getWarehouse' })
        const ii = JSON.parse(getLocalStorageItem('user'))
        this.setState({
          warehouseNo: ii.warehouseNo,
        })
      }
      componentWillReceiveProps(nextProps) {
        const beginBillDate = nextProps.mainStorehouse.searchParam.beginBillDate
        const endBillDate = nextProps.mainStorehouse.searchParam.endBillDate
        if (beginBillDate === undefined) {              // 判断开始时间为undefined时清空不可选择时间
          this.setState({
            startValue: null,
          })
        }
        if (endBillDate === undefined) {                 // 判断开始时间为undefined时清空不可选择时间
          this.setState({
            endValue: null,
          })
        }
      }
      onStartChange = (value) => {
        this.onChange('startValue', value)
      }
    
      onEndChange = (value) => {
        this.onChange('endValue', value)
      }
      onChange = (field, value) => {
        this.setState({
          [field]: value,
        })
      }
    handleOk = () => {
        this.props.form.resetFields()
        this.props.itemModalHidden()
        this.props.dispatch({ type: 'mainStorehouse/clean' })
    }
      handleCancel = () => {
        this.props.form.resetFields()
        this.props.itemModalHidden()
        this.props.dispatch({ type: 'mainStorehouse/clean' })
      }
      exportDetail = () => {
        const search = this.props.mainStorehouse.searchParam
        const start = search.beginBillDate === undefined ? undefined : moment(search.beginBillDate).format('YYYY-MM-DD')
        const end = search.endBillDate === undefined ? undefined : moment(search.endBillDate).format('YYYY-MM-DD')
        Object.assign(search, { beginBillDate: start, endBillDate: end })
        Object.assign(search, { skuNo: this.props.skuNo })
        if (this.props.warehouseNo) {
          Object.assign(search, { warehouseNo: this.props.warehouseNo })
          this.props.dispatch({
            type: 'mainStorehouse/exportDetail1',
            payload: { searchParam: search, IDLst: [], fileName: '主仓库存进出明细流水.xls' },
          })
        } else {
          this.props.dispatch({
            type: 'mainStorehouse/exportDetail',
            payload: { searchParam: search, IDLst: [], fileName: '主仓库存进出明细流水.xls' },
          })
        }
      }
      disabledStartDate = (startValue) => {
        const endValue = this.state.endValue
        if (!startValue || !endValue) {
          return false
        }
        return startValue.valueOf() > endValue.valueOf()
      }
      handleStartOpenChange = (open) => {
        if (!open) {
          this.setState({ endOpen: false })
        }
      }
      disabledEndDate = (endValue) => {
        const startValue = this.state.startValue
        if (!endValue || !startValue) {
          return false
        }
        return endValue.valueOf() <= startValue.valueOf()
      }
      handleEndOpenChange = (open) => {
        this.setState({ endOpen: open })
      }
render() {
    const { list, loading, searchParam, total, page, selectedRowKeys, selectedRows, warehouses } = this.props.mainStorehouse
    const { endOpen } = this.state
    const tabelToolbar = [
      <Button key={1} type="primary" premission="DIVISION_GETINOUTDAT" size="small" onClick={this.exportDetail}>导出</Button>,
     ]
    const tableProps = {
        toolbar: tabelToolbar,
        noListChoose: true,
        noSelected: false,
        dataSource: list,
        total,
        isPart: true,
        ...page,
        loading,
        columns,
        nameSpace: 'mainStorehouse',
        tableName: 'mainStorehouseTable',
        custormTableClass: 'tablecHeightFix340',
        dispatch: this.props.dispatch,
        selectedRows,
        selectedRowKeys,
        rowKey: 'autoNo',
        scroll: { y: 300 },
    }
      const searchBarItem = [{
          decorator: 'billType',
          components: (
            <Select placeholder="--业务类型--" size="small" style={{ marginTop: 4 }}>
              <Option value={0}>采购入库</Option>
              <Option value={1}>销售出库</Option>
              <Option value={2}>盘点</Option>
              <Option value={3}>期初</Option>
              <Option value={4}>门店补货</Option>
              <Option value={5}>退货入库</Option>
            </Select>
          ),
        }, {
            decorator: 'beginBillDate',
            components: (<DatePicker
              disabledDate={this.disabledStartDate}
              format="YYYY-MM-DD"
              onChange={this.onStartChange}
              onOpenChange={this.handleStartOpenChange}
              size={config.InputSize}
              placeholder="生效时间起"
            />),
          }, {
            decorator: 'endBillDate',
            components: (<DatePicker
              disabledDate={this.disabledEndDate}
              format="YYYY-MM-DD"
              onChange={this.onEndChange}
              open={endOpen}
              onOpenChange={this.handleEndOpenChange}
              size={config.InputSize}
              placeholder="生效时间止"
            />),
        }, {
            decorator: 'warehouseNo',
            components: (
              <Select placeholder="--仓储方--" size="small" style={{ marginTop: 4 }} disabled={this.props.type === 2}>
                {warehouses && warehouses.length && this.props.type === 2 ?
                  warehouses.map((ele) => <Option key={ele.warehouseNo} value={ele.warehouseNo}>{this.props.selectData
                                                  && ele.warehouseNo === this.props.selectData.warehouseNo ? '本仓' : ele.warehouseName}</Option>)
                : warehouses.map((ele) => <Option key={ele.warehouseNo} value={ele.warehouseNo}>{this.state.warehouseNo
                                                  && ele.warehouseNo === this.state.warehouseNo ? '本仓' : ele.warehouseName}</Option>)}
              </Select>
            ),
        },
        ]
        const sp = this.props.type === 2 ? Object.assign(searchParam, { warehouseNo: this.props.warehouseNo, skuNo: this.props.skuNo }): Object.assign(searchParam, { skuNo: this.props.skuNo })
        const rp = this.props.type === 2 ? { skuNo: this.props.skuNo, warehouseNo: this.props.warehouseNo } : { skuNo: this.props.skuNo }
        const searchBarProps = {
          colItems: searchBarItem,
          dispatch: this.props.dispatch,
          nameSpace: 'mainStorehouse',
          searchParam: sp,
          requestParam: rp,
        }
    return (
      <div>
        <Modal
          className="mainStorehouse"
          maskClosable={false}
          title="主仓库存进出明细流水"
          visible={this.props.detailModalVisiable}
          onCancel={this.handleCancel}
          width="1000px"
          bodyStyle={{
            minHeight: 500,
          }}
          footer={[
            <Button key="submit" type="primary" onClick={this.handleOk}>
              确定
            </Button>,
          ]}
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
