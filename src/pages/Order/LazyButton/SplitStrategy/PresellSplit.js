/*
 * @Author: tanmengjia
 * @Date: 2018-02-10 09:54:39
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-11 10:25:32
 * 预售按批次拆分
 */
import React, { Component } from 'react'
import moment from 'moment'
import { connect } from 'dva'
import { Modal, Form, Input, Radio, message, Col, Row, Checkbox, Button, Card, Table, notification } from 'antd'
import config from '../../../../utils/config'
import { moneyCheck } from '../../../../utils/utils'
import { savePresell } from '../../../../services/order/orderList'

const RadioGroup = Radio.Group

@connect(state => ({
  orderList: state.orderList,
}))
@Form.create()
export default class PresellSplit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 1,
      selectedRows: [],
      originMoney: '',
      nowMoney: '',
      isSplit: true,
      giftType: 0,
    }
  }
    onChange = (e) => {
      this.setState({
        value: e.target.value,
      })
    }
    originMoney = (e) => {
      this.setState({
        originMoney: e.target.value,
      })
    }
    nowMoney = (e) => {
      this.setState({
        nowMoney: e.target.value,
      })
    }
    analyse = () => {
      if (this.state.value === 0) {
        this.props.dispatch({ type: 'orderList/analyses', payload: { selectedRows: this.props.selectedRows, orderType: this.state.value } })
      } else if (this.state.value === 1) {
        this.props.dispatch({ type: 'orderList/analyses', payload: { searchParam: this.props.searchParam, orderType: this.state.value } })
      }
    }
    isSplit = (e) => {
      this.setState({
        isSplit: e.target.checked,
      })
    }
    giftType = (e) => {
      this.setState({
        giftType: e.target.value,
      })
    }
  handleOk = () => {
    const payload = {
      selectedRows: this.state.selectedRows,
      autoSplit: this.state.isSplit ? 1 : 0,
      isGift: this.state.giftType,
    }
    let yes = true
    if (this.state.originMoney > 0) {
      if (!moneyCheck(this.state.originMoney)) {
        message.error('请输入正确的原订单商品最小金额')
        yes = false
      }
      Object.assign(payload, { oldMinAmount: this.state.originMoney })
    }
    if (this.state.nowMoney > 0) {
      if (!moneyCheck(this.state.nowMoney)) {
        message.error('请输入正确的主动拆分商品最小金额')
        yes = false
      }
      Object.assign(payload, { newMinAmount: this.state.nowMoney })
    }
    if (yes) {
      savePresell(payload).then((json) => {
        if (json) {
          notification.success({
            message: '操作成功',
          })
          this.props.form.resetFields()
          this.props.itemModalHidden1()
          this.props.dispatch({ type: 'orderList/clean' })
        }
      })
    }
  }
  handleCancel = () => {
    this.props.form.resetFields()
    this.props.itemModalHidden()
    this.props.dispatch({ type: 'orderList/clean' })
  }
  render() {
    const { analyse, loading1 } = this.props.orderList
    const columns = [{
      title: '商品编码',
      dataIndex: 'skuNo',
      key: 'skuNo',
      // width: '20%',
    }, {
      title: '款式编码&颜色规格',
      dataIndex: 'productNo',
      key: 'productNo',
      // width: '20%',
      render: (text, record) => {
          return <div>{record.productNo}/{record.productSpec}</div>
      },
    }, {
      title: '预售日期',
      dataIndex: 'orderDate',
      key: 'orderDate',
      // width: '20%',
      render: text => (text && moment(text).format('YYYY-MM-DD') !== '1899-11-30' ? moment(text).format('YYYY-MM-DD') : null),
    }, {
      title: '商品数量',
      dataIndex: 'skuNum',
      key: 'skuNum',
      // width: '20%',
    }, {
      title: '订单数量',
      dataIndex: 'orderNum',
      key: 'orderNum',
      // width: '20%',
    }, {
      title: '可配货库存',
      dataIndex: 'lockInventory',
      key: 'lockInventory',
      // width: '20%',
    // }, {
    //   title: '拆分出去',
    //   dataIndex: 'isSplit',
    //   key: 'isSplit',
    //   // width: '20%',
    //   render: (text, record) => {
    //     if (text * 1 === 0) {
    //       return '否'
    //     } else if (text * 1 === 1) {
    //       return '是'
    //     }
    //   },
    }]
    const text = (
      <div style={{ color: 'green' }}>请选择订单筛选条件后点击分析</div>
    )
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        this.setState({
          selectedRows,
        })
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    }
    return (
      <Modal
        key="811"
        maskClosable={false}
        title="按批次拆分预售"
        visible={this.props.presellVisiable}
        onCancel={this.handleCancel}
        bodyStyle={{ padding: 0 }}
        width="1200px"
        footer={[
          <Button key="789" type="primary" onClick={this.handleOk} disabled={this.state.selectedRows.length === 0}>
            确定拆分
          </Button>,
        ]}
      >
        <div>
          <Col span={11} style={{ marginTop: 10, marginLeft: 20 }}>
            <RadioGroup onChange={this.onChange} value={this.state.value} key="821" style={{ width: '100%' }}>
              <Radio value={0} disabled={!(this.props.selectedRows && this.props.selectedRows.length)}>订单列表页勾选的订单</Radio>
              <Radio value={1}>所有符合条件的订单:(加入搜索条件过滤后)</Radio>
            </RadioGroup>
          </Col>
          <Button type="primary" onClick={this.analyse}>分析</Button>
        </div>
        <div>
          <Card>
            <Row>
              {/* 左侧树形列表 */}
              <Col span={6}>
                <Checkbox style={{ marginRight: 10 }} onChange={this.isSplit} defaultChecked>如果订单所有商品均被设定主动拆分出去，则实际不拆分</Checkbox>
                <br />
                <br />
                <RadioGroup onChange={this.giftType} value={this.state.giftType}>
                  <Col span={24}><Radio value={0}>赠品留在原订单，不主动拆分</Radio></Col>
                  <Col span={24} style={{ marginTop: 10 }} ><Radio value={1}>赠品跟随主动拆分商品一同拆分</Radio></Col>
                </RadioGroup>
                <br />
                <br />
                <br />
                <div>当留在原订单商品的合计金额：</div>
                <div style={{ marginTop: 10 }}>小于指定金额<Input size={config.InputSize} style={{ width: 60, marginRight: 5, marginLeft: 5 }} onChange={this.originMoney} />时，不拆分</div>
                <div style={{ marginTop: 10 }}>当主动拆分商品的合计金额：</div>
                <div style={{ marginTop: 10 }}>小于指定金额<Input size={config.InputSize} style={{ width: 60, marginRight: 5, marginLeft: 5 }} onChange={this.nowMoney} />时，不拆分</div>
                {/* suffix={this.state.nowMoney ? null : suffix} */}
              </Col>
              {/* 右侧详情列表 */}
              <Col span={18}>
                <Col span={24} push={0}>
                  <div>
                    <Table columns={columns} locale={{ emptyText: text }} dataSource={analyse} loading={loading1} rowSelection={rowSelection} rowKey={record => record.autoNo} />
                  </div>
                </Col>
              </Col>
            </Row>
          </Card>
        </div>
      </Modal>
      )
  }
}
