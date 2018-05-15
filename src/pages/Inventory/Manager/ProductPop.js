/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-04-25 14:39:06
 * 商品界面
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Card, Avatar, Button, Input, Divider, Popconfirm, message } from 'antd'
import numeral from 'numeral'
import update from 'immutability-helper'
import styles from '../Inventory.less'
import Jtable from '../../../components/JcTable'
import AddGood from '../../../components/ChooseItem/index'
import { savePurchaseD, delPurchaseD, editPurchaseD } from '../../../services/inventory/manager'
import { checkNumeral } from '../../../utils/utils'


// 单价
const EditableCell1 = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <Input
          maxLength="9"
          defaultValue={value.props.children[1].toString().indexOf(',') ? value.props.children[1].toString().replace(/,/g, '') : value.props.children[1]}
          style={{ margin: '-5px 0' }}
          onChange={e => onChange(e.target.value)}
        />
      : value
    }
  </div>
)

// 数量
const EditableCell2 = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <Input maxLength="11" defaultValue={value.props.children[1]} style={{ margin: '-5px 0' }} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
)

@connect(state => ({
  productPop: state.productPop,
  chooseItem: state.chooseItem,
  manager: state.manager,
}))
export default class ProductPop extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      dataCopy: [],
      showModal: false,
      billStatus: null, // 当前采购单状态
    }
    this.columns = [{
        title: '图片',
        dataIndex: 'productImage',
        key: 'productImage',
        width: 80,
        render: (text) => {
          return <Avatar shape="square" src={text} />
        },
      }, {
        title: '商品编码',
        dataIndex: 'skuNo',
        key: 'skuNo',
        width: 100,
      }, {
        title: '商品名称',
        dataIndex: 'productName',
        key: 'productName',
        width: 100,
      }, {
        title: '颜色及规格',
        dataIndex: 'productSpec',
        key: 'productSpec',
        width: 100,
      }, {
        title: '历史单价',
        dataIndex: 'historyPrice',
        key: 'historyPrice',
        width: 80,
      }, {
        title: '采购单价',
        dataIndex: 'purchasePrice',
        key: 'purchasePrice',
        width: 80,
        render: (text, record) => this.renderColumns1(<div style={{ color: 'red' }}>¥{checkNumeral(text)}</div>, record, 'purchasePrice'),
      }, {
        title: '采购数量',
        dataIndex: 'billNum',
        key: 'billNum',
        width: 80,
        render: (text, record) => this.renderColumns2(<div style={{ color: 'blue' }}>×{numeral(text).format('0,0')}</div>, record, 'billNum'),
      }, {
        title: '待入库数量',
        dataIndex: 'waitInNum',
        key: 'waitInNum',
        width: 80,
        render: text => numeral(text).format('0,0'),
      }, {
        title: '已入库数量',
        dataIndex: 'inNum',
        key: 'inNum',
        width: 80,
        render: text => numeral(text).format('0,0'),
      }, {
        title: '采购金额',
        dataIndex: 'price',
        key: 'price',
        width: 80,
        render: (text, record) => {
          return `¥${checkNumeral(Number(record.purchasePrice) * Number(record.billNum))}`
        },
      }, {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 120,
      }, {
        title: '款式编码',
        dataIndex: 'productNo',
        key: 'productNo',
        width: 100,
      }, {
        title: '操作',
        dataIndex: 'operation',
        width: 80,
        render: (text, record) => {
          const { editable } = record
          if (this.state.billStatus === 0) {
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
                    :
                    <span>
                      <a onClick={() => this.edit(record.skuNo)}>编辑</a>
                      <Divider type="vertical" />
                      <Popconfirm title="确定删除商品?" onConfirm={() => this.deleteSingleGood(record)}>
                        <a>删除</a>
                      </Popconfirm>
                    </span>
                }
              </div>
            )
          } else {
            return '不可编辑'
          }
        },
      }]
      this.cacheData = this.state.data.map(item => ({ ...item }))
    }
  componentWillReceiveProps(nextProps) {
    this.setState({
      data: [],
      dataCopy: [],
      billStatus: nextProps.record.billStatus,
    })
    if (nextProps.productPop.list.length) {
      const waitIn = nextProps.productPop.list
       this.setState({
        dataCopy: waitIn,
        data: waitIn,
      })
    }
  }
  addGood= () => {
    this.setState({ showModal: true, unable: true })
    this.props.dispatch({
      type: 'chooseItem/changeState',
      payload: { searchParam: { enableStatus: '1' }, searchParamT: true },
    })
  }
