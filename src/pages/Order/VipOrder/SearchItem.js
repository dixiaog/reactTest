/*
 * @Author: jiangteng
 * @Date: 2017-12-26 17:03:18
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-12 14:37:25
 * 唯品会接单左侧搜索栏目
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Form, Select, Collapse, DatePicker, Card, Checkbox, Button, message} from 'antd'
import  moment from 'moment'
import styles from '../Order.less'
import { vipOrderSearch } from '../../../services/order/search'

const Option = Select.Option
const Panel = Collapse.Panel
const FormItem = Form.Item

@connect(state => ({
  vipOrder: state.vipOrder,
}))
@Form.create()

export default class SearchItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      checked: true,
      shopNo: null, // 店铺选择
      startTime: moment().subtract(30, 'days'),
      endTime: moment().subtract(0, 'days'),
      loading: false,
      init: true,
    }
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.vipOrder.shopList.length && this.state.init) {
      const { shopList, shopNo } = nextProps.vipOrder
      this.props.shopChoose(shopNo ? shopNo : shopList.length ? shopList[0].shopNo : null)
      this.setState({
        init: false,
        shopNo: shopNo ? shopNo : shopList && shopList.length ? shopList[0].shopNo : undefined,
      })
    }
    if (nextProps.getDataS) {
      this.handleSubmit()
    }
  }
  onChange = (e) => {
    this.setState({
      checked: e.target.checked,
    })
    this.props.dispatch({
      type: 'vipOrder/changeState',
      payload: { checked: e.target.checked },
    })
  }
  // 店铺选择
  onShopChange = (e) => {
    this.setState({
      shopNo: e,
    })
    this.props.shopChoose(e)
  }
  // 日期选择
  onDateChange = (flag, e) => {
    if (flag === 'startTime') {
      this.setState({
        startTime: e ? e : null,
      })
    } else {
      this.setState({
        endTime: e ? e : null,
      })
    }
  }
  backData = (data) => {
    this.props.backData(data)
  }
  handleSubmit = () => {
    if (this.state.shopNo === null && this.props.form.getFieldValue('shopNo') === undefined ) {
      message.warning('请选择店铺')
    } else {
      this.props.dispatch({
        type: 'vipOrder/changeState',
        payload: { shopNo: this.state.shopNo },
      })
      this.setState({
        loading: true,
      })
      const params = {}
      Object.assign(params, {
       shopNo: this.state.shopNo ? this.state.shopNo : this.props.form.getFieldValue('shopNo'),
       stSellStTime: this.state.checked ? null : this.state.startTime ? this.state.startTime.format('YYYY-MM-DD') : null,
       etSellStTime: this.state.checked ? null : this.state.endTime ? this.state.endTime.format('YYYY-MM-DD') : null,
      })
      if (this.state.checked || !this.state.startTime) {
        delete params.stSellStTime
      }
      if (this.state.checked || !this.state.endTime) {
        delete params.etSellStTime
      }
      console.log('查询参数', params)
      vipOrderSearch(params).then((json) => {
        if (json) {
          this.props.dispatch({
            type: 'vipOrder/changeState',
            payload: { poList: json },
          })
        }
        if(!json && !this.props.noClose) {
          this.props.hideModal()
        }
        this.setState({
          loading: false,
        })
      })
    }
  }
  render() {
    const { shopList, shopNo, poList } = this.props.vipOrder
    const { getFieldDecorator } = this.props.form
    return (
      <Card
        bordered
        hoverable
        style={{ height: document.body.clientHeight - 100 }}
      >
      
          <Form>
            <Collapse defaultActiveKey={['1']} bordered={false} className={styles.customPanelStyle}>
              <Panel header="店铺" key="1">
                <FormItem>
                  {getFieldDecorator('shopNo', {
                    initialValue: shopNo ? shopNo : shopList && shopList.length ? shopList[0].shopNo : undefined,
                  })(
                    <Select
                      size="small"
                      style={{ marginTop: 10 }}
                      placeholder="请选择店铺"
                      onChange={this.onShopChange}
                    >
                    {shopList.length ? shopList.map((ele, index) => <Option key={index} value={ele.shopNo}>{ele.shopName}</Option>) : ''}
                    </Select>
                  )}
                </FormItem>
              </Panel>
            </Collapse>
            <Checkbox style={{ marginLeft: 16, marginTop: 10 }} checked={this.state.checked} onChange={this.onChange}>忽略查询时间</Checkbox>
            {this.state.checked ?
              null
              :
              <Collapse defaultActiveKey={['1']} bordered={false} className={styles.customPanelStyle}>
                <Panel header="销售时间" key="1">
                  <div style={{ height: '10px' }} />
                  <DatePicker size="small" placeholder="开始时间" value={this.state.startTime} className={styles.datePicker} onChange={this.onDateChange.bind(this, 'startTime')} />
                  <div style={{ height: '10px' }} />
                  <DatePicker size="small" placeholder="结束时间" value={this.state.endTime} className={styles.datePicker} onChange={this.onDateChange.bind(this, 'endTime')} />
                </Panel>
              </Collapse>  
            }
            <Button loading={this.state.loading} type="primary" size="small" onClick={this.handleSubmit} style={{ marginLeft: 16, marginTop: 10, width: 80 }}>查询</Button>
            <div style={{ clear: 'both' }} />
            <div style={{ height: document.body.clientHeight - 230, overflowX: 'hidden' }}>
              <Collapse defaultActiveKey={['1']} bordered={false} className={styles.customPanelStyle}>
                <Panel header="PO列表" key="1">
                  <a key={1} onClick={this.backData.bind(this, { poNo: 6066060008, salesVolume: 10, notPick: 10 })}>
                    <div className={styles.po}>
                      <span>6066060008 : </span>
                      <span>10 : </span>
                      <span>10</span>
                    </div>
                  </a>
                  <a key={2} onClick={this.backData.bind(this, { poNo: 6066060010, salesVolume: 10, notPick: 10 })}>
                    <div className={styles.po}>
                      <span>6066060010 : </span>
                      <span>10 : </span>
                      <span>10</span>
                    </div>
                  </a>
                  {poList.length ? poList.map(ele =>
                    <a key={ele.po_no} onClick={this.backData.bind(this, { poNo: ele.po_no, salesVolume: ele.sales_volume, notPick: ele.not_pick })}>
                      <div className={styles.po}>
                        <span>{ele.po_no} : </span>
                        <span>{ele.sales_volume} : </span>
                        <span>{ele.not_pick}</span>
                      </div>
                    </a>
                    ) : <div style={{ lineHeight: 2 }}>暂无PO列表信息</div> }
                </Panel>
              </Collapse>
            </div>
          </Form>
      
      </Card>
    )
  }
}
