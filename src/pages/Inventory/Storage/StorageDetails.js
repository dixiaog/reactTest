/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-04-20 18:48:02
 * 入库明细
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Card, Avatar, Button, Input, Divider, Popconfirm, message } from 'antd'
import numeral from 'numeral'
import update from 'immutability-helper'
import styles from '../Inventory.less'
import Jtable from '../../../components/JcTable'
import ImportGood from './ImportGood'
import AddGood from '../../../components/ChooseItem/index'
import AddGoodNoBill from './AddGoodNoBill'
import { addInStorageDetail, updateInStorageD, delInStorage } from '../../../services/inventory/storage'
import { checkNumeral } from '../../../utils/utils'

// 数量
const EditableCell = ({ editable, value, onChange, save }) => (
  <div>
    {editable
      ? <Input maxLength="11" onPressEnter={save} defaultValue={value} style={{ margin: '-5px 0' }} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
)

@connect(state => ({
  storageDetails: state.storageDetails,
  storage: state.storage,
  nobill: state.nobill,
  chooseItem: state.chooseItem,
}))
export default class StorageDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false, // 控制添加商品展示
      importGood: false, // 控制商品导入展示
      data: [],
      dataCopy: [],
      showNoBill: false, // 无采购单新增商品页面展示
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
        title: '款式编号',
        dataIndex: 'productNo',
        key: 'productNo',
        width: 120,
      }, {
        title: '入库数量',
        dataIndex: 'inNum',
        key: 'inNum',
        width: 120,
        render: (text, record) => this.renderColumns(checkNumeral(text), record, 'inNum'),
      }, {
        title: '采购单价',
        dataIndex: 'purchasePrice',
        key: 'purchasePrice',
        width: 120,
        render: (text) => {
          return checkNumeral(text)
        },
      }, {
        title: '操作',
        key: 'operation',
        width: 120,
        render: (text, record) => {
          const { editable } = record
          if (this.props.record.billStatus === 0 || this.props.record.billStatus === undefined) {
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
      this.cacheData = this.props.storageDetails.list.map(item => ({ ...item }))
    }
  componentWillReceiveProps(nextProps) {
    this.setState({
      data: [],
      dataCopy: [],
    })
    if (nextProps.storageDetails.list.length) {
       this.setState({
        data: nextProps.storageDetails.list,
        dataCopy: nextProps.storageDetails.list,
      })
    }
  }
  // 关闭窗口
  hideModal = () => {
    this.props.dispatch({ type: 'storage/search' })
    this.props.dispatch({ type: 'chooseItem/changeState', payload: { searchParamT: false } })
    this.setState({
      data: [],
    })
    const { hideModal } = this.props
    this.props.dispatch({ type: 'storageDetails/clean', payload: { selectedRows: [], selectedRowKeys: [], page: {}, list: [], total: 0, initKey: [] } })
    this.props.dispatch({ type: 'storage/save', payload: { purNo: '' } })
    hideModal()
  }

  choose = () => {
    if (this.props.storage.delicacy) {
      message.warning('精细化管理已开启,无法添加新的入库商品')
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

  // 删除商品
  deleteGood = () => {
    if (this.props.storage.delicacy) {
      message.warning('精细化管理已开启,无法删除商品')
     } else {
      const autoNo = []
      this.props.storageDetails.selectedRows.forEach((ele) => {
        autoNo.push(ele.autoNo)
      })
      delInStorage(Object.assign({ autoNos: autoNo.toString() })).then((json) => {
        if (json) {
          this.props.dispatch({ type: 'storageDetails/clean', payload: { selectedRowKeys: [], selectedRows: [] } })
          this.props.dispatch({ type: 'storageDetails/fetch', payload: { billNo: this.props.storage.billNo } })
        } else {
          message.error('删除商品失败')
        }
      })
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
      } else if ((String((target.inNum))).indexOf(',') === -1) {
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
    const { show } = this.props
    const { total, loading, selectedRows, selectedRowKeys, page } = this.props.storageDetails
    // 操作栏
    const tabelToolbar = this.props.record.billStatus === 0 || this.props.record.billStatus === undefined ? [
      <Button premission="STORAGE_ADDGOOD" type="primary" size="small" onClick={() => { this.choose() }}>添加新的入库商品</Button>,
      <Popconfirm premission="STORAGE_DELETEGOOD" okText="确定" cancelText="取消" title="请确认是否删除，删除后将无法恢复?" onConfirm={this.deleteGood}>
        <Button type="primary" size="small" disabled={!selectedRowKeys.length}>删除商品</Button>
      </Popconfirm>,
      <Button
        premission="STORAGE_IMPORT"
        type="primary"
        size="small"
        onClick={() => {
          if (this.props.storage.delicacy) {
            message.warning('精细化管理已开启,无法导入商品')
           } else {
            this.setState({ importGood: true })
           }
        }}
      >
        导入商品
      </Button>,
     ] : []
    // 表格参数
    const tableProps = {
      custormTableClass: 'tablecHeightFix340',
      rowSelection: {
        hideDefaultSelections: true,
        getCheckboxProps: record => ({
          disabled: this.props.record.billStatus === 0 || this.props.record.billStatus === undefined ? false : true,
        }),
      },
      toolbar: tabelToolbar,
      dataSource: this.state.dataCopy,
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
      scroll: { y: 300 },
    }
    const addProps = {
      unable: this.state.unable,
      enableStatus: '1',
      purNo: this.props.storage.purNo,
      fromName: 'jt',
      changeModalVisiable: this.state.showModal,
      itemModalHidden: () => { this.setState({ showModal: false }) },
      chooseDataKeys: this.props.storageDetails.initKey,
      chooseData: (rows, keys, callback) => {
        addInStorageDetail(Object.assign({ skuNos: keys.toString(), billNo: this.props.storage.billNo, purNo: this.props.storage.purNo })).then((json) => {
          if (json) {
            this.props.dispatch({ type: 'storageDetails/fetch', payload: { billNo: this.props.storage.billNo } })
            callback()
          }
        })
      },
    }

    const importGoodProps = {
      show: this.state.importGood,
      hideModal: () => { this.setState({ importGood: false }) },
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
        <Modal
          width={1200}
          title="入库明细"
          visible={show}
          onCancel={this.hideModal}
          footer={[
            <Button key="1" onClick={this.hideModal}>关闭</Button>,
          ]}
          bodyStyle={{ overflowX: 'hidden', padding: 0 }}
          maskClosable={false}
        >
          <div>
            <Card bordered={false}>
              <div className={styles.tableList}>
                <Jtable {...tableProps} />
              </div>
            </Card>
          </div>
        </Modal>
        {this.state.showModal ? <AddGood {...addProps} /> : null}
        <ImportGood {...importGoodProps} />
        {this.state.showNoBill ? <AddGoodNoBill {...addGoodNoBill} /> : null}
      </div>)
  }
}
