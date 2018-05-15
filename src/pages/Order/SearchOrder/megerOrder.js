import React, { Component } from 'react'
import { connect } from 'dva'
import { Table, Button, Modal, Tag, message } from 'antd'
import moment from 'moment'
import { getMegerList, mergeOr, updateTurnNormal } from '../../../services/order/search'
import { checkNumeral } from '../../../utils/utils'

const megerSuggest = (record, mainOrder) => {
  if (record.orderNo !== mainOrder.orderNo) {
    // 判断地址
    const address = record.province === mainOrder.province &&
      record.city === mainOrder.city &&
      record.county === mainOrder.county
    // 判断是否同一买家
    const buyer = record.siteBuyerNo === mainOrder.siteBuyerNo && record.receiver === mainOrder.receiver
    if (record.province === mainOrder.province &&
      record.city === mainOrder.city &&
      record.county === mainOrder.county &&
      record.address === mainOrder.address &&
      record.siteBuyerNo === mainOrder.siteBuyerNo &&
      record.receiver === mainOrder.receiver &&
      record.actualPayment > 0) {
        return { style: { background: '#87d068', color: '#fff' } }
      } else if ((!address && buyer && record.actualPayment > 0) || (address && !buyer && record.actualPayment > 0 )) {
        return { style: { background: '#fa8c16', color: '#fff' } }
      } else if(!(record.actualPayment > 0)) {
        return { style: { background: '#f50', color: '#fff' } }
      }
  } else {
    return { style: { background: '#2db7f5', color: '#fff' } }
  }
}

