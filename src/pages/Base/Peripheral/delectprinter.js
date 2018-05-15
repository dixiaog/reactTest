import React, { Component } from 'react'
import { Modal, Alert } from 'antd'

class Delect extends Component {
    render() {
        return (
          <Modal
            title="提示"
            okText="确定"
            cancelText="取消"
            maskClosable={false}
            visible={this.props.data.delectvis}
            onCancel={this.props.data.deletemadeltwo}
            onOk={this.props.data.delect.bind(this, this.props.data.selectedRowssss)}
          >
            <Alert
              description="确定删除选中打印机吗？"
              type="warning"
              showIcon
            />
          </Modal>
        )
    }
}
export default Delect
