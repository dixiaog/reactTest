/*
 * @Author: jiangteng
 * @Date: 2017-12-22 17:40:30
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-14 10:23:56
 * 订单财务审核
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Card, Button, Row, Col, Icon, Popover, Badge } from 'antd'
import SearchItem from './SearchItem'
import Jtable from '../../../components/JcTable'
import { checkPremission, checkNumeral, effectFetch } from '../../../utils/utils'
import styles from '../Order.less'
import ProductPop from './ProductPop'
import FApproveStrategy from '../LazyButton/FApproveStrategy/FApproveStrategy'
import OrderDetail from '../../../components/MoneyCheck'
import OrderNos from '../../Order/SearchOrder/OrderNos'
import { selectOrderNo, orderFinancialReview, orderFinException, getOrderMergeQuery } from '../../../services/order/search'

const orderType = [
  { orderType: 1, typeName: '换货' },
  { orderType: 2, typeName: '补发' },
  { orderType: 3, typeName: '分销' },
]
const megerSuggest = (record) => {
  return { style: { background: '#dea76a', color: 'white' } }
}

@connect(state => ({
  moneyCheck: state.moneyCheck,
  orderProductPop: state.orderProductPop,
  search: state.search,
  orderDetail: state.orderDetail,
}))
export default class MoneyCheck extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
      checkOrder: false,
      checkNormal: false,
      innerNo: null,
      recordPop: {},
      approveVisiable: false,
      orderDetail: false,
      record: {},
      orderNos: [],
      showOrderNos: false,
      moneyCheck: false,
    }
  }

  componentDidMount() {
    // const { moneyCheck } = getOtherStore()
    // if (!moneyCheck || moneyCheck.list.length === 0) {
    //   this.props.dispatch({ type: 'moneyCheck/fetch' })
    // }
    effectFetch('moneyCheck', this.props.dispatch)
  }
  checkOrder = () => {
    this.setState({
      checkOrder: true,
    })
    orderFinancialReview({ data: this.props.moneyCheck.selectedRowKeys.toString() }).then((json) => {
      if (json) {
        this.props.dispatch({ type: 'moneyCheck/search' })
      }
      this.setState({
        checkOrder: false,
      })
    })
  }
  checkNormal = () => {
    this.setState({
      checkNormal: true,
    })
    orderFinException({ data: this.props.moneyCheck.selectedRowKeys.toString() }).then((json) => {
      if (json) {
        this.props.dispatch({ type: 'moneyCheck/search' })
      }
      this.setState({
        checkNormal: false,
      })
    })
  }
  orderDetail = (record) => {
    selectOrderNo(record.orderNo).then((json) => {
      if (json) {
        Object.assign(json, { moneyCheck: true })
        this.setState({ orderDetail: true, record: json })
        this.props.dispatch({
          type: 'orderDetail/fetch',
          payload: { orderNo: record.orderNo },
        })
      }
    })
  }
  popContent = () => {
    return (
      <div>
        <ProductPop
          record={this.state.recordPop}
          hideModal={() => {
            this.props.dispatch({
              type: 'orderProductPop/clean',
              payload: { list: [] },
            })
            this.setState({
              innerNo: null,
              recordPop: {},
            })
          }}
        />
      </div>
    )
  }
  // 获取多个订单号
  getOrderList = (orderNo) => {
    getOrderMergeQuery(orderNo).then((json) => {
      if (json) {
        this.setState({
          orderNos: json,
          showOrderNos: true,
          moneyCheck: true,
        })
      }
    })
  }
  render() {
    const { list, total, loading, selectedRows, selectedRowKeys, page } = this.props.moneyCheck
    const { collapsed } = this.state

    // 操作栏
    const columns = [
      {
        title: '内部订单号',
        dataIndex: 'orderNo',
        key: 'orderNo',
        width: 130,
        render: (text, record) => {
          const typeList = orderType.find(ele => ele.orderType === record.orderType)
          return (
            <div>
              <a onClick={this.orderDetail.bind(this, record)}><span>{text}</span></a>
              {record.isMerge ? <span className={styles.spanCircleH}>合</span> : null}
              {record.isSplit ? <span className={styles.spanCircleC}>拆</span> : null}
              {typeList !== undefined ? <span className={styles.spanCircleT}>{typeList.typeName}</span> : null}
            </div>)
        },
      },
      {
        title: '商品',
        dataIndex: 'orderNum',
        key: 'orderNum',
        width: 80,
        className: styles.columnCenter,
        render: (text, record) => (
          <Popover
            visible={record.orderNo === this.state.innerNo ? !false : false}
            placement="bottomLeft"
            content={this.popContent()}
            trigger="click"
            overlayStyle={{ width: 1200 }}
            onVisibleChange={(visible) => {
              if (visible) {
                this.props.dispatch({ type: 'orderProductPop/fetch', payload: { orderNo: record.orderNo, warehouseNo: record.warehouseNo } })
                this.setState({
                  innerNo: record.orderNo,
                  recordPop: record,
                })
              }
            }}
          >
            <a><Badge showZero count={`${record.skuNum}/${text}`} style={{ backgroundColor: '#2eb7f6', color: 'white' }} /></a>
          </Popover>
        ),
      },
      {
        title: '状态',
        dataIndex: 'orderStatus',
        key: 'orderStatus',
        width: 90,
        className: styles.columnCenter,
        onCell: record => megerSuggest(record),
        render: (text, record) => {
          switch (text) {
            default:
              return '已客审待财审'
          }
        },
      },
      {
        title: '快递公司',
        dataIndex: 'expressCorpName',
        key: 'expressCorpName',
        width: 120,
        className: styles.columnCenter,
      },
      {
        title: '线上订单号',
        dataIndex: 'siteOrderNo',
        key: 'siteOrderNo',
        width: 125,
        render: (text, record) => {
          if (text.indexOf(',') !== -1) {
            const data = text.split(',').map((e) => {
              return <div style={{ marginTop: 5 }}><a onClick={this.getOrderList.bind(this, record.orderNo)}>{e}</a></div>
            })
            return data
          } else {
            return text
          }
        },
      },
      {
        title: '下单时间',
        dataIndex: 'orderTime',
        key: 'orderTime',
        width: 140,
        className: styles.columnCenter,
        render: (text) => {
          return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null
        },
      },
      {
        title: '付款时间',
        dataIndex: 'payTime',
        key: 'payTime',
        width: 140,
        className: styles.columnCenter,
        render: (text) => {
          if (text > 0) {
            return moment(text).format('YYYY-MM-DD HH:mm:ss')
          } else {
            return ''
          }
        },
      },
      {
        title: '买家账号+ 店铺',
        dataIndex: 'BuyerNoS',
        key: 'BuyerNoS',
        width: 120,
        className: styles.columnCenter,
        render: (text, record) => {
          return (
            <span>
              <div>{record.siteBuyerNo}</div>
              <div style={{ color: '#ccc', marginTop: 8 }}>{record.shopName}</div>
            </span>
          )
        },
      },
      {
        title: '应付+ 运费',
        dataIndex: 'payAmount',
        key: 'payAmount',
        className: styles.columnRight,
        width: 100,
        render: (text, record) => {
          return (
            <span>
              <div >{checkNumeral(record.payAmount)}</div>
              <div style={{ color: '#ccc', marginTop: 8 }}>{checkNumeral(record.expressAmount)}</div>
            </span>
          )
        },
      },
      {
        title: '已付金额',
        dataIndex: 'actualPayment',
        key: 'actualPayment',
        className: styles.columnRight,
        width: 100,
        render: (text) => {
          return checkNumeral(text)
        },
      },
      {
        title: '买家留言',
        dataIndex: 'buyerRemark',
        key: 'buyerRemark',
        width: 120,
        className: styles.columnCenter,
      },
      {
        title: '卖家备注',
        dataIndex: 'sellerRemark',
        key: 'sellerRemark',
        width: 120,
        className: styles.columnCenter,
      },
      {
        title: '订单标签',
        dataIndex: 'orderLabel',
        key: 'orderLabel',
        width: 120,
        className: styles.columnCenter,
        render: (text) => {
          switch (text) {
            case 0:
              return ''
            case 1:
              return <img alt="" src={require('../../../images/redFlag.png')} style={{ width: '20px', height: '20px' }} />
            case 2:
              return <img alt="" src={require('../../../images/yellowFlag.png')} style={{ width: '20px', height: '20px' }} />
            case 3:
              return <img alt="" src={require('../../../images/greenFlag.png')} style={{ width: '20px', height: '20px' }} />
            case 4:
              return <img alt="" src={require('../../../images/blueFlag.png')} style={{ width: '20px', height: '20px' }} />
            case 5:
              return <img alt="" src={require('../../../images/purpleFlag.png')} style={{ width: '20px', height: '20px' }} />
            default:
              return <img alt="" src={require('../../../images/blackFlag.png')} style={{ width: '20px', height: '20px' }} />
          }
        },
      },
      {
        title: '收货地址',
        dataIndex: 'addressDetail',
        key: 'addressDetail',
        width: 250,
        render: (text, record) => {
          return (
            <span>
              <div>{record.province.concat(record.city).concat(record.county)}</div>
              <div style={{ marginTop: 8 }}>{record.address}</div>
            </span>
          )
        },
      },
      {
        title: '分销商名称',
        dataIndex: 'distributorName',
        key: 'distributorName',
        width: 120,
        className: styles.columnCenter,
      },
      {
        title: '发票抬头+ 税号',
        dataIndex: 'invoiceTitle',
        key: 'invoiceTitle',
        width: 120,
        className: styles.columnCenter,
        render: (text, record) => {
          return (
            <span>
              <div>{record.invoiceTitle}</div>
              <div style={{ color: '#ccc', marginTop: 8 }}>{record.invoiceTaxNo}</div>
            </span>
          )
        },
      },
      {
        title: '发货时间',
        dataIndex: 'deliveryTime',
        key: 'deliveryTime',
        width: 140,
        className: styles.columnCenter,
        render: (text) => {
          if (text > 0) {
            return moment(text).format('YYYY-MM-DD HH:mm:ss')
          } else {
            return ''
          }
        },
      },
      {
        title: '发货仓',
        dataIndex: 'warehouseName',
        key: 'warehouseName',
        width: 120,
        className: styles.columnCenter,
      },
      {
        title: '业务员',
        dataIndex: 'createUser',
        key: 'createUser',
        width: 120,
        className: styles.columnCenter,
      },
    ]
    const rightSpan = collapsed ? { span: 24 } : { sm: 14, md: 12, lg: 19 }
        // 操作栏
    const tabelToolbar =
      [
      collapsed ?
        <Button key={0} premission="TRUE" size="small" onClick={() => this.setState({ collapsed: false })}>
          <Icon type="menu-unfold" />展开
        </Button>
      :
        <Button key={1} premission="TRUE" size="small" onClick={() => this.setState({ collapsed: true })}>
          <Icon type="menu-fold" />收缩
        </Button>]

    const tableProps = {
      toolbar: tabelToolbar,
      dataSource: list,
      loading,
      columns,
      noSelected: false,
      total,
      ...page,
      nameSpace: 'moneyCheck',
      dispatch: this.props.dispatch,
      selectedRows,
      selectedRowKeys,
      rowKey: 'orderNo',
      tableName: 'moneyCheckTable',
    }
    return (
      <div>
        <Card bodyStyle={{ paddingRight: 0 }} bordered={false} style={{ height: document.body.clientHeight - 76, overflowY: 'hidden' }}>
          <Row>
            {collapsed ?
              <Col span={0} style={{ position: 'relative' }}>
                <SearchItem initData={this.props.moneyCheck.initData} />
              </Col> : (
              <Col sm={10} md={12} lg={5} style={{ position: 'relative' }}>
                <SearchItem initData={this.props.moneyCheck.initData} />
              </Col>
            )}
            <Col {...rightSpan}>
              {
                checkPremission('ORDERSEARCH_CHECK') ?
                  <Button onClick={this.checkOrder} style={{ marginLeft: 8, marginTop: 5 }} loading={this.state.checkOrder} size="small" type="primary" disabled={!selectedRows.length}>
                    <Icon type="check-circle-o" />财务审核
                  </Button> : null
              }
              {
                checkPremission('ORDERSEARCH_COURIER') ?
                  <Button
                    size="small"
                    type="primary"
                    disabled={!selectedRows.length}
                    onClick={this.checkNormal}
                    loading={this.state.checkNormal}
                    style={{ marginLeft: 8, marginTop: 5 }}
                  >
                    <Icon type="close-circle-o" />财务审核打回并转异常
                  </Button> : null
              }
              {
                checkPremission('ORDERSEARCH_COURIER') ?
                  <Button
                    style={{ marginLeft: 8, marginTop: 5 }}
                    size="small"
                    type="primary"
                    onClick={() => {
                      this.setState({ approveVisiable: true })
                    } }
                  >
                    <Icon type="setting" />财审规则设定
                  </Button> : null
              }
              <Card bodyStyle={{ paddingRight: 0 }} bordered={false} style={{ height: document.body.clientHeight - 120 }}>
                <div className={styles.tableList}>
                  <Jtable {...tableProps} />
                </div>
              </Card>
            </Col>
          </Row>
        </Card>
        {this.state.approveVisiable ? <FApproveStrategy approveVisiable={this.state.approveVisiable} itemModalHidden={() => this.setState({ approveVisiable: false })} /> : null}
        <OrderDetail show={this.state.orderDetail} hideModal={() => this.setState({ orderDetail: false, record: {} })} record={this.state.record} />
        <OrderNos moneyCheck={this.state.moneyCheck} orderNos={this.state.orderNos} show={this.state.showOrderNos} hideModal={() => this.setState({ showOrderNos: false })} />
      </div>
    )
  }
}
