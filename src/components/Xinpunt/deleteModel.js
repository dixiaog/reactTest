import React, { Component } from 'react'
import { Modal, Alert } from 'antd'

class DeleteModel extends Component {
    onOk = () => {
        if (this.props.text === '确认解除绑定吗？') {
            this.props.delshandeldelmode()
        }
        if (this.props.text === '确认删除选中仓位？') {
            this.props.delementnumber()
        }
        if (this.props.text === '请先选择仓位？') {
            this.props.handelshow()
        }
    }
    render() {
        return (
          <Modal cancelText="取消" okText="确定" title="提示" visible={this.props.deletevisible} onCancel={this.props.onCancelDeleteModel} onOk={this.onOk}>
          <Alert
            description={this.props.text}
            type="warning"
            showIcon
            />
          </Modal>
        )
    }
}
export default DeleteModel
