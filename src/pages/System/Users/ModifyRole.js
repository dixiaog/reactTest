/*
 * @Author: jiangteng
 * @Date: 2017-12-24 08:51:54
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-03-20 14:04:50
 * 批量修改角色
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Checkbox, Modal } from 'antd'
import { modifyRole } from '../../../services/system'

const CheckboxGroup = Checkbox.Group

@connect(state => ({
  users: state.users,
}))
export default class ModifyRole extends Component {
  constructor(props) {
    super(props)
    this.state = {
        systemList: [],
        defineList: [],
        init: false,
        confirmLoading: false,
    }
  }

   // 勾选修改自定义角色
   onChange = (e) => {
    this.setState({
      defineList: e,
      systemList: [],
    })
  }

  // 勾选修改系统角色
  onChangeSys = (e) => {
    this.setState({
      systemList: e,
    })
  }

  // 关闭弹窗
  hideModal = () => {
    const { hideModal } = this.props
    hideModal()
  }

  // 确认
  okHandler = () => {
    // 没有选中角色
    if (this.state.systemList.length === 0 && this.state.defineList.length === 0) {
      this.setState({
          init: true,
      })
    } else {
      this.setState({
          init: false,
      })
      // 处理数据
      const { sysRole, defRole, selectedRowKeys } = this.props.users
      const systemNo = []
      const defineNo = []
      this.state.systemList.forEach((ele) => {
        for (const t in sysRole) {
          if (sysRole[t].label === ele) {
            systemNo.push(sysRole[t].value)
            break
          }
        }
      })
      this.state.defineList.forEach((ele) => {
        for (const t in defRole) {
          if (defRole[t].label === ele) {
            defineNo.push(defRole[t].value)
            break
          }
        }
      })
      const flag = this.state.systemList.length ? 'systemRoles' : 'defineRoles'
      const data = this.state.systemList.length ? systemNo.toString() : defineNo.toString()
      // 请求接口
      const values = {}
      Object.assign(values, { [flag]: data, userId: selectedRowKeys })
      this.setState({
        confirmLoading: true,
      })
      modifyRole(values).then((json) => {
        if (json) {
          this.setState({
            confirmLoading: false,
          })
          this.hideModal()
          this.props.dispatch({
            type: 'users/search',
          })
        } else {
          this.setState({
            confirmLoading: false,
          })
        }
      })
    }
  }

  render() {
    const { sysRole, defRole } = this.props.users
    const { show } = this.props
    return (
      <Modal
        title="批量修改角色"
        visible={show}
        onOk={this.okHandler}
        onCancel={this.hideModal}
        confirmLoading={this.state.confirmLoading}
        maskClosable={false}
      >
        <div>
          <div style={{ marginTop: '5px', marginBottom: '5px', fontWeight: 'bold' }}>系统用户:</div>
          <CheckboxGroup disabled={this.state.defineList.length ? true : false} value={this.state.systemList} onChange={this.onChangeSys}>
            { sysRole.length ? sysRole.map((ele, index) => { return <Checkbox style={{ margin: '5px' }} value={ele.label} key={index} title={String(ele.value)}>{ele.label}</Checkbox> }) : '' }
          </CheckboxGroup>
          <div style={{ marginTop: '5px', marginBottom: '5px', fontWeight: 'bold' }}>自定义用户:</div>
          <CheckboxGroup value={this.state.defineList} onChange={this.onChange}>
            { defRole ? defRole.map((ele, index) => { return <Checkbox style={{ margin: '5px' }} value={ele.label} key={index} title={String(ele.value)}>{ele.label}</Checkbox> }) : '' }
          </CheckboxGroup>
        </div>
        {this.state.systemList.length === 0 && this.state.defineList.length === 0 && this.state.init ? <div style={{ color: 'red' }}>至少选择一个角色</div> : ''}
      </Modal>
    )
  }
}
