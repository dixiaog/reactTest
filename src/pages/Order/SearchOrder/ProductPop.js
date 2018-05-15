/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-12 13:18:39
 * 商品界面
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Card, Button, Input, Tooltip, Table, Row, Col, Icon, message, Popconfirm } from 'antd'
import numeral from 'numeral'
import update from 'immutability-helper'
import styles from '../Order.less'
import config from '../../../utils/config'
import ChooseItem from '../../../components/ChooseItem/index'
import { insertOrderDInfo, deleteOrderD, updateOrderDeditor } from '../../../services/order/search'
import ShowImg from '../../../components/ShowImg'

const EditableCell = ({ editable, value, onChange, save }) => (
  <div>
    {editable
      ? <Tooltip title="回车保存">
          <Input
            onPressEnter={save}
            maxLength="8"
            defaultValue={value.props.children[1].toString().indexOf(',') ? value.props.children[1].toString().replace(/,/g, '') : value.props.children[1]}
            style={{ margin: '-5px 0' }}
            onChange={e => onChange(e.target.value)}
          />
        </Tooltip>
      : value
    }
  </div>
)

@connect(state => ({
  orderProductPop: state.orderProductPop,
  chooseItem: state.chooseItem,
  search: state.search,
}))
export default class ProductPop extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      dataCopy: [],
      billStatus: null, // 当前状态
      chooseItemVisiable: false,
      init: true,
      unable: false,
      isGift: false,
      noClick: false,
      productType: false,
    }
    this.columns = [{
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width: 60,
        render: (text, record) => {
          return (
            <Popconfirm title="是否确认删除商品信息?" onConfirm={() => this.deleteSingleGood(record)}>
              <a><Icon type="delete" /></a>
            </Popconfirm>
          )
        },
      }, {
      title: '图片',
      dataIndex: 'productImage',
      key: 'productImage',
      width: 60,
      render: (text, record) => {
        return (
          <ShowImg record={record} />
        )
      },
    }, {
      title: '商品名称',
      dataIndex: 'productName',
      key: 'productName',
      width: 350,
      render: (text, record) => {
        if (record.isGift === 0 && record.isPresale === 0) {
          return (
          <div>
            <div style={{ fontSize: 14 }}>{text}</div>
            <div>
              <span style={{ marginRight: 15, color: '#999' }}>{record.productNo}</span>
              <span style={{ marginRight: 15 }}>{record.skuNo}</span>
              <span style={{ color: '#999' }}>{record.productSpec}</span>
            </div>
          </div>
          )
         } else {
           return (
            <div>
              <div><span className={styles.spanCircle}>{record.isPresale ? '预' : '赠'}</span><span style={{ fontSize: 14 }}>{text}</span></div>
              <div style={{ marginTop: 5 }}>
                <span style={{ marginRight: 15, color: '#999' }}>{record.productNo}</span>
                <span style={{ marginRight: 15 }}>{record.skuNo}</span>
                <span style={{ color: '#999' }}>{record.productSpec}</span>
              </div>
            </div>
           )
         }
      },
    }, {
      title: <div>订单数量<div>(回车保存)</div></div>,
      dataIndex: 'orderNum',
      key: 'orderNum',
      width: 120,
      render: (text, record) => this.renderColumns(<div style={{ color: 'blue' }}>×{numeral(text).format('0,0')}</div>, record, 'orderNum'),
    }, {
      title: <div>单价<div>(回车保存)</div></div>,
      dataIndex: 'salePrice',
      key: 'salePrice',
      width: 120,
      render: (text, record) => {
        if (record.isGift === 0) {
         return this.renderColumns(<div style={{ color: 'red' }}>¥{numeral(text).format('0,0.00')}</div>, record, 'salePrice')
        } else {
          return <div style={{ color: 'red' }}>¥{numeral(text).format('0,0.00')}</div>
        }
      },
    }, {
      title: '原价',
      dataIndex: 'retailPrice',
      key: 'retailPrice',
      width: 120,
      render: (text) => {
        return `¥${numeral(text).format('0,0.00')}`
      },
    }, {
      title: '成交金额',
      dataIndex: 'saleAmount',
      key: 'saleAmount',
      width: 120,
      render: (text) => {
        return `¥${numeral(text).format('0,0.00')}`
      },
    }, {
      title: '可配货库存',
      dataIndex: 'waitNum',
      key: 'waitNum',
      width: 120,
      render: (text, record) => {
        const status = this.props.record.orderStatus
        if (status === 0 || status === 1 || status === 4 || status === 10) {
          const states = Number(record.inventoryNum) - Number(record.occupyNum) + Number(record.virtualNum) + Number(record.lockInventory) - (Number(record.lockNum) - Number(record.lockOccupyNum))
          return states
        } else {
          return 0
        }
      },
    }]
    }
  componentWillReceiveProps(nextProps) {
    if (nextProps.orderProductPop.list.length && this.state.init) {
      const waitIn = nextProps.orderProductPop.list
       this.setState({
        data: waitIn,
        dataCopy: waitIn,
        init: false,
        billStatus: nextProps.record.orderStatus,
      })
      this.props.dispatch({
        type: 'orderProductPop/changeState',
        payload: { list: [] },
      })
    }
    if (nextProps.record.orderStatus === 0 || nextProps.record.orderStatus === 1 || nextProps.record.orderStatus === 4) {
      this.setState({
        noClick: true,
      })
    }
  }
  // 添加商品
  addGood= () => {
    this.setState({ chooseItemVisiable: true, unable: true, isGift: false })
    this.props.dispatch({
      type: 'chooseItem/changeState',
      payload: { searchParam: { enableStatus: '1' }, searchParamT: true, jt: true, forbid: this.props.search.forbidList },
    })
    this.props.dispatch({
      type: 'chooseItem/fetch',
      payload: { enableStatus: '1' },
    })
  }

  // 添加赠品
  addGoodGift = () => {
    this.setState({ chooseItemVisiable: true, unable: true, isGift: true, productType: true })
    this.props.dispatch({
      type: 'chooseItem/changeState',
      payload: { searchParam: { enableStatus: '1', productType: '0' }, searchParamT: true, searchParamGift: true, jt: true, forbid: this.props.search.forbidList },
    })
    this.props.dispatch({
      type: 'chooseItem/fetch',
      payload: { enableStatus: '1', productType: 0 },
    })
  }
  // 删除单条商品
  deleteSingleGood = (record) => {
    deleteOrderD({
      orderNo: record.orderNo,
      autoNo: record.autoNo,
    }).then((json) => {
      if (json && json.review) {
        const index = this.state.data.findIndex(e => e.autoNo === record.autoNo)
        const newCollection = update(this.state.data, { $splice: [[index, 1]] })
        this.setState({
          data: newCollection,
          dataCopy: newCollection,
        })
        this.props.dispatch({
          type: 'orderProductPop/changeState',
          payload: { total: newCollection.length },
        })
        const keys = []
        const giftKey = []
        newCollection.forEach((ele) => {
          if (ele.isGift === 0) {
            keys.push(ele.skuNo)
          } else {
            giftKey.push(ele.skuNo)
          }
        })
        this.props.dispatch({
          type: 'orderProductPop/changeState',
          payload: { initKey: keys, giftKey },
        })
        this.props.dispatch({
          type: 'search/search',
        })
      }
    })
  }
  handleChange(value, key, column) {
    const newData = [...this.state.data]
    const target = newData.filter(item => key === item.autoNo)[0]
    const index = newData.findIndex(item => key === item.autoNo)
    let NewData = []
    if (column === 'salePrice') {
      NewData = update(newData, { [index]: { $merge: { [column]: value, saleAmount: value * target.orderNum } } })
    } else {
      NewData = update(newData, { [index]: { $merge: { [column]: value, saleAmount: value * target.salePrice } } })
    }
    if (target) {
      this.setState({
        data: NewData,
      })
    }
  }
  edit(key) {
    const newData = [...this.state.data]
    const target = newData.filter(item => key === item.autoNo)[0]
    if (target) {
      target.editable = true
      this.setState({ data: newData })
    }
  }
  save(key) {
    let status = true
    const params = {}
    const newData = [...this.state.data]
    const target = newData.filter(item => key === item.autoNo)[0]
    if (!target.orderNum) {
      message.error('订单数量不能为空')
      status = false
    } else if (isNaN(target.orderNum)) {
      message.error('订单数量请输入数字')
      status = false
    } else if (target.orderNum < 0) {
      message.error('订单数量不能小于0')
      status = false
     } else if (Math.round(Number(target.orderNum)) !== Number(target.orderNum) || target.orderNum.toString().indexOf('.') !== -1) {
      message.error('订单数量请输入整数(不带小数点)')
      status = false
     } else if (target.orderNum.toString().indexOf(' ') !== -1) {
      message.error('订单数量不能输入空格')
      status = false
     }
     if (!target.salePrice && target.salePrice !== 0) {
      message.error('单价不能为空')
      status = false
    } else if (isNaN(target.salePrice)) {
      message.error('单价请输入数字')
      status = false
    } else if (target.salePrice < 0) {
      message.error('单价不能小于0')
      status = false
     } else if (target.salePrice.toString().indexOf(' ') !== -1) {
      message.error('单价不能输入空格')
      status = false
     }
     if (status) {
      Object.assign(params, {
        autoNo: target.autoNo,
        orderNo: this.props.record.orderNo,
        salePrice: target.salePrice,
        orderNum: target.orderNum,
       })
      updateOrderDeditor(params).then((json) => {
        if (json && json.review) {
          message.success('编辑订单明细成功')
          const initialArray = []
          const newArray = update(initialArray, { $push: json.listOmDTO })
          this.setState({
            data: newArray,
            dataCopy: newArray,
          })
          this.props.dispatch({
            type: 'search/search',
          })
        }
      })
     }
  }
  cancel(key) {
    const newData = [...this.state.dataCopy]
    const target = newData.filter(item => key === item.autoNo)[0]
    if (target) {
      Object.assign(target, newData.filter(item => key === item.autoNo)[0])
      delete target.editable
      this.setState({ data: newData })
    }
  }
  chooseData = (rows, keys, callback) => {
    const orderList = rows.map((e) => {
      return {
        orderNo: this.props.record.orderNo,
        skuNo: e.skuNo,
        productNo: e.productNo,
        productName: e.productName,
        productImage: e.imageUrl,
        productSpec: e.productSpec,
        orderNum: 1,
        retailPrice: e.retailPrice,
        salePrice: this.state.isGift ? 0 : e.retailPrice,
        referWeight: e.referWeight,
        isPresale: 0,
        isGift: this.state.isGift ? 1 : 0,
      }
    })
    insertOrderDInfo(orderList).then((json) => {
      if (json && json.review) {
        callback()
        this.props.dispatch({
          type: 'orderProductPop/changeState',
          payload: { total: json.listOmDTO.length },
        })
        this.props.dispatch({
          type: 'chooseItem/changeState',
          payload: { jt: false, forbid: [] },
        })
        const initialArray = []
        const newArray = update(initialArray, { $push: json.listOmDTO })
        this.setState({
          data: newArray,
          dataCopy: newArray,
        })
        const initKey = []
        const giftKey = []
        json.listOmDTO.forEach((ele) => {
          if (ele.isGift === 0) {
            initKey.push(ele.skuNo)
          } else {
            giftKey.push(ele.skuNo)
          }
        })
        this.props.dispatch({
          type: 'orderProductPop/changeState',
          payload: { initKey, giftKey },
        })
        this.props.dispatch({
          type: 'search/search',
        })
      }
    })
  }
  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.autoNo, column)}
        save={() => this.save(record.autoNo)}
      />
    )
  }
  render() {
    const { total, current, pageSize, loading } = this.props.orderProductPop
    return (
      <div>
        <Card bordered={false}>
          <div>
            <Table
              loading={loading}
              scroll={{ y: 300 }}
              size={config.InputSize}
              columns={this.columns}
              dataSource={this.state.data}
              rowKey={record => record.autoNo}
              pagination={
                {
                  size: 'small',
                  current,
                  pageSize,
                  total,
                  showTotal: () => { return `当前显示 ${((current - 1) * pageSize) + 1} 到 ${current * pageSize > total ? total : current * pageSize} 条数据,共 ${total} 条数据` },
                  onChange: (PageIndex) => {
                    this.props.dispatch({
                      type: 'orderProductPop/search',
                      payload: {
                        current: PageIndex,
                        pageSize,
                        orderNo: this.props.record.orderNo,
                        warehouseNo: this.props.record.warehouseNo,
                      },
                    })
                    this.props.dispatch({
                      type: 'orderProductPop/changeState',
                      payload: {
                        current: PageIndex,
                        pageSize,
                      },
                    })
                  },
                  showSizeChanger: true,
                  pageSizeOptions: ['20', '50', '100'],
                  onShowSizeChange: (c, PageSize) => {
                    this.props.dispatch({
                      type: 'orderProductPop/search',
                      payload: {
                        current: c,
                        pageSize: PageSize,
                        orderNo: this.props.record.orderNo,
                        warehouseNo: this.props.record.warehouseNo,
                      },
                    })
                    this.props.dispatch({
                      type: 'orderProductPop/changeState',
                      payload: {
                        current: c,
                        pageSize: PageSize,
                      },
                    })
                  },
                }
              }
              onRow={(record) => {
                if (this.state.noClick) {
                  return {
                    onMouseEnter: () => {
                      this.edit(record.autoNo)
                    },
                    onMouseLeave: () => {
                      this.cancel(record.autoNo)
                    },
                  }
                } else {
                  return ''
                }
              }}
              footer={() => {
                let sumOrderNums = 0
                let sumPrices = 0
                this.state.data.length && this.state.data.forEach((e) => {
                  sumOrderNums += Number(e.orderNum)
                  sumPrices += e.saleAmount
                })
                if (sumOrderNums === 0) {
                  return null
                } else {
                  return (
                    <Row>
                      <Col span={12} style={{ float: 'left', textAlign: 'right', paddingRight: 48 }}>{`×${sumOrderNums}`}</Col>
                      <Col span={12} style={{ float: 'left', paddingLeft: 319 }}>{`¥${numeral(sumPrices).format('0,0.00')}`}</Col>
                    </Row>)
                }
              }}
            />
          </div>
        </Card>
        {this.state.billStatus === 2 ? '' :
        <span>
          <Button disabled={!this.state.noClick} size={config.InputSize} onClick={this.addGood} type="primary">增加新的商品</Button>
          <Button disabled={!this.state.noClick} size={config.InputSize} onClick={this.addGoodGift} style={{ marginLeft: '20px' }} type="primary">增加赠品</Button>
        </span>}
        <Button
          size={config.InputSize}
          style={{ marginLeft: 20 }}
          onClick={() => {
            this.setState({
              data: [],
              dataCopy: [],
              init: true,
              unable: false,
              noClick: false,
            })
            this.props.dispatch({
              type: 'orderProductPop/changeState',
              payload: { list: [] },
            })
            this.props.hideModal()
            this.props.dispatch({
              type: 'chooseItem/changeState',
              payload: { jt: false, forbid: [], searchParam: {}, searchParamT: false  },
            })
          }}
        >
          关闭页面
        </Button>
        {this.state.chooseItemVisiable ? <ChooseItem
          unable={this.state.unable}
          fromName="jt"
          enableStatus="1"
          needInv="Y"
          productType={this.state.productType ? '0' : undefined}
          productTypeT={this.state.productType}
          changeModalVisiable={this.state.chooseItemVisiable}
          itemModalHidden={() => {
            this.setState({ chooseItemVisiable: false, productType: false })
            this.props.dispatch({
              type: 'chooseItem/changeState',
              payload: { searchParamGift: false },
            })
          }}
          chooseData={this.chooseData}
          chooseDataKeys={this.state.isGift ? this.props.orderProductPop.giftKey : this.props.orderProductPop.initKey}
          shopNo={this.state.shopNo}
        /> : null}
      </div>)
  }
}
