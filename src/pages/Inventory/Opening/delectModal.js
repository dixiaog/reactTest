import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Alert } from 'antd'
// import { delete } from '../../../services/opening/opening'

@connect(state => ({
    opening: state.opening,
  }))
export default class DelectModal extends Component {
    state = {
    }
    handleCancel = () => {
      this.props.data.onDelectModalvisone()
    }
    onOk = () => {
      // delete({}).then((json) => {
        // console.log(json)
      // })
      // this.props.data.delectnumer
    }
render() {
  const delect = [`请确认是否${this.props.data.text}，一旦${this.props.data.text}不可恢复`]
    return (
      <Modal
        visible={this.props.data.DelectModalvis}
        onCancel={this.handleCancel}
        onOk={this.onOk}
      >
        <Alert message={delect} type="warning" showIcon />
      </Modal>
    )
}
}
