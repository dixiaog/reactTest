/*
 * @Author: jiangteng
 * @Date: 2017-12-22 17:40:30
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-12 15:51:38
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Card, Button, Row, Col, Icon, Menu, Dropdown, Popover, message, Badge, Modal } from 'antd'
import moment from 'moment'
import router from 'umi/router'
import config from '../../../utils/config'
import styles from '../Order.less'
import SearchItem from './SearchItem'
import MegerOrder from './megerOrder'
import SplitOrder from './splitOrder'
import Jtable from '../../../components/JcTable'
import ManualOrder from './ManualOrder'
import ProductPop from './ProductPop'
import OrderDetail from '../../../components/OrderDetail'
import BillDownload from './BillDownload'
import TimeDownload from './TimeDownload'
import CourierCompany from './CourierCompany'
import BillAbnormal from './BillAbnormal'
import BillCancel from './BillCancel'
import ModifySelRem from '../../../components/ModifySelRem'
import ModifyAddress from '../../../components/ModifyAddress'
import ModifyFreight from './ModifyFreight'
import GiftCalculation from './GiftCalculation'
import Label from '../../../components/Label'
import ChooseWar from './ChooseWar'
import OrderNos from './OrderNos'
import SplitStrategy from '../LazyButton/SplitStrategy/SplitStrategy'
import SplitStrategyModal from '../LazyButton/SplitStrategy/SplitStrategyModal'
import SpecialStrategy from '../LazyButton/SpecialStrategy/SpecialStrategy'
import FApproveStrategy from '../LazyButton/FApproveStrategy/FApproveStrategy'
import PresellSplit from '../LazyButton/SplitStrategy/PresellSplit'
import Separation from './Separation'
import { checkPremission, checkNumeral } from '../../../utils/utils'
import { getShop, updateOrderReview, updateTurnNormal, selectOrderNo, cancelDesc, returnBeforeMarge, getOrderMergeQuery } from '../../../services/order/search'
import { toUnPurchaseStorage } from '../../../services/inventory/storage'
import styles1 from './search.less'

const orderType = [
  { orderType: 1, typeName: '换货' },
  { orderType: 2, typeName: '补发' },
  { orderType: 3, typeName: '分销' },
]
const megerSuggest = (record) => {
  switch (record.orderStatus) {
    case 0:
      return { style: { background: '#fffbd7' } }
    case 1:
      return { style: { background: '#fce6ae' } }
    case 2:
      return { style: { background: '#c7e3ee', color: '#1a88b8' } }
    case 3:
      return { style: { background: '#169d41', color: 'white' } }
    case 4:
      return { style: { background: '#a88252', color: 'white' } }
    case 10:
      return { style: { background: '#dea76a', color: 'white' } }
    case 20:
      return { style: { background: '#d5fc99' } }
    case 40:
      return { style: { background: '#fc0d1c', color: 'white' } }
    case 41:
      return { style: { background: '#cccccc' } }
    default:
      return { style: { background: '#cccccc' } }
  }
}

@connect(state => ({
  search: state.search,
  orderProductPop: state.orderProductPop,
  orderDetail: state.orderDetail,
  splitStrategy: state.splitStrategy,
  tabList: state.global.tabList,
}))
export default class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
      megerOrderVisible: false,
      splitOrderVisible: false,
      display: 'none',
      manualOrder: false, // 手工下单
      record: {}, // 记录单条数据
      innerNo: null,
      orderDetail: false,
      billDownload: false,
      timeDownload: false,
      courierCompany: false,
      billAbnormal: false,
      billCancel: false,
      modifySelRem: false,
      modifyAddress: false,
      modifyFreight: false,
      giftCalculation: false,
      label: false,
      orderType: 1,
      isShow: false,
      checkOrder: false,
      setExpress: false,
      warList: [], // 仓库列表
      recordPop: {},
      separation: false,
      billCancelList: [],
      mergeOrderNo: '',
      splitVisiable: false,
      splitModalVisiable: false,
      specialStrategyVisiable: false,
      approveVisiable: false,
      presellVisiable: false,
      orderNos: [],
      showOrderNos: false,
      orderNo: null,
      btnModify: false,
      sellerRecord: {},
    }
  }

  componentDidMount() {
    this.props.dispatch({ type: 'search/fetch' })
  }
  hiddenModle = () => {
    this.setState({
      megerOrderVisible: false,
      splitOrderVisible: false,
      mergeOrderNo: '',
      splitOrderNo: '',
      abnormalNo: '',
    })
  }
  display = () => {
    if (this.state.display === 'none') {
      this.setState({ display: 'inline' })
    } else {
      this.setState({ display: 'none' })
    }
  }
  mergeOrder = () => {
    const { selectedRows, selectedRowKeys } = this.props.search
    if (selectedRows.length > 1) {
      message.warning('合并订单只能选择一笔订单')
    } else if (selectedRows[0].orderStatus !== 0 && selectedRows[0].orderStatus !== 1 && selectedRows[0].orderStatus !== 4) {
      message.warning('只有【待付款,已付款待审核,异常】的订单才可以合并')
    } else if (selectedRows[0].actualPayment <= 0) {
      message.warning('主订单必须已付款才可以进行合并')
    } else if (selectedRows[0].isMerge === 1) {
      message.warning('已合并的订单，禁止再次合并')
    } else {
      this.setState({
        megerOrderVisible: true,
        mergeOrderNo: selectedRowKeys[0],
      })
    }
  }
  splitOrder = () => {
    const { selectedRowKeys, selectedRows } = this.props.search
    if (selectedRowKeys.length > 1) {
      message.warning('请选择一笔订单')
    } else {
      if (selectedRows[0].isMerge) {
        const $this = this
        Modal.confirm({
          title: '不建议拆分',
          content: '本身通过合并产生的订单，继续拆分可能造成上传发货信息失败。如何合并错误，请【还原成合并前】',
          onOk() {
            returnBeforeMarge({
              orderNo: selectedRows[0].orderNo,
            }).then((json) => {
              if (json) {
                $this.props.dispatch({
                  type: 'search/search',
                })
              }
            })
          },
          onCancel() {
          },
          okText: '还原成合并前',
        })
      } else {
        this.setState({
          splitOrderVisible: true,
          splitOrderNo: selectedRowKeys[0],
          abnormalNo: selectedRows[0].abnormalNo,
        })
      }
    }
  }
  orderDetail = (record) => {
    selectOrderNo(record.orderNo).then((json) => {
      if (json) {
        this.setState({ orderDetail: true, record: json })
        this.props.dispatch({
          type: 'orderDetail/fetch',
          payload: { orderNo: record.orderNo, warehouseNo: record.warehouseNo },
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
  modifySelRem = () => {
    if (!this.props.search.selectedRows.length) {
      message.warning('请选择一笔订单')
    } else if (this.props.search.selectedRows.length !== 1) {
      message.warning('修改卖家备注只能选择一笔订单')
    } else {
      this.setState({
        modifySelRem: true,
      })
    }
  }
  modifyAddress = () => {
    const row = this.props.search.selectedRows[0]
    if (!this.props.search.selectedRows.length) {
      message.warning('请选择一笔订单')
    } else if (this.props.search.selectedRows.length !== 1) {
      message.warning('修改收货地址只能选择一笔订单')
    } else if (
      row.orderStatus === 10 ||
      row.orderStatus === 2 ||
      row.orderStatus === 20 ||
      row.orderStatus === 3 ||
      row.orderStatus === 40 ||
      row.orderStatus === 41 ||
      row.orderStatus === 42
    ) {
      message.warning('【已客审待财审,发货中,等待第三方发货,已发货,已取消,被合并,被拆分】的订单不可以修改收货地址')
    } else {
      this.setState({
        modifyAddress: true,
      })
    }
  }
  addToTablist = (e) => {
    switch (e.key * 1) {
      case 1: {
        const { tabList } = this.props
        let isHad = false
        tabList.forEach((ele) => {
          Object.assign(ele, { default: false })
          if (ele.key === 'giftStrategy') {
            isHad = true
            Object.assign(ele, { default: true })
          }
        })
        if (!isHad) {
          tabList.push({
            key: 'giftStrategy',
            path: '/order/LazyButton/giftStrategy',
            tab: '赠品策略',
            default: true,
          })
        }
        this.props.dispatch({
          type: 'global/changeTabList',
          payload: tabList,
        })
        //this.props.dispatch(routerRedux.push('/order/giftStrategy'))
        router.push('/order/LazyButton/giftStrategy')
      break
      }
      case 2:
        this.props.dispatch({ type: 'splitStrategy/fetch' })
        this.setState({ splitVisiable: true })
      break
      case 3:
        this.setState({ specialStrategyVisiable: true })
      break
      case 5:
      this.setState({ approveVisiable: true })
      break
      case 4: {
        const { tabList } = this.props
        let isHad = false
        tabList.forEach((ele) => {
          Object.assign(ele, { default: false })
          if (ele.key === 'approveStrategy') {
            isHad = true
            Object.assign(ele, { default: true })
          }
        })
        if (!isHad) {
          tabList.push({
            key: 'approveStrategy',
            path: '/order/LazyButton/approveStrategy',
            tab: '订单审核',
            default: true,
          })
        }
        this.props.dispatch({
          type: 'global/changeTabList',
          payload: tabList,
        })
        // this.props.dispatch(routerRedux.push('/order/approveStrategy'))
        router.push('/order/LazyButton/approveStrategy')
      }
      break
      default:
      break
    }
  }
  modifyFreight = () => {
    if (!this.props.search.selectedRows.length) {
      message.warning('至少选择一笔订单')
    } else {
      this.setState({
        modifyFreight: true,
      })
    }
  }
  giftCalculation = () => {
    this.setState({
      giftCalculation: true,
    })
  }
  separation = () => {
    this.setState({
      separation: true,
    })
  }
  label = () => {
    if (!this.props.search.selectedRows.length) {
      message.warning('至少选择一笔订单')
    } else {
      this.setState({
        label: true,
      })
    }
  }
  chooseWar = () => {
    if (!this.props.search.selectedRows.length) {
      message.warning('至少选择一笔订单')
    } else {
      this.setState({
        chooseWar: true,
      })
      toUnPurchaseStorage().then((json) => {
        this.setState({
          warList: json.warehouses,
        })
      })
    }
  }
  checkOrder = () => {
    this.setState({
      checkOrder: true,
    })
    updateOrderReview(this.props.search.selectedRowKeys).then((json) => {
      if (json && json.review) {
        // message.success('订单审核成功')
        this.props.dispatch({
          type: 'search/search',
        })
        this.props.dispatch({
          type: 'search/changeState',
          payload: { selectedRowKeys: [], selectedRows: [] },
        })
      }
      if (json.errorMessage) {
        message.warning(json.errorMessage.split('!').map((e, i) => {
          if (i !== json.errorMessage.split('!').length - 1 && i === 0) {
            return <span key={i}><br />{`${e}!`}<br /></span>
          } else if (i !== json.errorMessage.split('!').length - 1) {
            return <span key={i}>{`${e}!`}<br /></span>
          } else {
            return null
          }
        }))
      }
      this.setState({
        checkOrder: false,
      })
    })
  }
  // 转正常单
  updateTurnNormal = () => {
    updateTurnNormal(this.props.search.selectedRowKeys).then((json) => {
      if (json.review) {
        this.props.dispatch({
          type: 'search/search',
        })
        this.props.dispatch({
          type: 'search/changeState',
          payload: { selectedRowKeys: [], selectedRows: [] },
        })
      }
      if (json.errorMessage) {
        message.warning(json.errorMessage.split('!').map((e, i) => {
          if (i !== json.errorMessage.split('!').length - 1 && i === 0) {
            return <span key={i}><br />{`${e}!`}<br /></span>
          } else if (i !== json.errorMessage.split('!').length - 1) {
            return <span key={i}>{`${e}!`}<br /></span>
          } else {
            return null
          }
        }))
      }
    })
  }
  // 取消订单
  billCancel = () => {
    cancelDesc({ dictType: 3 }).then((json) => {
      this.setState({
        billCancelList: json,
      })
    })
    this.setState({
      billCancel: true,
    })
  }
  // 获取多个订单号
  getOrderList = (orderNo, e) => {
    getOrderMergeQuery({ orderNo, siteOrderNo: e }).then((json) => {
      if (json) {
        this.setState({
          orderNos: json,
          showOrderNos: true,
        })
      }
    })
  }
  getColor = (text) => {
    switch (text) {
      case 0:
        return ''
      case 1:
        return 'redFlag'
      case 2:
        return 'yellowFlag'
      case 3:
        return 'greenFlag'
      case 4:
        return 'blueFlag'
      case 5:
        return 'purpleFlag'
       default:
        return 'blackFlag'
    }
  }
  render() {
    const { list, total, loading, selectedRows, selectedRowKeys, page, searchParam } = this.props.search
    const { collapsed } = this.state
    const menu = (
      <Menu>
        <Menu.Item>
          <a
            onClick={() => {
              this.setState({ manualOrder: true })
              getShop({})
            }}
          >
            <Icon type="plus" style={{ fontSize: 14 }} /> 手工下单
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            onClick={() => {
              this.setState({ billDownload: true })
              getShop({})
            }}
          >
            <Icon type="cloud-download-o" style={{ fontSize: 14 }} /> 手工下载授权店铺订单[按单号]
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            onClick={() => {
              this.setState({ timeDownload: true })
            }}
          >
            <Icon type="cloud-download-o" style={{ fontSize: 14 }} /> 手工下载授权店铺订单[按时间]
          </a>
        </Menu.Item>
      </Menu>
    )
    const content = (
      <Menu onClick={this.addToTablist} className={styles1.border1}>
        {/* <Menu.Item key="11">
          <a>执行组:</a>
        </Menu.Item> */}
        <Menu.Item key="10">
          <a>策略组:</a>
        </Menu.Item>
        <Menu.Item style={{ marginLeft: 15 }} key="1" premisson="GIFTSTRATEGY_LIST">设置赠品策略</Menu.Item>
        <Menu.Item style={{ marginLeft: 15 }} key="2" premisson="SPLITSTRATEGY_LIST">设置拆分策略</Menu.Item>
        <Menu.Item style={{ marginLeft: 15 }} key="3" premisson="SPECIALSTRATEGY_LIST">设置特殊单策略</Menu.Item>
        <Menu.Item style={{ marginLeft: 15 }} key="4" premisson="APPROVESTRATEGY_LIST">设置智能审核策略</Menu.Item>
        <Menu.Item style={{ marginLeft: 15 }} key="5" premisson="FAPPROVESTRA_LIST">设置财务审核策略</Menu.Item>
      </Menu>
    )
    const specialStrategyProps = {
      specialStrategyVisiable: this.state.specialStrategyVisiable,
      dispatch: this.props.dispatch,
      itemModalHidden: () => {
        this.setState({
          specialStrategyVisiable: false,
        })
      },
    }
    const approveProps = {
      approveVisiable: this.state.approveVisiable,
      dispatch: this.props.dispatch,
      itemModalHidden: () => {
        this.setState({
          approveVisiable: false,
        })
      },
    }
    const presellProps = {
      presellVisiable: this.state.presellVisiable,
      dispatch: this.props.dispatch,
      searchParam,
      selectedRows,
      itemModalHidden: () => {
        this.setState({
          presellVisiable: false,
          splitVisiable: true,
        })
      },
      itemModalHidden1: () => {
        this.setState({
          presellVisiable: false,
        })
        this.props.dispatch({
          type: 'search/fetch',
        })
      },
    }
    const splitProps = {
      splitVisiable: this.state.splitVisiable,
      dispatch: this.props.dispatch,
      searchParam,
      selectedRows,
      orderType: this.state.orderType,
      isShow: this.state.isShow,
      // add: this.state.add,
      splitHidden: (ele, orderType, isShow) => {
        // this.props.dispatch({ type: 'omBuyer/search' })
        this.setState({
          splitModalVisiable: true,
          splitVisiable: false,
          data: ele,
          orderType,
          isShow,
        })
      },
      presellHidden: (ele) => {
        // this.props.dispatch({ type: 'omBuyer/search' })
        this.setState({
          presellVisiable: true,
          splitVisiable: false,
          data: ele,
        })
      },
      itemModalHidden: () => {
        // this.props.dispatch({ type: 'omBuyer/search' })
        this.setState({
          splitVisiable: false,
          orderType: 1,
          isShow: false,
        })
      },
    }
    const splitModalProps = {
      splitModalVisiable: this.state.splitModalVisiable,
      dispatch: this.props.dispatch,
      data: this.state.data,
      // add: this.state.add,
      itemModalHidden: () => {
        // this.props.dispatch({ type: 'omBuyer/search' })
        this.setState({
          splitModalVisiable: false,
          splitVisiable: true,
          data: {},
        })
      },
    }
    const menuT = (
      <Menu>
        <Menu.Item>
          <a onClick={this.modifySelRem}>修改卖家备注</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={this.modifyAddress}>修改收货地址</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={this.modifyFreight}>修改运费</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={this.giftCalculation}>重新计算并添加赠品</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={this.separation}>拆开组合装商品</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={this.label}>打标签</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={this.chooseWar}>指定发货仓</a>
        </Menu.Item>
      </Menu>
    )

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
        width: 180,
        className: styles.columnCenter,
        onCell: record => megerSuggest(record),
        render: (text, record) => {
          switch (text) {
            case 0:
              return '待付款'
            case 1:
              return '已付款待审核'
            case 2:
              return '发货中'
            case 3:
              return '已发货'
            case 4:
              return (
                <div style={{ float: 'left', position: 'relative', left: '50%' }}>
                  {record.abnormalDesc ?
                    <div style={{ float: 'left', marginTop: 5, position: 'relative', left: '-50%' }}>异常</div> : <div style={{ float: 'left', position: 'relative', left: '-50%' }}>异常</div>}
                  <div style={{ float: 'left', marginLeft: 5, position: 'relative', left: '-50%' }}>
                    <div style={{ color: 'yellow' }}>{record.abnormalName}</div>
                    {record.abnormalDesc ? <div style={{ color: 'yellow' }}>{record.abnormalDesc}</div> : null}
                  </div>
                </div>
              )
            case 10:
              return '已客审待财审'
            case 20:
              return '等待第三方发货'
            case 40:
              return '已取消'
            case 41:
              return '被合并'
            default:
              return '被拆分'
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
              return <div style={{ marginTop: 5 }}><a onClick={this.getOrderList.bind(this, record.orderNo, text)}>{e}</a></div>
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
        title: '应付+运费',
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
        render: (text) => {
          return text
        },
      },
      {
        title: '卖家备注',
        dataIndex: 'sellerRemark',
        key: 'sellerRemark',
        width: 120,
        className: styles.columnCenter,
        render: (text, record) => {
          return (
            <span className={styles.father}>
              {record.orderNo === this.state.orderNo ?
              <div
                style={{ position: 'absolute', right: -22, top: '50%', marginTop: -11 }}
                onClick={() => { this.setState({ modifySelRem: true, btnModify: true, sellerRecord: record }) }}
                className={styles.spanCircleM}>改</div>
              :
              ''
              }
              {text}
            </span>
          )
        },
      },
      {
        title: '订单标签',
        dataIndex: 'orderLabel',
        key: 'orderLabel',
        width: 120,
        className: styles.columnCenter,
        render: (text, record) => {
          const color = this.getColor(text)
          return (
            <span className={styles.father}>
              {record.orderNo === this.state.orderNo ?
              <span
                style={{ position: 'absolute', right: 10, top: '50%', marginTop: -11 }}
                onClick={() => {  this.setState({ label: true, btnModify: true, sellerRecord: record })  }}
                className={styles.spanCircleM}>改</span>
              :
              ''
              }
              {color ? <img alt="" src={require(`../../../images/${color}.png`)} style={{ width: '20px', height: '20px' }} />: ''}
            </span>
          )
        },
      },
      {
        title: '收货地址',
        dataIndex: 'addressDetail',
        key: 'addressDetail',
        width: 250,
        render: (text, record) => {
          return (
            <span className={styles.father}>
              {record.orderNo === this.state.orderNo ? 
                <span
                  style={{ position: 'absolute', right: -22, top: '50%', marginTop: -11 }}
                  onClick={() => {  this.setState({ modifyAddress: true, btnModify: true, sellerRecord: record }) }}
                  className={styles.spanCircleM}>改</span>
                :
                ''
              }
              <div style={{ textAlign: 'left', width: 250, paddingLeft: 7 }}>
                <div>{record.province.concat(record.city).concat(record.county)}</div>
                <div style={{ marginTop: 8 }}>{record.address}</div>
              </div>
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
    tabelToolbar.push(
      <Popover key={2} premission="ORDERSEARCH_LIST" content={content} placement="bottomLeft">
        <Button premission="ORDERSEARCH_LIST" size={config.InputSize}><Icon type="smile-o" />懒人按钮</Button>
      </Popover>)

    const tableProps = {
      toolbar: tabelToolbar,
      dataSource: list,
      loading,
      columns,
      noSelected: false,
      total,
      ...page,
      nameSpace: 'search',
      dispatch: this.props.dispatch,
      selectedRows,
      selectedRowKeys,
      rowKey: 'orderNo',
      tableName: 'orders',
      onRow: (record) => {
        return {
          onMouseEnter: () => {
            this.setState({
              orderNo: record.orderNo,
            })
          },
          onMouseLeave: () => {
            this.setState({
              orderNo: null,
            })
          },
        }
      }
    }
    return (
      <div>
        <Card bodyStyle={{ paddingRight: 0 }} bordered={false} style={{ height: document.body.clientHeight - 76, overflowY: 'hidden' }}>
          <Row>
            {collapsed ?
              <Col span={0} style={{ position: 'relative' }}>
                <SearchItem initData={this.props.search.initData} />
              </Col> : (
              <Col sm={10} md={12} lg={5} style={{ position: 'relative' }}>
                <SearchItem initData={this.props.search.initData} />
              </Col>
            )}
            <Col {...rightSpan}>
              {
              checkPremission('ORDERSEARCH_ADD') ?
                <Dropdown overlay={menu}>
                  <a className="ant-dropdown-link" style={{ marginLeft: 8, marginTop: 5 }}>
                    <Button size="small" type="primary">
                      <Icon type="plus-circle-o" />新增订单 <Icon type="caret-down" />
                    </Button>
                  </a>
                </Dropdown> : null
              }
              {
                checkPremission('ORDERSEARCH_CHECK') ?
                  <Button loading={this.state.checkOrder} onClick={this.checkOrder} size="small" type="primary" disabled={!selectedRows.length} style={{ marginLeft: 8, marginTop: 5 }}>
                    <Icon type="check-circle-o" />审核
                  </Button> : null
              }
              {
                checkPremission('ORDERSEARCH_COURIER') ?
                  <Button
                    style={{ marginLeft: 8, marginTop: 5 }}
                    size="small"
                    type="primary"
                    disabled={!selectedRows.length}
                    onClick={() => {
                      this.setState({ courierCompany: true, setExpress: true })
                      this.props.dispatch({
                        type: 'orderDetail/getExpresscorp',
                      })
                    }}
                  >
                    <Icon type="car" />设快递
                  </Button> : null
              }
              {
                checkPremission('ORDERSEARCH_ABNORMAL') ?
                  <Button
                    size="small"
                    type="primary"
                    disabled={!selectedRows.length}
                    onClick={() => {
                      this.setState({ billAbnormal: true })
                      this.props.dispatch({
                        type: 'search/getAbnormal',
                      })
                    }}
                    style={{ marginLeft: 8, marginTop: 5 }}
                  >
                    <Icon type="exclamation-circle-o" /> 转异常
                  </Button> : null
              }
              {
                checkPremission('ORDERSEARCH_NORMAL') ?
                  <Button size="small" onClick={this.updateTurnNormal} type="primary" disabled={!selectedRows.length} style={{ marginLeft: 8, marginTop: 5 }}>
                    <Icon type="info-circle-o" /> 转正常单
                  </Button> : null
              }
              {
                checkPremission('ORDERSEARCH_CANCEL') ?
                  <Button
                    style={{ marginLeft: 8, marginTop: 5 }}
                    size="small"
                    type="primary"
                    disabled={!selectedRows.length}
                    onClick={this.billCancel}
                  >
                    <Icon type="close-circle-o" /> 取消订单
                  </Button> : null
              }
              {
              checkPremission('ORDERSEARCH_MODIFY') ?
                <Dropdown overlay={menuT} >
                  <a className="ant-dropdown-link">
                    <Button style={{ marginLeft: 8, marginTop: 5 }} size="small" type="primary">
                      <Icon type="edit" />修改&标记 <Icon type="caret-down" />
                    </Button>
                  </a>
                </Dropdown> : null
              }
              <Button
                style={{ marginLeft: 8, marginTop: 5 }}
                size="small"
                type="primary"
                disabled={selectedRows.length !== 1 || (selectedRows[0].orderStatus !== 0 && selectedRows[0].orderStatus !== 1 && selectedRows[0].orderStatus !== 4)}
                onClick={this.mergeOrder}
              >
                <Icon type="link" />合并订单
              </Button>
              <Button
                style={{ marginLeft: 8, marginTop: 5 }}
                size="small"
                type="primary"
                disabled={!(selectedRows.length === 1 && [1, 4].indexOf(selectedRows[0].orderStatus * 1) > -1 && (selectedRows[0] ? selectedRows[0].actualPayment >= selectedRows[0].payAmount : true))}
                onClick={this.splitOrder}
              >
                <Icon type="disconnect" />拆分订单
              </Button>
              <Card bodyStyle={{ paddingRight: 0 }} bordered={false} style={{ height: document.body.clientHeight }}>
                <div className={styles.tableList}>
                  <Jtable {...tableProps} />
                </div>
              </Card>
            </Col>
          </Row>
        </Card>
        <MegerOrder dispatch={this.props.dispatch} orderNo={this.state.mergeOrderNo} visible={this.state.megerOrderVisible} hidden={this.hiddenModle} />
        <SplitOrder dispatch={this.props.dispatch} orderNo={this.state.splitOrderNo} abnormalNo={this.state.abnormalNo} visible={this.state.splitOrderVisible} hidden={this.hiddenModle} />
        <ManualOrder show={this.state.manualOrder} hideModal={() => this.setState({ manualOrder: false })} />
        <OrderDetail show={this.state.orderDetail} hideModal={() => this.setState({ orderDetail: false, record: {} })} record={this.state.record} />
        <BillDownload show={this.state.billDownload} hideModal={() => this.setState({ billDownload: false })} />
        <TimeDownload show={this.state.timeDownload} hideModal={() => this.setState({ timeDownload: false })} />
        <CourierCompany show={this.state.courierCompany} setExpress={this.state.setExpress} hideModal={() => this.setState({ courierCompany: false, setExpress: false })} />
        <BillAbnormal show={this.state.billAbnormal} hideModal={() => this.setState({ billAbnormal: false })} />
        <BillCancel cancelJT={this.state.billCancelList} show={this.state.billCancel} hideModal={() => this.setState({ billCancel: false })} />
        <ModifySelRem
          record={this.state.sellerRecord}
          btnModify={this.state.btnModify}
          show={this.state.modifySelRem}
          hideModal={() => this.setState({ modifySelRem: false, btnModify: false, sellerRecord: {} })} />
        <ModifyAddress
          record={this.state.sellerRecord}
          btnModify={this.state.btnModify}
          show={this.state.modifyAddress}
          hideModal={() => this.setState({ modifyAddress: false, sellerRecord: {}, btnModify: false })} />
        <ModifyFreight show={this.state.modifyFreight} hideModal={() => this.setState({ modifyFreight: false })} />
        <GiftCalculation show={this.state.giftCalculation} hideModal={() => this.setState({ giftCalculation: false })} />
        <Label record={this.state.sellerRecord} btnModify={this.state.btnModify} show={this.state.label} hideModal={() => this.setState({ label: false, sellerRecord: {} })} />
        <ChooseWar show={this.state.chooseWar} hideModal={() => this.setState({ chooseWar: false })} warList={this.state.warList} />
        <Separation show={this.state.separation} hideModal={() => this.setState({ separation: false })} />
        <OrderNos orderNos={this.state.orderNos} show={this.state.showOrderNos} hideModal={() => this.setState({ showOrderNos: false })} />
        {this.state.splitVisiable ? <SplitStrategy {...splitProps} /> : null }
        {this.state.splitModalVisiable ? <SplitStrategyModal {...splitModalProps} /> : null }
        {this.state.specialStrategyVisiable ? <SpecialStrategy {...specialStrategyProps} /> : null}
        {this.state.approveVisiable ? <FApproveStrategy {...approveProps} /> : null}
        {this.state.presellVisiable ? <PresellSplit {...presellProps} /> : null}
      </div>
    )
  }
}
