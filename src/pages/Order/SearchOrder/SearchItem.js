/*
 * @Author: jiangteng
 * @Date: 2017-12-26 17:03:18
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-12 10:02:35
 * 订单查询左侧搜索栏目
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Form, Icon, Input, Select, Tree, Collapse, Radio, Badge, DatePicker, Row, Col, Tooltip, Button, Checkbox, Card, Popover } from 'antd'
import SearchPool from './SearchPool'
import styles from '../Order.less'
import { buyer } from './BaseData'
import AddGood from '../../../components/ChooseItem/index'

const Option = Select.Option
const TreeNode = Tree.TreeNode
const Panel = Collapse.Panel
const RadioGroup = Radio.Group

@connect(state => ({
  search: state.search,
}))
@Form.create({ onValuesChange: (props, values) => {
  const { dispatch } = props
  dispatch({
    type: 'search/changeState',
    payload: {
      searchParam: Object.assign(props.search.searchParam, values),
    },
  })
} })

export default class SearchItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      shopNos: [],
      distributorNos: [],
      expressCropNos: [],
      provinces: [],
      orderStatuses: [], // 订单状态按钮
      orderTypes: [], // 订单类型状态按钮
      abnormalNos: [],
      warehouseNos: [],
      poolDate: {},
      selectPool: {},
      buyerMsg: 1, // 买家留言单选按钮
      sellerMsg: 1, // 卖家备注单选按钮
      orderFlag: 0,
      orderLabel: 0,
      height: 179,
      showModal: false,
      unable: false,
    }
  }
  componentWillMount() {
    window.addEventListener('resize', this.onWindowResize)
    this.props.dispatch({
      type: 'search/statistics',
    })
  }
  componentDidMount() {
    const { searchParam } = this.props.search
    this.setState({
      orderStatuses: searchParam.orderStatuses,
      buyerMsg: searchParam.buyerMsg ? searchParam.buyerMsg : 1,
      sellerMsg: searchParam.sellerMsg ? searchParam.sellerMsg : 1,
      orderTypes: searchParam.orderTypes,
      shopNos: searchParam.shopNos,
      expressCropNos: searchParam.expressCropNos,
      provinces: searchParam.provinces,
      warehouseNos: searchParam.warehouseNos,
    })
    this.props.form.setFieldsValue({ ...searchParam })
    this.onWindowResize()
  }
  onWindowResize = () => {
    const o = document.getElementById("search")
    const h = o.offsetHeight
    if (h > 50) {
      this.setState({ height: 200 })
    } else {
      this.setState({ height: 179 })
    }
  }
  onShopChange = (checkedValues) => {
    this.props.dispatch({
      type: 'search/changeState',
      payload: { searchParam: Object.assign(this.props.search.searchParam, { shopNos: checkedValues }) },
    })
    this.setState({
      shopNos: checkedValues,
    })
  }
  onDistributorNosChange = (checkedValues) => {
    this.props.dispatch({
      type: 'search/changeState',
      payload: { searchParam: Object.assign(this.props.search.searchParam, { distributorNos: checkedValues }) },
    })
    this.setState({
      distributorNos: checkedValues,
    })
  }
  onExpressCropNosChange = (checkedValues) => {
    this.props.dispatch({
      type: 'search/changeState',
      payload: { searchParam: Object.assign(this.props.search.searchParam, { expressCropNos: checkedValues }) },
    })
    this.setState({
      expressCropNos: checkedValues,
    })
  }
  onProvincesChange = (checkedValues) => {
    this.props.dispatch({
      type: 'search/changeState',
      payload: { searchParam: Object.assign(this.props.search.searchParam, { provinces: checkedValues }) },
    })
    this.setState({
      provinces: checkedValues,
    })
  }
  onWarehouseNosChange = (checkedValues) => {
    this.props.dispatch({
      type: 'search/changeState',
      payload: { searchParam: Object.assign(this.props.search.searchParam, { warehouseNos: checkedValues }) },
    })
    this.setState({
      warehouseNos: checkedValues,
    })
  }
  orderStatusChange = (checkedValues) => {
    this.props.dispatch({
      type: 'search/changeState',
      payload: { searchParam: Object.assign(this.props.search.searchParam, { orderStatuses: checkedValues }) },
    })
    this.setState({
      orderStatuses: checkedValues,
    })
  }
  orderTypesChange = (checkedValues) => {
    this.props.dispatch({
      type: 'search/changeState',
      payload: { searchParam: Object.assign(this.props.search.searchParam, { orderTypes: checkedValues }) },
    })
    this.setState({
      orderTypes: checkedValues,
    })
  }
  abnormalNosChange = (checkedValues) => {
    this.setState({
      abnormalNos: checkedValues,
    })
  }
  buyerMsgChange = (e) => {
    this.props.dispatch({
      type: 'search/changeState',
      payload: { searchParam: Object.assign(this.props.search.searchParam, { buyerMsg: e.target.value }) },
    })
    this.setState({
      buyerMsg: e.target.value,
    })
  }
  sellerMsgChange = (e) => {
    this.props.dispatch({
      type: 'search/changeState',
      payload: { searchParam: Object.assign(this.props.search.searchParam, { sellerMsg: e.target.value }) },
    })
    this.setState({
      sellerMsg: e.target.value,
    })
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.poolDateChange((values) => {
      this.setState({
        poolDate: values,
      })
      this.props.dispatch({
        type: 'search/cleanPage',
        payload: {
          searchParam: values,
          page: {},
        },
      })
      // this.props.dispatch({
      //   type: 'search/search',
      //   payload: {
      //     searchParam: values,
      //   },
      // })
      this.props.dispatch({
        type: 'search/changeState',
        payload: {
          searchParam: values,
        },
      })
    })
  }
  handleReset = () => {
    this.setState({
      buyerMsg: 1,
      sellerMsg: 1,
      orderStatuses: [],
      orderTypes: [],
      shopNos: [],
      distributorNos: [],
      expressCropNos: [],
      provinces: [],
      warehouseNos: [],
      abnormalNos: [],
      selectPool: {},
      poolDate: {},
      orderFlag: 0,
      orderLabel: 0,
    })
    this.props.form.resetFields()
    this.props.dispatch({
      type: 'search/clean',
    })
  }
  poolShow = () => {
    this.poolDateChange((values) => {
      this.setState({
        poolDate: values,
      })
    })
  }

  // 订单更新统计
  updateOrderStatistics = () => {
    this.props.dispatch({
      type: 'search/update',
    })
  }
  poolDateChange = (callback) => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { prefix1, prefix2, prefix3, postfix1, postfix2, postfix3 } = values
        Object.assign(values, {
          [prefix1]: postfix1,
          [prefix2]: postfix2,
          [prefix3]: postfix3,
          orderStatuses: this.state.orderStatuses,
          orderTypes: this.state.orderTypes,
          abnormalNos: this.state.abnormalNos,
          shopNos: this.state.shopNos,
          distributorNos: this.state.distributorNos,
          expressCropNos: this.state.expressCropNos,
          provinces: this.state.provinces,
          warehouseNos: this.state.warehouseNos,
          buyerMsg: this.state.buyerMsg,
          sellerMsg: this.state.sellerMsg,
        })
        callback(values)
      }
    })
  }
  selectQuery = (content) => {
    this.setState({
      shopNos: JSON.parse(content).shopNos,
      distributorNos: JSON.parse(content).distributorNos,
      expressCropNos: JSON.parse(content).expressCropNos,
      provinces: JSON.parse(content).provinces,
      orderStatuses: JSON.parse(content).orderStatuses, // 订单状态按钮
      orderTypes: JSON.parse(content).orderTypes, // 订单类型状态按钮
      abnormalNos: JSON.parse(content).abnormalNos,
      warehouseNos: JSON.parse(content).warehouseNos,
      buyerMsg: JSON.parse(content).buyerMsg, // 买家留言单选按钮
      sellerMsg: JSON.parse(content).sellerMsg, // 卖家备注单选按钮
      poolDate: JSON.parse(content),
      selectPool: JSON.parse(content),
      orderFlag: JSON.parse(content).orderFlag,
      orderLabel: JSON.parse(content).orderLabel,
    }, () => {
      this.props.dispatch({
        type: 'search/search',
        payload: {
          searchParam: this.state.poolDate,
        },
      })
    })
  }
  renderTreeNodes = (data) => {
    return (
      data &&
      data.map((item) => {
        if (item.children) {
          return (
            <TreeNode title={item.title} key={item.key} dataRef={item}>
              {this.renderTreeNodes(item.children)}
            </TreeNode>
          )
        }
        return <TreeNode {...item} />
      })
    )
  }
  addGood= () => {
    this.setState({ showModal: true, unable: true })
    this.props.dispatch({
      type: 'chooseItem/changeState',
      payload: { searchParam: { enableStatus: '1' }, searchParamT: true, jt: true, forbid: this.props.search.forbidList },
    })
    this.props.dispatch({
      type: 'chooseItem/fetch',
      payload: { enableStatus: '1' },
    })
  }
  onChangeCollapse = (key) => {
    const { defaultActiveKey } = this.props.search
    const index = defaultActiveKey.findIndex(ele => ele === key)
    index === -1 ? defaultActiveKey.push(key) : defaultActiveKey.splice(index, 1)
    this.props.dispatch({
      type: 'searct/changeState',
      payload: { defaultActiveKey },
    })
  }
  render() {
    const addProps = {
      fromName: 'jt',
      unable: this.state.unable,
      changeModalVisiable: this.state.showModal,
      enableStatus: '1',
      itemModalHidden: () => { this.setState({ showModal: false }) },
      chooseData: (rows, keys, callback) => {
        const flag = this.props.form.getFieldValue('prefix3')
        if (flag === 'skuNo') {
          this.props.form.setFieldsValue({
            postfix3: keys.toString(),
          })
        } else {
          const productNo = []
          rows.length ? rows.forEach(ele => productNo.push(ele.productNo)) : null
          this.props.form.setFieldsValue({
            postfix3: productNo.toString(),
          })
        }
        callback()
      },
    }
    const { OrderAbnormal, OrderType, OrderStatus, shop, logistic, Province, warehouse } = this.props.search.initData
    const { distributorList, statisticsData, defaultActiveKey } = this.props.search
    const { selectPool } = this.state
    const { getFieldDecorator } = this.props.form
    const selectAfterOrderNo = <div style={{ width: 83 }}>内部订单号</div>
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    }
    const selectAfter = getFieldDecorator('prefix1', {
      initialValue: selectPool.prefix1 ? selectPool.prefix1 : 'siteOrderNo',
    })(
      <Select style={{ width: 105 }}>
        <Option value="siteOrderNo">线上订单号</Option>
        <Option value="billNo">支付单号</Option>
      </Select>
    )
    const siteBuyerNo = getFieldDecorator('prefix2', {
      initialValue: selectPool.prefix2 ? selectPool.prefix2 : 'siteBuyerNo',
    })(
      <Select style={{ width: 105 }}>
        {buyer &&
          buyer.map((ele, index) => (
            <Option key={index} value={ele.key}>
              {ele.title}
            </Option>
          ))}
      </Select>
    )
    const goodInf = getFieldDecorator('prefix3', {
      initialValue: selectPool.prefix3 ? selectPool.prefix3 : 'skuNo',
    })(
      <Select style={{ width: 90 }}>
        <Option value="skuNo">商品编号</Option>
        <Option value="productNo">款式编号</Option>
      </Select>
    )
    const number = (
      <div>
        <div>订单数量（包含赠品，不包括已取消的商品)</div>
        <div>如果不强制到状态等其它条件，仅限待发货订单</div>
        <div>性能较慢</div>
      </div>
    )
    const price = (
      <div>
        <div>订单金额（应付金额）</div>
        <div>如果不强制到状态等其它条件，仅限待发货订单</div>
        <div>性能较慢</div>
      </div>
    )
    const weight = (
      <div>
        <div>订单预估重量</div>
        <div>如果不强制到状态等其它条件，仅限待发货订单</div>
        <div>性能较慢</div>
      </div>
    )
    const timeField = (
      <div onClick={(event) => { event.stopPropagation() }}>
        {getFieldDecorator('timeField', {
      initialValue: selectPool.timeField ? selectPool.timeField : '1',
    })(
      <Select
        size="small"
        style={{ width: 120 }}
      >
        <Option value="1">下单时间</Option>
        <Option value="2">发货时间</Option>
        <Option value="3">付款时间</Option>
      </Select>)}
      </div>
    )
    return (
      <Card
        bordered
        hoverable
        style={{ height: document.body.clientHeight - 90 }}
      >
        <div style={{ width: '100%' }}>
          <div id="search"  style={{ paddingBottom: '13px' }}>
            <Button type="primary" size="small" style={{ marginRight: '10px' }} onClick={this.handleSubmit}>
              <Icon type="search" />组合查询
            </Button>
            <Button size="small" style={{ marginRight: '10px' }} onClick={this.handleReset}>
              <Icon type="delete" />清空
            </Button>
            <Button type="primary" style={{ marginTop: 10 }} size="small" onClick={this.updateOrderStatistics}><Icon type="reload" />更新统计</Button>
          </div>
        </div>
        <div style={{ height: document.body.clientHeight - this.state.height, overflowX: 'hidden', paddingTop: 1 }}>
          <Form>
            {getFieldDecorator('orderSNo', {
              initialValue: selectPool.orderSNo ? selectPool.orderSNo : undefined,
            })(<Input addonAfter={selectAfterOrderNo} size="small" />)}
            <div style={{ height: '10px' }} />
            {getFieldDecorator('postfix1', {
              initialValue: selectPool.postfix1 ? selectPool.postfix1 : undefined,
            })(<Input addonAfter={selectAfter} size="small" />)}
            <div style={{ height: '10px' }} />
            {getFieldDecorator('postfix2', {
              initialValue: selectPool.postfix2 ? selectPool.postfix2 : undefined,
            })(<Input addonAfter={siteBuyerNo} size="small" />)}
            <Collapse onChange={this.onChangeCollapse.bind(this, '1')} defaultActiveKey={defaultActiveKey} bordered={false} className={styles.customPanelStyle}>
              <Panel header="订单状态" key="1">
                <Checkbox.Group style={{ width: '100%' }} value={this.state.orderStatuses} onChange={this.orderStatusChange}>
                  <Row>
                    {OrderStatus && OrderStatus.map((e, index) => (
                      <Col key={index} style={{ marginTop: 2, marginBottom: 2 }} span={24}>
                        <Checkbox
                          disabled={this.props.search.status === 1}
                          value={e.index}
                        >
                          {e.name}
                          {statisticsData[`os${e.index}`] > 0 && e.index !== '3' && e.index !== '40' && e.index !== '41' && e.index !== '42' ? <Badge count={statisticsData[`os${e.index}`]} /> : null }
                        </Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
                <Collapse onChange={this.onChangeCollapse.bind(this, '2')} defaultActiveKey={defaultActiveKey} bordered={false} className={styles.yichang}>
                  <Panel header="异常" key="2">
                    <Checkbox.Group style={{ width: '100%' }} value={this.state.abnormalNos} onChange={this.abnormalNosChange}>
                      <Row>
                        {OrderAbnormal && OrderAbnormal.map((e, index) => {
                          if (e.index !== '0') {
                            return (
                              <Col key={index} style={{ marginTop: 2, marginBottom: 2 }} span={24}>
                                <Checkbox value={e.index}>{e.name}{statisticsData[`an${e.index}`] > 0 ? <Badge count={statisticsData[`an${e.index}`]} /> : null }</Checkbox>
                              </Col>
                            )
                          } else {
                            return null
                          }
                        })}
                      </Row>
                    </Checkbox.Group>
                  </Panel>
                </Collapse>
              </Panel>
            </Collapse>
            <Collapse onChange={this.onChangeCollapse.bind(this, '3')} defaultActiveKey={defaultActiveKey} bordered={false} className={styles.customPanelStyle}>
              <Panel
                key="3"
                header={
                  <div>
                    买家留言<span className={styles.remark}>只查询未发货单</span>
                  </div>
                }
              >
                <RadioGroup onChange={this.buyerMsgChange} value={this.state.buyerMsg}>
                  <Radio value={1} style={radioStyle} >
                    不过滤
                  </Radio>
                  <Radio value={2} style={radioStyle} >
                    无留言
                  </Radio>
                  <Radio value={4} style={radioStyle} >
                    有留言{getFieldDecorator('buyerRemark', {
              initialValue: selectPool.buyerRemark ? selectPool.buyerRemark : undefined,
            })(<Input placeholder="留言内容,限未发货" size="small" style={{ width: '136px' }} />)}
                  </Radio>
                </RadioGroup>
              </Panel>
            </Collapse>
            <Collapse onChange={this.onChangeCollapse.bind(this, '4')} defaultActiveKey={defaultActiveKey} bordered={false} className={styles.customPanelStyle}>
              <Panel
                key="4"
                header={
                  <div>
                    卖家备注<span className={styles.remark}>只查询未发货单</span>
                  </div>
                }
              >
                <RadioGroup onChange={this.sellerMsgChange} value={this.state.sellerMsg}>
                  <Radio value={1} style={radioStyle}>
                    不过滤
                  </Radio>
                  <Radio value={2} style={radioStyle}>
                    无备注
                  </Radio>
                  <Radio value={4} style={radioStyle}>
                    有备注{getFieldDecorator('sellerRemark', {
              initialValue: selectPool.sellerRemark ? selectPool.sellerRemark : undefined,
            })(<Input placeholder="留言内容,限未发货" size="small" style={{ width: '136px' }} />)}
                  </Radio>
                </RadioGroup>
              </Panel>
            </Collapse>
            <Collapse onChange={this.onChangeCollapse.bind(this, '5')} defaultActiveKey={defaultActiveKey} bordered={false} className={styles.customPanelStyle}>
              <Panel key="5" header={timeField}>
                <div style={{ height: '10px' }} />
                {getFieldDecorator('startTime', {
                  initialValue: selectPool.startTime ? moment(selectPool.startTime) : undefined,
                })(<DatePicker size="small" placeholder="开始时间" className={styles.datePicker} />)}
                <div style={{ height: '10px' }} />
                {getFieldDecorator('endTime', {
                  initialValue: selectPool.endTime ? moment(selectPool.endTime) : undefined,
                })(<DatePicker size="small" placeholder="结束时间" className={styles.datePicker} />)}
              </Panel>
            </Collapse>
            <Collapse onChange={this.onChangeCollapse.bind(this, '6')} defaultActiveKey={defaultActiveKey} bordered={false} className={styles.customPanelStyle}>
              <Panel key="6" header="商品信息">
                <div style={{ height: '10px' }} />
                {getFieldDecorator('postfix3', {
                  initialValue: selectPool.postfix3 ? selectPool.postfix3 : undefined,
                })(<Input placeholder="双击选择编号" addonAfter={goodInf} size="small" onDoubleClick={this.addGood} />)}
                <div style={{ height: '10px' }} />
                <Col span={11}>
                  <Tooltip trigger="click" placement="top" title={number}>
                    {getFieldDecorator('minNum', {
                      initialValue: selectPool.minNum ? selectPool.minNum : undefined,
                    })(<Input size="small" placeholder="数量大于等于" />)}
                  </Tooltip>
                </Col>
                <Col span={2} />
                <Col span={11}>
                  <Tooltip trigger="click" placement="top" title="仅限待发货订单">
                    {getFieldDecorator('maxNum', {
                      initialValue: selectPool.maxNum ? selectPool.maxNum : undefined,
                    })(<Input size="small" placeholder="数量小于等于" />)}
                  </Tooltip>
                </Col>
                <div style={{ height: '10px' }} />
                <Col span={11} style={{ marginTop: '10px' }}>
                  <Tooltip trigger="click" placement="top" title={price}>
                    {getFieldDecorator('minMoney', {
                      initialValue: selectPool.minMoney ? selectPool.minMoney : undefined,
                    })(<Input size="small" placeholder="金额大于等于" />)}
                  </Tooltip>
                </Col>
                <Col span={2} />
                <Col span={11} style={{ marginTop: '10px' }}>
                  <Tooltip trigger="click" placement="top" title="仅限待发货订单">
                    {getFieldDecorator('maxMoney', {
                      initialValue: selectPool.maxMoney ? selectPool.maxMoney : undefined,
                    })(<Input size="small" placeholder="金额小于等于" />)}
                  </Tooltip>
                </Col>
                <div style={{ height: '10px' }} />
                <Tooltip trigger="click" placement="top" title="仅限待发货订单">
                  {getFieldDecorator('productName', {
                    initialValue: selectPool ? selectPool.productName : undefined,
                  })(<Input size="small" placeholder="商品名称包含关键字" style={{ marginTop: '10px' }} />)}
                </Tooltip>
                <div style={{ height: '10px' }} />
                <Tooltip trigger="click" placement="top" title="仅限待发货订单">
                  {getFieldDecorator('productSpec', {
                    initialValue: selectPool ? selectPool.productSpec : undefined,
                  })(<Input size="small" placeholder="商品规格包含关键字" />)}
                </Tooltip>
                <div style={{ height: '10px' }} />
                <Col span={11}>
                  <Tooltip trigger="click" placement="top" title={weight}>
                    {getFieldDecorator('minWeight', {
                      initialValue: selectPool ? selectPool.minWeight : undefined,
                    })(<Input size="small" placeholder="重量大于等于" />)}
                  </Tooltip>
                </Col>
                <Col span={2} />
                <Col span={11}>
                  <Tooltip trigger="click" placement="top" title={weight}>
                    {getFieldDecorator('maxWeight', {
                      initialValue: selectPool ? selectPool.maxWeight : undefined,
                    })(<Input size="small" placeholder="重量小于等于" />)}
                  </Tooltip>
                </Col>
              </Panel>
            </Collapse>
            <Collapse onChange={this.onChangeCollapse.bind(this, '7')} defaultActiveKey={defaultActiveKey} bordered={false} className={styles.orderType}>
              <Panel key="7" header="订单类型">
                <Checkbox.Group style={{ width: '100%' }} value={this.state.orderTypes} onChange={this.orderTypesChange}>
                  <Row>
                    {OrderType && OrderType.map((e, index) => (
                      <Col key={index} style={{ marginTop: 2, marginBottom: 2 }} span={24}>
                        <Checkbox value={e.index}>{e.name}{statisticsData[`ot${index}`] > 0 && e.index !== '0' && e.index !== '3' ? <Badge count={statisticsData[`ot${index}`]} /> : null }</Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </Panel>
            </Collapse>
            <Collapse onChange={this.onChangeCollapse.bind(this, '8')} defaultActiveKey={defaultActiveKey} bordered={false} className={styles.shopList}>
              <Panel key="8" header="订单标签">
                {getFieldDecorator('orderLabel', {
                  initialValue: this.state.orderLabel,
                })(
                  <Select
                    size="small"
                    style={{ width: 120, marginTop: 10 }}
                  >
                    <Option value={0}>无标签</Option>
                    <Option value={1}>红色标签</Option>
                    <Option value={2}>黄色标签</Option>
                    <Option value={3}>绿色标签</Option>
                    <Option value={4}>蓝色标签</Option>
                    <Option value={5}>紫色标签</Option>
                    <Option value={6}>黑色标签</Option>
                  </Select>
                )}
              </Panel>
            </Collapse>
            <Collapse onChange={this.onChangeCollapse.bind(this, '9')} defaultActiveKey={defaultActiveKey} bordered={false} className={styles.shopList}>
              <Panel key="9" header="订单旗帜">
                {getFieldDecorator('orderFlag', {
                  initialValue: this.state.orderFlag,
                })(
                  <Select
                    size="small"
                    style={{ width: 120, marginTop: 10 }}
                  >
                    <Option value={0}>无旗帜</Option>
                    <Option value={1}>红色旗帜</Option>
                    <Option value={2}>黄色旗帜</Option>
                    <Option value={3}>绿色旗帜</Option>
                    <Option value={4}>蓝色旗帜</Option>
                    <Option value={5}>紫色旗帜</Option>
                    <Option value={6}>黑色旗帜</Option>
                  </Select>
                )}
              </Panel>
            </Collapse>
            <Collapse onChange={this.onChangeCollapse.bind(this, '10')} defaultActiveKey={defaultActiveKey} bordered={false} className={styles.shopList}>
              <Panel key="10" header="店铺">
                <Checkbox.Group style={{ width: '100%' }} value={this.state.shopNos} onChange={this.onShopChange}>
                  <Row>
                    {shop && shop.map((e, index) => (
                      <Col key={index} style={{ marginTop: 2, marginBottom: 2 }} span={24}>
                        <Checkbox value={e.shopNo}>{e.shopName}</Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </Panel>
            </Collapse>
            <Collapse onChange={this.onChangeCollapse.bind(this, '11')} defaultActiveKey={defaultActiveKey} bordered={false} className={styles.shopList}>
              <Panel key="11" header="分销商">
                <Checkbox.Group style={{ width: '100%' }} value={this.state.distributorNos} onChange={this.onDistributorNosChange}>
                  <Row>
                    {distributorList.length && distributorList.map((e, index) => (
                      <Col key={index} style={{ marginTop: 2, marginBottom: 2 }} span={24}>
                        <Checkbox value={e.distributorNo}>{e.distributorName}</Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </Panel>
            </Collapse>
            <Collapse onChange={this.onChangeCollapse.bind(this, '12')} defaultActiveKey={defaultActiveKey} bordered={false} className={styles.shopList}>
              <Panel key="12" header="快递公司">
                <Checkbox.Group style={{ width: '100%' }} value={this.state.expressCropNos} onChange={this.onExpressCropNosChange}>
                  <Row>
                    {logistic && logistic.map((e, index) => (
                      <Col key={index} style={{ marginTop: 2, marginBottom: 2 }} span={24}>
                        <Checkbox value={e.no}>{e.name}</Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </Panel>
            </Collapse>
            <Collapse onChange={this.onChangeCollapse.bind(this, '13')} defaultActiveKey={defaultActiveKey} bordered={false} className={styles.shopList}>
              <Panel key="13" header="收货省">
                <Checkbox.Group style={{ width: '100%' }} value={this.state.provinces} onChange={this.onProvincesChange}>
                  <Row>
                    {Province && Province.success && Province.data.map((e, index) => (
                      <Col key={index} style={{ marginTop: 2, marginBottom: 2 }} span={24}>
                        <Checkbox value={e.regionName}>{e.regionName}</Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </Panel>
            </Collapse>
            <Collapse onChange={this.onChangeCollapse.bind(this, '14')} defaultActiveKey={defaultActiveKey} bordered={false} className={styles.shopList}>
              <Panel key="14" header="发货仓库">
                <Checkbox.Group style={{ width: '100%' }} value={this.state.warehouseNos} onChange={this.onWarehouseNosChange}>
                  <Row>
                    {warehouse && warehouse.map((e, index) => (
                      <Col key={index} style={{ marginTop: 2, marginBottom: 2 }} span={24}>
                        <Checkbox value={e.no}>{e.name}</Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </Panel>
            </Collapse>
          </Form>
        </div>
        <div className={styles.chaxunchi}>
          <Popover
            content={<SearchPool selectQuery={this.selectQuery} poolDate={this.state.poolDate} />}
            trigger="click"
            onVisibleChange={this.poolShow}
          >
            <a><Icon type="switcher" />查询池</a>
          </Popover>
        </div>
        <AddGood {...addProps} />
      </Card>
    )
  }
}
