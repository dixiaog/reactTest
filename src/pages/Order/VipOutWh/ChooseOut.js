/*
 * @Author: tanmengjia
 * @Date: 2018-05-09 14:53:11
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-14 21:23:12
 * 选择出库单
 */
import React, { Component } from 'react'
import moment from 'moment'
import { connect } from 'dva'
import { Modal, Form, Card, Button, message, notification } from 'antd'
import styles from './VipOutWh.less'
import Jtable from '../../../components/JcTable'
import { yesChoose } from '../../../services/order/vipOutWh'

@connect(state => ({
  chooseOut: state.chooseOut,
  vipOutWhModal: state.vipOutWhModal,
}))
@Form.create()
export default class ChooseOut extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  componentWillMount() {
    this.props.dispatch({ type: 'chooseOut/fetch', payload: { billNo: this.props.record.billNo } })
  }
  componentWillReceiveProps(nextProps) {

  }
  handleOk = () => {
    const { selectedRows } = this.props.chooseOut
    if (selectedRows && selectedRows.length) {
    yesChoose().then((json) => {
      if (json) {
        this.props.dispatch({
          type: 'vipOutWhModal/fetch',
          payload: { billNo: this.props.record.billNo },
        })
        this.props.outHidden()
        this.props.dispatch({
          type: 'chooseOut/clear'
        })
        notification.success({
          message: '操作成功',
        })
      }
    })
  } else {
    message.error('请选择出库单')
  }
  // this.props.choose(selectedRows, () => {
  //   this.props.outHidden()
  //   this.props.dispatch({
  //     type: 'chooseOut/clear'
  //   })
  // })
  }
  handleCancel = () => {
    this.props.dispatch({
      type: 'chooseOut/clear'
    })
    this.props.outHidden()
  }
  render() {
    const { list, loading, total, page, selectedRowKeys, selectedRows } = this.props.chooseOut
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
      title: '出库单号',
      dataIndex: 'expressNo',
      key: 'expressNo',
      width: 130,
    }, {
      title: '内部订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 130,
    }, {
      title: '线上订单号',
      dataIndex: 'siteOrderNo',
      key: 'siteOrderNo',
      width: 130,
    }, {
      title: '单据日期',
      dataIndex: 'billDate',
      key: 'billDate',
      width: 150,
      render: text => (text && moment(text).format('YYYY-MM-DD') !== '1899-11-30' ? moment(text).format('YYYY-MM-DD') : null)
    }, {
      title: '状态',
      dataIndex: 'uploadStatus',
      key: 'uploadStatus',
      width: 80,
      // render: (text) => {
      //   if (text * 1 === 0) {
      //     return '未上传'
      //   } else if (text * 1 === 1) {
      //     return '部分上传'
      //   } else if (text * 1 === 2) {
      //     return '已上传'
      //   }
      // },
    }, {
      title: '收货人',
      dataIndex: 'receiver',
      key: 'receiver',
      width: 80,
    }, {
      title: '收货地址',
      dataIndex: 'address',
      key: 'address',
      width: 150,
      render: (text, record) => {
        return (
          <div>{record.province}{record.city}{record.county} {record.address}</div>
        )
      }
    }, {
      title: '移动电话',
      dataIndex: 'mobileNo',
      key: 'mobileNo',
      width: 100,
    }]
    const tableProps = {
        // toolbar: tabelToolbar,
        noListChoose: true,
        noSelected: false,
        dataSource: list,
        total,
        isPart: true,
        ...page,
        loading,
        columns,
        nameSpace: 'chooseOut',
        tableName: 'chooseOutTable',
        custormTableClass: 'tablecHeightFix340',
        dispatch: this.props.dispatch,
        selectedRows,
        selectedRowKeys,
        // : selectedRowKeys.concat(this.state.haveChoose)
        rowKey: 'billNo',
        scroll: { y: 300 },
        // rowSelection: {
        //   getCheckboxProps: record => ({
        //     disabled: this.state.haveChoose && this.state.haveChoose.length && this.state.haveChoose.indexOf(record.poNo) > -1,
        //   }) },
    }
    return (
      <div>
        <Modal
          maskClosable={false}
          title="选择出库单"
          visible={this.props.chooseOutVisible}
          onCancel={this.handleCancel}
          onOk={this.handleOk}
          width={1000}
          bodyStyle={{
            minHeight: 500,
          }}
          footer={[
            <Button key={0} type="primary" onClick={this.handleOk}>
              确认选择一个或多个出库单
            </Button>,
            <Button key={1} onClick={this.handleCancel}>
              取消
            </Button>,
          ]}
        >
          <Card bordered={false}>
            <div className={styles.tableList}>
              <Jtable {...tableProps} />
            </div>
          </Card>
        </Modal>
      </div>
    )
  }
}
