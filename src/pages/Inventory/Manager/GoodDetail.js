/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-04-19 11:03:42
 * 商品明细详情
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Card, Avatar, Button, Input, Divider, Popconfirm, message } from 'antd'
import numeral from 'numeral'
import update from 'immutability-helper'
import styles from '../Inventory.less'
import SearchBar from '../../../components/SearchBar'
import Jtable from '../../../components/JcTable'
import AddGood from '../../../components/ChooseItem/index'
import ImportGood from './ImportGood'


// 单价
const EditableCell1 = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <Input defaultValue={value} style={{ margin: '-5px 0' }} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
)

// 数量
const EditableCell2 = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <Input defaultValue={value} style={{ margin: '-5px 0' }} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
)

@connect(state => ({
  goodModal: state.goodModal,
}))
export default class GoodDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false, // 控制添加商品展示
      importGood: false, // 控制商品导入展示
      data: [],
      dataCopy: [],
    }
    this.columns = [{
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      width: 80,
      render: (text, record, index) => {
        return (
          <span>
            {index + 1}
          </span>
        )
      },
    }, {
      title: '图片',
      dataIndex: 'productImage',
      key: 'productImage',
      width: 120,
      render: (text) => {
        return <Avatar shape="square" src={text} />
      },
    }, {
      title: '商品编码',
      dataIndex: 'skuNo',
      key: 'skuNo',
      width: 120,
    }, {
      title: '商品名称',
      dataIndex: 'productName',
      key: 'productName',
      width: 120,
    }, {
      title: '颜色及规格',
      dataIndex: 'productSpec',
      key: 'productSpec',
      width: 120,
    }, {
      title: '历史单价',
      dataIndex: 'historyPrice',
      key: 'historyPrice',
      width: 120,
    }, {
      title: '采购单价',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',
      width: 120,
      render: (text, record) => this.renderColumns1(text, record, 'purchasePrice'),
    }, {
      title: '采购数量',
      dataIndex: 'billNum',
      key: 'billNum',
      width: 120,
      render: (text, record) => this.renderColumns2(text, record, 'billNum'),
    }, {
      title: '采购金额',
      dataIndex: 'price',
      key: 'price',
      width: 120,
    }, {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 120,
    }, {
      title: '款式编码',
      dataIndex: 'productNo',
      key: 'productNo',
      width: 120,
    }, {
      title: '操作',
      key: 'operation',
      width: 120,
      render: (text, record) => {
        const { editable } = record
        return (
          <div className="editable-row-operations">
            {
              editable ?
                <span>
                  <a onClick={() => this.save(record.skuNo)}>保存</a>
                  <Divider type="vertical" />
                  <Popconfirm title="确定取消编辑?" onConfirm={() => this.cancel(record.skuNo)}>
                    <a>取消</a>
                  </Popconfirm>
                </span>
                : <a onClick={() => this.edit(record.skuNo)}>编辑</a>
            }
          </div>
        )
      },
    }]
    this.cacheData = this.state.data.map(item => ({ ...item }))
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.goodModal.list.length) {
      this.setState({
        data: nextProps.goodModal.list,
        dataCopy: nextProps.goodModal.list,
      })
    }
  }
  // 关闭窗口
  hideModal = () => {
    this.setState({
      data: [],
      dataCopy: [],
    })
    const { hideModal } = this.props
    this.props.dispatch({ type: 'goodModal/clean', payload: { selectedRows: [], selectedRowKeys: [], list: [], total: 0, initKey: [] } })
    hideModal()
  }

  // 删除商品
  deleteGood = () => { }
  handleChange1(value, key) {
    const newData = [...this.state.data]
    let t = null
    const target = newData.filter(item => key === item.skuNo)[0]
    newData.forEach((ele, index) => {
      if (key === ele.skuNo) {
        t = index
      }
    })
    const NewData = update(newData, { [t]: { $merge: { purchasePrice: value } } })
    if (target) {
      this.setState({ data: NewData })
    }
  }
  handleChange2(value, key) {
    const newData = [...this.state.data]
    let t = null
    const target = newData.filter(item => key === item.skuNo)[0]
    newData.forEach((ele, index) => {
      if (key === ele.skuNo) {
        t = index
      }
    })
    const NewData = update(newData, { [t]: { $merge: { billNo: value } } })
    if (target) {
      this.setState({ data: NewData })
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
  save(key) {
    // 判断是否数字
    const ret = /^(([0])|([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,6})))$/
    // 判断是否整数
    const trueNumber = /^\d+$/
    const newData = [...this.state.data]
    const target = newData.filter(item => key === item.skuNo)[0]
    let priceNull = false
    let priceNumber = false
    let priceDouhao = false
    let billNull = false
    let billNumber = false
    let billDouhao = false
    if (target.purchasePrice === '' || target.purchasePrice === undefined) {
      priceNull = true // 单价为空
    } else {
      if ((target.purchasePrice).indexOf(',') !== -1) {
        priceDouhao = true
        if (!(ret.test((target.purchasePrice).replace(/,/g, '')))) {
          priceNumber = true // 单价不是数字
        }
      } else if ((target.purchasePrice).indexOf(',') === -1) {
        if (!(ret.test((target.purchasePrice)))) {
          priceNumber = true // 单价不是数字
        }
      }
    }
    if (target.billNum === '' || target.billNum === undefined) {
      billNull = true // 数量为空
    } else {
      if ((String(target.billNum)).indexOf(',') !== -1) {
        billDouhao = true
        if (!(trueNumber.test((String(target.billNum)).replace(/,/g, ''))) || target.billNum < 0) {
          billNumber = true // 数量不是整数
        }
      } else if (String(target.billNum).indexOf(',') === -1) {
        if (!(trueNumber.test(String(target.billNum))) || target.billNum < 0) {
          billNumber = true // 数量不是整数
        }
      }
    }

    if (priceNull || billNull) {
      message.error('采购单价或者数量不能为空')
    } else if (priceNumber) {
      message.error('采购单价必须是不小于0的数字')
    } else if (billNumber) {
      message.error('采购数量必须是不小于0的整数')
    } else if (priceDouhao && billDouhao) {
      Object.assign(target, { 
        price: numeral(target.purchasePrice.replace(/,/g, '') * target.billNum.replace(/,/g, '')).format('0,0.000'),
        purchasePrice: numeral(target.purchasePrice).format('0,0.000'), billNum: numeral(target.billNum).format('0,0'),
      })
      if (target) {
        delete target.editable
        this.setState({ data: newData })
        this.cacheData = newData.map(item => ({ ...item }))
      }
    } else if (priceDouhao === true && billDouhao === false) {
      Object.assign(target, {
        price: numeral(target.purchasePrice.replace(/,/g, '') * target.billNum).format('0,0.000'),
        purchasePrice: numeral(target.purchasePrice).format('0,0.000'), billNum: numeral(target.billNum).format('0,0'),
      })
      if (target) {
        delete target.editable
        this.setState({ data: newData })
        this.cacheData = newData.map(item => ({ ...item }))
      }
    } else if (priceDouhao === false && billDouhao === true) {
      Object.assign(target, {
        price: numeral(target.purchasePrice * target.billNum.replace(/,/g, '')).format('0,0.000'),
        purchasePrice: numeral(target.purchasePrice).format('0,0.000'), billNum: numeral(target.billNum).format('0,0'),
      })
      if (target) {
        delete target.editable
        this.setState({ data: newData })
        this.cacheData = newData.map(item => ({ ...item }))
      }
    } else {
      Object.assign(target, {
        price: numeral(target.purchasePrice * target.billNum).format('0,0.000'),
        purchasePrice: numeral(target.purchasePrice).format('0,0.000'), billNum: numeral(target.billNum).format('0,0'),
      })
      if (target) {
        delete target.editable
        this.setState({ data: newData })
        this.cacheData = newData.map(item => ({ ...item }))
      }
    }
  }

  cancel(key) {
    const newData = [...this.state.dataCopy]
    const target = newData.filter(item => key === item.skuNo)[0]
    if (target) {
      Object.assign(target, this.state.dataCopy.filter(item => key === item.skuNo)[0])
      delete target.editable
      this.setState({ data: this.state.dataCopy })
    }
  }
  renderColumns1(text, record, column) {
    return (
      <EditableCell1
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange1(value, record.skuNo, column)}
      />
    )
  }
  renderColumns2(text, record, column) {
    return (
      <EditableCell2
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange2(value, record.skuNo, column)}
      />
    )
  }
  render() {
    const { show } = this.props
    const { total, loading, selectedRows, selectedRowKeys, page, searchParam } = this.props.goodModal
    // 操作栏
    const tabelToolbar = [
      <Button type="primary" size="small" onClick={() => { this.setState({ showModal: true }) }}>添加商品</Button>,
      <Button type="primary" size="small" disabled={!selectedRowKeys.length} onClick={this.deleteGood}>删除商品</Button>,
      <Button type="primary" size="small" onClick={() => { this.setState({ importGood: true }) }}>导入商品</Button>,
    ]
    // 表格参数
    const tableProps = {
      rowSelection: {
        hideDefaultSelections: true,
      },
      toolbar: tabelToolbar,
      dataSource: this.state.data,
      total,
      ...page,
      loading,
      columns: this.columns,
      nameSpace: 'goodModal',
      dispatch: this.props.dispatch,
      selectedRows,
      selectedRowKeys,
      isPart: true,
      rowKey: 'skuNo',
      tableName: 'goodModalTable',
      scroll: { x: 800 },
    }
    const searchBarItem = [ // 搜索栏
      {
        decorator: 'skuNo',
        components: (<Input placeholder="商品编码" size="small" />),
      },
      {
        decorator: 'productName',
        components: (<Input placeholder="商品名称" size="small" />),
      },
      {
        decorator: 'productSpec',
        components: (<Input placeholder="颜色及规格" size="small" />),
      },
      {
        decorator: 'productNo',
        components: (<Input placeholder="款式编号" size="small" />),
      },
    ]
    const searchBarProps = {
      colItems: searchBarItem,
      dispatch: this.props.dispatch,
      nameSpace: 'goodModal',
      searchParam,
    }

    const addProps = {
      changeModalVisiable: this.state.showModal,
      itemModalHidden: () => { this.setState({ showModal: false }) },
      chooseDataKeys: this.props.productPop.initKey,
      chooseData: (rows, keys, callback) => {
        if (true) {
          this.props.dispatch({ type: 'productPop/fetch' })
          callback()
        }
      },
    }

    const importGoodProps = {
      show: this.state.importGood,
      hideModal: () => { this.setState({ importGood: false }) },
    }
    return (
      <div>
        <Modal
          width={1200}
          title="采购明细"
          visible={show}
          onCancel={this.hideModal}
          footer={[
            <Button type="danger" onClick={this.hideModal}>关闭</Button>,
          ]}
          bodyStyle={{ maxHeight: 500, overflowX: 'hidden', padding: 0 }}
          maskClosable={false}
        >
          <div>
            <Card bordered={false}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>
                  <SearchBar {...searchBarProps} />
                </div>
                <Jtable {...tableProps} />
              </div>
            </Card>
          </div>
        </Modal>
        <AddGood {...addProps} />
        <ImportGood {...importGoodProps} />
      </div>)
  }
}
