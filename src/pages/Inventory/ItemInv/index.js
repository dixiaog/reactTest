/*
 * @Author: tanmengjia
 * @Date: 2018-02-01 16:39:33
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-14 13:08:39
 * 商品库存
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import update from 'immutability-helper'
import { Button, Select, Input, Popconfirm, message, Divider, notification, Avatar, Dropdown, Icon, Menu, InputNumber, Alert, Form, Modal } from 'antd'
import Jtable from '../../../components/JcTable'
import SearchBar from '../../../components/SearchBar'
import styles from '../Inventory.less'
import EditInputCell from '../../../components/EditInputCell'
import { recalculation, cleanInv, clearAll, clearChoose, resetItem1, editSave } from '../../../services/inventory/itemInv'
import SynchronousInv from './SynchronousInv'
import SetInventory from './SetInventory'
import MainStorehouse from './MainStorehouse'
import OrderNum from './OrderNum'
import { getOtherStore } from '../../../utils/otherStore'
import { getLocalStorageItem } from '../../../utils/utils'

const { Option } = Select

@connect(state => ({
    itemInv: state.itemInv,
}))
@Form.create()
export default class ItemInv extends Component {
  constructor(props) {
    super(props)
    this.state = {
    synchronousModalVisiable: false,
    orderNumVisiable: false,
    importModalVisiable: false,
    detailModalVisiable: false,
    resetItem: false,
    clearChoose: false,
    clearAll: false,
    type: '',
    empty: [],
    autoNo: '',
    ephemeralData: {},
    dataWhenCancel: [],
    data: [],
    record: '',
    Alertvis: false,
    Alertvis1: false,
    virtualNum1: false,
    skuNo1: '',
    selectData: null,
    }
  }
  componentDidMount() {
    const { itemInv } = getOtherStore()
    const tabKeys = getLocalStorageItem('itemInv')
    const isInTab = tabKeys ? tabKeys.split(',').indexOf('itemInv') > -1 : false
    if (!itemInv || (itemInv.list.length === 0 && !isInTab)) {
      this.props.dispatch({ type: 'itemInv/fetch' })
    } else {
      this.setState({
        data: itemInv.list,
      })
    }
    // this.props.dispatch({ type: 'itemInv/fetch' })
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.itemInv.list,
      dataWhenCancel: nextProps.itemInv.list,
    })
  }
handleChange = (value, record, column) => {
  if (value === '') {
    const index = this.state.data.findIndex(e => e.autoNo === record.autoNo)
    this.setState(update(
      this.state, {
        ephemeralData: {
          [record.autoNo]: { $merge: { [column]: value } },
        },
        data: { [index]: { $merge: { [column]: value } } },
      }
    ))
  } else if (/[0-9]$/.test(value)) {
      const index = this.state.data.findIndex(e => e.autoNo === record.autoNo)
      this.setState(update(
        this.state, {
          ephemeralData: {
            [record.autoNo]: { $merge: { [column]: value } },
          },
          data: { [index]: { $merge: { [column]: value } } },
        }
      ))
    } else {
      this.setState({
        Alertvis: true,
      })
    }
  }
  handleChange1 = (value, record, column) => {
    if (value === '') {
      const index = this.state.data.findIndex(e => e.autoNo === record.autoNo)
      this.setState(update(
        this.state, {
          ephemeralData: {
            [record.autoNo]: { $merge: { [column]: value } },
          },
          data: { [index]: { $merge: { [column]: value } } },
          }
      ))
    } else if (/(-)|(-(\d)|(\d))$/.test(value)) {
      const index = this.state.data.findIndex(e => e.autoNo === record.autoNo)
      this.setState(update(
        this.state, {
          ephemeralData: {
            [record.autoNo]: { $merge: { [column]: value } },
          },
          data: { [index]: { $merge: { [column]: value } } },
          }
      ))
    } else {
      this.setState({
        virtualNum1: true,
      })
    }
  }
save(autoNo) {
  if (Number(this.state.ephemeralData[autoNo].safetyLowerLimit) <= Number(this.state.ephemeralData[autoNo].safetyUpperLimit)) {
    const { ephemeralData, data, dataWhenCancel } = this.state
    const target = ephemeralData[autoNo]// newData.filter(item => autoNo === item.autoNo)[0]
    const index = data.findIndex(e => e.autoNo === autoNo)
    delete ephemeralData[autoNo]
      if (target) {
          const payload = {
            virtualNum: (target.virtualNum === '') ? 0 : target.virtualNum,
            safetyLowerLimit: (target.safetyLowerLimit === '') ? 0 : target.safetyLowerLimit,
            safetyUpperLimit: (target.safetyUpperLimit === '') ? 0 : target.safetyUpperLimit,
            autoNo,
          }
          editSave(payload).then((json) => {
            if (json) {
              target.editable = false
              data[index] = target
              dataWhenCancel[index] = target
              this.setState({ data, ephemeralData, dataWhenCancel })
              this.props.dispatch({
                type: 'itemInv/search',
              })
            }
          })
      }
  } else {
    this.setState({
          Alertvis1: true,
        })
  }
  }
  handleOk = () => {
    this.setState({
      resetItem: false,
      clearChoose: false,
      clearAll: false,
      Alertvis: false,
      Alertvis1: false,
      virtualNum1: false,
    })
  }
  exportItem = () => {
    this.props.dispatch({
      type: 'itemInv/exportItem',
      payload: { ...this.props.itemInv.searchParam, fileName: '商品库存明细.xls' },
    })
  }
edit = (autoNo) => {
  const { data } = this.state
  const target = data.filter(item => autoNo === item.autoNo)[0]
  if (target) {
    target.editable = true
    this.setState({ data, ephemeralData: Object.assign(this.state.ephemeralData, { [autoNo]: target }) })
  }
  }
cancel(autoNo) {
  const { ephemeralData, dataWhenCancel, data } = this.state
  delete ephemeralData[autoNo]
  const target = dataWhenCancel.filter(item => autoNo === item.autoNo)[0]
  target.editable = false
  const index = data.findIndex(e => e.autoNo === autoNo)
  data[index] = target
  this.setState({ data, ephemeralData })
  }
  count = () => {
    recalculation().then((json) => {
      if (json.success) {
        notification.success({
          message: json.errorMessage,
        })
        this.props.dispatch({
          type: 'itemInv/search',
        })
      }
    })
  }
  resetItem = () => {
    resetItem1().then((json) => {
      if (json) {
        this.setState({
          resetItem: true,
        }, () => {
          this.props.dispatch({
            type: 'itemInv/search',
          })
        })
      }
    })
  }
  cleanInv = () => {
    const skuNo = []
    this.props.itemInv.selectedRows.forEach((ele) => {
      skuNo.push(ele.skuNo)
    })
    const payload = { IDLst: skuNo }
    cleanInv(payload).then((json) => {
      if (json) {
        this.props.dispatch({
          type: 'itemInv/search',
        })
      }
    })
  }
  clearChoose = () => {
    const skuNo = []
    this.props.itemInv.selectedRows.forEach((ele) => {
      skuNo.push(ele.skuNo)
    })
    const payload = { IDLst: skuNo }
    clearChoose(payload).then((json) => {
      if (json) {
        this.props.dispatch({
          type: 'itemInv/search',
        })
        this.setState({
          clearChoose: false,
        })
      }
    })
  }
  clearAll = () => {
    const payload = { IDLst: this.state.empty }
    clearAll(payload).then((json) => {
        if (json) {
          this.props.dispatch({
            type: 'itemInv/search',
          })
          this.setState({
            clearAll: false,
          })
        }
      })
  }
  beyond = () => {
    this.props.dispatch({ type: 'itemInv/beyond' })
  }
  low = () => {
    this.props.dispatch({ type: 'itemInv/low' })
  }
  details = (record) => {
    this.setState({
      detailModalVisiable: true,
      autoNo: record.skuNo,
      selectData: record,
    })
  }
  tbClick = (e) => {
    switch (e.key * 1) {
      case 1:
      this.setState({ importModalVisiable: true, type: 2 })
      break
      case 2:
      this.setState({ clearChoose: true })
      break
      case 3:
      this.setState({ clearAll: true })
      break
      default:
      break
    }
  }
  lookOccupyNum = (record) => {
    if (record.occupyNum > 0) {
      this.setState({
        orderNumVisiable: true,
        skuNo1: record.skuNo,
      })
    }
  }
  lookLockNum = (record) => {
    console.log('库存锁定数', record)
  }
  beginNumis = (value) => {
    console.log(value)
    if (/^[0-9]*[1-9][0-9]*$/.test(value)) {
      console.log('输入的是正整数')
    } else if (value === 0) {
      console.log('输入了0')
    } else if (value === '') {
      console.log('输入的是空格')
    } else if (value === undefined) {
      console.log('输入值不做校验')
    } else {
      message.config({
        top: 100,
        duration: 2,
        maxCount: 3,
      })
      message.error(`${value}不是正整数,请输入大于0的正整数`)
    }
  }
  endNumis = (value) => {
    if (/^[0-9]*[1-9][0-9]*$/.test(value)) {
      console.log('输入的是正整数')
    } else if (value === 0) {
      console.log('输入的是0')
    } else if (value === '') {
      console.log('输入的是空格')
    } else if(value === undefined) {
      console.log('输入值不做校验')
    } else {
      message.config({
        top: 100,
        duration: 2,
        maxCount: 3,
      })
      message.error(`${value}不是正整数,请输入大于0的正整数`)
    }
  }
  renderColumns(text, record, column) {
    return (
      <EditInputCell
        editEnable={record.editable}
        value={text}
        autoNo={record.autoNo}
        column={column}
        record={record}
        onInputChange={this.handleChange.bind(this)}
      />
    )
  }
  renderColumns1(text, record, column) {
    return (
      <EditInputCell
        editEnable={record.editable}
        value={text}
        autoNo={record.autoNo}
        column={column}
        record={record}
        onInputChange={this.handleChange1.bind(this)}
      />
    )
  }
  render() {
    const { loading, searchParam, total, page, selectedRowKeys, selectedRows } = this.props.itemInv
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
            title: '图片',
            dataIndex: 'productImage',
            key: 'productImage',
            width: 80,
            render: (text) => {
              return (<Avatar shape="square" src={text} />)
              },
      }, {
        title: '款式编码',
        dataIndex: 'productNo',
        key: 'productNo',
        width: 120,
    }, {
        title: '商品编码',
        dataIndex: 'skuNo',
        key: 'skuNo',
        width: 120,
    }, {
      title: '虚拟库存数',
      dataIndex: 'virtualNum',
      key: 'virtualNum',
      width: 100,
      className: styles.columnRight,
      render: (text, record) => this.renderColumns1(text, record, 'virtualNum'),
  }, {
      title: '安全库存下限',
      dataIndex: 'safetyLowerLimit',
      key: 'safetyLowerLimit',
      width: 120,
      className: styles.columnRight,
      render: (text, record) => this.renderColumns(text, record, 'safetyLowerLimit'),
  }, {
      title: '安全库存上限',
      dataIndex: 'safetyUpperLimit',
      key: 'safetyUpperLimit',
      width: 120,
      className: styles.columnRight,
      render: (text, record) => this.renderColumns(text, record, 'safetyUpperLimit'),
    }, {
      title: '操作',
      dataIndex: 'opreation',
      key: 'opreation',
      width: 120,
      className: styles.columnCenter,
      render: (text, record) => {
        const { editable } = record
        return (
          <div className="editable-row-operations">
            {
              editable ?
                <span>
                  <Popconfirm title="确定保存??" okText="确定" cancelText="取消" onConfirm={() => this.save(record.autoNo)}>
                    <a>保存</a>
                  </Popconfirm>
                  <Divider type="vertical" />
                  <a onClick={this.cancel.bind(this, record.autoNo)} >取消</a>
                </span>
                : <a onClick={this.edit.bind(this, record.autoNo)} >编辑</a>
            }
          </div>
        )
        },
}, {
        title: '商品名',
        dataIndex: 'productName',
        key: 'productName',
        width: 120,
    }, {
        title: '颜色及规格',
        dataIndex: 'productSpec',
        key: 'productSpec',
        width: 120,
    }, {
        title: '主仓实际库存',
        dataIndex: 'inventoryNum',
        key: 'inventoryNum',
        width: 120,
        className: styles.columnRight,
    }, {
        title: '库存锁定数',
        dataIndex: 'lockNum',
        key: 'lockNum',
        width: 100,
        className: styles.columnRight,
        render: (text, record) => {
          return (
            <a onClick={this.lookLockNum.bind(this, record)}>{text}</a>
          )
        },
    }, {
        title: '订单占有数',
        dataIndex: 'occupyNum',
        key: 'occupyNum',
        width: 100,
        className: styles.columnRight,
        render: (text, record) => {
          return (
            <a onClick={this.lookOccupyNum.bind(this, record)}>{text}</a>
          )
        },
    }, {
        title: '可用库存数量',
        children: [{
            title: '总可用',
            dataIndex: 'all',
            key: 'all',
            width: 100,
            className: styles.columnRight,
            // inventoryNum - occupyNum + virtualNum
            render: (text, record) => {
              return (
                <span>{Number(record.inventoryNum) - Number(record.occupyNum) + Number(record.virtualNum)}</span>
              )
            },
            }, {
            title: '公用可用',
            dataIndex: 'allUser',
            key: 'allUser',
            width: 100,
            className: styles.columnRight,
            // inventoryNum - occupyNum + virtualNum - (lockNum - lockOccupyNum)
            render: (text, record) => {
              const states = Number(record.inventoryNum) - Number(record.occupyNum) + Number(record.virtualNum) - (Number(record.lockNum) - Number(record.lockOccupyNum))
              return (
                <span>{Number(states)}</span>
              )
            },
            }],
    },
     {
        title: '主仓库存明细账',
        dataIndex: 'opreation1',
        key: 'opreation1',
        width: 160,
        render: (text, record) => {
            return (
              <div>
                <a onClick={this.details.bind(this, record)}>主仓明细账</a>
                <Divider type="vertical" />
                {/* <a disabled="true">查看日志</a> */}
              </div>
            )
          },
    }, {
        title: '仓库待发数',
        dataIndex: 'waitDeliveryNum',
        key: 'waitDeliveryNum',
        width: 110,
        className: styles.columnRight,
    }, {
        title: '销退仓库存',
        dataIndex: 'returnWarehouseNum',
        key: 'returnWarehouseNum',
        width: 110,
        className: styles.columnRight,
    }, {
        title: '进货仓库存',
        dataIndex: 'inWarehouseNum',
        key: 'inWarehouseNum',
        width: 110,
        className: styles.columnRight,
    }, {
        title: '次品库存',
        dataIndex: 'defectiveWarehouseNum',
        key: 'defectiveWarehouseNum',
        width: 80,
        className: styles.columnRight,
    }, {
        title: '采购在途数',
        dataIndex: 'onWayNum',
        key: 'onWayNum',
        width: 110,
        className: styles.columnRight,
    }]
    const importModalProps = {
      type: this.state.type,
      dispatch: this.props.dispatch,
      itemModalHidden: () => {
        this.setState({
          importModalVisiable: false,
        })
      },
      importModalVisiable: this.state.importModalVisiable,
    }
    const orderNumProps = {
      skuNo: this.state.skuNo1,
      dispatch: this.props.dispatch,
      itemModalHidden: () => {
        this.setState({
          orderNumVisiable: false,
          skuNo1: '',
        })
      },
      orderNumVisiable: this.state.orderNumVisiable,
    }
    const detailModalProps = {
      skuNo: this.state.autoNo,
      selectData: this.state.selectData,
      type: 1,
      dispatch: this.props.dispatch,
      itemModalHidden: () => {
        this.setState({
          detailModalVisiable: false,
          autoNo: '',
        })
      },
      detailModalVisiable: this.state.detailModalVisiable,
    }
    const synchronousModalProps = {
      selectedRows,
      dispatch: this.props.dispatch,
      itemModalHidden: () => {
        this.setState({
          synchronousModalVisiable: false,
        })
      },
      synchronousModalVisiable: this.state.synchronousModalVisiable,
    }
    const open = (
      <Menu onClick={this.tbClick.bind(this)}>
        <Menu.Item key="1">导入安全库存</Menu.Item>
        <Menu.Item key="2" disabled={this.props.itemInv.selectedRows.length === 0}>清空选定商品安全库存</Menu.Item>
        <Menu.Item key="3">清空所有商品安全库存</Menu.Item>
      </Menu>
      )
    const tabelToolbar = [
      <Button key={1} type="primary" premission="ITEMINV_UPLOADINVENT" size="small" onClick={() => this.setState({ importModalVisiable: true, type: 1 })}>添加虚拟库存</Button>,
      <Dropdown key={2} premission="INVENTORY_DELETESFNU" overlay={open}>
        <Button type="primary" size="small" className={styles.btn_jiange}>
            设置安全库存 <Icon type="down" />
        </Button>
      </Dropdown>,
      <Button key={3} premission="INVENTORY_EXPORTSKU" type="primary" size="small" onClick={this.exportItem}>导出所有符合条件的单据</Button>,
      <Button key={4} premission="INVENTORY_REFRESHPNA" type="primary" size="small" onClick={this.resetItem}>刷新商品名</Button>,
      <Button key={5} premission="ITEMINV_SYNCIN" type="primary" size="small" onClick={() => { this.setState({ synchronousModalVisiable: true }) }} disabled="true">同步库存</Button>,
      <Popconfirm key={6} premission="INVENTORY_DELETENULL" title="清除1小时内没有库存变化并且库存为0的资料信息；请确认清除这些信息" okText="确定" onConfirm={this.cleanInv} cancelText="取消">
        <Button premission="INVENTORY_DELETENULL" type="primary" size="small">清除0库存资料</Button>
      </Popconfirm>,
      <Button key={7} premission="INVENTORY_BACKONWAYN" type="primary" size="small" onClick={this.count}>重算在途</Button>,
     ]
    const tableProps = {
        toolbar: tabelToolbar,
        noSelected: false,
        dataSource: this.state.data,
        total,
        ...page,
        loading,
        columns,
        nameSpace: 'itemInv',
        tableName: 'itemInvTable',
        dispatch: this.props.dispatch,
        selectedRows,
        selectedRowKeys,
        rowKey: 'autoNo',
        class: styles.tableEllipsis,
        scroll: { x: 2000, y: document.body.clientHeight - 380 },
        custormTableClass: 'tablecHeightFixInvUse',
    }
    const searchBarItem = [{
        decorator: 'productNo',
        components: <Input placeholder="款式编码" size="small" />,
    }, {
        decorator: 'skuNo',
        components: <Input placeholder="商品编码" size="small" />,
    }, {
        decorator: 'productName',
        components: <Input placeholder="商品名称" size="small" />,
    }, {
        decorator: 'productSpec',
        components: <Input placeholder="颜色规格" size="small" />,
    }, {
      decorator: 'status',
      components: (
        <Select placeholder="请选择范围条件" size="small" style={{ marginTop: 4 }} >
          <Option value="1">主仓实际库存</Option>
          <Option value="2">订单占有数</Option>
          <Option value="3">可用库存</Option>
          <Option value="4">可用库存（不算虚拟库）减安全库存</Option>
          <Option value="5">退货仓库库存</Option>
          <Option value="6">进货仓库库存</Option>
          <Option value="7">次品仓库库存</Option>
          <Option value="8">虚拟库存</Option>
          <Option value="9">安全库存下限</Option>
          <Option value="10">安全库存上限</Option>
        </Select>
      ),
    }, {
      decorator: 'beginNum',
      components: <InputNumber onChange={this.beginNumis.bind(this)} placeholder="下限值" size="small" />,
    }, {
        decorator: 'endNum',
        components: <InputNumber onChange={this.endNumis.bind(this)} placeholder="上限值" size="small" />,
    }, {
      type: 'button',
      components: <Button type="primary" size="small" style={{ marginTop: '7px' }} onClick={this.low}>等于低于安全库存</Button>,
    }, {
      type: 'button',
      components: <Button type="primary" size="small" style={{ marginTop: '7px' }} onClick={this.beyond}>超卖</Button>,
    },
    ]
    const searchBarProps = {
      colItems: searchBarItem,
      dispatch: this.props.dispatch,
      nameSpace: 'itemInv',
      searchParam,
    }
    const description = (
      <div>
        <div style={{ color: '#A14715' }}>可用数[同步线上的库存数]=主仓实际库存-订单占有数+虚拟库存，可配货库存=主仓实际库存-仓库待发数</div>
        <div style={{ color: '#A14715' }}>虚拟库存=可以正负，用于虚假库存用来同步线上或锁定一部分库存不同步线上，实际同步线上库存数=主仓实际库存-订单占有数+虚拟库存</div>
      </div>
    )
    return (
      <div>
        <div className={styles.contentBoard}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Alert
                description={description}
                type="warning"
                // showIcon
              />
              <SearchBar {...searchBarProps} />
            </div>
            <Jtable {...tableProps} />
          </div>
        </div>
        <Modal
          maskClosable={false}
          title="刷新成功"
          visible={this.state.resetItem}
          onOk={this.handleOk}
          onCancel={this.handleOk}
          footer={[
            <Button key="999" type="primary" onClick={this.handleOk}>
              确定
            </Button>,
          ]}
          // confirmLoading={this.state.confirmLoading}
          // onCancel={this.handleCancel}
          // bodyStyle={{ height: 500, overflowX: 'hidden' }}
        >
          <Alert
            description="刷新成功"
            type="success"
            showIcon
          />
        </Modal>
        <Modal
          maskClosable={false}
          title=""
          visible={this.state.clearChoose}
          onOk={this.clearChoose}
          onCancel={this.handleOk}
          // confirmLoading={this.state.confirmLoading}
          // onCancel={this.handleCancel}
          // bodyStyle={{ height: 500, overflowX: 'hidden' }}
        >
          <div className={styles.wordSize} style={{ fontSize: 20 }}>清空所选商品的安全库存？</div>
        </Modal>
        <Modal
          maskClosable={false}
          title=""
          visible={this.state.clearAll}
          onOk={this.clearAll}
          onCancel={this.handleOk}
          // confirmLoading={this.state.confirmLoading}
          // onCancel={this.handleCancel}
          // bodyStyle={{ height: 500, overflowX: 'hidden' }}
        >
          <div className={styles.wordSize} style={{ fontSize: 20 }}>清空所有商品安全库存？</div>
        </Modal>
        <Modal
          maskClosable={false}
          title="提示"
          visible={this.state.Alertvis}
          onOk={this.handleOk}
          onCancel={this.handleOk}
          footer={[
            <Button key="999" type="primary" onClick={this.handleOk}>
              确定
            </Button>,
          ]}
          // confirmLoading={this.state.confirmLoading}
          // onCancel={this.handleCancel}
          // bodyStyle={{ height: 500, overflowX: 'hidden' }}
        >
          <Alert message="输入的不是正确的整数，请输入有效的整数" type="warning" showIcon />
        </Modal>
        <Modal
          maskClosable={false}
          title="提示"
          visible={this.state.Alertvis1}
          onOk={this.handleOk}
          onCancel={this.handleOk}
          footer={[
            <Button type="primary" onClick={this.handleOk}>
              确定
            </Button>,
          ]}
          // confirmLoading={this.state.confirmLoading}
          // onCancel={this.handleCancel}
          // bodyStyle={{ height: 500, overflowX: 'hidden' }}
        >
          <Alert message="安全库存下限需小于等于安全库存上限" type="warning" showIcon />
        </Modal>
        <Modal
          maskClosable={false}
          title="提示"
          visible={this.state.virtualNum1}
          onOk={this.handleOk}
          onCancel={this.handleOk}
          footer={[
            <Button type="primary" onClick={this.handleOk}>
              确定
            </Button>,
          ]}
          // confirmLoading={this.state.confirmLoading}
          // onCancel={this.handleCancel}
          // bodyStyle={{ height: 500, overflowX: 'hidden' }}
        >
          <Alert message="请输入正确的虚拟库存数" type="warning" showIcon />
        </Modal>
        { this.state.synchronousModalVisiable ? <SynchronousInv {...synchronousModalProps} /> : null }
        { this.state.importModalVisiable ? <SetInventory {...importModalProps} /> : null }
        { this.state.detailModalVisiable ? <MainStorehouse {...detailModalProps} /> : null }
        { this.state.orderNumVisiable ? <OrderNum {...orderNumProps} /> : null }
      </div>
    )
  }
}
