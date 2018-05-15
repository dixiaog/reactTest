/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-04-20 18:49:42
 * 商品界面
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Card, Avatar, Button, Input, Divider, Popconfirm, message } from 'antd'
import update from 'immutability-helper'
import styles from '../Inventory.less'
import SearchBar from '../../../components/SearchBar'
import Jtable from '../../../components/JcTable'
import AddGood from '../../../components/ChooseItem/index'
import ImportGood from './ImportGood'
import { savePurchaseD, delPurchaseD, editPurchaseD } from '../../../services/inventory/manager'
import { checkPremission, checkNumeral } from '../../../utils/utils'


// 单价
const EditableCell1 = ({ editable, value, onChange, save }) => (
  <div>
    {editable
      ? <Input onPressEnter={save} maxLength="9" defaultValue={value.indexOf(',') ? value.replace(/,/g, '') : value} style={{ margin: '-5px 0' }} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
)

// 数量
const EditableCell2 = ({ editable, value, onChange, save }) => (
  <div>
    {editable
      ? <Input onPressEnter={save} maxLength="11" defaultValue={value.indexOf(',') ? value.replace(/,/g, '') : value} style={{ margin: '-5px 0' }} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
)
const data = []
for (let i = 0; i < 100; i++) {
  data.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  })
}

