/*
 * @Author: tanmengjia
 * @Date: 2018-05-08 18:45:49
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-14 21:18:45
 * 唯品会出仓单明细
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Card, Button, notification, message } from 'antd'
// import Jtable from '../../components/JcTable'
import styles from './VipOutWh.less'
import Jtable from '../../../components/JcTable'
import ChooseOut from './ChooseOut'
import Details from './Details'
import { deleteAll, chooseUpload } from '../../../services/order/vipOutWh'

@connect(state => ({
  vipOutWh: state.vipOutWh,
  vipOutWhModal: state.vipOutWhModal,
}))
@Form.create()
export default class ChooseItem extends Component {
  constructor(props) {
      super(props)
      this.state = {
        chooseOutVisible: false,
        detailVisible: false,
        selectData: null,
      }
    }
  componentWillMount() {
    if (this.props.record) {
      this.props.dispatch({ type: 'vipOutWhModal/fetch', payload: { billNo: this.props.record.billNo } })
    }
  }
  componentWillReceiveProps(nextProps) {

  }
  handleOk = () => {
    this.props.vipModalHidden()
    // this.props.dispatch({ type: 'vipOutWh/search' })
  }
  handleCancel = () => {
    this.props.vipModalHidden()
    // this.props.dispatch({ type: 'vipOutWh/search' })
  }
  editModal = (record) => {
    this.setState({
      detailVisible: true,
      selectData: record,
    })
  }
  deleteAll = () => {
    const { selectedRowKeys } = this.props.vipOutWhModal
    deleteAll(selectedRowKeys).then((json) => {
      if (json) {
        this.props.dispatch({
          type: 'vipOutWhModal/fetch',
          payload: { billNo: this.props.record.billNo },
        })
        notification.success({
          message: '操作成功',
        })
      }
    })
  }
  chooseUpload = () => {
    const { selectedRowKeys, selectedRows } = this.props.vipOutWhModal
    let isyes = true
    selectedRows.forEach((ele) => {
      if(ele.uploadStatus !== 0 && ele.uploadStatus !== 1) {
        isyes = false
      }
    })
    if (isyes) {
      const payload = {
        billNo : this.props.record.billNo,
        autoNos: selectedRowKeys,
      }
      chooseUpload(payload).then((json) => {
        if (json) {
          this.props.dispatch({
            type: 'vipOutWhModal/fetch',
            payload: { billNo: this.props.record.billNo },
          })
          notification.success({
            message: '操作成功',
          })
        }
      })
    } else {
      message.error('只有待出库或部分上传的明细可以上传')
    }
  }
  render() {
    const { list, loading, total, page, selectedRowKeys, selectedRows } = this.props.vipOutWhModal
    const { record } = this.props
    const tabelToolbar = [
      <Button key={0}
        type="primary"
        size="small"
        premission="TRUE"
        onClick={() => this.setState({ chooseOutVisible: true })}
        disabled={this.props.record.billStatus > 2}>选择出库单</Button>,
      <Button key={1}
        type="primary"
        size="small"
        premission="TRUE"
        onClick={this.deleteAll}
        disabled={!(selectedRows && selectedRows.length) || this.props.record.billStatus > 2}>批量删除</Button>,
      <Button key={2}
        type="primary"
        size="small"
        premission="TRUE"
        onClick={this.chooseUpload}
        disabled={!(selectedRows && selectedRows.length)}>单独上传</Button>,
    ]
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
      title: '内部订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 140,
    }, {
      title: '出仓单号',
      dataIndex: 'deliveryNo',
      key: 'deliveryNo',
      width: 140,
    }, {
      title: '线上订单号',
      dataIndex: 'billNo',
      key: 'billNo',
      width: 140,
    }, {
      title: '状态',
      dataIndex: 'uploadStatus',
      key: 'uploadStatus',
      width: 80,
      render: (text) => {
        if (text * 1 === 0) {
          return '未上传'
        } else if (text * 1 === 1) {
          return '部分上传'
        } else if (text * 1 === 2) {
          return '已上传'
        }
      },
    }, {
      title: '箱数',
      dataIndex: 'boxNum',
      key: 'boxNum',
      width: 60,
      className: styles.columnRight,
    }, {
      title: '订单商品数',
      dataIndex: 'singleSkuNum',
      key: 'singleSkuNum',
      width: 80,
      className: styles.columnRight,
    }, {
      title: '装箱商品数',
      dataIndex: 'skuNum',
      key: 'skuNum',
      width: 80,
      className: styles.columnRight,
    }, {
      title: '操作',
      dataIndex: 'opreation',
      key: 'opreation',
      width: 100,
      render: (text, record) => {
        return (
          <span>
            <a onClick={this.editModal.bind(this, record)} >查看装箱信息</a>
          </span>
        )
      },
      className: styles.columnCenter,
    }]
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
        nameSpace: 'vipOutWhModal',
        tableName: 'vipOutWhModalTable',
        custormTableClass: 'tablecHeightFix340',
        dispatch: this.props.dispatch,
        selectedRows,
        selectedRowKeys,
        rowKey: 'autoNo',
        scroll: { y: 300 },
    }
    const chooseOutProps = {
      chooseOutVisible: this.state.chooseOutVisible,
      outHidden: () => {
        this.setState({
          chooseOutVisible: false,
        })
      },
      choose: (data, callback) => {
        console.log('data', data)
        callback()
      },
      record,
    }
    const detailProps = {
      detailVisible: this.state.detailVisible,
      detailHidden: () => {
        this.setState({
          detailVisible: false,
          selectData: null,
        })
      },
      selectData: this.state.selectData,
    }
    
    return (
      <Modal
        maskClosable={false}
        title="出仓单明细"
        visible={this.props.vipModalVisiable}
        onCancel={this.handleCancel}
        onOk={this.handleOk}
        width={1000}
        bodyStyle={{
          minHeight: 500,
        }}
        footer={[
          <Button key="789" type="primary" onClick={this.handleOk}>
            确定
          </Button>,
        ]}
      >
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Jtable {...tableProps} />
          </div>
        </Card>
        {this.state.chooseOutVisible ? <ChooseOut {...chooseOutProps}/> : null}
        {this.state.detailVisible ? <Details {...detailProps}/> : null}
      </Modal>
    )
  }
}
