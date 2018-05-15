import React, { Component } from 'react'
import { Modal, Alert } from 'antd'

class Delect extends Component {
    render() {
        return (
          <Modal
            title="提示"
            visible={this.props.data.visible}
            onCancel={this.props.data.deletemadeltwo}
            confirmLoading={this.props.data.confirmLoading}
            onOk={this.props.data.deletemadel}
            cancelText="取消"
            okText="确定"
          >
            <Alert
              description="确定删除选中仓位吗？"
              type="warning"
              showIcon
            />
          </Modal>
        )
    }
}
export default Delect
