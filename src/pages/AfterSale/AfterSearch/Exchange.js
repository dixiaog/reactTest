/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-14 10:03:09
 * 生成换货订单
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import numeral from 'numeral'
import update from 'immutability-helper'
import { Modal, Avatar, Popconfirm, Button, Input, message, Table } from 'antd'
import styles from '../AfterSale.less'
import AddGood from '../../../components/ChooseItem/index'
// import OrderDetail from './OrderDetail'
import OrderDetail from '../../../components/OrderDetail'
import { insertOrderSwapInfo } from '../../../services/aftersale/afterSearch'

const EditableCell = ({ editable, value, onChange }) => {
  return (
    <div>
      {editable
        ? <Input maxLength="8" defaultValue={value} style={{ margin: '-5px 0' }} onChange={e => onChange(e.target.value)} />
        : value
      }
    </div>
  )
}
@connect(state => ({
  exchange: state.exchange,
  chooseItem: state.chooseItem,
  afterSearch: state.afterSearch,
}))

export default class Exchange extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      unable: false,
      showModal: false,
      init: true,
      data: [],
      dataCopy: [],
      orderDetail: false,
      record: {},
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.exchange.list.length && this.state.init) {
      this.setState({
        data: nextProps.exchange.list,
        dataCopy: nextProps.exchange.list,
        init: false,
      })
    }
  }

  // 删除单条商品
  deleteSingleGood = (record) => {
    const index = this.state.data.findIndex(e => e.skuNo === record.skuNo)
    let newCollection = this.state.data
    newCollection = update(newCollection, { $splice: [[index, 1]] })
    this.setState({
      data: newCollection,
      dataCopy: newCollection,
    })
    const keys = []
    newCollection.forEach((ele) => {
      keys.push(ele.skuNo)
    })
    this.props.dispatch({
      type: 'exchange/changeState',
      payload: { initKey: keys },
    })
  }
  addGood= () => {
    this.setState({ showModal: true, unable: true })
    this.props.dispatch({
      type: 'chooseItem/changeState',
      payload: { searchParam: { enableStatus: '1' }, searchParamT: true },
    })
    this.props.dispatch({
      type: 'chooseItem/fetch',
      payload: { enableStatus: '1' },
    })
  }
  // 关闭窗口
  hideModal = () => {
    this.props.hideModal()
    this.setState({
      confirmLoading: false,
      init: true,
    })
    const initialArray = []
    const newArray = update(initialArray, { $push: [] })
    this.setState({
      data: newArray,
      dataCopy: newArray,
    })
    this.props.dispatch({
      type: 'exchange/changeState',
      payload: { list: [], initKey: [] },
    })
  }
  handleSubmit = () => {
    this.setState({
      confirmLoading: true,
    })
    const swapOrderDlist = []
    this.state.data.forEach((ele) => {
      if (ele.skuNum && ele.skuNum !== '0') {
        swapOrderDlist.push({ orderNum: ele.skuNum, skuNo: ele.skuNo })
      }
    })
    insertOrderSwapInfo({ asNo: this.props.afterSearch.selectedRows[0].asNo, swapOrderDlist }).then((json) => {
      this.setState({
        confirmLoading: false,
      })
    })
  }
  handleChange(value, key, column) {
    let status = true
    const newData = [...this.state.data]
    const target = newData.filter(item => key === item.skuNo)[0]
    const index = newData.findIndex(item => key === item.skuNo)
    if (!value) {
      message.warning('商品数量不能为空')
      status = false
    } else if (isNaN(value)) {
      message.warning('商品数量请输入数字')
      status = false
    } else if (value < 0) {
      message.warning('商品数量不能小于0')
      status = false
     } else if (Math.round(Number(value)) !== Number(value) || value.toString().indexOf('.') !== -1) {
      message.warning('商品数量请输入整数(不带小数点)')
      status = false
     } else if (value.toString().indexOf(' ') !== -1) {
      message.warning('商品数量不能输入空格')
      status = false
     }
     if (status) {
      let NewData = []
      NewData = update(newData, { [index]: { $merge: { [column]: value, price: value * target.costPrice } } })
      if (target) {
        this.setState({
          data: NewData,
          dataCopy: NewData,
        })
      }
     }
  }
  edit(key) {
    const newData = [...this.state.data]
    const target = newData.filter(item => key === item.skuNo)[0]
    if (target) {
      target.editable = true
      this.setState({ data: newData })
    }
  }

  cancel(key) {
    const newData = [...this.state.dataCopy]
    const target = newData.filter(item => key === item.skuNo)[0]
    if (target) {
      Object.assign(target, newData.filter(item => key === item.skuNo)[0])
      delete target.editable
      this.setState({ data: newData })
    }
  }
  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.skuNo, column)}
        save={() => this.save(record.skuNo)}
      />
    )
  }
  render() {
    const { show } = this.props
    const { loading } = this.props.exchange
    const columns = [
      {
        title: '图片',
        dataIndex: 'productImage',
        key: 'productImage',
        width: 120,
        render: (text, record) => {
          return <Avatar shape="square" src={record.imageUrl} />
        },
      }, {
        title: '商品名称',
        dataIndex: 'productName',
        key: 'productName',
        width: 150,
        className: styles.columnCenter,
      }, {
        title: '颜色及规格',
        dataIndex: 'productSpec',
        key: 'productSpec',
        width: 150,
        className: styles.columnCenter,
      }, {
        title: '商品单价',
        dataIndex: 'costPrice',
        key: 'costPrice',
        width: 100,
        className: styles.columnCenter,
      }, {
        title: '商品数量',
        dataIndex: 'skuNum',
        key: 'skuNum',
        width: 100,
        className: styles.columnCenter,
        render: (text, record) => this.renderColumns(numeral(text).format('0,0'), record, 'skuNum'),
      }, {
        title: '成交金额',
        dataIndex: 'price',
        key: 'price',
        width: 100,
        className: styles.columnCenter,
        render: text => numeral(text).format('0,0.00'),
      }, {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 100,
        className: styles.columnCenter,
        render: (text, record) => {
          return (
            <Popconfirm title="是否确认删除商品?" onConfirm={() => this.deleteSingleGood(record)}>
              <a>删除</a>
            </Popconfirm>
          )
        },
      },
    ]
    const addProps = {
      enableStatus: '1',
      fromName: 'jt',
      unable: this.state.unable,
      changeModalVisiable: this.state.showModal,
      itemModalHidden: () => { this.setState({ showModal: false }) },
      chooseDataKeys: this.props.exchange.initKey,
      chooseData: (rows, keys, callback) => {
        callback()
        let initialArray = this.state.data
        rows.forEach((ele) => {
          const flag = this.props.exchange.initKey.indexOf(ele.skuNo)
          if (flag === -1) {
            initialArray = update(initialArray, { $push: [ele] })
          }
        })
        this.setState({
          data: initialArray,
          dataCopy: initialArray,
        })
        this.props.dispatch({
          type: 'exchange/changeState',
          payload: { initKey: keys },
        })
      },
    }
    return (
      <div>
        <Modal
          title="换货商品"
          visible={show}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          width={1100}
          bodyStyle={{ maxHeight: 480, overflowX: 'hidden', padding: 0 }}
          maskClosable={false}
          confirmLoading={this.state.confirmLoading}
        >
          <div className={styles.contentBoard}>
            <div className={styles.tableList}>
              <Button style={{ marginBottom: 6 }} onClick={() => { this.setState({ showModal: true }) }} premission="PURCHASE_MANAGER1" type="primary" size="small">添加换货商品</Button>
              <Table
                dataSource={this.state.data}
                loading={loading}
                columns={columns}
                pagination={false}
                rowKey={record => record.skuNo}
                onRow={(record) => {
                  return {
                    onMouseEnter: () => {
                      this.edit(record.skuNo)
                    },
                    onMouseLeave: () => {
                      this.cancel(record.skuNo)
                    },
                  }
                }}
              />
            </div>
          </div>
        </Modal>
        {this.state.showModal ? <AddGood {...addProps} /> : null}
        <OrderDetail
          show={this.state.orderDetail}
          hideModal={() => this.setState({ orderDetail: false, record: {} })}
          record={this.state.record}
        />
      </div>)
  }
}
