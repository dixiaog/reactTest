import React, { Component } from 'react'
import { Modal } from 'antd'

// EditDelete 删除
// EditSpecifications 编辑
class EditDelete extends Component {
    render() {
        return (
          <Modal
            visible={this.props.Editvis}
            onOk={this.handleOk}
            width={1200}
            onCancel={this.props.handelimportTaobohide}
          >
            <h2>请确认删除所有分类,一旦删除,将不可恢复。</h2>
            <h2>请仔细确认</h2>
          </Modal>
        )
    }
}

export default EditDelete
