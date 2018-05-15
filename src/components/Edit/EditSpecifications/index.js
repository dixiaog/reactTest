import React, { Component } from 'react'
import { Modal } from 'antd'
// import style from './index.less'

// EditDelete 删除
// EditSpecifications 编辑
class EditSpecifications extends Component {
    render() {
        return (
          <Modal
            visible={this.props.Editattributesvis}
            onOk={this.handleOk}
            width={1200}
            zIndex={1000}
            onCancel={this.props.handelimportTaobohide}
          >
            <h2>请确认删除所有分类,一旦删除,将不可恢复。</h2>
            <h2>请仔细确认</h2>
          </Modal>
        )
    }
}

export default EditSpecifications
