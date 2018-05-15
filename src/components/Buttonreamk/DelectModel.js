import React, { Component } from 'react'
import { Modal, Alert } from 'antd'
import { delectAllCategory } from '../../services/category/category'

class DelectModel extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    handleOk = () => {
        // this.props.data.Lockmodeltwo()
        delectAllCategory({}).then((json) => {
            if (json === null) {
                console.log('删除失败')
            } else {
                this.props.data.DelectModeltwo()
            }
          })
    }
    handleCancel = () => {
        // this.props.data.Lockmodeltwo()
    }
    render() {
      return (
        <div>
          <Modal
            title="警告"
            visible={this.props.data.DelectModelvis}
            onOk={this.handleOk}
            maskClosable={false}
            onCancel={this.props.data.DelectModeltwo}
          >
            <Alert message="请确认是否清空所有分类(清空后数据将无法恢复)" type="warning" showIcon />
          </Modal>
        </div>
      )
    }
}
export default DelectModel
