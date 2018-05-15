import React, { Component } from 'react'
import { Modal } from 'antd'

export default class Positiondelect extends Component {
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
        title="提示"
        visible={this.props.data.Positiondelectvis}
        onCancel={this.handleCancel}
        mask={false}
        maskClosable={false}
        onOk={this.onOk}
      >
        <p style={{ lineHeight: 2 }}>是否清楚现有库存</p>
      </Modal>
    )
}
}
