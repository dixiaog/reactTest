/*
 * @Author: Wupeng
 * @Date: 2017-1-2 10:04:11
 * @Last Modified by;
 * 商品类目按钮
 * @Last Modified time:
 */
import React, { Component } from 'react'
import { Modal, Alert } from 'antd'

class Remaxe extends Component {
    handleOk = () => {
       this.props.data.Remaxeone(this.props.data.value)
      }
      handleCancel = () => {
        this.props.data.Remaxetwo()
      }
    render() {
        return (
          <Modal
            title={`${(this.props.data.handle === 1) ? '提示' : '警告'}`}
            visible={this.props.data.Remaxevis}
            onOk={this.handleOk}
            cancelText="取消"
            okText="确定"
            maskClosable={false}
            onCancel={this.handleCancel}
          >
            <Alert
              message={`${(this.props.data.handle === 1) ? '是否启用以下类目' : '是否禁用以下类目'}`}
              description={`${this.props.data.text}`}
              type={(this.props.data.handle === 1) ? 'success' : 'error'}
            />
          </Modal>
        )
    }
}
export default Remaxe
