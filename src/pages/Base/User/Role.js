import React, { Component } from 'react'
import { Modal } from 'antd'

export default class Role extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
    }
  }
  handleSubmit = () => {
    console.log('确定')
  }

  hideModal = () => {
    this.props.hideModal()
  }
  render() {
    return (
      <div>
        <Modal
          title="角色分配"
          visible={this.props.show}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          maskClosable={false}
          confirmLoading={this.state.confirmLoading}
        >

        </Modal>
      </div>
    )
  }
}
