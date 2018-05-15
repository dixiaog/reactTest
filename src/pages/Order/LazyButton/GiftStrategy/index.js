/*
 * @Author: tanmengjia
 * @Date: 2018-02-07 09:53:31
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-14 20:13:31
 * 赠品规则
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Button, Card, Input, Radio, DatePicker, Checkbox, Divider, notification, Collapse, Row, Form, Col, Tooltip, Tag, Icon } from 'antd'
import Jtable from '../../../../components/JcTable'
import config from '../../../../utils/config'
import styles from '../../Order.less'
import GiftStrategyModal from './GiftStrategyModal'
import { enable } from '../../../../services/order/giftStrategy'
import { checkPremission, getLocalStorageItem } from '../../../../utils/utils'
// , effectFetch 
import { getOtherStore } from '../../../../utils/otherStore'

const RadioGroup = Radio.Group
const Panel = Collapse.Panel

@connect(state => ({
  giftStrategy: state.giftStrategy,
}))
@Form.create()
export default class GiftStrategy extends Component {
  constructor(props) {
    super(props)
    this.state = {
      strategyNo: undefined,
      giftList: undefined,
      strategyName: undefined,
      beginTime: undefined,
      endTime: undefined,
      includeProduct: undefined,
      includeSku: undefined,
      minAmountBig: undefined,
      minAmountSmall: undefined,
      maxAmountBig: undefined,
      maxAmountSmall: undefined,
      minNumBig: undefined,
      minNumSmall: undefined,
      maxNumBig: undefined,
      maxNumSmall: undefined,
      enableStatus: undefined,
      eachOverAmountBig: undefined,
      eachOverNumBig: undefined,
      eachOverAmountSmall: undefined,
      eachOverNumSmall: undefined,
      specifyShopName: undefined,
      giftStrategyVisiable: false,
      editData: null,
    }
  }
  componentDidMount() {
    const { giftStrategy } = getOtherStore()
    const tabKeys = getLocalStorageItem('tabKeys')
    const isInTab = tabKeys ? tabKeys.split(',').indexOf('giftStrategy') > -1 : false // 判断是否在tablist中存在
    if (!giftStrategy || (giftStrategy.list.length === 0 && !isInTab)||getLocalStorageItem('forceRefresh') === 'giftStrategy') {
      this.props.dispatch({ type: 'giftStrategy/fetch' })
    }
    // effectFetch('giftStrategy', this.props.dispatch)
    this.props.dispatch({ type: 'giftStrategy/getShopName' })
  }
  search = () => {
    const searchParam = {}
    Object.assign(searchParam, {
      strategyNo: this.state.strategyNo ? this.state.strategyNo.trim() : undefined,
      giftList: this.state.giftList ? this.state.giftList.trim() : undefined,
      strategyName: this.state.strategyName ? this.state.strategyName.trim() : undefined,
      beginTime: this.state.beginTime === undefined || this.state.beginTime === null ? undefined : moment(this.state.beginTime).format('YYYY-MM-DD HH:mm:ss'),
      endTime: this.state.endTime === undefined || this.state.endTime === null ? undefined : moment(this.state.endTime).format('YYYY-MM-DD HH:mm:ss'),
      includeProduct: this.state.includeProduct ? this.state.includeProduct.trim() : undefined,
      includeSku: this.state.includeSku ? this.state.includeSku.trim() : undefined,
      minAmountBig: this.state.minAmountBig ? this.state.minAmountBig.trim() : undefined,
      minAmountLittle: this.state.minAmountSmall ? this.state.minAmountSmall.trim() : undefined,
      maxAmountBig: this.state.maxAmountBig ? this.state.maxAmountBig.trim() : undefined,
      maxAmountLittle: this.state.maxAmountSmall ? this.state.maxAmountSmall.trim() : undefined,
      minNumBig: this.state.minNumBig ? this.state.minNumBig.trim() : undefined,
      minNumLittle: this.state.minNumSmall ? this.state.minNumSmall.trim() : undefined,
      maxNumBig: this.state.maxNumBig ? this.state.maxNumBig.trim() : undefined,
      maxNumLittle: this.state.maxNumSmall ? this.state.maxNumSmall.trim() : undefined,
      enableStatus: this.state.enableStatus,
      eachOverAmountBig: this.state.eachOverAmountBig ? this.state.eachOverAmountBig.trim() : undefined,
      eachOverNumBig: this.state.eachOverNumBig ? this.state.eachOverNumBig.trim() : undefined,
      eachOverAmountLittle: this.state.eachOverAmountSmall ? this.state.eachOverAmountSmall.trim() : undefined,
      eachOverNumLittle: this.state.eachOverNumSmall ? this.state.eachOverNumSmall.trim() : undefined,
      specifyShopName: this.state.specifyShopName,
    })
    this.props.dispatch({
      type: 'giftStrategy/search',
      payload: {
        searchParam,
        page: { current: 1 },
      },
    })
  }
  editModal = (record) => {
    this.setState({
      editData: record,
      giftStrategyVisiable: true,
    })
  }
  clear = () => {
    this.setState({
      strategyNo: undefined,
      giftList: undefined,
      strategyName: undefined,
      beginTime: undefined,
      endTime: undefined,
      includeProduct: undefined,
      includeSku: undefined,
      minAmountBig: undefined,
      minAmountSmall: undefined,
      maxAmountBig: undefined,
      maxAmountSmall: undefined,
      minNumBig: undefined,
      minNumSmall: undefined,
      maxNumBig: undefined,
      maxNumSmall: undefined,
      enableStatus: undefined,
      eachOverAmountBig: undefined,
      eachOverNumBig: undefined,
      eachOverAmountSmall: undefined,
      eachOverNumSmall: undefined,
      specifyShopName: undefined,
    })
    this.props.dispatch({ type: 'giftStrategy/fetch' })
  }
  strategyNo = (e) => {
    this.setState({
      strategyNo: e.target.value,
    })
  }
  giftList = (e) => {
    this.setState({
      giftList: e.target.value,
    })
  }
  strategyName = (e) => {
    this.setState({
      strategyName: e.target.value,
    })
  }
  beginTime = (e) => {
    this.setState({
      beginTime: e,
    })
  }
  endTime = (e) => {
    this.setState({
      endTime: e,
    })
  }
  includeProduct = (e) => {
    this.setState({
      includeProduct: e.target.value,
    })
  }
  includeSku = (e) => {
    this.setState({
      includeSku: e.target.value,
    })
  }
  minAmountSmall = (e) => {
    this.setState({
      minAmountSmall: e.target.value,
    })
  }
  minAmountBig = (e) => {
    this.setState({
      minAmountBig: e.target.value,
    })
  }
  maxAmountSmall = (e) => {
    this.setState({
      maxAmountSmall: e.target.value,
    })
  }
  maxAmountBig = (e) => {
    this.setState({
      maxAmountBig: e.target.value,
    })
  }
  maxNumBig = (e) => {
    this.setState({
      maxNumBig: e.target.value,
    })
  }
  maxNumSmall = (e) => {
    this.setState({
      maxNumSmall: e.target.value,
    })
  }
  minNumBig = (e) => {
    this.setState({
      minNumBig: e.target.value,
    })
  }
  minNumSmall = (e) => {
    this.setState({
      minNumSmall: e.target.value,
    })
  }
  enableStatus = (e) => {
    this.setState({
      enableStatus: e.target.value,
    })
  }
  eachOverAmountBig = (e) => {
    this.setState({
      eachOverAmountBig: e.target.value,
    })
  }
  eachOverAmountSmall = (e) => {
    this.setState({
      eachOverAmountSmall: e.target.value,
    })
  }
  eachOverNumSmall = (e) => {
    this.setState({
      eachOverNumSmall: e.target.value,
    })
  }
  eachOverNumBig = (e) => {
    this.setState({
      eachOverNumBig: e.target.value,
    })
  }
  specifyShopName = (e) => {
    this.setState({
      specifyShopName: e.target.value,
    })
  }
  enable = (record) => {
    const payload = {
      strategyNo: record.strategyNo,
      enableStatus: 1,
    }
    enable(payload).then((json) => {
      if (json) {
        this.props.dispatch({ type: 'giftStrategy/search' })
        notification.success({
          message: '操作成功',
        })
      }
    })
  }
  disEnable = (record) => {
    const payload = {
      strategyNo: record.strategyNo,
      enableStatus: 0,
    }
    enable(payload).then((json) => {
      if (json) {
        this.props.dispatch({ type: 'giftStrategy/search' })
        notification.success({
          message: '操作成功',
        })
      }
    })
  }
  exportOrder = () => {
    const searchParam = {}
    // const start = this.state.beginTime === undefined ? undefined : new Date(this.state.beginTime).toLocaleDateString()
    // const end = this.state.endTime === undefined ? undefined : new Date(this.state.endTime).toLocaleDateString()
    // Object.assign(values, { beginTime: moment(values.beginTime).format('YYYY-MM-DD'), endTime: moment(values.endTime).format('YYYY-MM-DD') })
    Object.assign(searchParam, {
      strategyNo: this.state.strategyNo,
      giftList: this.state.giftList,
      strategyName: this.state.strategyName,
      beginTime: this.state.beginTime === undefined ? undefined : moment(this.state.beginTime).format('YYYY-MM-DD'),
      endTime: this.state.endTime === undefined ? undefined : moment(this.state.endTime).format('YYYY-MM-DD'),
      includeProduct: this.state.includeProduct,
      includeSku: this.state.includeSku,
      minAmountBig: this.state.minAmountBig,
      minAmountSmall: this.state.minAmountSmall,
      maxAmountBig: this.state.maxAmountBig,
      maxAmountSmall: this.state.maxAmountSmall,
      minNumBig: this.state.minNumBig,
      minNumSmall: this.state.minNumSmall,
      maxNumBig: this.state.maxNumBig,
      maxNumSmall: this.state.maxNumSmall,
      enableStatus: this.state.enableStatus,
      eachOverAmountBig: this.state.eachOverAmountBig,
      eachOverNumBig: this.state.eachOverNumBig,
      eachOverAmountSmall: this.state.eachOverAmountSmall,
      eachOverNumSmall: this.state.eachOverNumSmall,
      specifyShopName: this.state.specifyShopName,
    })
    this.props.dispatch({
      type: 'giftStrategy/exportOrder',
      payload: { searchParam, IDLst: [], fileName: '赠品规则.xls' },
    })
  }
  disabledStartDate = (startValue) => {
    const endValue = this.state.endTime
    if (!startValue || !endValue) {
      return false
    }
    return startValue.valueOf() > endValue.valueOf()
  }
  disabledEndDate = (endValue) => {
    const startValue = this.state.beginTime
    if (!endValue || !startValue) {
      return false
    }
    return endValue.valueOf() <= startValue.valueOf()
  }
  render() {
    const { list, loading, total, page, lists } = this.props.giftStrategy
     const columns = [{
      //   title: '序号',
      //   dataIndex: 'key',
      //   key: 'key',
      //   width: 40,
      //   render: (text, record, index) => {
      //     return (
      //       <span>
      //         {index + 1}
      //       </span>)
      //     },
      // }, {
        title: '规则号',
        dataIndex: 'strategyNo',
        key: 'strategyNo',
        width: 50,
      }, {
        title: '名称',
        dataIndex: 'strategyName',
        key: 'strategyName',
        width: 50,
      }, {
        title: '状态',
        dataIndex: 'siteName',
        key: 'siteName',
        width: 80,
        className: styles.columnCenter,
        render: (text, record) => {
          if (moment().format('YYYY-MM-DD HH:mm:ss') < moment(record.beginTime).format('YYYY-MM-DD HH:mm:ss')) {
            return <Tag color="#87d068" >未开始</Tag>
          } else if (moment().format('YYYY-MM-DD HH:mm:ss') > moment(record.endTime).format('YYYY-MM-DD HH:mm:ss')) {
            return <Tag color="#f50" >已过期</Tag>
          } else {
            return <Tag color="#2db7f5">进行中</Tag>
          }
        },
      },
      {
          title: '操作',
          dataIndex: 'opreation',
          key: 'opreation',
          width: 50,
          className: styles.columnCenter,
          render: (text, record) => {
            if (checkPremission('GIFTSTRATEGY_EDIT')) {
              return (
                <div className="editable-row-operations">
                  <a onClick={this.editModal.bind(this, record)}>编辑</a>
                  <Divider type="vertical" />
                  {record.enableStatus ? <a onClick={this.disEnable.bind(this, record)}>禁用</a> : <a onClick={this.enable.bind(this, record)}>启用</a>}
                </div>
              )
            }
          },
      }, {
        title: '店铺',
        dataIndex: 'specifyShopName',
        key: 'specifyShopName',
        width: 70,
      }, {
        title: '赠品',
        dataIndex: 'giftList',
        key: 'giftList',
        width: 70,
      }, {
        title: '包含其中任一商品编码',
        dataIndex: 'includeSku',
        key: 'includeSku',
        width: 80,
      }, {
        title: '包含其中任一款式编码',
        dataIndex: 'includeProduct',
        key: 'includeProduct',
        width: 80,
      }, {
        title: '最小金额',
        dataIndex: 'minAmount',
        key: 'minAmount',
        width: 50,
        className: styles.columnRight,
      }, {
        title: '最大金额',
        dataIndex: 'maxAmount',
        key: 'maxAmount',
        width: 50,
        className: styles.columnRight,
      }, {
        title: '最小数量',
        dataIndex: 'minNum',
        key: 'minNum',
        width: 50,
        className: styles.columnRight,
      }, {
        title: '最大数量',
        dataIndex: 'maxNum',
        key: 'maxNum',
        width: 50,
        className: styles.columnRight,
      }, {
        title: '开始时间',
        dataIndex: 'beginTime',
        key: 'beginTime',
        width: 90,
        render: text => (text && moment(text).format('YYYY-MM-DD HH:mm:ss') !== '1899-11-30 00:00:00' ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null),
      }, {
        title: '结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
        width: 90,
        render: text => (text && moment(text).format('YYYY-MM-DD HH:mm:ss') !== '1899-11-30 00:00:00' ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null),
      }, {
        title: '金额数量设计针对包含的商品',
        dataIndex: 'validIncluded',
        key: 'validIncluded',
        width: 100,
        className: styles.columnCenter,
        render: (text, record) => (
          <Checkbox checked={record.validIncluded} />
        ),
      }, {
        title: '最多送数量',
        dataIndex: 'cumulativeMaxNum',
        key: 'cumulativeMaxNum',
        width: 60,
        className: styles.columnRight,
      }, {
        title: (<Tooltip title="只有当设定了最多送数量时才记录已送数量"><span style={{ color: 'red' }}>？</span>已经送数量</Tooltip>),
        dataIndex: 'mobileNo',
        key: 'mobileNo',
        width: 60,
        titleEx: '已经送数量',
        className: styles.columnRight,
      }, {
        title: '每数量送1组',
        dataIndex: 'eachOverNum',
        key: 'eachOverNum',
        width: 60,
        className: styles.columnRight,
      }, {
        title: '每金额送1组',
        dataIndex: 'eachOverAmount',
        key: 'eachOverAmount',
        width: 60,
        className: styles.columnRight,
      }, {
        title: '必须有库存',
        dataIndex: 'meetInventoryFlag',
        key: 'meetInventoryFlag',
        width: 50,
        render: (text, record) => (
          <Checkbox checked={record.meetInventoryFlag} />
        ),
      }, {
        title: '叠加赠送',
        dataIndex: 'superposeFlag',
        key: 'superposeFlag',
        width: 50,
        render: (text, record) => (
          <Checkbox checked={record.superposeFlag} />
        ),
      }, {
        title: '启用',
        dataIndex: 'enableStatus',
        key: 'enableStatus',
        width: 40,
        render: (text, record) => (
          <Checkbox checked={record.enableStatus} />
        ),
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 90,
        render: text => (text && moment(text).format('YYYY-MM-DD HH:mm:ss') !== '1899-11-30 00:00:00' ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null),
      }, {
        title: '修改时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        width: 90,
        render: text => (text && moment(text).format('YYYY-MM-DD HH:mm:ss') !== '1899-11-30 00:00:00' ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null),
    }]
    const tabelToolbar = [
      <Button key="540" type="primary" size="small" onClick={() => this.setState({ giftStrategyVisiable: true })} premission="GIFTSTRATEGY_ADD">添加新的规则</Button>,
      // <Button type="primary" size="small" premission="TRUE">查看修改日志</Button>,
      // <Button type="primary" size="small" onClick={this.exportOrder} premission="TRUE">导出符合条件的单据</Button>,
      // <Button type="primary" size="small" premission="TRUE">设定赠送触发方式-当前：【下单送】</Button>,
    ]
    const tableProps = {
        toolbar: tabelToolbar,
        noSelected: true,
        dataSource: list,
        total,
        ...page,
        loading,
        columns,
        nameSpace: 'giftStrategy',
        tableName: 'giftStrategyTable',
        dispatch: this.props.dispatch,
        // selectedRows,
        // selectedRowKeys,
        rowKey: 'strategyNo',
        scroll: { x: 2800 },
    }
    const customPanelStyle = {
      border: 0,
      overflow: 'hidden',
    }
    const giftStrategyProps = {
      giftStrategyVisiable: this.state.giftStrategyVisiable,
      dispatch: this.props.dispatch,
      lists,
      editData: this.state.editData,
      itemModalHidden: () => {
        this.props.dispatch({ type: 'giftStrategy/clear' })
        this.setState({
          giftStrategyVisiable: false,
          editData: null,
        })
      },
    }
    return (
      <div>
        <Card>
          <Row>
            {/* 左侧树形列表 */}
            <Col span={6}>
              <Card hoverable bordered style={{ height: document.body.clientHeight - 120 }}>
                <div>
                  <Button type="primary" size="small" onClick={this.search} premission="TRUE"><Icon type="search" />组合查询</Button>
                  <Button style={{ marginLeft: 8 }} size="small" onClick={this.clear} premission="TRUE"><Icon type="delete" />清空</Button></div>
                <div style={{ height: document.body.clientHeight - 200, overflowX: 'hidden' }}>
                  <Input placeholder="规则号" size="small" style={{ marginTop: 5 }} onChange={this.strategyNo} value={this.state.strategyNo} />
                  <Input placeholder="赠品" size="small" style={{ marginTop: 5 }} onChange={this.giftList} value={this.state.giftList} />
                  <Input placeholder="名称" size="small" style={{ marginTop: 5 }} onChange={this.strategyName} value={this.state.strategyName} />
                  <DatePicker
                    size={config.InputSize}
                    placeholder="规则开始时间"
                    style={{ marginTop: 5 }}
                    onChange={this.beginTime} value={this.state.beginTime} format="YYYY-MM-DD HH:mm:ss" showTime disabledDate={this.disabledStartDate} />
                  <DatePicker
                    size={config.InputSize}
                    placeholder="规则结束时间"
                    style={{ marginTop: 5 }}
                    onChange={this.endTime} value={this.state.endTime} format="YYYY-MM-DD HH:mm:ss" showTime disabledDate={this.disabledEndDate} />
                  <Input placeholder="包含其中任一商品编码" size="small" style={{ marginTop: 5 }} onChange={this.includeSku} value={this.state.includeSku} />
                  <Input placeholder="包含其中任一款式编码" size="small" style={{ marginTop: 5 }} onChange={this.includeProduct} value={this.state.includeProduct} />
                  <Col span={12}><Input placeholder="最小金额大于等于" size="small" style={{ marginTop: 5 }} onChange={this.minAmountBig} value={this.state.minAmountBig} /></Col>
                  <Col span={12}><Input placeholder="最小金额小于等于" size="small" style={{ marginTop: 5 }} onChange={this.minAmountSmall} value={this.state.minAmountSmall} /></Col>
                  <Col span={12}><Input placeholder="最大金额大于等于" size="small" style={{ marginTop: 5 }} onChange={this.maxAmountBig} value={this.state.maxAmountBig} /></Col>
                  <Col span={12}><Input placeholder="最大金额小于等于" size="small" style={{ marginTop: 5 }} onChange={this.maxAmountSmall} value={this.state.maxAmountSmall} /></Col>
                  <Col span={12}><Input placeholder="最小数量大于等于" size="small" style={{ marginTop: 5 }} onChange={this.minNumBig} value={this.state.minNumBig} /></Col>
                  <Col span={12}><Input placeholder="最小数量小于等于" size="small" style={{ marginTop: 5 }} onChange={this.minNumSmall} value={this.state.minNumSmall} /></Col>
                  <Col span={12}><Input placeholder="最大数量大于等于" size="small" style={{ marginTop: 5 }} onChange={this.maxNumBig} value={this.state.maxNumBig} /></Col>
                  <Col span={12}><Input placeholder="最大数量小于等于" size="small" style={{ marginTop: 5 }} onChange={this.maxNumSmall} value={this.state.maxNumSmall} /></Col>
                  <RadioGroup onChange={this.enableStatus} value={this.state.enableStatus} key="549">
                    <Radio value={1} style={{ marginTop: 5 }} key="555">启用</Radio>
                    <Radio value={0} style={{ marginTop: 5 }} key="556">已禁用</Radio>
                  </RadioGroup>
                  <Collapse bordered={false} key="550">
                    <Panel header="每多少数量送1组" key="1" style={customPanelStyle}>
                      <Input key="554" placeholder="大于等于" size="small" style={{ marginBottom: 5 }} onChange={this.eachOverNumBig} value={this.state.eachOverNumBig} />
                      <Input key="553" placeholder="小于等于" size="small" onChange={this.eachOverNumSmall} value={this.state.eachOverNumSmall} />
                    </Panel>
                    <Panel header="每多少金额送1组" key="2" style={customPanelStyle}>
                      <Input key="552" placeholder="大于等于" size="small" style={{ marginBottom: 5 }} onChange={this.eachOverAmountBig} value={this.state.eachOverAmountBig} />
                      <Input key="551" placeholder="小于等于" size="small" onChange={this.eachOverAmountSmall} value={this.state.eachOverAmountSmall} />
                    </Panel>
                    {/* <Panel header="登记时间" key="3" style={customPanelStyle}>
                      <DatePicker size={config.InputSize} placeholder="开始时间" style={{ marginBottom: 5 }} />
                      <DatePicker size={config.InputSize} placeholder="结束时间" />
                    </Panel> */}
                    <Panel header="店铺" key="4" style={customPanelStyle}>
                      <RadioGroup onChange={this.specifyShopName} value={this.state.specifyShopName} key="557">
                        <div key={-1}><Radio value={-1} style={{ marginBottom: 5 }}>所有店铺</Radio></div>
                        { lists && lists.length ? lists.map((ele) => { return <div key={ele.shopNo}><Radio value={ele.shopName} style={{ marginBottom: 5 }}>{ele.shopName}</Radio></div> }) : null }
                        {/* <Col key={ele.autoNo} style={{ marginBottom: 5 }} span={8}> */}
                      </RadioGroup>
                    </Panel>
                  </Collapse>
                </div>
              </Card>
            </Col>
            {/* 右侧详情列表 */}
            <Col span={18} className={styles.scanLeftCard1}>
              <Col span={24} push={0} style={{ marginLeft: 15 }}>
                <div className={styles.tableList}>
                  <Jtable {...tableProps} />
                </div>
              </Col>
            </Col>
          </Row>
        </Card>
        {this.state.giftStrategyVisiable ? <GiftStrategyModal {...giftStrategyProps} /> : null}
      </div>
    )
  }
}
