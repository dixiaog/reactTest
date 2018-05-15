/*
 * @Author: chenjie
 * @Date: 2018-01-30 16:42:55
 * 分销资金审核
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Modal, Button, Select, Input, DatePicker, Popconfirm, notification, Tag } from 'antd'
import numeral from 'numeral'
import styles from '../SupplySell.less'
import { getDistributorList, fundAuditSelect } from '../../../services/supplySell/accountBalance'
import config from '../../../utils/config'
import SearchBar from '../../../components/SearchBar'
import Jtable from '../../../components/JcTable'

const Option = Select.Option

@connect(state => ({
    fundAudit: state.fundAudit,
    accountBalance: state.accountBalance,
}))
export default class FundAuditList extends Component {
    constructor(props) {
        super(props)
        this.state = {
          distributors: [],
        }
    }
    componentWillMount() {
        if (this.props.disSupTypeNo === 1) {
          getDistributorList({
            // supplierNo: ,
            disSupTypeNo: this.props.disSupTypeNo,
          }).then((json) => {
            if (json && json.length) {
              this.setState({
                distributors: json,
              })
            }
          })
        }
        // const { fundAudit } = getOtherStore()
        // if (!fundAudit || fundAudit.list.length === 0) {
        //   this.props.dispatch({ type: 'fundAudit/fetch' })
        // }
    }
    componentDidMount() {
    }
    componentWillReceiveProps(nextProps) {
      if (this.props.distributorNo !== nextProps.distributorNo || this.props.fundType !== nextProps.fundType) {
        this.props.dispatch({
          type: 'fundAudit/fetch',
          payload: Object.assign({
            // distributorNo: nextProps.distributorNo,
            disSupTypeNo: this.props.disSupTypeNo,
            fundType: nextProps.fundType,
            current: 1,
        }, this.props.disSupTypeNo === 0 ? {
          supplierNo: nextProps.distributorNo,
        } : {
          distributorNo: nextProps.distributorNo,
        }),
      })
      }
    }
    handleOk = () => {
      this.handleSubmit()
    }
    handleCancel = () => {
      if (this.props.disSupTypeNo === 1 ) {
        this.props.dispatch({
          type: 'accountManager/fetch',
          payload: { disSupTypeNo: 0 },
        })
      } else {
        this.props.dispatch({
          type: 'accountBalance/fetch',
          payload: { disSupTypeNo: 1},
        })
      }
      
      this.props.hidden()
    }
    doPass = () => {
      const { selectedRowKeys, selectedRows } = this.props.fundAudit
      fundAuditSelect({
        auditNo: 1,
        autoNo: selectedRowKeys[0],
        fundType: selectedRows[0].fundType,
      }).then((json) => {
        if (json) {
          this.props.dispatch({
           type: 'fundAudit/search',
         })
         notification.success({
          message: '审核完成',
        })
        }
      })
    }
    donotPass = () => {
      const { selectedRowKeys, selectedRows } = this.props.fundAudit
      fundAuditSelect({
        auditNo: 2,
        autoNo: selectedRowKeys[0],
        fundType: selectedRows[0].fundType,
      }).then((json) => {
        if (json) {
          this.props.dispatch({
            type: 'fundAudit/search',
          })
         notification.success({
          message: '审核完成',
        })
        }
      })
    }
    doRetail = () => {
      const { selectedRowKeys, selectedRows } = this.props.fundAudit
      fundAuditSelect({
        auditNo: 3,
        autoNo: selectedRowKeys[0],
        fundType: selectedRows[0].fundType,
      }).then((json) => {
        if (json) {
          this.props.dispatch({
            type: 'fundAudit/search',
          })
         notification.success({
          message: '审核完成',
        })
        }
      })
    }
    titleName = (text) => {
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
    }
    render() {
    const { list, total, loading, selectedRows, selectedRowKeys, page } = this.props.fundAudit
    const columns = [{
      title: '内部支付单号',
      dataIndex: 'autoNo',
      key: 'autoNo',
      width: 50,
    },
    {
      title: '分销商名称',
      dataIndex: 'distributorName',
      key: 'distributorName',
      width: 120,
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
      title: '支付时间',
      dataIndex: 'billDate',
      key: 'billDate',
      width: 80,
      className: styles.columnRight,
      render: text => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: '支付单号',
      dataIndex: 'billNo',
      key: 'billNo',
      width: 80,
      className: styles.columnRight,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 80,
      className: styles.columnRight,
      render: (text, record) => {
        if ([0,5,6].indexOf(record.fundType * 1) > -1) {
          return `-${numeral(text).format('0,0')}`
        } else {
          return `${numeral(text).format('0,0')}`
        }
      },
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render: (text) => {
          switch (text * 1) {
            case 0:
              return <Tag color="#87d068">待审核</Tag>
            case 1:
              return <Tag color="#2db7f5">已审核</Tag>
            case 2:
              return <Tag color="orange">审核未通过</Tag>
            case 3:
              return <Tag color="#f50">已作废</Tag>
            default:
              return <Tag color="green">其他</Tag>
          }
        },
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
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 100,
    },
    {
        title: '分销商支付账号',
        dataIndex: 'payAccount',
        key: 'payAccount',
        width: 80,
    },
    {
        title: '登记人',
        dataIndex: 'createUser',
        key: 'createUser',
        width: 100,
    },
    {
      title: '登记时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 80,
      render: text => moment(text).format('YYYY-MM-DD'),
    },
  ]
  const searchParam = [{
    decorator: 'startTime',
    components: (<DatePicker placeholder="支付时间起" size={config.InputSize} />),
  },
  {
    decorator: 'endTime',
    components: (<DatePicker placeholder="支付时间讫" size={config.InputSize} />),
  }, {
    decorator: 'billNo',
    components: (<Input placeholder="支付单号" size={config.InputSize} />),
  }, {
    decorator: 'remark',
    components: (<Input placeholder="备注" size={config.InputSize} />),
  }]
  if (this.props.disSupTypeNo === 1) {
    searchParam.push({
      decorator: 'distributorNo',
      components: (
        <Select placeholder="分销商" size={config.InputSize} style={{ marginTop: 4 }}>
          {this.state.distributors.map(e => <Option key={e.distributorNo} value={e.distributorNo}>{e.distributorName}</Option>)}
        </Select>),
    })
  }
    // 操作栏
    let tabelToolbar = []
    if (this.props.disSupTypeNo === 1) {
        tabelToolbar = [
          <Popconfirm key={0} premission="TRUE" title="确定要审核嘛" onConfirm={this.doPass} okText="确定" cancelText="取消">
            <Button disabled={!(selectedRows.length && selectedRows[0].status === 0)} type="primary" size="small" >审核通过</Button>
          </Popconfirm>,
          <Popconfirm key={1} premission="TRUE" title="确定要审核不通过嘛" onConfirm={this.donotPass} okText="确定" cancelText="取消">
            <Button disabled={!(selectedRows.length && selectedRows[0].status === 0)} type="primary" size="small">审核不通过</Button>
          </Popconfirm>,
          <Popconfirm key={2} premission="TRUE" title="确定要作废嘛" onConfirm={this.doRetail} okText="确定" cancelText="取消">
            <Button disabled={!(selectedRows.length && selectedRows[0].status === 0)} type="primary" size="small">作废</Button>
          </Popconfirm>,
       ]
    }
    const searchBarProps = {
      colItems: searchParam,
      dispatch: this.props.dispatch,
      nameSpace: 'fundAudit',
      searchParam,
      requestParam: Object.assign({
        // distributorNo: nextProps.distributorNo,
        disSupTypeNo: this.props.disSupTypeNo,
        fundType: this.props.fundType,
        current: 1,
    }, this.props.disSupTypeNo === 0 ? {
      supplierNo: this.props.distributorNo,
    } : {
      distributorNo: this.props.distributorNo,
    }),
    }
        const tableProps = {
            rowSelection: {
                type: 'radio',
            // hideDefaultSelections: true,
            },
            toolbar: tabelToolbar,
            dataSource: list,
            isPart: true,
            total,
            ...page,
            loading,
            columns,
            nameSpace: 'fundAudit',
            dispatch: this.props.dispatch,
            selectedRows,
            selectedRowKeys,
            rowKey: 'autoNo',
            tableName: 'fundAuditTable',
            custormTableClass: 'tablecHeightFix440',
        }
        return (
          <div>
            <Modal
              maskClosable={false}
              title="分销资金审核"
              visible={this.props.visiable}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              width={1000}
              style={{ height: 500 }}
              footer={[
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
