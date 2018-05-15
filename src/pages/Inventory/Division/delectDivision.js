import React, { Component } from 'react'
import { Modal, Alert } from 'antd'

class Delect extends Component {
    render() {
        return (
          <Modal
            okText="确定"
            cancelText="取消"
            title="提示"
            visible={this.props.data.Delectvis} onCancel={this.props.data.delectskunoone} onOk={this.props.data.delectskuno}>
            <Alert
              description="确定清除0库存资料吗？"
              type="warning"
              showIcon
            />
          </Modal>
        )
    }
}
export default Delect
