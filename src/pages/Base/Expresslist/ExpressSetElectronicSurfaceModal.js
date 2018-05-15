/*
 * @Author: chenjie
 * @Date: 2017-12-26 09:09:21
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-05-03 09:21:01
 * 设定电子面单
 */
import React, { Component } from 'react'
import { Modal, message } from 'antd'
import update from 'immutability-helper'
import ElectronicSurfaceRadioModal from './ElectronicSurfaceRadioModal'
import { checkEmpty } from '../../../utils/utils'
import { expressType } from '../../../services/base/express'

export default class ExpressSetElectronicSurfaceModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      electrices: {},
      electricList: [],
    }
  }
  componentWillReceiveProps(nextProps) {
    const electrices = {}
    if (nextProps.visiable && nextProps.electricList && nextProps.electricList.length) {
      nextProps.electricList.forEach((ele) => {
        Object.assign(electrices, { [ele.expressCorpNo]: { selected: ele.expressType } })
      })
      this.setState({
        electrices,
        electricList: nextProps.electricList,
      })
    }
  }
  handleOk = () => {
    // this.props.addNewExpress(this.state.selected)
    const { electrices } = this.state
    let flag = true
    Object.keys(electrices).forEach((k) => {
      const ele = electrices[k]
      if (ele.selected === 1) {
        if (ele.param && Object.keys(ele.param).length > 0) {
          if (checkEmpty(ele.param.appNo) || checkEmpty(ele.param.appKey)) {
            flag = false
          }
        } else {
          flag = false
        }
      }
    })
    if (!flag) {
      message.error('请检查配置信息是否全部填写')
    } else {
      const list = []
      Object.keys(electrices).forEach((key) => {
        list.push({
          warehouseNo: this.props.warehouseNo,
          expressCorpNo: key,
          expressType: electrices[key].selected,
          ...electrices[key].param,
        })
      })
      this.props.electronicModalHidden()
      expressType({ list }).then((json) => {
        if (json) {
          this.props.dispatch({
            type: 'expresslist/search',
          })
        }
      })
    }
  }
  changeElectricSureface = (electric) => {
    const { electricList } = this.state
    const index = electricList.findIndex(ele => ele.expressCorpNo === Object.keys(electric)[0].toString())
    this.setState(
      update(this.state, {
        electrices: {
          $merge: { ...electric },
        },
        electricList: {
          [index]: {
            $merge: {
              expressType: electric[Object.keys(electric)[0]].selected,
              appKey: electric[Object.keys(electric)[0]].param.appKey,
              appNo: electric[Object.keys(electric)[0]].param.appNo,
            },
          },
        },
      }),
    )
  }
  handleCancel = () => {
    this.props.electronicModalHidden()
    this.setState({
      electricList: [],
    })
  }
  render() {
    const { warehouseName } = this.props
    const { electricList } = this.state
    return (
      <div>
        <Modal
          maskClosable={false}
          title={`${warehouseName}_设置电子面单`}
          visible={this.props.visiable}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
        >
          { electricList.map((ele, i) => <ElectronicSurfaceRadioModal changeElectricSureface={this.changeElectricSureface} key={i} electric={ele} />)}
        </Modal>
      </div>)
  }
}
