/*
 * @Author: tanmengjia
 * @Date: 2018-02-10 15:33:24
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-04-19 09:58:23
 * 订单审核
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Button, Card, notification, Checkbox, Divider } from 'antd'
import Jtable from '../../../../components/JcTable'
import styles from '../../Order.less'
import { checkPremission } from '../../../../utils/utils'
import ApproveStrategyModal from './ApproveStrategyModal'
import { enable } from '../../../../services/order/approveStrategy'

@connect(state => ({
  approveStrategy: state.approveStrategy,
}))
export default class ApproveStrategy extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editData: null,
      approveModalVisiable: false,
    }
  }
  componentDidMount() {
    this.props.dispatch({ type: 'approveStrategy/fetch' })
    this.props.dispatch({ type: 'approveStrategy/getShopName' })
  }
  editModal = (record) => {
    this.props.dispatch({
      type: 'approveStrategy/getChooseData',
      payload: {
        strategyNo: record.strategyNo,
      },
    })
    this.setState({
      editData: record,
      approveModalVisiable: true,
    })
  }
  enable = (record) => {
    const payload = {
      strategyNo: record.strategyNo,
      enableStatus: 1,
    }
    enable(payload).then((json) => {
      if (json) {
        this.props.dispatch({ type: 'approveStrategy/fetch' })
        notification.success({
          message: '操作成功',
        })
      }
    })
  }
  disEnable = (record) => {
    const payload = {
      strategyNo: record.strategyNo,
      enableStatus: 0,
    }
    enable(payload).then((json) => {
      if (json) {
        this.props.dispatch({ type: 'approveStrategy/fetch' })
        notification.success({
          message: '操作成功',
        })
      }
    })
  }
  render() {
    const { list, loading, total, page, selectedRowKeys, selectedRows } = this.props.approveStrategy
    const columns = [{
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        width: 60,
        render: (text, record, index) => {
          return (
            <span>
              {index + 1}
            </span>)
          },
      }, {
        title: '名称',
        dataIndex: 'strategyName',
        key: 'strategyName',
        width: 80,
      },
      {
          title: '操作',
          dataIndex: 'opreation',
          key: 'opreation',
          width: 120,
          className: styles.columnCenter,
          render: (text, record) => {
            if (checkPremission('APPROVESTRATEGY_SAVE')) {
              return (
                <span>
                  <a onClick={this.editModal.bind(this, record)}>编辑</a>
                  <Divider type="vertical" />
                  {record.enableStatus ? <a onClick={this.disEnable.bind(this, record)}>禁用规则</a> : <a onClick={this.enable.bind(this, record)}>启用规则</a>}
                </span>
            )
          }
          },
        }, {
        title: '限定店铺',
        dataIndex: 'shopName',
        key: 'shopName',
        width: 120,
        render: text => (text ? text : '全部生效'),
      }, {
        title: '订单类型限定',
        dataIndex: 'limitOrderType',
        key: 'limitOrderType',
        width: 120,
        render: (text, record) => {
          if (record.limitOrderType === 0) {
            return '普通订单'
          } else if (record.limitOrderType === 1) {
            return '补发订单'
          } else if (record.limitOrderType === 2) {
            return '换货订单'
          } else if (record.limitOrderType === 3) {
            return '天猫分销'
          } else if (record.limitOrderType === 4) {
            return '天猫供销'
          } else if (record.limitOrderType === 5) {
            return '协同订单'
          } else if (record.limitOrderType === 99) {
            return '全部生效'
          }
        },
      }, {
        title: '买家有留言',
        dataIndex: 'ignoreBuyerMessage',
        key: 'ignoreBuyerMessage',
        width: 120,
        render: (text, record) => {
          if (record.ignoreBuyerMessage === 0) {
            return '忽略'
          } else if (record.ignoreBuyerMessage === 1) {
            return '不忽略'
          }
        },
      }, {
        title: '开始时间',
        dataIndex: 'beginTime',
        key: 'beginTime',
        width: 120,
        render: text => (text && moment(text).format('YYYY-MM-DD') !== '1899-11-30' ? moment(text).format('YYYY-MM-DD') : undefined),
      }, {
        title: '结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
        width: 120,
        render: text => (text && moment(text).format('YYYY-MM-DD') !== '1899-11-30' ? moment(text).format('YYYY-MM-DD') : undefined),
      }, {
        title: '支付后有延迟(分)',
        dataIndex: 'delayApprove',
        key: 'delayApprove',
        width: 100,
        className: styles.columnCenter,
      }, {
        title: '启用',
        dataIndex: 'enableStatus',
        key: 'enableStatus',
        width: 100,
        className: styles.columnCenter,
        render: (text, record) => (
          <Checkbox checked={record.enableStatus} />
        ),
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 100,
        render: text => (text && moment(text).format('YYYY-MM-DD') !== '1899-11-30' ? moment(text).format('YYYY-MM-DD') : undefined),
      }, {
        title: '修改时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        width: 100,
        render: text => (text && moment(text).format('YYYY-MM-DD') !== '1899-11-30' ? moment(text).format('YYYY-MM-DD') : undefined),
    }]
      const approveModalProps = {
        approveModalVisiable: this.state.approveModalVisiable,
        dispatch: this.props.dispatch,
        editData: this.state.editData,
        itemModalHidden: () => {
          this.props.dispatch({ type: 'approveStrategy/clear' })
          this.setState({
            approveModalVisiable: false,
            editData: null,
          })
        },
      }
    const tabelToolbar = [
      <Button type="primary" size="small" key={123} onClick={() => { this.setState({ approveModalVisiable: true }) }} premission="APPROVESTRATEGY_SAVE">添加新的规则</Button>,
      // premission="COMBINATIONITEM_ADD"
    ]
    const tableProps = {
        toolbar: tabelToolbar,
        noSelected: false,
        dataSource: list,
        total,
        ...page,
        loading,
        columns,
        nameSpace: 'approveStrategy',
        tableName: 'approveStrategyTable',
        dispatch: this.props.dispatch,
        selectedRows,
        selectedRowKeys,
        rowKey: 'strategyNo',
        scroll: { x: 1500 },
    }
    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Jtable {...tableProps} />
          </div>
        </Card>
        { this.state.approveModalVisiable ? <ApproveStrategyModal {...approveModalProps} /> : null }
      </div>
    )
  }
}
