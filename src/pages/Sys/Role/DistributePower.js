/*
 * @Author: tanmengjia
 * @Date: 2018-05-16 10:53:38
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-16 13:29:40
 * 分配资源
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Checkbox, Col } from 'antd'
import { getChoosePowers } from '../../../services/system'

const CheckboxGroup = Checkbox.Group
// const FormItem = Form.Item
// const Option = Select.Option

@connect(state => ({
  role: state.role,
}))
// @Form.create()
export default class AddRoles extends Component {
  constructor(props) {
    super(props)
    this.state = {
      choosePower: [],
      names: [],
    }
  }
  componentWillMount() {
    const { tabList } = this.props.global
    this.setState({
      names: tabList,
    })
    if (this.props.record) {
      getChoosePowers(this.props.record.autoNo).then((json) => {
        if (json) {
          this.setState({
            choosePower: json,
          })
        }
      })
    }
  }
  handleSubmit = () => {
    console.log('ok', this.state.choosePower)
  }

  hideModal = () => {
    this.props.hideModal()
  }
  choosePower = (e) => {
    this.setState({
      choosePower: e,
    })
  }
  render() {
    const { powerVisible } = this.props
    return (
      <div>
        <Modal
          title="资源分配"
          visible={powerVisible}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          maskClosable={false}
        >
          <CheckboxGroup style={{ width: '100%' }} onChange={this.choosePower} value={this.state.choosePower}>
          {this.state.names && this.state.names.length && this.state.names.map((ele) => {
            return (
              <Col span={8} key={ele.key}><Checkbox value={ele.key} >{ele.tab}</Checkbox></Col>
            )
          })}
          </CheckboxGroup>
        </Modal>
      </div>
    )
  }
}

