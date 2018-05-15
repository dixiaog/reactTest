import React, { Component } from 'react'
import { Modal, Alert } from 'antd'

export default class Filstemadol extends Component {
state = {

}
onOk = () => {
    this.props.data.Filstetwo()
}
handleCancel = () => {
    this.props.data.Filstetwo()
}

render() {
    return (
      <Modal
        okText="确定"
        cancelText="取消"
        title="提示"
        visible={this.props.data.FilsteMadolvis}
        onCancel={this.handleCancel}
        mask={false}
        maskClosable={false}
        onOk={this.onOk}
      >
      <Alert
        description="刷新商品名成功"
        type="success"
        showIcon
      />
      </Modal>
    )
}
}
