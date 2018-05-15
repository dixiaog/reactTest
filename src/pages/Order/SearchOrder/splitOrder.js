import React, { Component } from 'react'
import update from 'immutability-helper'
import { connect } from 'dva'
import { Table, Button, Modal, InputNumber, List, Card, Avatar, Badge, Alert } from 'antd'
import { getSplitList, splitOr } from '../../../services/order/search'
import styles from '../Order.less'

@connect(state => ({
  search: state.search,
}))
export default class SplitOrder extends Component {
    constructor(props) {
        super(props)
        this.columns = [{
          title: '商品图片',
          dataIndex: 'productImage',
          width: 100,
          render: text => <Avatar shape="square" src={text} />,
        }, {
          title: '商品编码',
          dataIndex: 'skuNo',
          width: 200,
        }, {
          title: '款式编码',
          dataIndex: 'productNo',
          width: 150,
        }, {
          title: '商品名称',
          dataIndex: 'productName',
          width: 150,
        }, {
          title: '参考重量',
          dataIndex: 'referWeight',
          className: styles.columnRight,
          width: 80,
        }, {
          title: '颜色规格',
          dataIndex: 'productSpec',
          width: 150,
        }, {
          title: '订单数量',
          dataIndex: 'orderNum',
          className: styles.columnRight,
          width: 100,
        }, {
          title: '可配货库存',
          dataIndex: 'waitNum',
          key: 'waitNum',
          className: styles.columnRight,
          width: 120,
          render: (text, record) => {
              return Number(record.inventoryNum) - Number(record.occupyNum) + Number(record.virtualNum) + Number(record.lockInventory) - (Number(record.lockNum) - Number(record.lockOccupyNum))
          },
        }, {
          title: '拆分数量',
          width: '100',
          dataIndex: 'operation',
          render: (text, record) => {
            return <InputNumber
                disabled={record.orderNum <= 0 }
                value={record.splitNum ? record.splitNum : 0}
                defaultValue={0}
                onChange={this.handleSpliteCount.bind(this, record)}
                min={0}
                max={record.orderNum}
              />
          },
        }]
        this.state = {
            list: [],
            spliteData: [],
            selectedRows: [],
            selectedRowKeys: [],
            sellerRemark:'',
            buyerRemark: '',
        }
      }
      componentWillReceiveProps(nextProps) {
          if (nextProps.orderNo !== '' && this.props.orderNo !== nextProps.orderNo) {
            getSplitList({
                orderNo: nextProps.orderNo,
                abnormalNo: nextProps.abnormalNo,
            }).then((json) => {
              this.setState({
                sellerRemark: json.sellerRemark,
                buyerRemark: json.buyerRemark,
                list: json.orderDetails,
              })
            })
          }
      }
      handleSpliteCount = (record, e) => {
        const { list } = this.state
        const index = list.findIndex(ele => ele.autoNo === record.autoNo)
        this.setState(update(this.state, {
          list: { [index] :{ $merge: { splitNum: e } }},
        }))
      }
      handleCancel = () => {
        this.setState({
          spliteData: [],
          list: [],
        })
        this.props.hidden()
      }
      handleWait = () => {
        const { spliteData, list } = this.state
        const item = []
        list.forEach((k) => {
          if (k.splitNum > 0 && k.orderNum > 0) {
            item.push({
              autoNo: k.autoNo,
              orderNum: k.splitNum,
              productImage: k.productImage,
              isGift: k.isGift,
              skuNo: k.skuNo,
            })
            Object.assign(k, {
              orderNum: k.orderNum - k.splitNum,
              splitNum: 0 ,
            })
          }
        })
        if (item.length) {
          spliteData.push(item)
          this.setState({
            spliteData,
            list,
          })
        }
      }
      handleSplite = () => {
        const { spliteData, list } = this.state
        if (spliteData.length === 0) {
          const item = []
          list.forEach((k) => {
            if (k.splitNum > 0 && k.orderNum > 0) {
              item.push({
                autoNo: k.autoNo,
                orderNum: k.splitNum * 1,
                productImage: k.productImage,
                isGift: k.isGift,
                skuNo: k.skuNo,
              })
              Object.assign(k, { orderNum: k.orderNum - k.splitNum })
              if (k.orderNum === 0) {
                Object.assign(k, { splitNum: 0 })
              }
            }
          })
          if (item.length) {
            spliteData.push(item)
          }
        }
        const hasNum = list.filter(e => e.orderNum > 0)
        if (hasNum.length > 0) {
          spliteData.push(hasNum.map((e) => { return { autoNo: e.autoNo, orderNum: e.orderNum, productImage: e.productImage,isGift: e.isGift,skuNo: e.skuNo, } }))
        }
        splitOr({
          orderNo: this.props.orderNo,
          splitList: spliteData,
        }).then((json) => {
          if (json) {
            this.handleCancel()
            this.props.dispatch({
              type: 'search/search',
            })
          } else {
            this.setState({
              spliteData: [],
              list: [],
            })
          }
        })
      }
      render() {
        const { buyerRemark, sellerRemark } = this.state
        return (
          <Modal
            maskClosable={false}
            title="拆分订单"
            visible={this.props.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            width={1200}
            bodyStyle={{ height: 500, overflowX: 'hidden', position: 'relative' }}
            footer={[
              <Button type="primary" onClick={this.handleWait.bind(this)}>添加到预拆分</Button>,
              <Button type="primary" onClick={this.handleSplite.bind(this)}>确定拆分</Button>,
            ]}
          >
            <Alert style={{ marginBottom: 10 }} message="拆分订单后请勿线上发货或其他ERP发货，拆分订单线上发货，线下不会同步发货" type="warning" />
            { buyerRemark !== '' ? <Alert style={{ marginBottom: 10 }} message={`买家留言: ${buyerRemark}`} type="warning" /> : null}
            { sellerRemark !== '' ? <Alert style={{ marginBottom: 10 }} message={`卖家备注: ${sellerRemark}`} type="info" /> : null}
            <Table
              rowSelection={{
                type: 'Checkbox',
                onChange: (selectedRowKeys, selectedRows) => {
                  this.setState({
                    selectedRowKeys,
                    selectedRows,
                  })
                },
              }}
              pagination={false}
              size="small"
              dataSource={this.state.list}
              columns={this.columns}
            />
            <div style={{ position: 'absolute', bottom: 0, width: '100%' }}>
              { this.state.spliteData.length ? <List
                grid={{ gutter: 16, column: 4 }}
                dataSource={this.state.spliteData}
                renderItem={item => (
                  <List.Item>
                    <Card bordered hoverable>
                      {item.map(e => <Badge count={e.orderNum}><Avatar shape="square" src={e.productImage} style={{ marginLeft: 10 }} /></Badge>)}
                    </Card>
                  </List.Item>
                )}
              /> : null}
            </div>
          </Modal>)
      }
}