@connect(state => ({
  search: state.search,
}))
export default class MegerOrder extends Component {
    constructor(props) {
        super(props)
        this.columns = [{
          title: '订单编号',
          dataIndex: 'orderNo',
          width: 100,
          onCell: record => megerSuggest(record, this.state.mainOrder),
          render: (text, record) => {
            if (record.orderNo === this.props.search.selectedRowKeys[0]) {
              return (
                <div>
                  <span style={{ marginRight: 10 }}>{record.orderNo}</span>
                </div>
              )
            } else {
              return (
                <div>
                  <span>{record.orderNo}</span><br />
                </div>
              )
            }
        },
        }, {
          title: '线上订单编号',
          dataIndex: 'siteOrderNo',
          width: 200,
          onCell: record => megerSuggest(record, this.state.mainOrder),
          render: (text, record) => {
              return (
                <div>
                  <span>{record.siteOrderNo}</span><br />
                </div>
              )
          },
        }, {
          title: '买家&店铺名称',
          dataIndex: 'shopName',
          width: 150,
          onCell: record => megerSuggest(record, this.state.mainOrder),
          render: (text, record) => {
            if (record.siteBuyerNo) {
              return (
                <div>
                  <div>{record.siteBuyerNo}</div>
                  <div style={{ marginTop: 8 }}>{record.shopName}</div>
                </div>
              )
            } else {
              return (
                <div>
                  <span>{record.shopName}</span>
                </div>
              )
            }
        },
        }, {
          title: '付款时间 & 已付款金额',
          dataIndex: 'siteBuyerNo',
          width: 230,
          onCell: record => megerSuggest(record, this.state.mainOrder),
          render: (text, record) => {
            return (
              <div>
                <div>{record.payTime > 0 ? moment(record.payTime).format('YYYY-MM-DD HH:mm:ss') : '暂未付款'}</div>
                {record.actualPayment > 0 ? <div style={{ marginTop: 8 }}>{`￥${checkNumeral(record.actualPayment)}`}</div>: null}
              </div>
            )
          },
        }, {
            title: '收货地址 & 收货人',
            dataIndex: 'payTime',
            width: 280,
            onCell: record => megerSuggest(record, this.state.mainOrder),
            render: (text, record) => {
                return (
                  <div>
                    <div>{`${record.province}${record.city}${record.county}${record.address}`}</div>
                    <div style={{ marginTop: 8 }}>{record.receiver}</div>
                  </div>
                )
              },
        }, {
            title: '订单状态',
            dataIndex: 'orderStatus',
            width: 200,
            onCell: record => megerSuggest(record, this.state.mainOrder),
            render: (text) => {
              switch (text * 1) {
                case 0:
                  return '待付款'
                case 1:
                  return '已付款待审核'
                case 10:
                  return '已客审待财审'
                case 2:
                  return '发货中'
                case 20:
                  return '等待第三方发货'
                case 3:
                  return '已发货'
                case 4:
                  return '异常'
                case 40:
                  return '已取消'
                case 41:
                  return '被合并'
                case 42:
                  return '被拆分'
                default:
                  return '未知'
              }
            },
        }, 
        // {
        //     title: '商品',
        //     dataIndex: 'oderDetails',
        //     width: 200,
        //     onCell: record => megerSuggest(record, this.state.mainOrder),
        //     render: (text) => {
        //       <Avatar shape="square" src={text} />
        //     },
        // }, 
        {
            title: '买家备注 & 卖家备注',
            dataIndex: 'BuyerSellerRemark',
            width: 200,
            onCell: record => megerSuggest(record, this.state.mainOrder),
            render: (text, record) => {
                return (
                  <div>
                    {record.buyerRemark ? <div>{record.buyerRemark}</div> : null}
                    {record.sellerRemark ? record.buyerRemark ? <div style={{ marginTop: 8 }}>{record.sellerRemark}</div> : <div>{record.sellerRemark}</div> : null}
                  </div>
                )
            },
        }, {
          title: '操作',
          width: 100,
          onCell: record => megerSuggest(record, this.state.mainOrder),
          dataIndex: 'operation',
          render: (text, record) => {
            if (record.orderStatus === 4) {
              return <a onClick={this.updateTurnNormal.bind(this, record.orderNo)}>转正常单</a>
            } else {
              return ''
            }
          },
        }]
        this.state = {
          list: [],
          mainOrder: {},
          selectedRows: [],
          selectedRowKeys: [],
          init: true,
          tableLoading: false,
          shop: false,
        }
      }      
      componentWillReceiveProps(nextProps) {
        if (nextProps.orderNo !== '' && this.state.init) {
          this.setState({
            init: false,
            mainOrder: nextProps.search.selectedRows[0],
            tableLoading: true,
          })
          getMegerList({ orderNo: nextProps.orderNo }).then((json) => {
            const index = json.findIndex(ele => ele.orderNo === this.props.search.selectedRowKeys[0])
            const deleteJson = json.splice(index, 1)
            json.unshift(deleteJson[0])
            const keys = []
            const rows = []
            json.forEach((ele) => {
              if(ele.actualPayment > 0 &&  ele.orderNo !== this.props.search.selectedRowKeys[0]) {
                keys.push(ele.orderNo)
                rows.push(ele)
              }
            })
            this.setState({
              list: json,
              tableLoading: false,
              selectedRowKeys: keys,
              selectedRows: rows,
            })
          })
        }
      }
      // 转正常单
  updateTurnNormal = (orderNo) => {
    updateTurnNormal([orderNo]).then((json) => {
      if (json.review) {
        this.props.dispatch({
          type: 'search/search',
        })
        const data = this.state.list
        const index = data.findIndex(ele => ele.orderNo === orderNo)
        if (data[index].actualPayment > 0) {
          Object.assign(data[index], { orderStatus: 1 })
        } else {
          Object.assign(data[index], { orderStatus: 0 })
        }
        this.setState({
          list: data,
        })
      }
      if (json.errorMessage) {
        message.warning(json.errorMessage)
      }
    })
  }
      handleCancel = () => {
        this.setState({
          list: [],
          mainOrder: {},
          selectedRows: [],
          selectedRowKeys: [],
          init: true,
        })
        this.props.hidden()
      }
      handleMerge = () => {
        if (this.state.list.length === 1) {
          message.warning('当前没有可选择的合并订单,无法进行合并')
        } else if (!this.state.selectedRows.length) {
          message.warning('至少选择一笔订单进行合并')
        } else {
          const nowData = this.state.selectedRows
          const mianOrder = this.props.search.selectedRows
          const children = nowData.concat(mianOrder)
          const shopNos = []
          children.forEach(ele => {
            const index = shopNos.filter(e => e === ele.shopNo)
            if (!index.length) {
              shopNos.push(ele.shopNo)
            }
          })
          if (shopNos.length === 1) {
            this.startMeger()
          } else {
            this.setState({
              shop: true,
            })
          }
        }
      }
      startMeger = () => {
        this.setState({
          loading: true,
          shop: false,
        })
        mergeOr({
          orderNo: this.props.orderNo,
          orderNos: this.state.selectedRowKeys.toString(),
        }).then((json) => {
          if (json) {
            message.success('合并订单成功')
            this.handleCancel()
            this.props.dispatch({
              type: 'search/search',
            })
          }
          this.setState({
            loading: false,
          })
        })
      }
      noMeger = () => {
        this.setState({
          shop: false,
        })
      }
      render() {
        return (
          <Modal
            maskClosable={false}
            title="请选择需要被合并的订单,即被合并到当前选择的备选订单"
            visible={this.props.visible}
            onCancel={this.handleCancel}
            width={1300}
            bodyStyle={{ height: 500, overflowX: 'hidden' }}
            footer={[
              <Button key="1" onClick={this.handleCancel}>取消</Button>,
              <Button key="2" type="primary" loading={this.state.loading} onClick={this.handleMerge}>确定合并</Button>,
            ]}
          >
            <div style={{ marginBottom: 10 }}>
              <Tag color="#2db7f5">当前订单(主订单)</Tag>
              <Tag color="#87d068">推荐合并项(客户及收货地址均相同且已支付)</Tag>
              <Tag color="#fa8c16">中风险合并项(客户相同收货地址不同或客户不同收货地址相同且已支付)</Tag>
              <Tag color="#f50">高风险不能合并(没支付)</Tag>
            </div>
            <Table
              rowSelection={{
                selectedRowKeys: this.state.selectedRowKeys,
                selectedRows: this.state.selectedRows,
                type: 'Checkbox',
                onChange: (selectedRowKeys, selectedRows) => {
                  this.setState({
                    selectedRowKeys,
                    selectedRows,
                  })
                },
                getCheckboxProps: record => ({
                  disabled: record.orderNo === this.props.search.selectedRowKeys[0] || record.actualPayment <= 0,
                }),
              }}
              pagination={false}
              size="small"
              dataSource={this.state.list}
              columns={this.columns}
              rowKey={record => record.orderNo}
              loading={this.state.tableLoading}
            />
            <Modal
              maskClosable={false}
              title="请确认是否合并订单"
              visible={this.state.shop}
              onCancel={this.noMeger}
              footer={[
                <Button key="1" onClick={this.noMeger}>取消</Button>,
                <Button key="2" type="primary" loading={this.state.loading} onClick={this.startMeger}>确定合并</Button>,
              ]}
            >
              <div><strong>合并订单存在不同店铺，是否确认合并订单</strong></div>
            </Modal>
          </Modal>)
      }
}
