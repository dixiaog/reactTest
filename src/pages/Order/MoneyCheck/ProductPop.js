/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-12 13:22:32
 * 商品界面
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Card, Button, Table, Row, Col } from 'antd'
import numeral from 'numeral'
import styles from '../Order.less'
import config from '../../../utils/config'
import ShowImg from '../../../components/ShowImg'


@connect(state => ({
  orderProductPop: state.orderProductPop,
  search: state.search,
}))
export default class ProductPop extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      init: true,
    }
    this.columns = [{
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
      title: '订单数量',
      dataIndex: 'orderNum',
      key: 'orderNum',
      width: 120,
      render: (text) => {
        return numeral(text).format('0,0')
      },
    }, {
      title: '单价',
      dataIndex: 'salePrice',
      key: 'salePrice',
      width: 120,
      render: (text) => {
        return <div style={{ color: 'red' }}>¥{numeral(text).format('0,0.00')}</div>
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
        init: false,
      })
      this.props.dispatch({
        type: 'orderProductPop/changeState',
        payload: { list: [] },
      })
    }
  }
  render() {
    const { total, current, pageSize, loading } = this.props.orderProductPop
    return (
      <div>
        <Card bordered={false}>
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
                    <Col span={12} style={{ float: 'left', textAlign: 'right', paddingRight: 90 }}>{`×${sumOrderNums}`}</Col>
                    <Col span={12} style={{ float: 'left', paddingLeft: 298 }}>{`¥${numeral(sumPrices).format('0,0.00')}`}</Col>
                  </Row>)
              }
            }}
          />
        </Card>
        <Button
          size={config.InputSize}
          style={{ marginLeft: 20 }}
          onClick={() => {
            this.setState({
              data: [],
              init: true,
            })
            this.props.dispatch({
              type: 'orderProductPop/changeState',
              payload: { list: [] },
            })
            this.props.hideModal()
          }}
        >
          关闭页面
        </Button>
      </div>)
  }
}
