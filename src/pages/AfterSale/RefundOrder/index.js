/*
 * @Author: tanmengjia
 * @Date: 2018-03-06 10:09:26
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-14 09:41:16
 * 售后-退款单
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Button, Select, Input, Popconfirm, Divider, DatePicker, message, Checkbox, notification, Tag } from 'antd'
import update from 'immutability-helper'
import Jtable from '../../../components/JcTable'
import { checkPremission, effectFetch } from '../../../utils/utils'
import SearchBar from '../../../components/SearchBar'
import EditInputCell from '../../../components/EditInputCell'
import EditSelectCell from '../../../components/EditSelectCell'
import styles from '../AfterSale.less'
import config from '../../../utils/config'
import { agree, finish, saveEdit } from '../../../services/aftersale/refundOrder'

const { Option } = Select

@connect(state => ({
  refundOrder: state.refundOrder,
}))
export default class RefundOrder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      startValue: null,
      endValue: null,
      ephemeralData: {},
      dataWhenCancel: [],
      data: [],
      typeData: [
        {
          value: 0,
          name: '支付宝',
        }, {
          value: 1,
          name: '银行转账',
        }, {
          value: 2,
          name: '现金支付',
        }, {
          value: 3,
          name: '京东-货到付款',
        }, {
          value: 4,
          name: '京东-在线支付',
        }, {
          value: 5,
          name: '京东-分期付款',
        }, {
          value: 6,
          name: '京东-公司转账',
        }, {
          value: 7,
          name: '唯品会',
        }, {
          value: 8,
          name: '内部流转',
        }, {
          value: 9,
          name: '供销支付',
        }, {
          value: 10,
          name: '快速支付',
        }, {
          value: 11,
          name: '其他',
        },
      ],
    }
  }
  componentDidMount() {
    // const { refundOrder } = getOtherStore()
    // if (!refundOrder || refundOrder.list.length === 0) {
    //   this.props.dispatch({
    //     type: 'refundOrder/fetch',
    //   })
    // }
    effectFetch('refundOrder', this.props.dispatch)
    this.props.dispatch({ type: 'refundOrder/getShopName' })
    this.props.dispatch({ type: 'refundOrder/getDistributor' })
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      // shops: nextProps.shopProduct.lists,
      data: nextProps.refundOrder.list,
      dataWhenCancel: nextProps.refundOrder.list,
    })
  }
  onChange1 = (field, value) => {
    this.setState({
      [field]: value,
    })
  }
  onStartChange = (value) => {
    this.onChange1('startValue', value)
  }
  onEndChange = (value) => {
    this.onChange1('endValue', value)
  }
  // 拒绝退款
  refuse = () => {
    const ids = []
    let isYes = true
    this.props.refundOrder.selectedRows.forEach((ele) => {
      ids.push(ele.autoNo)
      if (ele.status !== 0) {
        isYes = false
      }
    })
    const payload = {
      IDList: ids,
      status: 2,
    }
    if (isYes) {
      agree(payload).then((json) => {
        if (json) {
          notification.success({
            message: '操作成功',
          })
          this.props.dispatch({
            type: 'refundOrder/search',
          })
        }
      })
    } else {
      message.error('只有状态为“待确认”的单号可以拒绝退款')
    }
  }
  // 退款完成
  haveYes = () => {
    const ids = []
    let isYes = true
    this.props.refundOrder.selectedRows.forEach((ele) => {
      ids.push(ele.autoNo)
      if (ele.status !== 1 && ele.status !== 2) {
        isYes = false
      }
    })
    const payload = {
      IDList: ids,
    }
    if (isYes) {
      finish(payload).then((json) => {
        if (json) {
          notification.success({
            message: '操作成功',
          })
          this.props.dispatch({
            type: 'refundOrder/search',
          })
        }
      })
    } else {
      message.error('只有状态为“同意退款”或“拒绝退款”的单号可以退款成功')
    }
  }
  // 作废
  cancel = () => {
    const ids = []
    let isYes = true
    this.props.refundOrder.selectedRows.forEach((ele) => {
      ids.push(ele.autoNo)
      if (ele.status !== 0) {
        isYes = false
      }
    })
    const payload = {
      IDList: ids,
      status: 3,
    }
    if (isYes) {
      agree(payload).then((json) => {
        if (json) {
          notification.success({
            message: '操作成功',
          })
          this.props.dispatch({
            type: 'refundOrder/search',
          })
        }
      })
    } else {
      message.error('只有状态为“待确认”的单号可以作废')
    }
  }
  // 同意退款
  agree = () => {
    const ids = []
    let isYes = true
    this.props.refundOrder.selectedRows.forEach((ele) => {
      ids.push(ele.autoNo)
      if (ele.status !== 0) {
        isYes = false
      }
    })
    const payload = {
      IDList: ids,
      status: 1,
    }
    if (isYes) {
      agree(payload).then((json) => {
        if (json) {
          notification.success({
            message: '操作成功',
          })
          this.props.dispatch({
            type: 'refundOrder/search',
          })
        }
      })
    } else {
      message.error('只有状态为“待确认”的单号可以同意退款')
    }
  }
  edit = (autoNo) => {
    const { data } = this.state
    const target = data.filter(item => autoNo === item.autoNo)[0]
    if (target) {
      target.editable = true
      this.setState({ data, ephemeralData: Object.assign(this.state.ephemeralData, { [autoNo]: target }) })
    }
  }
  save(autoNo) {
    const { ephemeralData, data, dataWhenCancel } = this.state
    const target = ephemeralData[autoNo]// newData.filter(item => autoNo === item.autoNo)[0]
    const index = data.findIndex(e => e.autoNo === autoNo)
    if (target) {
      const moneycheck = /^(([1-9])|([1-9]\d{0,8}[0-9])|(([0-9]\.\d{1,2}|[1-9]\d{0,8}[0-9]\.\d{1,2})))$/
      let isYes = true
      if (target.amount === '') {
        message.error('请输入金额')
        isYes = false
      } else if (!moneycheck.test(target.amount)) {
        message.error('金额格式错误或长度过长')
        isYes = false
      }
      if (isYes) {
        const payload = {
          autoNo: target.autoNo,
          amount: target.amount,
          modeNo: target.modeNo,
        }
        delete ephemeralData[autoNo]
        saveEdit(payload).then((json) => {
          if (json) {
            notification.success({
              message: '操作成功',
            })
            target.editable = false
            data[index] = target
            dataWhenCancel[index] = target
            this.setState({ data, ephemeralData, dataWhenCancel })
          }
        })
      }
    }
  }
  cancel1(autoNo) {
    const { ephemeralData, dataWhenCancel, data } = this.state
    delete ephemeralData[autoNo]
    const target = dataWhenCancel.filter(item => autoNo === item.autoNo)[0]
    target.editable = false
    const index = data.findIndex(e => e.autoNo === autoNo)
    data[index] = target
    this.setState({ data, ephemeralData })
  }
  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue
    if (!startValue || !endValue) {
      return false
    }
    return startValue.valueOf() > endValue.valueOf()
  }
  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue
    if (!endValue || !startValue) {
      return false
    }
    return endValue.valueOf() <= startValue.valueOf()
  }
  handleChange = (value, record, column) => {
    const index = this.state.data.findIndex(e => e.autoNo === record.autoNo)
    this.setState(update(
      this.state, {
        ephemeralData: {
          [record.autoNo]: { $merge: { [column]: value } },
        },
        data: { [index]: { $merge: { [column]: value } } },
      }
    ))
  }
  renderColumns(text, record, column) {
    return (
      <EditInputCell
        editEnable={record.editable}
        value={text}
        autoNo={record.autoNo}
        key={record.autoNo}
        column={column}
        record={record}
        onInputChange={this.handleChange.bind(this)}
      />
    )
  }
  renderColumns1(text, record, column) {
    return (
      <EditSelectCell
        width={150}
        editEnable={record.editable}
        value={text}
        autoNo={record.autoNo}
        key={record.autoNo}
        column={column}
        record={record}
        onInputChange={this.handleChange.bind(this)}
        typeData={this.state.typeData}
      />
    )
  }
  render() {
    const { loading, searchParam, total, page, selectedRowKeys, selectedRows, lists, distributor } = this.props.refundOrder
    const columns = [{
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      width: 50,
      render: (text, record, index) => {
        return (
          <span>
            {index + 1}
          </span>)
        },
    }, {
      title: '店铺',
      dataIndex: 'shopName',
      key: 'shopName',
      width: 150,
    }, {
      title: '内部退款号',
      dataIndex: 'autoNo',
      key: 'autoNo',
      width: 130,
    }, {
      title: '操作',
      dataIndex: 'opreation',
      key: 'opreation',
      width: 100,
      className: styles.columnCenter,
      render: (text, record) => {
        if (checkPremission('REFUNDORDER_EDIT')) {
          const { editable } = record
          return (
            <div className="editable-row-operations">
              {
                editable ?
                  <span>
                    <Popconfirm title="确定保存？?" onConfirm={() => this.save(record.autoNo)}>
                      <a>保存</a>
                    </Popconfirm>
                    <Divider type="vertical" />
                    <a onClick={this.cancel1.bind(this, record.autoNo)}>取消</a>
                  </span>
                  : <a onClick={this.edit.bind(this, record.autoNo)}>编辑</a>
              }
            </div>
          )
        }
        },
      }, {
        title: '退款时间',
        dataIndex: 'refundTime',
        key: 'refundTime',
        width: 130,
        render: text => (text && moment(text).format('YYYY-MM-DD HH:mm:ss') !== '1899-11-30 00:00:00' ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null),
      }, {
        title: '审核时间',
        dataIndex: 'approveDate',
        key: 'approveDate',
        width: 130,
        render: text => (text && moment(text).format('YYYY-MM-DD HH:mm:ss') !== '1899-11-30 00:00:00' ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null),
      }, {
        title: '修改时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        width: 130,
        render: text => (text && moment(text).format('YYYY-MM-DD HH:mm:ss') !== '1899-11-30 00:00:00' ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null),
    }, {
      title: '内部订单号',
      dataIndex: 'innerNo',
      key: 'innerNo',
      width: 150,
    }, {
      title: '线上订单号',
      dataIndex: 'onlineNo',
      key: 'onlineNo',
      width: 150,
    }, {
      title: '退款单号',
      dataIndex: 'billNo',
      key: 'billNo',
      width: 150,
    }, {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 80,
      className: styles.columnRight,
      render: (text, record) => this.renderColumns(text, record, 'amount'),
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      className: styles.columnCenter,
      render: (text) => {
        if (text * 1 === 1) {
          return <Tag color="#87d068" style={{ width: 60 }}>同意退款</Tag>
        } else if (text * 1 === 0) {
          return <Tag color="#2db7f5" style={{ width: 60 }}>待确认</Tag>
        } else if (text * 1 === 2) {
          return <Tag color="#f50" style={{ width: 60 }}>拒绝退款</Tag>
        } else if (text * 1 === 3) {
          return <Tag color="#ccc" style={{ width: 60 }}>作废</Tag>
        }
      },
    }, {
      title: '退款完成',
      dataIndex: 'refundStatus',
      key: 'refundStatus',
      width: 100,
      className: styles.columnCenter,
      render: (text, record) => (
        <Checkbox checked={record.refundStatus} />
      ),
    }, {
      title: '退款方式',
      dataIndex: 'modeNo',
      key: 'modeNo',
      width: 150,
      render: (text, record) => this.renderColumns1(text, record, 'modeNo'),
    }, {
      title: '买家支付账号',
      dataIndex: 'payAccount',
      key: 'payAccount',
      width: 100,
  }, {
      title: '买家店铺账号',
      dataIndex: 'siteAccount',
      key: 'siteAccount',
      width: 100,
    }, {
      title: '售后单号',
      dataIndex: 'afterSaleNo',
      key: 'afterSaleNo',
      width: 120,
  }, {
      title: '售后分类',
      dataIndex: 'asType',
      key: 'asType',
      width: 80,
      render: (text) => {
        if (text * 1 === 0) {
          return '退货'
        } else if (text * 1 === 1) {
          return '换货'
        } else if (text * 1 === 2) {
          return '补发'
        } else if (text * 1 === 3) {
          return '其他'
        }
      },
    }, {
      title: '售后问题类型',
      dataIndex: 'refundReason',
      key: 'refundReason',
      width: 150,
    }, {
      title: '售后备注',
      dataIndex: 'remark',
      key: 'remark',
      // width: 100,
  }]
    // 操作栏
    const tabelToolbar = [
      <Button key={0} type="primary" size="small" premission="REFUNDORDER_AGREE" onClick={this.agree} disabled={!(selectedRows && selectedRows.length)}>同意退款</Button>,
      <Button key={1} type="primary" size="small" premission="REFUNDORDER_AGREE" onClick={this.refuse} disabled={!(selectedRows && selectedRows.length)}>拒绝退款</Button>,
      <Button key={2} type="primary" size="small" premission="REFUNDORDER_FINISH" onClick={this.haveYes} disabled={!(selectedRows && selectedRows.length)}>退款完成</Button>,
      <Button key={3} type="primary" size="small" premission="REFUNDORDER_AGREE" onClick={this.cancel} disabled={!(selectedRows && selectedRows.length)}>作废</Button>,
    ]
    const tableProps = {
        toolbar: tabelToolbar,
        noSelected: false,
        dataSource: this.state.data,
        total,
        ...page,
        loading,
        columns,
        nameSpace: 'refundOrder',
        tableName: 'refundOrderTable',
        dispatch: this.props.dispatch,
        selectedRows,
        selectedRowKeys,
        rowKey: 'autoNo',
        scroll: { x: 2500 },
    }
    // 搜索栏
    const searchBarItem = [{
    decorator: 'orderType',
    components: (
      <Select placeholder="单号类型" size="small">
        <Option key={0} value="退款单号">退款单号</Option>
        <Option key={1} value="线上订单号">线上订单号</Option>
        <Option key={2} value="内部订单号">内部订单号</Option>
        <Option key={3} value="内部支付单号">内部支付单号</Option>
      </Select>
    ),
    }, {
      decorator: 'afterSaleNo',
      components: <Input placeholder="单号" size="small" />,
    }, {
    decorator: 'timeType',
    components: (
      <Select placeholder="时间类型" size="small">
        <Option key={0} value="退款时间">退款时间</Option>
        <Option key={1} value="审核时间">审核时间</Option>
        <Option key={2} value="修改时间">修改时间</Option>
      </Select>
    ),
    }, {
      decorator: 'timeStart',
      components: (<DatePicker
        size={config.InputSize}
        placeholder="时间起"
        disabledDate={this.disabledStartDate}
        format="YYYY-MM-DD HH:mm:ss"
        showTime
        onChange={this.onStartChange}
      />),
    }, {
      decorator: 'timeEnd',
      components: (<DatePicker
        size={config.InputSize}
        placeholder="时间讫"
        disabledDate={this.disabledEndDate}
        format="YYYY-MM-DD HH:mm:ss"
        showTime
        onChange={this.onEndChange}
      />),
    }, {
      decorator: 'status',
      components: (
        <Select placeholder="退款状态" size="small">
          <Option key={0} value={0}>待确认</Option>
          <Option key={1} value={1}>同意退款</Option>
          <Option key={2} value={2}>拒绝退款</Option>
          <Option key={3} value={3}>作废</Option>
        </Select>
      ),
    }, {
      decorator: 'shopNo',
      components: (
        <Select placeholder="店铺" size="small" style={{ marginTop: 4 }}>
          {lists && lists.length ? lists.map(ele => <Option key={ele.shopNo} value={ele.shopNo}>{ele.shopName}</Option>) : null}
        </Select>
      ),
    }, {
      decorator: 'modeNo',
      components: (
        <Select placeholder="支付方式" size="small" style={{ marginTop: 4 }}>
          {this.state.typeData && this.state.typeData.length ? this.state.typeData.map(e => <Option key={e.value} value={e.value}>{e.name}</Option>) : null}
        </Select>
      ),
    }, {
      decorator: 'distributorNo',
      components: (
        <Select placeholder="分销商" size="small" style={{ marginTop: 4 }}>
          {distributor && distributor.length ? distributor.map(e => <Option key={e.distributorNo} value={e.distributorNo}>{e.distributorName}</Option>) : null}
        </Select>
      ),
      // ),
    },
  ]
    const searchBarProps = {
      colItems: searchBarItem,
      dispatch: this.props.dispatch,
      nameSpace: 'refundOrder',
      searchParam,
      clearState: () => {
        this.setState({
          startValue: null,
          endValue: null,
        })
      },
      clear: 1,
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
      </div>
    )
  }
}
