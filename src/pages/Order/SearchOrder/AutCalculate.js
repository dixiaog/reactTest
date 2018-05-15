/*
 * @Author: jiangteng
 * @Date: 2018-01-22 09:34:07
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-03-30 10:30:19
 * 设定订单审核时自动计算快递公司
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Checkbox, Divider, Modal } from 'antd'
import moment from 'moment'
import Jtable from '../../../components/JcTable'
import OrderRules from './OrderRules'

@connect(state => ({
  autCalculate: state.autCalculate,
}))
export default class AutCalculate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orderRules: false,
      record: {},
    }
  }
  detail = (record) => {
    this.setState({
      orderRules: true,
      record,
    })
  }
  hideModal = () => {
    this.props.hideModal()
  }
  render() {
    const { show } = this.props
    const { list, total, loading, selectedRows, selectedRowKeys, page } = this.props.autCalculate
    // 操作栏
    const tabelToolbar = [
      <Button type="primary" size="small" onClick={() => { this.setState({ orderRules: true }) }}>添加新的规则</Button>,
    ]
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
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: 120,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 120,
        render: (text, record) => (
          <span>
            <a onClick={this.detail.bind(this, record)}>编辑</a>
            <Divider type="vertical" />
            {record.enable === 0 ? <a>启用规则</a> : <a>禁用规则</a>}
          </span>
        ),
      },
      {
        title: '限定店铺',
        dataIndex: 'billDate',
        key: 'billDate',
        width: 120,
      },
      {
        title: '订单类型限定',
        dataIndex: 'relativeBillNo',
        key: 'relativeBillNo',
        width: 120,
        render: (text) => {
          switch (text) {
            case 1:
              return '普通订单'
            case 2:
              return '补发订单'
            case 3:
              return '换货订单'
            case 4:
              return '天猫分销'
            case 5:
              return '天猫供销'
            default:
              return '协同订单'
          }
        },
      },
      {
        title: '买家有留言',
        dataIndex: 'supplierName',
        key: 'supplierName',
        width: 120,
        render: (text) => {
          if (text) {
            return '启用'
          } else {
            return '未启用'
          }
        },
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        key: 'startTime',
        width: 120,
        render: (text) => {
          return moment(text).format('YYYY-MM-DD')
        },
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
        width: 120,
        render: (text) => {
          return moment(text).format('YYYY-MM-DD')
        },
      },
      {
        title: '支付后延迟(分)',
        dataIndex: 'yanchi',
        key: 'yanchi',
        width: 120,
        render: (text) => {
          return moment(text).format('YYYY-MM-DD')
        },
      },
      {
        title: '启用',
        dataIndex: 'enable',
        key: 'enable',
        width: 120,
        render: (text) => {
          return <Checkbox checked={text} />
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 120,
        render: (text) => {
          return moment(text).format('YYYY-MM-DD')
        },
      },
      {
        title: '修改时间',
        dataIndex: 'modifyTime',
        key: 'modifyTime',
        width: 120,
        render: (text) => {
          return moment(text).format('YYYY-MM-DD')
        },
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
      nameSpace: 'autCalculate',
      dispatch: this.props.dispatch,
      selectedRows,
      selectedRowKeys,
      rowKey: 'billNo',
      tableName: 'autCalculateTable',
      scroll: { x: 1600 },
      noSelected: true,
    }

    return (
      <div>
        <Modal
          title="自动计算快递公司"
          visible={show}
          onCancel={this.hideModal}
          maskClosable={false}
          width={1000}
        >
          <Jtable {...tableProps} />
        </Modal>
        <OrderRules
          show={this.state.orderRules}
          hideModal={() => { this.setState({ orderRules: false, record: {} }) }}
          record={this.state.record}
        />
      </div>
    )
  }
}
