/*
 * @Author: jiangteng
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-09 13:50:29
 * 唯品会接单
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Card, Button, Row, Col, Icon, Divider, Input, Checkbox, message } from 'antd'
import styles from '../Order.less'
import SearchItem from './SearchItem'
import Jtable from '../../../components/JcTable'
import WarehouseOrder from './WarehouseOrder'
import { checkPremission } from '../../../utils/utils'
import SetTimeOut from './SetTimeOut'
import { getPickNo, createPickNo, createWarehouse } from '../../../services/order/vipOrder'

@connect(state => ({
  vipOrder: state.vipOrder,
}))
export default class VipOrder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
      btn: false,
      checked: false,
      time: null,
      num: null,
      // record: [],
      warehouseOrder: false,
      shopNo: null,
      noClose: false,
      getDataS: 0,
      other: 0,
      loading: false,
      Loading: false,
      tableLoading: false,
      list: [],
      total: 0,
      createWarehouse: false,
      warehouseList: [],
    }
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'vipOrder/fetchShop',
    })
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      tableLoading: nextProps.vipOrder.loading,
      list: nextProps.vipOrder.list,
    })
  }
  btn = () => {
    if (this.state.shopNo === null) {
      message.warning('请选择店铺')
    } else if (!this.state.time) {
      message.warning('请输入自动刷新PO的时间(分钟)')
    } else if(this.checkTime(this.state.time)) {
      
    } else if (this.checkNum(this.state.num)) {

    } else {
      this.setState({
        btn: true,
      })
    }
  }
  // 检验时间  
  checkTime = (value) => {
    if (value && isNaN(value)) {
      message.warning('自动刷新PO时间请输入数字')
      return true
    } else if (value && (!(/(^[1-9]\d*$)/.test(value)) || value <= 0 || value > 60)) {
      message.warning('自动刷新PO时间请输入1到60的整数(提示:不带小数位)')
      return true
    } else {
      return false
    }
  }
  // 检验数量  
  checkNum = (value) => {
    if (value && isNaN(value)) {
      message.warning('PO未拣数请输入数字')
      return true
    } else if (value && (!(/(^[1-9]\d*$)/.test(value))) || value < 0) {
      message.warning('PO未拣数请输入不小于0的整数(提示:不带小数位)')
      return true
    } else {
      return false
    }
  }
  downAll = () => {
    console.log('一键下载')
  }
  onChecked = (e) => {
    this.setState({
      checked: e.target.checked,
    })
  }
  noClose = (e) => {
    this.setState({
      noClose: e.target.checked,
    })
  }
  onChangeTimeNum = (flag, e) => {
    this.setState({
      [flag]: e.target.value,
    }, () => {
      if (flag === 'time') {
        this.checkTime(this.state.time)
      } else {
        this.checkNum(this.state.num)
      }
    })
  }
  getPickNo = () => {
    this.setState({
      tableLoading: true,
    })
    const poNos = []
    this.props.vipOrder.record.forEach(ele => poNos.push(ele.poNo))
    getPickNo({ poNos, shopNo: this.state.shopNo }).then((json) => {
      if (json) {
        this.setState({
          Loading: false,
          tableLoading: false,
        })
        // this.setState({
        //   list: json.list,
        //   total: json.pagination.total,
        // })
        this.props.dispatch({
          type: 'vipOrder/changeState',
          payload: { total: json.pagination.total, list: json.list },
        })
      }
    })
  }
  createPickNo = () => {
    const PoOrdDTO = {}
    // const poNo = []
    // if (this.state.record.length) {
    //   this.state.record.forEach(ele => poNo.push(ele.poNo))
    // }
    Object.assign(PoOrdDTO, {
      poOrder: this.props.vipOrder.record,
      shopNo: this.state.shopNo,
    })
    createPickNo(PoOrdDTO).then((json) => {
      if (json) {
        message.success('生成拣货单成功')
      }
      this.setState({
        loading: false,
      })
    })
  }
  createWarehouse = () => {
    const PoOrdDTO = {}
    // const poNo = []
    // if (this.state.record.length) {
    //   this.state.record.forEach(ele => poNo.push(ele.poNo))
    // }
    Object.assign(PoOrdDTO, {
      poOrder: this.props.vipOrder.record,
      shopNo: this.state.shopNo,
    })
    createWarehouse(PoOrdDTO).then((json) => {
      console.log('按仓库', json)
      if (json) {
        this.setState({ warehouseOrder: true, warehouseList: json })
      }
      this.setState({
        createWarehouse: false,
      })
    })
  }
  render() {
    const { selectedRows, selectedRowKeys, page, searchParam, record, total, list } = this.props.vipOrder
    const { collapsed } = this.state
    // 操作栏
    const columns = [
      {
        title: 'PO',
        dataIndex: 'poNo',
        key: 'poNo',
        width: 120,
      },
      {
        title: '拣货单号',
        dataIndex: 'siteOrderNo',
        key: 'siteOrderNo"',
        width: 120,
      },
      {
        title: '仓库',
        dataIndex: 'vipWarehouse',
        key: 'vipWarehouse',
        width: 120,
      },
      {
        title: '唯品会创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 120,
        render: (text) => {
          return moment(text).format('YYYY-MM-DD HH:mm:ss')
        },
      },
      {
        title: '送货状态',
        dataIndex: 'deliveryStatus',
        key: 'deliveryStatus',
        width: 120,
        render: (text) => {
          if (text === 0) {
            return '未送货'
          } else{
            return '已送货'
          }
        },
      },
      {
        title: '拣货数量',
        dataIndex: 'orderNum',
        key: 'orderNum',
        width: 120,
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
      dataSource: list,
      loading: this.state.tableLoading,
      columns,
      searchParam,
      noSelected: false,
      total,
      ...page,
      nameSpace: 'vipOrder',
      dispatch: this.props.dispatch,
      selectedRows,
      selectedRowKeys,
      rowKey: 'poNo',
      tableName: 'vipOrder',
      custormTableClass: 'tablecHeightFix300',
      scroll: { y: 250 },
    }
    return (
      <div>
        <Card bordered={false} style={{ height: document.body.clientHeight - 76, overflowY: 'hidden' }}>
          <Row>
            {collapsed ?
              <Col span={0} style={{ position: 'relative' }}>
                <SearchItem
                  backData={data => {
                    // const { record } = this.state
                    const index = record.findIndex(ele => ele.poNo === data.poNo)
                    if (index === -1) {
                      record.push(data)
                      // this.setState({
                      //   record,
                      // })
                      const poNos = []
                      record.forEach(ele => poNos.push(ele.poNo))
                      this.props.dispatch({
                        type: 'vipOrder/changeState',
                        payload: { searchParam: { poNos, shopNo: this.state.shopNo }, record },
                      })
                    }
                  }}
                  shopChoose={(shopNo) => this.setState({ shopNo })}
                  getDataS={this.state.getDataS}
                  hideModal={() => {
                    this.setState({
                      other: 1,
                    }, () => {
                      this.setState({
                        other: 0,
                      })
                    })
                  }}
                  noClose={this.state.noClose}
                />
              </Col> : (
              <Col sm={8} md={10} lg={4} style={{ position: 'relative' }}>
                <SearchItem
                  backData={data => {
                    // const { record } = this.state
                    const index = record.findIndex(ele => ele.poNo === data.poNo)
                    if (index === -1) {
                      record.push(data)
                      // this.setState({
                      //   record,
                      // })
                      const poNos = []
                      record.forEach(ele => poNos.push(ele.poNo))
                      this.props.dispatch({
                        type: 'vipOrder/changeState',
                        payload: { searchParam: { poNos, shopNo: this.state.shopNo }, record },
                      })
                    }
                  }}
                  shopChoose={(shopNo) => this.setState({ shopNo })}
                  getDataS={this.state.getDataS}
                  hideModal={() => {
                    this.setState({
                      other: 1,
                    }, () => {
                      this.setState({
                        other: 0,
                      })
                    })
                  }}
                  noClose={this.state.noClose}
                />
              </Col>
            )}
            <Col {...rightSpan}>
              <span style={{ marginLeft: 16 }}>{tabelToolbar}</span>
              <div style={{ marginLeft: 16, marginTop: 16 }}>
                <span>每<Input maxLength="3" onChange={this.onChangeTimeNum.bind(this, 'time')} size="small" style={{ width: 50, marginLeft: 5, marginRight: 5 }} />分钟自动刷新PO</span>
                <Divider type="vertical" />
                <span>
                  PO未拣数达到<Input maxLength="6" onChange={this.onChangeTimeNum.bind(this, 'num')} size="small" style={{ width: 50, marginLeft: 5, marginRight: 5 }} />自动创建拣货单
                  <span style={{ color: 'red' }}>[自动生成时请选择,如手动创建此处无效:<Checkbox>单PO</Checkbox>]</span>
                </span>
                <Divider type="vertical" />
                <span><Checkbox onChange={this.noClose}>开启后报错不关闭</Checkbox><Button onClick={this.btn} type="primary" style={{ marginLeft: 5 }} size="small">开启</Button></span>
              </div>
              <Divider />
              <div style={{ color: '#1f90e6', marginLeft: 16, marginBottom: 10 }}>如下显示多个PO,生成拣货单时将按照多PO生成(未拣数大于0的PO)</div>
              <div className={styles.line} style={{ height: 80, overflow: 'scroll', overflowX: 'hidden', marginRight: 15 }}>
                <div style={{ float: 'left', width: 600 }}>
                  {record.length ? record.map((ele, index) => 
                    <div key={index}>
                      <span style={{ marginLeft: 16 }}>PO: {ele.poNo !== undefined ? ele.poNo : '--'}</span>
                      <Divider type="vertical" />
                      <span>销售数: {ele.salesVolume !== undefined ? ele.salesVolume : '--'}</span>
                      <Divider type="vertical" />
                      <span>未拣数: {ele.notPick !== undefined ? ele.notPick : '--'}</span>
                      <Divider type="vertical" />
                      { ele.poNo ?  <a onClick={() => {
                        // const { record } = this.state
                        const index = record.findIndex(e => e.poNo === ele.poNo)
                        record.splice(index, 1)
                        // this.setState({
                        //   record,
                        // })
                        const poNos = []
                        record.forEach(ele => poNos.push(ele.poNo))
                        this.props.dispatch({
                          type: 'vipOrder/changeState',
                          payload: { searchParam: { poNos }, record },
                        })
                      }}>清除</a> : ''}
                    </div>
                  )
                  : 
                  <div>
                    <span style={{ marginLeft: 16 }}>PO: --</span>
                    <Divider type="vertical" />
                    <span>销售数: --</span>
                    <Divider type="vertical" />
                    <span>未拣数: --</span>
                  </div>
                  }
      
                </div>
                <div style={{float: 'left', width: 350 }}>
                  {
                  checkPremission('ORDERSEARCH_MODIFY') ?
                      <Button
                        style={{ marginLeft: 15 }}
                        loading={this.state.loading}
                        size="small"
                        type="primary"
                        onClick={() => {
                          let flag = false
                          const newRecord = record.filter(ele => ele.notPick > 0)
                          if (!newRecord.length) {
                            flag = true
                          }
                          if (flag) {
                            message.warning('至少选择一条未拣数不为0的PO')
                          } else if(this.state.shopNo === null) {
                            message.warning('请选择店铺')
                          } else {
                            this.createPickNo()
                            this.setState({
                              loading: true,
                            })
                          }
                        }}
                      >
                        生成拣货单
                      </Button> : null
                  }
                  <Divider type="vertical" />
                  <Button
                    loading={this.state.createWarehouse}
                    style={{ marginRight: 20 }}
                    size="small"
                    type="primary"
                    onClick={() => {
                      let flag = false
                      const newRecord = record.filter(ele => ele.notPick > 0)
                      if (!newRecord.length) {
                        flag = true
                      }
                      if (flag) {
                        message.warning('至少选择一条未拣数不为0的PO')
                      } else {
                        this.createWarehouse()
                        this.setState({
                          createWarehouse: true,
                        })
                      }
                    }}
                  >
                    按仓库生成拣货单
                  </Button>
                  <Button
                    loading={this.state.Loading}
                    size="small"
                    type="primary"
                    onClick={() => {
                    if (!record.length) {
                        message.warning('至少选择一条PO')
                      } else {
                        this.getPickNo()
                        this.setState({
                          Loading: true,
                        })
                      }
                    }}
                  >
                    查看拣货单
                  </Button>
                </div>
              </div>
              <div style={{ clear: 'both' }} />
              <Card bordered={false}>
                <div className={styles.tableList}>
                  <Jtable {...tableProps} />
                </div>
              </Card>
              <span style={{ marginLeft: 16 }}>
                注:一键下载订单,一次最多20个,如页面超过20个,请分批次下载
                <Button style={{ marginLeft: 5, marginRight: 5 }} onClick={this.downAll} size="small" type="primary">一键下载</Button>
                <Checkbox checked={this.state.checked} onChange={this.onChecked}>隐藏已下载</Checkbox>
              </span>
            </Col>
          </Row>
        </Card>
        <WarehouseOrder warehouseList={this.state.warehouseList} show={this.state.warehouseOrder} hideModal={() => this.setState({ warehouseOrder: false })} />
        <SetTimeOut
          getData={(flag) => {
            this.setState({
              getDataS: flag,
            }, () => {
              this.setState({
                getDataS: 0,
              })
            })
          }}
          show={this.state.btn}
          hideModal={() => this.setState({ btn: false })}
          time={this.state.time}
          other={this.state.other}
        />
      </div>
    )
  }
}