// 删除单条商品
deleteSingleGood = (record) => {
  if (record.inNum * 1 > 0) {
    message.warning('商品已入库数量大于0,不可以删除')
  } else {
    delPurchaseD(Object.assign({ autoNos: [record.autoNo], billNo: this.props.record.billNo })).then((json) => {
      if (json) {
        this.props.dispatch({
          type: 'productPop/fetch',
          payload: { billNo: this.props.record.billNo },
        })
      }
    })
  }
}
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
    const NewData = update(newData, { [t]: { $merge: { billNum: value } } })
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
    // 判断是否整数
    const trueNumber = /^\d+$/
    const newData = [...this.state.data]
    const target = newData.filter(item => key === item.skuNo)[0]
    let priceNull = false
    let priceNumber = false
    let priceDian = false
    let priceWeishu = false
    let billNull = false
    let billNumber = false
    if (target.purchasePrice === '' || target.purchasePrice === undefined) {
      priceNull = true // 单价为空
    } else {
      if ((target.purchasePrice).toString().indexOf(',') !== -1) {
        if (isNaN((target.purchasePrice).replace(/,/g, '')) || target.purchasePrice < 0 || target.purchasePrice >= 1000000) {
          priceNumber = true // 单价不是数字
        } else if ((target.purchasePrice).toString().replace(/,/g, '').charAt(0) === '.' ||
        (target.purchasePrice).toString().replace(/,/g, '').charAt([(target.purchasePrice).replace(/,/g, '').length - 1]) === '.') {
          priceDian = true
        } else if ((target.purchasePrice).toString().replace(/,/g, '').indexOf('.') !== -1) {
          if ((target.purchasePrice).toString().replace(/,/g, '').toString().split('.')[1].length > 2) {
            priceWeishu = true
          }
        }
      } else if ((target.purchasePrice).toString().indexOf(',') === -1) {
        if (isNaN((target.purchasePrice)) || target.purchasePrice < 0 || target.purchasePrice >= 1000000) {
          priceNumber = true // 单价不是数字
        } else if ((target.purchasePrice).toString().charAt(0) === '.' || (target.purchasePrice).toString().charAt([(target.purchasePrice).length - 1]) === '.') {
          priceDian = true
        } else if ((target.purchasePrice).toString().indexOf('.') !== -1) {
          if ((target.purchasePrice).toString().split('.')[1].length > 2) {
            priceWeishu = true
          }
        }
      }
    }
    if (target.billNum === '' || target.billNum === undefined) {
      billNull = true // 数量为空
    } else {
      if ((String(target.billNum)).indexOf(',') !== -1) {
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
      message.warning('采购单价或者数量不能为空')
    } else if (priceNumber) {
      message.warning('采购单价必须是大于等于0,小于1000000的数字且小数点不超过2位')
    } else if (billNumber) {
      message.warning('采购数量必须是不小于0的整数(提示:整数后面不要携带小数位)')
    } else if (priceDian) {
      message.warning('采购单价不能以.做开始或结尾')
    } else if (priceWeishu) {
      message.warning('采购单价小数位数不能超过2位')
    } else {
      if (target.billNum * (1 + this.props.record.exceedRate) >= target.inNum) {
        const params = {}
        Object.assign(params, {
          purchasePrice: target.purchasePrice.toString().indexOf(',') !== -1 ? target.purchasePrice.toString().replace(/,/g, '') : target.purchasePrice,
          billNum: target.purchasePrice.toString().indexOf(',') !== -1 ? target.billNum.replace(/,/g, '') : target.billNum,
          autoNo: target.autoNo,
          billNo: this.props.record.billNo,
        })
        editPurchaseD(params).then((json) => {
          if (json) {
            this.props.dispatch({
              type: 'manager/search',
            })
            this.props.dispatch({
              type: 'productPop/fetch',
              payload: { billNo: this.props.record.billNo },
            })
          }
        })
      } else {
        message.warning(`采购数量*(1 + 溢出率) >= 已入库数量才可以保存!(提示: 当前溢出率为${this.props.record.exceedRate})`)
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
    const { total, loading, selectedRows, selectedRowKeys, page } = this.props.productPop
    // 表格参数
    const tableProps = {
      noSelected: true,
      dataSource: this.state.data,
      total,
      ...page,
      loading,
      columns: this.columns,
      nameSpace: 'productPop',
      dispatch: this.props.dispatch,
      selectedRows,
      selectedRowKeys,
      isPart: true,
      rowKey: 'skuNo',
      tableName: 'productPopTable',
      scroll: { x: 1200 },
      noListChoose: true,
      showHeader: false,
      pagination: false,
    }
    const addProps = {
      fromName: 'jt',
      enableStatus: '1',
      unable: this.state.unable,
      changeModalVisiable: this.state.showModal,
      itemModalHidden: () => { this.setState({ showModal: false }) },
      chooseDataKeys: this.props.productPop.initKey,
      chooseData: (rows, keys, callback) => {
        savePurchaseD(Object.assign({ billNo: this.props.record.billNo, skuNos: keys.toString() })).then((json) => {
          if (json) {
          this.props.dispatch({ type: 'productPop/fetch', payload: { billNo: this.props.record.billNo ? this.props.record.billNo : this.props.manager.billNo } })
          callback()
          }
        })
      },
    }
    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Jtable {...tableProps} />
          </div>
        </Card>
        <AddGood {...addProps} />
        <Button size="small" disabled={this.state.billStatus !== 0} onClick={this.addGood} type="primary">新增商品</Button>
        <Button
          size="small"
          style={{ marginLeft: 20 }}
          onClick={() => {
            this.props.hideModal()
            this.setState({
              data: [],
            })
          }}
        >
          关闭页面
        </Button>
      </div>)
  }
}
