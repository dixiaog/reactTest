/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-12 15:11:53
 * 绑定订单
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Modal, Select, Input, DatePicker, Table, message } from 'antd'
import SearchBar from '../../../components/SearchBar'
import styles from '../AfterSale.less'
import { updateAsAfterSaleOrderNo } from '../../../services/aftersale/afterSearch'

const Option = Select.Option

@connect(state => ({
  bindOrder: state.bindOrder,
  afterSearch: state.afterSearch,
}))
export default class bindOrder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      startValue: moment().subtract(0, 'days'),
      endValue: moment().subtract(-7, 'days'),
      endOpen: false,
      asNo: 0,
      info: 0,
      expandedRowKeys: [],
      selectedRowKeys: [],
      flag: 'siteOrderNo',
      flagT: 'siteBuyerNo',
      selectedRows: [],
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.bindOrder.disabled) {
      this.setState({
        startValue: null,
        endValue: null,
      })
      this.props.dispatch({
        type: 'bindOrder/changeState',
        payload: { disabled: false },
      })
    }
    if (nextProps.bindOrder.expand) {
      this.setState({
        expandedRowKeys: [],
      })
      this.props.dispatch({
        type: 'bindOrder/changeState',
        payload: { expand: false },
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
  // 获取子元素
  getChild = (expanded, record) => {
    const newKeys = this.state.expandedRowKeys
    const index = newKeys.findIndex(ele => ele === record.orderNo)
    if (expanded) {
      newKeys.push(record.orderNo)
    } else {
      newKeys.splice(index, 1)
    }
    this.setState({
      expandedRowKeys: newKeys,
    })
    if (expanded) {
      this.props.dispatch({
        type: 'bindOrder/changeState',
        payload: { orderNo: record.orderNo },
      })
      this.props.dispatch({
        type: 'bindOrder/getChild',
        payload: { orderNo: record.orderNo },
      })
    }
  }
  handleSubmit = () => {
    if (this.state.selectedRows.length) {
      updateAsAfterSaleOrderNo({ orderNo: this.state.selectedRows[0].orderNo, asNo: this.props.afterSearch.selectedRowKeys[0] }).then((json) => {
        if (json) {
          this.hideModal()
          this.props.dispatch({
            type: 'afterSearch/search',
          })
        }
      })
    } else {
      message.warning('请选择一笔订单')
    }
  }
  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue
    if (!endValue || !startValue) {
      return false
    }
    return endValue.valueOf() <= startValue.valueOf()
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
      this.setState({ endOpen: true })
    }
  }
  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open })
  }
  // 选取线上/内部/快递单号
  asNo = (e) => {
    this.setState({
      asNo: e,
    })
    this.props.dispatch({
      type: 'bindOrder/changeState',
      payload: { billNo: e },
    })
    if (e === 0) {
      this.setState({
        flag: 'siteOrderNo',
      })
    } else if (e === 1) {
      this.setState({
        flag: 'orderNo',
      })
    } else {
      this.setState({
        flag: 'expressNo',
      })
    }
  }
  // 选取买家账号/收货人/手机号码
  Info = (e) => {
    this.setState({
      info: e,
    })
    this.props.dispatch({
      type: 'bindOrder/changeState',
      payload: { Info: e },
    })
    if (e === 0) {
      this.setState({
        flagT: 'siteBuyerNo',
      })
    } else if (e === 1) {
      this.setState({
        flagT: 'receiver',
      })
    } else {
      this.setState({
        flagT: 'mobileNo',
      })
    }
  }
  // 关闭窗口
  hideModal = () => {
    this.props.dispatch({
      type: 'bindOrder/changeState',
      payload: {
        searchParam: {},
      },
    })
    this.setState({
      confirmLoading: false,
      asNo: 0,
      info: 0,
      expandedRowKeys: [],
      selectedRowKeys: [],
      selectedRows: [],
    })
    this.props.dispatch({
      type: 'bindOrder/changeState',
      payload: { searchParam: { startTime: moment().subtract(0, 'days'), endTime: moment().subtract(-7, 'days') } },
    })
    this.props.hideModal()
  }
  render() {
    const { endOpen } = this.state
    const { list, total, loading, searchParam, current, pageSize, warehouseList, shopList, suppliers, expressList } = this.props.bindOrder
    const selectAfter = (
      <Select value={this.state.asNo} style={{ width: 90 }} onChange={this.asNo}>
        <Option value={0}>线上单号</Option>
        <Option value={1}>内部单号</Option>
        <Option value={2}>快递单号</Option>
      </Select>
    )
    const user = (
      <Select value={this.state.info} style={{ width: 90 }} onChange={this.Info}>
        <Option value={0}>买家账号</Option>
        <Option value={1}>收货人</Option>
        <Option value={2}>手机号</Option>
      </Select>
    )
    const { show } = this.props
    const rowSelection = {
      type: 'radio',
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (rowKeys, rows) => {
        this.setState({
          selectedRowKeys: rowKeys,
          selectedRows: rows,
        })
      },
    }
    const columns = [
      {
        title: '订单号',
        dataIndex: 'orderNo',
        key: 'orderNo',
        width: 120,
      },
      {
        title: '订单日期',
        dataIndex: 'orderDate',
        key: 'orderDate',
        width: 120,
        render: (text) => {
          return moment(text).format('YYYY-MM-DD')
        },
      },
      {
        title: '买家账号',
        dataIndex: 'siteBuyerNo',
        key: 'siteBuyerNo',
        width: 120,
      },
      {
        title: '店铺',
        dataIndex: 'shopName',
        key: 'shopName',
        width: 120,
      },
      {
        title: '店铺(外部)订单号',
        dataIndex: 'siteOrderNo',
        key: 'siteOrderNo',
        width: 190,
      },
      {
        title: '应付金额',
        dataIndex: 'payAmount',
        key: 'payAmount',
        width: 120,
      },
      {
        title: '运费',
        dataIndex: 'actualPayment',
        key: 'actualPayment',
        width: 120,
      },
      {
        title: '订单类型',
        dataIndex: 'actualReturnAmount',
        key: 'actualReturnAmount',
        width: 120,
      },
      {
        title: '收货人',
        dataIndex: 'receiver',
        key: 'receiver',
        width: 120,
      },
      {
        title: '移动电话',
        dataIndex: 'mobileNo',
        key: 'mobileNo',
        width: 120,
      },
      {
        title: '固定电话',
        dataIndex: 'telNo',
        key: 'telNo',
        width: 120,
      },
      {
        title: '卖家备注',
        dataIndex: 'sellerRemark',
        key: 'asStatus',
        width: 120,
      },
      {
        title: '买家留言',
        dataIndex: 'buyerRemark',
        key: 'buyerRemark',
        width: 120,
      },
      {
        title: '收货地址',
        dataIndex: 'address',
        key: 'address',
        width: 120,
      },
      {
        title: '快递公司',
        dataIndex: 'expressCorpName',
        key: 'expressCorpName',
        width: 120,
      },
      {
        title: '快递单号(运单号)',
        dataIndex: 'expressNo',
        key: 'expressNo',
        width: 190,
      },
    ]
    const searchBarItem = [ // 搜索栏
      {
        decorator: 'startTime',
        components: (<DatePicker
          disabledDate={this.disabledStartDate}
          format="YYYY-MM-DD"
          placeholder="订单开始时间"
          size="small"
          onChange={this.onStartChange}
          onOpenChange={this.handleStartOpenChange}
        />),
      },
      {
        decorator: 'endTime',
        components: (<DatePicker
          disabledDate={this.disabledEndDate}
          format="YYYY-MM-DD"
          placeholder="订单结束时间"
          size="small"
          onChange={this.onEndChange}
          open={endOpen}
          onOpenChange={this.handleEndOpenChange}
        />),
      },
      {
        decorator: 'shopNo',
        components: (
          <Select
            placeholder="选择店铺"
            size="small"
          >
            {shopList.length ? shopList.map(ele => <Option key={ele.shopNo} value={ele.shopNo}>{ele.shopName}</Option>) : ''}
          </Select>
        ),
      },
      {
        decorator: 'expressCorpNo',
        components: (
          <Select
            placeholder="快递公司"
            size="small"
          >
            {expressList.length ? expressList.map(ele => <Option key={ele.expressCorpNo} value={ele.expressCorpNo}>{ele.expressCorpName}</Option>) : ''}
          </Select>
        ),
      },
      {
        decorator: 'distributorNo',
        components: (
          <Select
            placeholder="分销商"
            size="small"
          >
            {suppliers.length ? suppliers.map(ele => <Option key={ele.supplierNo} value={ele.supplierNo}>{ele.supplierName}</Option>) : ''}
          </Select>
        ),
      },
      {
        decorator: 'warehouseNo',
        components: (
          <Select
            placeholder="发货仓"
            size="small"
          >
            {warehouseList.length ? warehouseList.map(ele => <Option value={ele.warehouseNo} key={ele.warehouseNo}>{ele.warehouseName}</Option>) : ''}
          </Select>
        ),
      },
      {
        decorator: this.state.flag,
        components: (
          <Input size="small" placeholder="输入单号" addonAfter={selectAfter} style={{ width: 220 }} />
        ),
      },
      {
        decorator: this.state.flagT,
        components: (
          <Input size="small" placeholder="输入对应信息" addonAfter={user} style={{ width: 220, marginLeft: 80 }} />
        ),
      },
    ]
    const searchBarProps = {
      colItems: searchBarItem,
      dispatch: this.props.dispatch,
      nameSpace: 'bindOrder',
      searchParam,
    }
    console.log('banding')
    return (
      <div>
        <Modal
          title="绑定订单"
          visible={show}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          width={1200}
          bodyStyle={{ maxHeight: 480, overflowX: 'hidden', padding: 0 }}
          maskClosable={false}
          confirmLoading={this.state.confirmLoading}
        >
          <div className={styles.contentBoard}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>
                <SearchBar {...searchBarProps} />
              </div>
              <Table
                rowSelection={rowSelection}
                scroll={{ x: 1600 }}
                rowKey={record => record.orderNo}
                loading={loading}
                columns={columns}
                dataSource={list}
                pagination={
                  {
                    size: 'small',
                    total,
                    current,
                    showTotal: () => { return `当前显示 ${((current - 1) * pageSize) + 1} 到 ${current * pageSize > total ? total : current * pageSize} 条数据,共 ${total} 条数据` },
                    pageSize,
                    onChange: (PageIndex) => {
                      this.props.dispatch({
                        type: 'bindOrder/search',
                        payload: {
                          current: PageIndex,
                          pageSize,
                        },
                      })
                      this.props.dispatch({
                        type: 'bindOrder/changeState',
                        payload: {
                          current: PageIndex,
                          pageSize,
                        },
                      })
                    },
                    showSizeChanger: true,
                    pageSizeOptions: ['20', '50', '100'],
                    onShowSizeChange: (c, PageSize) => {
                      this.props.dispatch({
                        type: 'bindOrder/search',
                        payload: {
                          current: c,
                          pageSize: PageSize,
                        },
                      })
                      this.props.dispatch({
                        type: 'bindOrder/changeState',
                        payload: {
                          current: c,
                          pageSize: PageSize,
                        },
                      })
                    },
                    style: { marginRight: '20px' },
                  }
                }
              />
            </div>
          </div>
        </Modal>
      </div>)
  }
}
