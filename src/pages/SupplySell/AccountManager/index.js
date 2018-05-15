/*
 * @Author: chenjie
 * @Date: 2018-01-30 16:42:55
 * 分销资金管理
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Icon, Tag } from 'antd'
import numeral from 'numeral'
import styles from '../SupplySell.less'
import Jtable from '../../../components/JcTable'
// import { getOtherStore } from '../../../utils/otherStore'
import AccountDepositModal from '../AccountBalance/AccountDepositModal'
import FundAunditList from '../AccountBalance/FundAuditList'
import ContactDetails from '../AccountBalance/ContactDetails'
import { effectFetch } from '../../../utils/utils'

@connect(state => ({
    accountManager: state.accountManager,
    fundAudit: state.fundAudit,
}))
export default class AccountBalance extends Component {
    constructor(props) {
        super(props)
        this.state = {
          contactDetailsVisible: false,
          accountDepositModalVisible: false,
          fundType: 0,
          fundAundistVisible: false,
          fundAundistType: 0,
          distributorNo: 0,
          fundDistributorNo: 0,
        }
    }
    componentWillMount() {
        // const { accountManager } = getOtherStore()
        // if (!accountManager || accountManager.list.length === 0) {
        //   this.props.dispatch({ type: 'accountManager/fetch', payload: { disSupTypeNo: 0 } })
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
        fundDistributorNo: record.distributorNo,
      })
      this.props.dispatch({
        type: 'fundAudit/changeState',
        payload: {
          disSupTypeNo: 1,
          fundType,
          distributorNo: record.distributorNo,
        },
      })
      this.props.dispatch({
        type: 'fundAudit/search',
        payload: {
          disSupTypeNo: 1,
          fundType,
          distributorNo: record.distributorNo,
        },
      })
    }
    depositShow = (fundType) => {
      this.setState({
        accountDepositModalVisible: true,
        fundType,
        distributorNo: this.props.accountManager.selectedRows[0].distributorNo,
        distributorName: this.props.accountManager.selectedRows[0].distributorName,
      })
    }
    render() {
    const { list, total, loading, selectedRows, selectedRowKeys, page, searchParam } = this.props.accountManager
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
      title: '分销商名称',
      dataIndex: 'distributorName',
      key: 'distributorName',
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
      // render: text => <span style={{ color: '#2db7f5' }}>{numeral(text).format('0,0')}</span>,
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
        render: (text, record) => <a onClick={this.fundAundistDetail.bind(this, 5, record)} style={{ color: '#f50' }}>{numeral(text).format('0,0')}</a>,
    },
    {
        title: '订单占用',
        dataIndex: 'occupation',
        key: 'occupation',
        width: 100,
        className: styles.columnRight,
        render: (text, record) => <a onClick={this.fundAundistDetail.bind(this, 0, record)} style={{ color: '#f50' }}>{numeral(text).format('0,0')}</a>,
    },
    {
      title: '提现',
      dataIndex: 'withdrawals',
      key: 'withdrawals',
      width: 80,
      className: styles.columnRight,
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
      render: text => <span >{numeral(text).format('0,0')}</span>,
    },
    {
      title: '授信金额',
      dataIndex: 'reditSum',
      key: 'reditSum',
      width: 100,
      className: styles.columnRight,
      render: text => <span >{numeral(text).format('0,0')}</span>,
    },
    {
      title: '总可用金额',
      dataIndex: 'availableAllBalance',
      key: 'availableAllBalance',
      width: 100,
      className: styles.columnRight,
      render: text => <span >{numeral(text).format('0,0')}</span>,
    },
  ]
    // 操作栏
    const tabelToolbar = [
      <Button
        key={1}
        premission="FUNDSUMMARY_DEPOSIT"
        disabled={selectedRows.length === 0 || [0, 1, 3].indexOf(selectedRows[0].distributorStatus) === -1}
        type="primary"
        size="small"
        onClick={this.depositShow.bind(this, 2)}
      >
        登记保证金
      </Button>,
      <Button
        premission="FUNDSUMMARY_DEPOSIT"
        key={2}
        disabled={selectedRows.length === 0 || [3, 4].indexOf(selectedRows[0].distributorStatus) === -1}
        type="primary" size="small" onClick={this.depositShow.bind(this, 21)} >退还保证金</Button>,
      <Button
        premission="FUNDSUMMARY_DEPOSIT"
        key={3}
        disabled={selectedRows.length === 0 || [0, 1, 3].indexOf(selectedRows[0].distributorStatus) === -1}
        type="primary" size="small" onClick={this.depositShow.bind(this, 3)} >登记付款</Button>,
      <Button
        premission="FUNDSUMMARY_DEPOSIT"
        key={4}
        disabled={selectedRows.length === 0 || [1].indexOf(selectedRows[0].distributorStatus) === -1}
        type="primary" size="small" onClick={this.depositShow.bind(this, 4)} >奖励</Button>,
      <Button
        key={5}
        premission="FUNDSUMMARY_DEPOSIT"
        disabled={selectedRows.length === 0 || [1, 3].indexOf(selectedRows[0].distributorStatus) === -1}
        type="primary" size="small" onClick={this.depositShow.bind(this, 5)} >罚款</Button>,
      <Button
        key={6}
        premission="FUNDSUMMARY_CONTACT"
        disabled={selectedRows.length === 0}
        type="primary"
        size="small"
        onClick={() => {
          this.setState({
            contactDetailsVisible: true,
            distributorNo: selectedRows[0].distributorNo,
          })
        }}
      >
        <Icon type="swap" />往来明细查询
      </Button>,
      <Button
        key={7}
        premission="FUNDSUMMARY_EXPORT"
        type="primary"
        size="small"
        onClick={() => {
        this.props.dispatch({
          type: 'accountManager/export',
          payload: Object.assign({ fileName: '分销资金管理.xls' }, searchParam),
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
            nameSpace: 'accountManager',
            dispatch: this.props.dispatch,
            selectedRows,
            selectedRowKeys,
            rowKey: 'autoNo',
            tableName: 'accountManagerTable',
        }
        return (
          <div>
            <div className={styles.contentBoard}>
              <div className={styles.tableList}>
                <Jtable {...tableProps} />
              </div>
            </div>
            <AccountDepositModal
              distributorNo={this.state.distributorNo}
              fundType={this.state.fundType}
              dispatch={this.props.dispatch}
              hidden={this.hiddenModal}
              disSupTypeNo={0}
              visiable={this.state.accountDepositModalVisible}
              distributorName={this.state.distributorName}
            />
            <ContactDetails disSupTypeNo={0} distributorNo={this.state.distributorNo} hidden={this.hiddenModal} visiable={this.state.contactDetailsVisible} />
            <FundAunditList
              comName={selectedRows.length ? selectedRows[0].supplierName : ''}
              distributorNo={this.state.fundDistributorNo}
              disSupTypeNo={1}
              fundType={this.state.fundAundistType}
              hidden={this.hiddenModal}
              visiable={this.state.fundAundistVisible}
            />
          </div>
        )
    }
}
