import React, { Component } from 'react'
import { Modal, Alert } from 'antd'

export default class DelectList extends Component {
state = {

}
onOk = () => {
    this.props.data.delect(this.props.data.delectselectedRows)
}
handleCancel = () => {
    this.props.data.delecttwo()
}

render() {
    return (
      <Modal
        okText="确定"
        cancelText="取消"
        title="提示"
        visible={this.props.data.DelectListvis}
        onCancel={this.handleCancel}
        mask={false}
        maskClosable={false}
        onOk={this.onOk}
      >
        <Alert message="请确认是否删除，一旦删除不可恢复" type="warning" showIcon />
      </Modal>
    )
}
}
