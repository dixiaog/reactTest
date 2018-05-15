/*
 * @Author: chenjie
 * @Date: 2018-01-30 16:42:55
 * 账户余额查询
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Icon, Tag } from 'antd'
import numeral from 'numeral'
import styles from '../SupplySell.less'
import Jtable from '../../../components/JcTable'
import AccountDepositModal from './AccountDepositModal'
import ContactDetails from './ContactDetails'
import FundAunditList from './FundAuditList'
import { effectFetch } from '../../../utils/utils'

@connect(state => ({
    accountBalance: state.accountBalance,
}))
export default class AccountBalance extends Component {
    constructor(props) {
        super(props)
        this.state = {
            contactDetailsVisible: false,
            accountDepositModalVisible: false,
            fundAundistVisible: false,
            fundAundistType: 0,
            distributorNo: 0,
            supplierNo: 0,
            fundSupplierNo: 0,
            comName: '',
        }
    }
    componentWillMount() {
      // const { accountBalance } = getOtherStore()
      // if (!accountBalance || accountBalance.list.length === 0) {
      //   this.props.dispatch({ type: 'accountBalance/fetch', payload: { disSupTypeNo: 1 } })
      // }
      effectFetch('accountBalance', this.props.dispatch)
    }
    componentDidMount() {
    }
    hiddenModal = () => {
      this.setState({
        contactDetailsVisible: false,
        accountDepositModalVisible: false,
        fundAundistVisible: false,
      })
    }
    fundAundistDetail = (fundType, record) => {
      this.setState({
        fundAundistType: fundType,
        fundAundistVisible: true,
        fundSupplierNo: record.supplierNo,
        // distributorNo,
      })
    }
    render() {
    const { list, total, loading, selectedRows, selectedRowKeys, page, searchParam } = this.props.accountBalance
    const columns = [{
      title: '编号',
      dataIndex: 'key',
      key: 'key',
      width: 50,
      render: (text, record, index) => {
        return (
          <span>
            {index + 1}
          </span>
          )
        },
    },
    {
      title: '供销商名称',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 120,
    },
    {
      title: '分销状态',
      dataIndex: 'distributorStatus',
      key: 'distributorStatus',
      width: 100,
      render: (text) => {
              switch (text * 1) {
                  case 0:
                  return <Tag color="#87d068">等待审核</Tag>
                  case 1:
                  return <Tag color="#2db7f5">确认生效</Tag>
                  case 2:
                  return <Tag color="#f50">作废</Tag>
                  case 3:
                  return <Tag color="orange">冻结</Tag>
                  case 4:
                  return <Tag color="purple">被拒绝</Tag>
                  default:
                  return <Tag>其他</Tag>
              }
          },
    },
    {
      title: '保证金',
      dataIndex: 'deposit',
      key: 'deposit',
      width: 80,
      className: styles.columnRight,
      render: (text, record) => <a onClick={this.fundAundistDetail.bind(this, 2, record)} style={{ color: '#2db7f5' }}>{numeral(text).format('0,0')}</a>,
    },
    {
      title: '预付款',
      dataIndex: 'prepay',
      key: 'prepay',
      width: 80,
      className: styles.columnRight,
      // render: text => <span style={{ color: '#2db7f5' }}>{numeral(text).format('0,0')}</span>,
      render: (text, record) => <a onClick={this.fundAundistDetail.bind(this, 3, record)} style={{ color: '#2db7f5' }}>{numeral(text).format('0,0')}</a>,
    },
    {
      title: '奖励金',
      dataIndex: 'reward',
      key: 'reward',
      width: 80,
      className: styles.columnRight,
      render: (text, record) => <a onClick={this.fundAundistDetail.bind(this, 4, record)} style={{ color: '#2db7f5' }}>{numeral(text).format('0,0')}</a>,
    },
    {
      title: '佣金返利',
      dataIndex: 'commision',
      key: 'commision',
      width: 100,
      className: styles.columnRight,
      render: (text, record) => <a onClick={this.fundAundistDetail.bind(this, 7, record)} style={{ color: '#2db7f5' }}>{numeral(text).format('0,0')}</a>,
    },
    {
        title: '罚款',
        dataIndex: 'amerce',
        key: 'amerce',
        width: 80,
        className: styles.columnRight,
        // render: text => <span style={{ color: '#f50' }}>{numeral(text).format('0,0')}</span>,
        render: (text, record) => <a onClick={this.fundAundistDetail.bind(this, 5, record)} style={{ color: '#f50' }}>{numeral(text).format('0,0')}</a>,
    },
    {
        title: '订单占用',
        dataIndex: 'occupation',
        key: 'occupation',
        width: 100,
        className: styles.columnRight,
        // render: text => <span style={{ color: '#f50' }}>{numeral(text).format('0,0')}</span>,
        render: (text, record) => <a onClick={this.fundAundistDetail.bind(this, 0, record)} style={{ color: '#f50' }}>{numeral(text).format('0,0')}</a>,
    },
    {
      title: '提现',
      dataIndex: 'withdrawals',
      key: 'withdrawals',
      width: 80,
      className: styles.columnRight,
      // render: text => <span style={{ color: '#f50' }}>{numeral(text).format('0,0')}</span>,
      render: (text, record) => <a onClick={this.fundAundistDetail.bind(this, 6, record)} style={{ color: '#f50' }}>{numeral(text).format('0,0')}</a>,
    },
    {
      title: '售后退款',
      dataIndex: 'refund',
      key: 'refund',
      width: 80,
      className: styles.columnRight,
      render: (text, record) => <a onClick={this.fundAundistDetail.bind(this, 1, record)} style={{ color: '#2db7f5' }}>{numeral(text).format('0,0')}</a>,
    },
    {
      title: '可用余额',
      dataIndex: 'availableBalance',
      key: 'availableBalance',
      width: 100,
      className: styles.columnRight,
      render: text => <span style={{ color: '#2db7f5' }}>{numeral(text).format('0,0')}</span>,
    },
    {
      title: '授信金额',
      dataIndex: 'reditSum',
      key: 'reditSum',
      width: 100,
      className: styles.columnRight,
      render: text => <span style={{ color: '#2db7f5' }}>{numeral(text).format('0,0')}</span>,
    },
    {
      title: '总可用金额',
      dataIndex: 'availableAllBalance',
      key: 'availableAllBalance',
      width: 100,
      className: styles.columnRight,
      render: text => <span style={{ color: '#2db7f5' }}>{numeral(text).format('0,0')}</span>,
    },
  ]
    // 操作栏
    const tabelToolbar = [
      <Button
        key={0}
        type="primary"
        size="small"
        disabled={ selectedRows.length === 0 || selectedRows[0].availableBalance <=0 || selectedRows[0].distributorStatus !== 1}
        onClick={() => {
        this.setState({
          availableBalance: selectedRows[0].availableBalance,
          accountDepositModalVisible: true,
          supplierNo: this.props.accountBalance.selectedRows[0].supplierNo,
          distributorName: this.props.accountBalance.selectedRows[0].distributorName,
         })
        }}
        premission="FUNDSUMMARY_DEPOSIT"
      >
        <Icon type="plus" />申请提现
      </Button>,
      <Button
        key={1}
        premission="FUNDSUMMARY_CONTACT"
        disabled={selectedRows.length === 0}
        type="primary"
        size="small"
        onClick={() => { this.setState({ contactDetailsVisible: true, supplierNo: selectedRows[0].supplierNo }) }}
      ><Icon type="swap" />往来明细查询
      </Button>,
      <Button
        key={2}
        premission="FUNDSUMMARY_EXPORT"
        type="primary"
        size="small"
        onClick={() => {
        this.props.dispatch({
          type: 'accountBalance/export',
          payload: Object.assign({ fileName: '账户余额查询.xls' }, searchParam),
        })
      }}
      ><Icon type="cloud-download-o" />导出
      </Button>,
    ]

        const tableProps = {
            rowSelection: {
                type: 'radio',
            },
            toolbar: tabelToolbar,
            dataSource: list,
            total,
            ...page,
            loading,
            columns,
            nameSpace: 'accountBalance',
            dispatch: this.props.dispatch,
            selectedRows,
            selectedRowKeys,
            rowKey: 'billNo',
            tableName: 'accountBalanceTable',
        }
        return (
          <div>
            <div className={styles.contentBoard}>
              <div className={styles.tableList}>
                <Jtable {...tableProps} />
              </div>
            </div>
            <AccountDepositModal
              distributorName={this.state.distributorName}
              supplierNo={this.state.supplierNo}
              fundType={6}
              availableBalance={this.state.availableBalance}
              dispatch={this.props.dispatch}
              disSupTypeNo={1}
              title="申请体现"
              hidden={this.hiddenModal}
              visiable={this.state.accountDepositModalVisible}
            />
            <ContactDetails
              supplierNo={this.state.supplierNo}
              disSupTypeNo={1}
              hidden={this.hiddenModal}
              visiable={this.state.contactDetailsVisible}
            />
            <FundAunditList
              comName={selectedRows.length ? selectedRows[0].supplierName : ''}
              distributorNo={this.state.fundSupplierNo}
              disSupTypeNo={0}
              fundType={this.state.fundAundistType}
              hidden={this.hiddenModal}
              visiable={this.state.fundAundistVisible}
            />
          </div>
        )
    }
}
