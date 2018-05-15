/*
 * @Author: jiangteng
 * @Date: 2017-12-22 17:40:30
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-03-02 14:52:26
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-14 17:13:48
 * 售后查询
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Row, Col, Icon, Menu, Dropdown, Divider, Popconfirm, Tag, message, Input, Select } from 'antd'
import update from 'immutability-helper'
import moment from 'moment'
import styles from '../AfterSale.less'
import Jtable from '../../../components/JcTable'
import { checkPremission } from '../../../utils/utils'
import SearchItem from './SearchItem'
import AddAfter from './AddAfter'
import BillDownload from './BillDownload'
import TimeDownload from './TimeDownload'
import AfterDetail from './AfterDetail'
import BindOrder from './BindOrder'
import Exchange from './Exchange'
import { viewData, homePageEdit, agreeReturnGoods, confirmOrderAfterInfo, cancelOrderAfterInfo } from '../../../services/aftersale/afterSearch'
import { checkNumeral, effectFetch } from '../../../utils/utils'

const Option = Select.Option

const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable
      ? <Input size="small" maxLength="8" defaultValue={value} style={{ margin: '-5px 0' }} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
)

const EditableCellSelect = ({ editable, value, valueName, onChange, warehouseList }) => (
  <div>
    {editable
      ?
        <Select defaultValue={value} size="small" style={{ margin: '-5px 0', width: 120 }} onChange={e => onChange(e)}>
          {warehouseList.length ? warehouseList.map(ele => <Option key={ele.warehouseNo} value={ele.warehouseNo}>{ele.warehouseName}</Option>) : '' }
        </Select>
      : valueName
    }
  </div>
)
@connect(state => ({
  afterSearch: state.afterSearch,
  addAfter: state.addAfter,
  bindOrder: state.bindOrder,
  exchange: state.exchange,
  agree: false,
  no: false,
}))
export default class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      addAfter: false,
      billDownload: false,
      timeDownload: false,
      afterDetail: false,
      bindOrder: false,
      exchange: false,
      record: {}, // 记录点击的对象
      data: [],
      dataCopy: [],
      confirm: false,
      cancel: false,
    }
  }

  componentDidMount() {
    effectFetch('afterSearch', this.props.dispatch)
    // this.props.dispatch({ type: 'afterSearch/fetch' })
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.afterSearch.disabled) {
      this.setState({
        data: nextProps.afterSearch.list,
        dataCopy: nextProps.afterSearch.list,
      })
      this.props.dispatch({
        type: 'afterSearch/changeState',
        payload: { disabled: false },
      })
    }
  }
  edit(key) {
    const newData = [...this.state.data]
    const target = newData.filter(item => key === item.asNo)[0]
    if (target) {
      target.editable = true
      this.setState({ data: newData })
    }
  }
  handleChange(value, key, column) {
    const newData = [...this.state.data]
    const index = newData.findIndex(item => key === item.asNo)
    const NewData = update(newData, { [index]: { $merge: { [column]: value } } })
    this.setState({ data: NewData })
  }
  // 同意,拒绝退货
  backGood = (status) => {
    if (status) {
      this.setState({
        agree: true,
      })
    } else {
      this.setState({
        no: true,
      })
    }
    agreeReturnGoods({ asNo: this.props.afterSearch.selectedRows[0].asNo, status }).then((json) => {
      if (json) {
        this.props.dispatch({
          type: 'afterSearch/search',
        })
      }
      if (status) {
        this.setState({
          agree: false,
        })
      } else {
        this.setState({
          no: false,
        })
      }
    })
  }
  save(key) {
    const newData = [...this.state.data]
    const target = newData.filter(item => key === item.asNo)[0]
    const value = {}
    Object.assign(value, {
      expressCorpNo: target.expressCorpNo,
      expressNo: target.expressNo,
      remark: target.remark,
      asNo: target.asNo,
      warehouseNo: target.warehouseNo,
    })
    console.log('value', value)
    homePageEdit(value).then((json) => {
      if (json) {
        message.success('售后单编辑保存成功')
        const index = newData.findIndex(item => key === item.asNo)
        const warehouse = this.props.afterSearch.warehouseList.filter(ele => ele.warehouseNo === target.warehouseNo)[0]
        const NewData = update(target, { $merge: { 'warehouseName': warehouse.warehouseName, expressCorpName: warehouse.expressCorpNo } })
        const newCollection = update(newData, { $splice: [[index, 1, NewData]] })
        const targetFinal = newCollection.filter(item => key === item.asNo)[0]
        if (targetFinal) {
          Object.assign(targetFinal, newCollection.filter(item => key === item.asNo)[0])
          delete targetFinal.editable
          this.setState({ data: newCollection })
        }
      }
    })
  }
  cancel(key) {
    const newData = [...this.state.dataCopy]
    const target = newData.filter(item => key === item.asNo)[0]
    if (target) {
      Object.assign(target, newData.filter(item => key === item.asNo)[0])
      delete target.editable
      this.setState({ data: newData })
    }
  }
  renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.asNo, column)}
      />
    )
  }
  renderColumnsSelect(text, record, column) {
    return (
      <EditableCellSelect
        editable={record.editable}
        value={text}
        valueName={record.warehouseName}
        onChange={value => this.handleChange(value, record.asNo, column)}
        warehouseList={this.props.afterSearch.warehouseList}
      />
    )
  }
  render() {
    const { total, loading, selectedRows, selectedRowKeys, page } = this.props.afterSearch
    const { collapsed } = this.state
    const menu = (
      <Menu>
        <Menu.Item>
          <a onClick={() => {
            this.setState({ addAfter: true })
            this.props.dispatch({
              type: 'addAfter/fetch',
            })
          }}
          >
            创建新的售后单
          </a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={() => { this.setState({ billDownload: true }) }}>
            手工下载授权店铺售后单(按单号)
          </a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={() => { this.setState({ timeDownload: true }) }}>
            手工下载授权店铺售后单(按时间)
          </a>
        </Menu.Item>
      </Menu>
    )
    const columns = [
      {
        title: '售后单号',
        dataIndex: 'asNo',
        key: 'asNo',
        width: 80,
        render: (text, record) => {
          return (
            <span>
              <a onClick={() => {
                viewData({ asNo: record.asNo }).then((json) => {
                  if (json) {
                    this.setState({ afterDetail: true, record: json })
                  }
                })
              }}
              >
                {text}
              </a>
            </span>
          )
        },
      },
      {
        title: '内部订单号',
        dataIndex: 'orderNo',
        key: 'orderNo',
        width: 80,
        render: (text) => {
          if (text <= 0) {
            return '无信息件'
          } else {
            return text
          }
        },
      },
      {
        title: '线上订单号',
        dataIndex: 'siteOrderNo',
        key: 'siteOrderNo',
        width: 130,
        render: (text, record) => {
          if (text.indexOf(',') !== -1) {
            const data = text.split(',').map((e) => {
              return <div style={{ marginTop: 5 }}>{e}</div>
            })
            return data
          } else {
            return text
          }
        },
      },
      {
        title: '操作',
        dataIndex: 'opreation',
        key: 'opreation',
        width: 90,
        render: (text, record) => {
          const { editable } = record
          return (
            <div className="editable-row-operations">
              {
                editable ?
                  <span>
                    <a onClick={() => this.save(record.asNo)}>保存</a>
                    <Divider type="vertical" />
                    <Popconfirm title="确定取消编辑?" onConfirm={() => this.cancel(record.asNo)}>
                      <a>取消</a>
                    </Popconfirm>
                  </span>
                  :
                  checkPremission('AFTERSEARCH_EDIT') ?
                    <a onClick={() => {
                      if (record.asStatus === 2) {
                        message.warning('已作废的售后单不可编辑')
                      } else {
                        this.edit(record.asNo)
                      }
                    }}
                    >
                    编辑
                    </a>
                  : ''
              }
            </div>
          )
        },
      },
      {
        title: '售后单日期',
        dataIndex: 'asDate',
        key: 'asDate',
        width: 100,
        render: (text) => {
          if (text < 0) {
            return ''
          } else {
            return moment(text).format('YYYY-MM-DD')
          }
        },
      },
      {
        title: '售后类型',
        dataIndex: 'asType',
        key: 'asType',
        width: 80,
        render: (text) => {
          switch (text) {
            case 0:
              return <Tag color="#f50">退货</Tag>
            case 1:
              return <Tag color="#108ee9">换货</Tag>
            case 2:
              return <Tag color="#2db7f5">补发</Tag>
            default:
              return <Tag color="#87d068">其他</Tag>
          }
        },
      },
      {
        title: '售后状态',
        dataIndex: 'asStatus',
        key: 'asStatus',
        width: 80,
        render: (text) => {
          switch (text) {
            case 0:
              return <Tag color="#87d068">待确认</Tag>
            case 1:
              return <Tag color="#108ee9">已确认</Tag>
            case 2:
              return <Tag color="#f50">已作废</Tag>
            default:
              return <Tag color="#2db7f5">强制确认</Tag>
          }
        },
      },
      {
        title: '仓库',
        dataIndex: 'warehouseNo',
        key: 'warehouseNo',
        width: 100,
        render: (text, record) => {
          if (record.goodStatus === 'SELLER_RECEIVED') {
            return record.warehouseName
          } else {
            return this.renderColumnsSelect(text, record, 'warehouseNo')
          }
        },
      },
      {
        title: '快递公司',
        dataIndex: 'expressCorpNo',
        key: 'expressCorpNo',
        width: 80,
        render: (text, record) => this.renderColumns(text, record, 'expressCorpNo'),
      },
      {
        title: '快递单号(运单号)',
        dataIndex: 'expressNo',
        key: 'expressNo',
        width: 120,
        render: (text, record) => this.renderColumns(text, record, 'expressNo'),
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
        width: 120,
        render: (text, record) => this.renderColumns(text, record, 'remark'),
      },
      {
        title: '买家账号',
        dataIndex: 'siteBuyerNo',
        key: 'siteBuyerNo',
        width: 120,
      },
      {
        title: '收货人',
        dataIndex: 'receiver',
        key: 'receiver',
        width: 80,
      },
      {
        title: '手机',
        dataIndex: 'mobileNo',
        key: 'mobileNo',
        width: 100,
      },
      {
        title: '店铺',
        dataIndex: 'shopName',
        key: 'shopName',
        width: 120,
      },
      {
        title: '实际应退金额',
        dataIndex: 'actualReturnAmount',
        key: 'actualReturnAmount',
        width: 100,
        className: styles.columnRight,
        render: (text) => {
          return checkNumeral(text)
        },
      },
      {
        title: '退款原因',
        dataIndex: 'refundReason',
        key: 'refundReason',
        width: 100,
      },
      {
        title: '商品编码',
        dataIndex: 'skuNo',
        key: 'skuNo',
        width: 100,
      },
      {
        title: '商品名称',
        dataIndex: 'productName',
        key: 'productName',
        width: 120,
      },
      {
        title: '商品规格',
        dataIndex: 'productSpec',
        key: 'productSpec',
        width: 120,
      },
      {
        title: '申请数量',
        dataIndex: 'returnNum',
        key: 'returnNum',
        width: 80,
      },
      {
        title: '实收数量',
        dataIndex: 'inNum',
        key: 'inNum',
        width: 80,
      },
      {
        title: '货物状态',
        dataIndex: 'goodStatus',
        key: 'goodStatus',
        width: 100,
        render: (text) => {
          switch (text) {
          case 'BUYER_NOT_RECEIVED':
            return '买家未收到货'
          case 'BUYER_RECEIVED':
            return '买家已收到货'
          case 'BUYER_RETURNED_GOODS':
            return '买家已退货'
          case 'SELLER_RECEIVED':
            return '卖家已收到货'
          default:
            return '卖家未收到货'
          }
        },
      },
      {
        title: '退款状态',
        dataIndex: 'refundStatus',
        key: 'refundStatus',
        width: 220,
        render: (text) => {
          switch (text) {
          case 'WAIT_SELLER_AGREE':
            return '买家已经申请退款, 等待卖家同意'
          case 'WAIT_BUYER_RETURN_GOODS':
            return '卖家已经同意退款, 等待买家退货'
          case 'WAIT_SELLER_CONFIRM_GOODS':
            return '买家已经退货, 等待卖家确认收货'
          case 'SELLER_REFUSE_BUYER':
            return '卖家拒绝退款'
          case 'CLOSED':
            return '退款关闭'
          default:
            return '退款成功'
          }
        },
      },
      {
        title: '登记人',
        dataIndex: 'registrationUser',
        key: 'registrationUser',
        width: 80,
      },
      {
        title: '登记时间',
        dataIndex: 'registrationTime',
        key: 'registrationTime',
        width: 100,
        render: (text) => {
          if (text < 0) {
            return ''
          } else {
            return moment(text).format('YYYY-MM-DD')
          }
        },
      },
      {
        title: '确认人',
        dataIndex: 'confirmUser',
        key: 'confirmUser',
        width: 80,
      },
      {
        title: '确认时间',
        dataIndex: 'confirmTime',
        key: 'confirmTime',
        width: 100,
        render: (text) => {
          if (text < 0) {
            return ''
          } else {
            return moment(text).format('YYYY-MM-DD')
          }
        },
      },
      {
        title: '修改人',
        dataIndex: 'updateUser',
        key: 'updateUser',
        width: 80,
      },
      {
        title: '修改时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        width: 100,
        render: (text) => {
          if (text < 0) {
            return ''
          } else {
            return moment(text).format('YYYY-MM-DD')
          }
        },
      },
    ]
    const rightSpan = collapsed ? { span: 24 } : { sm: 14, md: 15, lg: 20 }
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
      dataSource: this.state.data,
      loading,
      columns,
      noSelected: false,
      total,
      ...page,
      nameSpace: 'afterSearch',
      dispatch: this.props.dispatch,
      selectedRows,
      selectedRowKeys,
      rowKey: 'asNo',
      tableName: 'asNo',
      rowSelection: {
        type: 'radio',
      },
    }
    return (
      <div>
        <div className={styles.contentBoard} style={{ height: document.body.clientHeight - 76, overflowY: 'hidden' }}>
          <Row>
            {collapsed ?
              <Col span={0} style={{ position: 'relative' }}>
                <SearchItem />
              </Col> : (
              <Col sm={10} md={9} lg={4} style={{ position: 'relative' }}>
                <SearchItem />
              </Col>
            )}
            <Col {...rightSpan}>
              {
                checkPremission('AFTERSEARCH_ADD') ?
                  <Dropdown overlay={menu}>
                    <a className="ant-dropdown-link" style={{ marginLeft: 8, marginTop: 5 }}>
                      <Button size="small" type="primary">
                      创建新的售后单 <Icon type="caret-down" />
                      </Button>
                    </a>
                  </Dropdown> : null
              }
              {
                checkPremission('AFTERSEARCH_BIND') ?
                  <Button
                    style={{ marginLeft: 8, marginTop: 5 }}
                    size="small"
                    type="primary"
                    onClick={() => {
                      this.setState({ bindOrder: true })
                      this.props.dispatch({
                        type: 'bindOrder/fetch',
                        payload: { siteOrderNo: this.props.afterSearch.selectedRows[0].siteOrderNo },
                      })
                    }}
                    disabled={!(selectedRows.length === 1 && this.props.afterSearch.selectedRows[0].orderNo < 0 && this.props.afterSearch.selectedRows[0].asStatus === 0)}
                  >
                  绑定订单
                  </Button> : null
              }
              {
                checkPremission('AFTERSEARCH_AGREE') ?
                  <Button
                    style={{ marginLeft: 8, marginTop: 5 }}
                    size="small"
                    type="primary"
                    disabled={!(selectedRows.length && this.props.afterSearch.selectedRows[0].refundStatus === 'WAIT_SELLER_AGREE' && this.props.afterSearch.selectedRows[0].asStatus !== 2)}
                    onClick={this.backGood.bind(this, 1)}
                    loading={this.state.agree}
                  >
                  同意退货
                  </Button> : null
              }
              {
                checkPremission('AFTERSEARCH_NO') ?
                  <Button
                    size="small"
                    type="primary"
                    disabled={!(selectedRows.length && this.props.afterSearch.selectedRows[0].refundStatus === 'WAIT_SELLER_CONFIRM_GOODS' && this.props.afterSearch.selectedRows[0].asStatus !== 2)}
                    onClick={this.backGood.bind(this, 0)}
                    loading={this.state.no}
                    style={{ marginLeft: 8, marginTop: 5 }}
                  >
                  拒绝退货
                  </Button> : null
              }
              {
                checkPremission('ORDERSEARCH_EXCHANGE') ?
                  <Button
                    onClick={() => {
                      if (this.props.afterSearch.selectedRows.length === 1) {
                        this.setState({ exchange: true })
                        this.props.dispatch({
                          type: 'exchange/fetch',
                          payload: this.props.afterSearch.selectedRows[0].orderNo,
                        })
                      } else {
                        message.warning('只能选择一笔资料生成换货订单')
                      }
                    }}
                    size="small"
                    type="primary"
                    disabled={!(selectedRows.length && this.props.afterSearch.selectedRows[0].asType === 1 && this.props.afterSearch.selectedRows[0].asStatus === 0)}
                    style={{ marginLeft: 8, marginTop: 5 }}
                  >
                  生成换货订单
                  </Button> : null
              }
              {
                checkPremission('ORDERSEARCH_CONFIRM') ?
                  <Popconfirm
                    title="确认后系统将根据设定的补发商品生成补发订单、换货订单付款单进入订单流程;如果有设定退款金额,系统生成退款单"
                    onConfirm={() => {
                      this.setState({
                        confirm: true,
                      })
                      confirmOrderAfterInfo([this.props.afterSearch.selectedRows[0].asNo]).then((json) => {
                        if (json) {
                          this.props.dispatch({
                            type: 'afterSearch/search',
                          })
                        }
                        this.setState({
                          confirm: false,
                        })
                      })
                    }}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button
                      size="small"
                      type="primary"
                      disabled={!selectedRows.length}
                      style={{ marginLeft: 8, marginTop: 5 }}
                      loading={this.state.confirm}
                    >
                    售后确认
                    </Button>
                  </Popconfirm>
                 : null
              }
              {
                checkPremission('ORDERSEARCH_DROP') ?
                  <Button
                    onClick={() => {
                      cancelOrderAfterInfo([this.props.afterSearch.selectedRows[0].asNo]).then((json) => {
                        if (json) {
                          this.props.dispatch({
                            type: 'afterSearch/search',
                          })
                        }
                        this.setState({
                          confirm: false,
                        })
                      })
                    }}
                    loading={this.state.cancel}
                    size="small"
                    type="primary"
                    disabled={!(selectedRows.length && this.props.afterSearch.selectedRows[0].asStatus === 0 && this.props.afterSearch.selectedRows[0].goodStatus === 'SELLER_NOT_RECEIVED')}
                    style={{ marginLeft: 8, marginTop: 5 }}
                  >
                  作废售后
                  </Button> : null
              }
              <div className={styles.contentBoard} style={{ height: document.body.clientHeight, paddingRight: 0 }}>
                <div className={styles.tableList}>
                  <Jtable {...tableProps} />
                </div>
              </div>
            </Col>
          </Row>
        </div>
        {this.state.addAfter ? <AddAfter show={this.state.addAfter} hideModal={() => { this.setState({ addAfter: false }) }}/> : null}
        <BillDownload
          show={this.state.billDownload}
          hideModal={() => { this.setState({ billDownload: false }) }}
        />
        <TimeDownload
          show={this.state.timeDownload}
          hideModal={() => { this.setState({ timeDownload: false }) }}
        />
        <AfterDetail
          show={this.state.afterDetail}
          hideModal={() => { this.setState({ afterDetail: false, record: {} }) }}
          record={this.state.record}
        />
        {this.state.bindOrder ?
          <BindOrder
            show={this.state.bindOrder}
            hideModal={() => { this.setState({ bindOrder: false }) }}
          /> : ''}
        <Exchange
          show={this.state.exchange}
          hideModal={() => { this.setState({ exchange: false }) }}
        />
      </div>
    )
  }
}