@connect(state => ({
  goodModal: state.goodModal,
  manager: state.manager,
}))
export default class GoodModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false, // 控制添加商品展示
      importGood: false, // 控制商品导入展示
      data: [],
      dataCopy: [],
      billStatus: undefined, // 当前采购单状态
      unable: false,
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
        render: (text, record) => {
          return this.renderColumns1(checkNumeral(text), record, 'purchasePrice')
        },
      }, {
        title: '采购数量',
        dataIndex: 'billNum',
        key: 'billNum',
        width: 120,
        render: (text, record) => this.renderColumns2(checkNumeral(text), record, 'billNum'),
      }, {
        title: '待入库数量',
        dataIndex: 'waitInNum',
        key: 'waitInNum',
        width: 120,
        render: text => checkNumeral(text),
      }, {
        title: '已入库数量',
        dataIndex: 'inNum',
        key: 'inNum',
        width: 120,
        render: text => checkNumeral(text),
      }, {
        title: '采购金额',
        dataIndex: 'price',
        key: 'price',
        width: 120,
        render: (text, record) => {
          return checkNumeral(record.purchasePrice * record.billNum)
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
        width: 120,
      }, {
        title: '操作',
        key: 'operation',
        width: 120,
        render: (text, record) => {
          const { editable } = record
          if (this.state.billStatus === 0 || this.state.billStatus === undefined) {
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
                    <div>
                      {checkPremission('PURCHASE_EDITGOODS') ?
                        <span>
                          <a onClick={() => this.edit(record.skuNo)}>编辑</a>
                          <Divider type="vertical" />
                        </span> : null}
                      {checkPremission('PURCHASE_DELETEGOODS') ?
                        <span>
                          <Popconfirm title="确定删除商品?" onConfirm={() => this.deleteSingleGood(record)}>
                            <a>删除</a>
                          </Popconfirm>
                        </span> : null}
                    </div>
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
    if (nextProps.goodModal.list.length) {
      const waitIn = nextProps.goodModal.list
       this.setState({
        dataCopy: waitIn,
        data: waitIn,
      })
    }
  }
  // 关闭窗口
  hideModal = () => {
    this.setState({
      data: [],
      dataCopy: [],
      unable: false,
    })
    this.props.dispatch({ type: 'manager/search' })
    const { hideModal } = this.props
    this.props.dispatch({ type: 'goodModal/clean', payload: { selectedRows: [], selectedRowKeys: [], list: [], total: 0, initKey: [] } })
    hideModal()
  }
  addGood= () => {
    this.setState({ showModal: true, unable: true })
    this.props.dispatch({
      type: 'chooseItem/changeState',
      payload: { searchParam: { enableStatus: '1' }, searchParamT: true },
    })
  }
  // 删除商品
  deleteGood = () => {
    const deleteArray = this.props.goodModal.selectedRows.filter(ele => ele.inNum * 1 > 0)
    if (deleteArray.length) {
      message.warning('删除商品中包含已入库数量大于0的商品,请先去除')
    } else {
      delPurchaseD(Object.assign({ autoNos: this.props.goodModal.selectedRowKeys, billNo: this.props.record.billNo ? this.props.record.billNo : this.props.manager.billNo })).then((json) => {
        if (json) {
          this.props.dispatch({
            type: 'goodModal/fetch',
            payload: { billNo: this.props.record.billNo ? this.props.record.billNo : this.props.manager.billNo },
          })
          this.props.dispatch({ type: 'manager/search' })
          this.props.dispatch({
            type: 'goodModal/changeState',
            payload: { selectedRowKeys: [], selectedRows: [] },
          })
        }
      })
    }
  }
   // 删除单条商品
   deleteSingleGood = (record) => {
     if (record.inNum * 1 > 0) {
       message.warning('商品已入库数量大于0,不可以删除')
     } else {
      delPurchaseD(Object.assign({ autoNos: [record.autoNo], billNo: this.props.record.billNo ? this.props.record.billNo : this.props.manager.billNo })).then((json) => {
        if (json) {
          this.props.dispatch({
            type: 'manager/search',
          })
          this.props.dispatch({
            type: 'goodModal/fetch',
            payload: { billNo: this.props.record.billNo ? this.props.record.billNo : this.props.manager.billNo },
          })
          this.props.dispatch({
            type: 'goodModal/changeState',
            payload: { selectedRowKeys: [], selectedRows: [] },
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
    // 判断是否数字
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
        } else if ((target.purchasePrice).replace(/,/g, '').charAt(0) === '.' || (target.purchasePrice).replace(/,/g, '').charAt([(target.purchasePrice).replace(/,/g, '').length - 1]) === '.') {
          priceDian = true
        } else if ((target.purchasePrice).replace(/,/g, '').indexOf('.') !== -1) {
          if ((target.purchasePrice).replace(/,/g, '').toString().split('.')[1].length > 2) {
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
      let exceedRate = 0
      if (!(this.props.record.exceedRate === undefined)) {
        exceedRate = this.props.record.exceedRate
      }
      if (target.billNum * (1 + exceedRate) >= target.inNum) {
        const params = {}
        Object.assign(params, {
          purchasePrice: target.purchasePrice.toString().indexOf(',') !== -1 ? target.purchasePrice.toString().replace(/,/g, '') : target.purchasePrice,
          billNum: target.purchasePrice.toString().indexOf(',') !== -1 ? target.billNum.replace(/,/g, '') : target.billNum,
          autoNo: target.autoNo,
          billNo: this.props.record.billNo ? this.props.record.billNo : this.props.manager.billNo,
        })
        editPurchaseD(params).then((json) => {
          if (json) {
            this.props.dispatch({
              type: 'goodModal/fetch',
              payload: { billNo: this.props.record.billNo ? this.props.record.billNo : this.props.manager.billNo },
            })
            this.props.dispatch({
              type: 'manager/search',
            })
            this.props.dispatch({
              type: 'goodModal/changeState',
              payload: { selectedRowKeys: [], selectedRows: [] },
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
        save={() => this.save(record.skuNo)}
      />
    )
  }
  renderColumns2(text, record, column) {
    return (
      <EditableCell2
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange2(value, record.skuNo, column)}
        save={() => this.save(record.skuNo)}
      />
    )
  }
  render() {
    const { show } = this.props
    const { total, loading, selectedRows, selectedRowKeys, page, searchParam } = this.props.goodModal
    const { billStatus } = this.props.record
    // 操作栏
    const tabelToolbar = billStatus !== 0 && billStatus !== undefined ? [] : [
      <Button premission="PURCHASE_ADDGOOD" type="primary" size="small" onClick={this.addGood}>添加商品</Button>,
      <Popconfirm premission="PURCHASE_DELETEGOODS" okText="确定" cancelText="取消" title="请确认是否删除，删除后将无法恢复?" onConfirm={this.deleteGood}>
        <Button type="primary" size="small" disabled={!selectedRowKeys.length}>删除商品</Button>
      </Popconfirm>,
      <Button premission="PURCHASE_IMPORTPRO" type="primary" size="small" onClick={() => { this.setState({ importGood: true }) }}>导入商品</Button>,
    ]
    // 表格参数
    const tableProps = {
      rowSelection: {
        hideDefaultSelections: true,
        getCheckboxProps: record => ({
          disabled: billStatus !== 0 && billStatus !== undefined ? true : false,
        }),
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
      rowKey: 'autoNo',
      tableName: 'goodModalTable',
      scroll: { y: 300 },
      custormTableClass: 'tablecHeightFix340',
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
      unable: this.state.unable,
      fromName: 'jt',
      enableStatus: '1',
      changeModalVisiable: this.state.showModal,
      itemModalHidden: () => { this.setState({ showModal: false }) },
      chooseDataKeys: this.props.goodModal.initKey,
      chooseData: (rows, keys, callback) => {
        savePurchaseD(Object.assign({ billNo: this.props.record.billNo ? this.props.record.billNo : this.props.manager.billNo, skuNos: keys.toString() })).then((json) => {
          if (json) {
          this.props.dispatch({ type: 'goodModal/fetch', payload: { billNo: this.props.record.billNo ? this.props.record.billNo : this.props.manager.billNo } })
          this.props.dispatch({ type: 'manager/search' })
          callback()
          }
        })
      },
    }

    const importGoodProps = {
      show: this.state.importGood,
      hideModal: () => { this.setState({ importGood: false }) },
      billNo: this.props.record.billNo,
    }
    return (
      <div>
        <Modal
          width={1200}
          title="采购明细"
          visible={show}
          onCancel={this.hideModal}
          footer={[
            <Button key="1" onClick={this.hideModal}>关闭</Button>,
          ]}
          bodyStyle={{ maxHeight: 600, overflowX: 'hidden', padding: 0 }}
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
