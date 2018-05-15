/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-04-25 14:39:34
 * 入库管理--悬浮框
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Card, Avatar, Button, Input, Divider, Popconfirm, message } from 'antd'
import update from 'immutability-helper'
import numeral from 'numeral'
import styles from '../Inventory.less'
import Jtable from '../../../components/JcTable'
import AddGood from '../../../components/ChooseItem/index'
import ImportGood from './ImportGood'
import AddGoodNoBill from './AddGoodNoBill'
import { addInStorageDetail, updateInStorageD, delInStorage } from '../../../services/inventory/storage'

// 数量
const EditableCell = ({ editable, value, onChange, save }) => (
  <div>
    {editable
      ? <Input 
          maxLength="11"
          onPressEnter={save}
          onChange={e => onChange(e.target.value)}
          defaultValue={value.props.children[1].toString().indexOf(',') ? value.props.children[1].toString().replace(/,/g, '') : value.props.children[1]}
        />
      : value
    }
  </div>
)

@connect(state => ({
  storageDetails: state.storageDetails,
  storage: state.storage,
}))
export default class StoragePop extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      dataCopy: [],
      showModal: false,
      billStatus: null, // 当前采购单状态
      import: false,
      showNoBill: false,
      unable: false,
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
        title: '款式编号',
        dataIndex: 'productNo',
        key: 'productNo',
        width: 100,
      }, {
        title: '入库数量',
        dataIndex: 'inNum',
        key: 'inNum',
        width: 80,
        render: (text, record) => this.renderColumns(<div style={{ color: 'blue' }}>×{numeral(text).format('0,0')}</div>, record, 'inNum'),
      }, {
        title: '采购单价',
        dataIndex: 'purchasePrice',
        key: 'purchasePrice',
        width: 80,
        render: (text) => {
          return numeral(text).format('0,0')
        },
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
                      <a onClick={() => {
                        if (this.props.storage.delicacy) {
                          message.warning('精细化管理已开启,无法编辑明细')
                         } else {
                          this.edit(record.skuNo)
                         }
                      }}
                      >
                      编辑
                      </a>
                      <Divider type="vertical" />
                      <Popconfirm
                        title="确定删除商品?"
                        onConfirm={() => {
                          if (this.props.storage.delicacy) {
                            message.warning('精细化管理已开启,无法删除明细')
                          } else {
                            this.deleteSingleGood(record.autoNo)
                          }
                        }}
                      >
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
    if (nextProps.storageDetails.list.length) {
       this.setState({
        data: nextProps.storageDetails.list,
        dataCopy: nextProps.storageDetails.list,
      })
    }
  }
  choose = () => {
    if (this.props.storage.delicacy) {
      message.warning('精细化管理已开启,无法新增商品')
    } else {
      if (this.props.storage.purNo === '') {
        this.setState({ showModal: true, unable: true })
        this.props.dispatch({
          type: 'chooseItem/changeState',
          payload: { searchParam: { enableStatus: '1' }, searchParamT: true },
        })
      } else {
        this.setState({ showNoBill: true })
        this.props.dispatch({
          type: 'nobill/fetch',
          payload: { billNo: this.props.storage.purNo },
        })
      }
    }
  }
  // 删除单条商品
  deleteSingleGood = (autoNo) => {
    delInStorage(Object.assign({ autoNos: autoNo })).then((json) => {
      if (json) {
        this.props.dispatch({ type: 'storageDetails/fetch', payload: { billNo: this.props.storage.billNo } })
      } else {
        message.error('删除商品失败')
      }
    })
  }
  handleChange(value, key) {
    const newData = [...this.state.data]
    let t = null
    const target = newData.filter(item => key === item.skuNo)[0]
    newData.forEach((ele, index) => {
      if (key === ele.skuNo) {
        t = index
      }
    })
    const NewData = update(newData, { [t]: { $merge: { inNum: value } } })
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
    let billNull = false
    let billNumber = false
    if (target.inNum === '' || target.inNum === undefined) {
      billNull = true // 数量为空
    } else {
      if ((String(target.inNum)).indexOf(',') !== -1) {
        if (!(trueNumber.test(((target.inNum)).replace(/,/g, ''))) || (target.inNum).replace(/,/g, '') < 0) {
          billNumber = true // 数量不是整数
        }
      } else if (String(target.inNum).indexOf(',') === -1) {
        if (!(trueNumber.test((target.inNum))) || target.inNum < 0) {
          billNumber = true // 数量不是整数
        }
      }
    }

    if (billNull) {
      message.warning('采购数量不能为空')
    } else if (billNumber) {
      message.warning('采购数量必须是不小于0的整数(提示:整数后面不要携带小数位)')
    } else {
      const number = String(target.inNum).indexOf(',') !== -1 ? String(target.inNum).replace(/,/g, '') : String(target.inNum)
      updateInStorageD(Object.assign({ autoNo: target.autoNo, inNum: number })).then((json) => {
        if (json) {
          Object.assign(target, { billNum: numeral(target.billNum).format('0,0') })
          if (target) {
            delete target.editable
            this.setState({
              data: newData,
              dataCopy: newData,
            })
          }
        }
      })
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
    const { total, loading, selectedRows, selectedRowKeys, page } = this.props.storageDetails
    // 表格参数
    const tableProps = {
      noSelected: true,
      dataSource: this.state.data,
      total,
      ...page,
      loading,
      columns: this.columns,
      nameSpace: 'storageDetails',
      dispatch: this.props.dispatch,
      selectedRows,
      selectedRowKeys,
      isPart: true,
      rowKey: 'skuNo',
      tableName: 'storageDetailsTable',
      scroll: { x: 1200 },
      noListChoose: true,
      showHeader: false,
      pagination: false,
    }
    const addProps = {
      fromName: 'jt',
      unable: this.state.unable,
      enableStatus: '1',
      changeModalVisiable: this.state.showModal,
      itemModalHidden: () => { this.setState({ showModal: false }) },
      chooseDataKeys: this.props.storageDetails.initKey,
      chooseData: (rows, keys, callback) => {
        addInStorageDetail(Object.assign({ skuNos: keys.toString(), billNo: this.props.storage.billNo, purNo: '' })).then((json) => {
          if (json) {
            this.props.dispatch({ type: 'storageDetails/fetch', payload: { billNo: this.props.storage.billNo } })
            callback()
          }
        })
      },
    }
    const importProps = {
      show: this.state.import,
      hideModal: () => { this.setState({ import: false }) },
    }
    const addGoodNoBill = {
      show: this.state.showNoBill,
      hideModal: () => { this.setState({ showNoBill: false }) },
      chooseDataKeys: this.props.storageDetails.initKey,
      getGoods: (rows, keys, callback, callbackError) => {
        addInStorageDetail(Object.assign({ skuNos: keys.toString(), billNo: this.props.storage.billNo, purNo: this.props.storage.purNo })).then((json) => {
          if (json) {
            this.props.dispatch({ type: 'storageDetails/fetch', payload: { billNo: this.props.storage.billNo } })
            callback()
          } else {
            callbackError()
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
        {this.state.showNoBill ? <AddGoodNoBill {...addGoodNoBill} /> : null}
        <ImportGood {...importProps} />
        <Button size="small" disabled={this.state.billStatus !== 0} onClick={this.choose} type="primary">新增商品</Button>
        <Button
          size="small"
          style={{ marginLeft: 20 }}
          disabled={this.state.billStatus !== 0}
          onClick={() => {
            if (this.props.storage.delicacy) {
              message.warning('精细化管理已开启,无法导入商品')
            } else {
              this.setState({ import: true })
            }
          }}
          type="primary"
        >
          导入商品
        </Button>
        <Button
          size="small"
          style={{ marginLeft: 20 }}
          onClick={() => {
            this.props.dispatch({ type: 'storage/search' })
            this.props.dispatch({ type: 'chooseItem/changeState', payload: { searchParamT: false } })
            this.props.hideModal()
            this.setState({
              data: [],
              unable: false,
            })
          }}
        >
          关闭页面
        </Button>
      </div>)
  }
}
