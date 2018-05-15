/*
 * @Author: chenjie
 * @Date: 2018-01-30 16:42:55
 * 往来资金明显
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Modal, Button, Input, Select, DatePicker, Icon } from 'antd'
import styles from '../SupplySell.less'
import SearchBar from '../../../components/SearchBar'
import Jtable from '../../../components/JcTable'
// import { getOtherStore } from '../../../utils/otherStore'
import { getAllShop } from '../../../services/utils'
import config from '../../../utils/config'

const Option = Select.Option
@connect(state => ({
  contactDetail: state.contactDetail,
}))
export default class ContactDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      shops: [],
      startValue: null,
      endValue: null,
    }
  }
  componentWillMount() {
    // this.props.dispatch({
    //   type: 'contactDetail/fetch',
    //   payload: {
    //     disSupTypeNo: this.props.disSupTypeNo,
    //     distributorName: this.props.distributorName,
    // } })
  }
  componentDidMount() {
    getAllShop().then((json) => {
      this.setState({
        shops: json,
      })
    })
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.disSupTypeNo === 0) {
      if (this.props.distributorNo !== nextProps.distributorNo) {
        this.props.dispatch({
          type: 'contactDetail/fetch',
          payload: {
            disSupTypeNo: nextProps.disSupTypeNo,
            distributorNo: nextProps.distributorNo,
        } })
      }
    } else {
      if (this.props.supplierNo !== nextProps.supplierNo) {
        this.props.dispatch({
          type: 'contactDetail/fetch',
          payload: {
            disSupTypeNo: nextProps.disSupTypeNo,
            supplierNo: nextProps.supplierNo,
        } })
      }
    }
  }
  onStartChange = (value) => {
    this.setState({
      startValue: value,
    })
  }
  onEndChange = (value) => {
    this.setState({
      endValue: value,
    })
  }
  handleOk = () => {
    this.handleSubmit()
  }
  handleCancel = () => {
  this.props.dispatch({
      type: 'contactDetail/search',
      payload: {
        searchParam: Object.assign({ disSupTypeNo: this.props.disSupTypeNo },
          this.props.disSupTypeNo === 0 ? {
            distributorNo: this.props.distributorNo,
          } : {
            supplierNo: this.props.supplierNo,
          }),
      }
    })
    this.refs.searchBar.resetFields()
    this.props.hidden()
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
  render() {
    const { list, total, loading, selectedRows, selectedRowKeys, page, searchParam } = this.props.contactDetail
    const columns = [
      {
        title: '内部支付号',
        dataIndex: 'autoNo',
        key: 'autoNo',
        width: 120,
      },
      {
        title: '支付时间',
        dataIndex: 'billDate',
        key: 'billDate',
        width: 120,
        render: text => moment(text).format('YYYY-MM-DD'),
      },
      {
        title: '资金类型',
        dataIndex: 'fundType',
        key: 'fundType',
        width: 100,
        render: (text) => {
          switch (text * 1) {
            case 0:
              return '订单支付'
            case 1:
              return '售后退款'
            case 2:
              return '保证金'
            case 3:
              return '预付款'
            case 4:
              return '奖励金'
            case 5:
              return '罚款'
            case 6:
              return '提现'
            case 7:
              return '佣金'
            case 20:
              return '其他'
            default:
              return '其他'
          }
        },
      },
      {
        title: '金额',
        dataIndex: 'amount',
        key: 'amount',
        width: 80,
        render: (text, record) => {
          if ([0,5,6].indexOf(record.fundType * 1) > -1) {
            return `-${text}`
          } else {
            return `${text}`
          }
        },
      },
      {
        title: '支付单号',
        dataIndex: 'billNo',
        key: 'billNo',
        width: 100,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render: (text) => {
          switch (text * 1) {
            case 0:
              return '等待审核'
            case 1:
              return '已审核'
            case 2:
              return '审核未通过'
            case 3:
              return '作废'
            default:
              return '其他'
          }
        },
      },
      {
        title: '内部订单号',
        dataIndex: 'innerNo',
        key: 'innerNo',
        width: 100,
      },
      {
        title: '支付方式',
        dataIndex: 'modeNo',
        key: 'modeNo',
        width: 100,
        render: (text) => {
          switch (text * 1) {
            case 0:
              return '支付宝'
            case 1:
              return '银行转账'
            case 2:
              return '现金支付'
            case 3:
              return '京东-货到付款'
            case 4:
              return '京东-在线支付'
            case 5:
              return '京东-分期付款'
            case 6:
              return '京东-公司转账'
            case 7:
              return '唯品会'
            case 8:
              return '内部流转'
            case 9:
              return '供销支付'
            case 10:
              return '快速支付'
            default:
              return '其他'
          }
        },
      },
      {
        title: '线上订单号',
        dataIndex: 'onlineNo',
        key: 'onlineNo',
        width: 100,
      },
      {
        title: '审核时间',
        dataIndex: 'approveDate',
        key: 'approveDate',
        width: 100,
        render: (text, record) => {
          if (record.status * 1 === 0) {
            return '-'
          } else {
            return moment(text).format('YYYY-MM-DD')
          }
        },
      },
      {
        title: '审核人',
        dataIndex: 'approveUser',
        key: 'approveUser',
        width: 100,
      },
      {
        title: '创建人',
        dataIndex: 'createUser',
        key: 'createUser',
        width: 100,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 100,
        render: text => moment(text).format('YYYY-MM-DD'),
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 150,
      },
    ]
    const searchBarItem = [{
      decorator: 'startTime',
      components: (<DatePicker
        placeholder="支付时间起"
        size={config.InputSize}
        disabledDate={this.disabledStartDate}
        onChange={this.onStartChange}
      />),
    },
    {
      decorator: 'endTime',
      components: (<DatePicker
        placeholder="支付时间讫"
        size={config.InputSize}
        disabledDate={this.disabledEndDate}
          onChange={this.onEndChange}
      />),
    }, {
      decorator: 'fundType',
      components: (
        <Select placeholder="资金类型" size={config.InputSize} style={{ marginTop: 4 }}>
          <Option value={0}>订单支付</Option>
          <Option value={1}>售后退款</Option>
          <Option value={2}>保证金</Option>
          <Option value={3}>预付款</Option>
          <Option value={4}>奖励金</Option>
          <Option value={5}>罚款</Option>
          <Option value={6}>提现</Option>
          <Option value={7}>佣金</Option>
          <Option value={20}>其他</Option>
        </Select>
      ),
    }, {
      decorator: 'modeNo',
      components: (
        <Select placeholder="支付方式" size={config.InputSize} style={{ marginTop: 4 }}>
          <Option value={0}>支付宝</Option>
          <Option value={1}>银行转账</Option>
          <Option value={2}>现金支付</Option>
          <Option value={3}>京东-货到付款</Option>
          <Option value={4}>京东-在线支付</Option>
          <Option value={5}>京东-分期付款</Option>
          <Option value={6}>京东-公司转账</Option>
          <Option value={7}>唯品会</Option>
          <Option value={8}>内部流转</Option>
          <Option value={9}>供销支付</Option>
          <Option value={10}>快速支付</Option>
          <Option value={11}>其他</Option>
        </Select>),
    }, {
      decorator: 'innerNo',
      components: (<Input placeholder="内部订单号" size={config.InputSize} />),
    }, {
      decorator: 'onlineNo',
      components: (<Input placeholder="线上订单号" size={config.InputSize} />),
    }, {
      decorator: 'status',
      components: (
        <Select placeholder="单据状态" size={config.InputSize} style={{ marginTop: 4 }}>
          <Option value={0}>等待审核</Option>
          <Option value={1}>已审核</Option>
          <Option value={2}>审核未通过</Option>
          <Option value={3}>作废</Option>
        </Select>),
    },
    ]
    const tabelToolbar = [
      <Button
        key={0}
        premission="FUNDSUMMARY_EXPORT"
        type="primary"
        size="small"
        onClick={() => {
        this.props.dispatch({
          type: 'contactDetail/export',
          payload: Object.assign({ fileName: '往来明细.xls' }, searchParam),
        })
      }}
      >
        <Icon type="cloud-download-o" />导出
      </Button>,
    ]

    const searchBarProps = {
      colItems: searchBarItem,
      dispatch: this.props.dispatch,
      nameSpace: 'contactDetail',
      searchParam,
      requestParam: Object.assign({ disSupTypeNo: this.props.disSupTypeNo },
        this.props.disSupTypeNo === 0 ? {
          distributorNo: this.props.distributorNo,
        } : {
          supplierNo: this.props.supplierNo,
        }),
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
      nameSpace: 'contactDetail',
      dispatch: this.props.dispatch,
      selectedRows,
      selectedRowKeys,
      rowKey: 'billNo',
      tableName: 'contactDetailTable',
    }
    return (
      <div>
        <Modal
          maskClosable={false}
          title="往来明细查询"
          visible={this.props.visiable}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={1000}
          footer={[
        ]}
        >
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <SearchBar {...searchBarProps} ref="searchBar" />
            </div>
            <Jtable {...tableProps} />
          </div>
        </Modal>
      </div>
    )
  }
}
