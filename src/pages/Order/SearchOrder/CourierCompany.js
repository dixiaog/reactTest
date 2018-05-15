/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified time: 2018-02-08 09:18:49
 * 设置快递公司
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Modal, Radio, message, Button, Col, Row } from 'antd'
import AutCalculate from './AutCalculate'
import { updateSetTheCourier } from '../../../services/order/search'

const RadioGroup = Radio.Group

@connect(state => ({
  search: state.search,
  autCalculate: state.autCalculate,
  orderDetail: state.orderDetail,
  tabList: state.global.tabList,
}))
export default class CourierCompany extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
      autCalculate: false,
      loading: false,
    }
  }
  onChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  }
  addToTablist = () => {
    const { tabList } = this.props
    let isHad = false
    tabList.forEach((ele) => {
      Object.assign(ele, { default: false })
      if (ele.key === 'expresslist') {
        isHad = true
        Object.assign(ele, { default: true })
      }
    })
    if (!isHad) {
      tabList.push({
        key: 'expresslist',
        path: '/base/expresslist',
        tab: '物流快递',
        default: true,
      })
    }
    this.props.dispatch({
      type: 'global/changeTabList',
      payload: tabList,
    })
    this.props.dispatch(routerRedux.push('/base/expresslist'))
  }
  autCalculate = () => {
    this.setState({ autCalculate: true })
    this.props.dispatch({
      type: 'autCalculate/fetch',
    })
  }
  // 关闭窗口
  hideModal = () => {
    this.setState({
      value: '',
    })
    this.props.dispatch({
      type: 'search/search',
    })
    this.props.hideModal()
  }
  handleSubmit = () => {
    if (!this.state.value) {
      message.warning('请选择一家快递公司')
    } else {
      this.setState({
        loading: true,
      })
      if (this.state.value === -1 || this.state.value === -2) {
        updateSetTheCourier(Object.assign({
          listOrderNo: this.props.setExpress ? this.props.search.selectedRowKeys : [this.props.orderNo],
          expressCorpNo: this.state.value,
          orderStatus: this.props.orderType ? this.props.orderStatus : null,
        })).then((json) => {
          if (json.review) {
            if (this.props.onOk) {
              this.props.onOk(-1)
            }
            if (this.props.listLog) {
              this.props.listLog()
            }
            if (this.props.orderType) {
              this.props.orderType(json.orderType)
            }
            this.props.dispatch({
              type: 'search/search',
            })
            if (this.props.setExpress) {
              this.props.dispatch({
                type: 'search/changeState',
                payload: { selectedRowKeys: [], selectedRows: [] },
              })
            }
            this.hideModal()
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
            loading: false,
          })
        })
      } else {
        const value = this.props.orderDetail.expressList.filter(ele => ele.expressCorpNo === this.state.value)
        if (this.props.setExpress) {
          this.setState({
            loading: true,
          })
          updateSetTheCourier(Object.assign({
            listOrderNo: this.props.search.selectedRowKeys,
            expressCorpNo: value[0].expressCorpNo,
            expressCorpName: value[0].expressCorpName,
            orderStatus: this.props.orderType ? this.props.orderStatus : null,
          })).then((json) => {
            if (json.review) {
              this.props.dispatch({
                type: 'search/search',
              })
              if (this.props.listLog) {
                this.props.listLog()
              }
              if (this.props.orderType) {
                this.props.orderType(json.orderType)
              }
              this.props.dispatch({
                type: 'search/changeState',
                payload: { selectedRowKeys: [], selectedRows: [] },
              })
              this.hideModal()
            } else {
              // message.error('设置快递失败')
              if (json.errorMessage) {
                message.warning(json.errorMessage.split('!').map((e, i) => {
                  if (i !== json.errorMessage.split('!').length - 1 && i === 0) {
                    return <span key={i}><br />{`${e}!`}<br /></span>
                  } else if (i !== json.errorMessage.split('!').length - 1) {
                    return <span key={i}>{`${e}!`}<br /></span>
                  } else {
                    return null
                  }
                }), 10)
              }
            }
            this.setState({
              loading: false,
            })
          })
        } else {
          this.setState({
            loading: true,
          })
          updateSetTheCourier(Object.assign({
            listOrderNo: [this.props.orderNo],
            expressCorpNo: value[0].expressCorpNo,
            expressCorpName: value[0].expressCorpName,
            orderStatus: this.props.orderType ? this.props.orderStatus : null,
          })).then((json) => {
            if (json) {
              if (this.props.listLog) {
                this.props.listLog()
              }
              if (this.props.orderType) {
                this.props.orderType(json.orderType)
              }
              message.success('设置快递成功')
              this.props.onOk(value[0])
              this.hideModal()
              this.props.dispatch({
                type: 'search/search',
              })
            } else {
              // message.error('设置快递失败')
            }
          })
          this.setState({
            loading: false,
          })
        }
      }
    }
  }
  render() {
    const { expressList } = this.props.orderDetail
    const { show } = this.props
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    }
    const radioStyleR = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
      color: 'red',
    }
    const radioStyleG = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
      color: 'green',
    }
    return (
      <div>
        <Modal
          title="请选择需要设定的物流(快递)公司"
          visible={show}
          onCancel={this.hideModal}
          onOk={this.handleSubmit}
          maskClosable={false}
          confirmLoading={this.state.loading}
        >
          <Row>
            <RadioGroup onChange={this.onChange} value={this.state.value}>
              {expressList.length ? expressList.map(ele => <Col span={12} key={ele.expressCorpNo}><Radio style={radioStyle} value={ele.expressCorpNo}>{ele.expressCorpName}</Radio></Col>) : null}
              <Col span={24}><Radio key="-1" style={radioStyleR} value={-1}>清空已设快递</Radio></Col>
              <Col span={24}><Radio key="-2" style={radioStyleG} value={-2}>让系统自动计算</Radio></Col>
            </RadioGroup>
          </Row>
          <Row>
            <Col span={12}>
              <Button size="small" type="primary" onClick={this.addToTablist}>绑定物流(快递)公司</Button>
            </Col>
          </Row>
        </Modal>
        <AutCalculate
          show={this.state.autCalculate}
          hideModal={() => { this.setState({ autCalculate: false }) }}
        />
      </div>)
  }
}
