/*
 * @Author: jiangteng
 * @Date: 2017-12-24 08:51:54
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-04-03 20:57:22
 * 导入用户
 */

import React, { Component } from 'react'
import { Modal, Upload, message, Button, Icon } from 'antd'
import reqwest from 'reqwest'
import config from '../../../utils/config'
import { getLocalStorageItem } from '../../../utils/utils'

class ImportUser extends Component {
  constructor(props) {
    super(props)
    this.state = {
        fileList: [],
        importUser: false,
        loading: false,
    }
  }

  // 文件上传列表改变
  onFileChange = () => {
    this.setState({
      importUser: false,
    })
  }

  // 确认上传文件
  handleUpload = () => {
    if (this.state.fileList.length === 0) {
      this.setState({
        importUser: true,
      })
    } else {
        // 激活按钮加载状态
        this.setState({ loading: true })
        const { fileList } = this.state
        const formData = new FormData()
        fileList.forEach((fileL) => {
          formData.append('file', fileL)
        })
        reqwest({
          name: 'file',
          url: `${config.APIV1}/sym/user/uploadUser`,
          method: 'post',
          headers: {
            'authorization': `Basic ${getLocalStorageItem('token')}`,
            'CompanyNo': `${getLocalStorageItem('companyNo')}`,
            'UserNo': `${getLocalStorageItem('userNo')}`,
          },
          processData: false,
          data: formData,
          success: (json) => {
            if (json.success) {
              this.setState({
                fileList: [],
              })
              message.success('用户导入成功')
            } else {
              this.setState({
                fileList: [],
              })
              message.error(json.errorMessage)
            }
            this.setState({ loading: false })
          },
          error: () => {
            this.setState({ loading: false })
          },
        })
    }
  }

  // 关闭弹窗
  hideModal = () => {
    this.setState({
        fileList: [],
        importUser: false,
    })
    const { hideModal } = this.props
    hideModal()
  }

  render() {
    const { show } = this.props
    const props = {
      onChange: this.onFileChange,
      name: 'file',
      action: `${config.APIV1}/sym/user/uploadUser`,
      onRemove: (file) => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file)
          const newFileList = fileList.slice()
          newFileList.splice(index, 1)
          return {
            fileList: newFileList,
          }
        })
      },

      beforeUpload: (file) => {
        const isXLSX = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel'
        if (!isXLSX) {
            message.error('只能上传xlsx和xls文件')
        } else {
            this.setState(({ fileList }) => ({
                fileList: [file],
            }))
        }
        return false
      },
      fileList: this.state.fileList,
    }
    return (
      <Modal
        title="用户导入"
        visible={show}
        onOk={this.handleUpload}
        onCancel={this.hideModal}
        maskClosable={false}
        footer={[
          <Button key="back" onClick={this.hideModal}>取消</Button>,
          <Button key="submit" type="primary" loading={this.state.loading} onClick={this.handleUpload}>
              上传文件
          </Button>,
        ]}
      >
        <div>
          <Upload {...props}>
            <Button>
              <Icon type="upload" /> 上传文件
            </Button>
          </Upload>
        </div>
        <div style={{ marginTop: 8 }}>支持扩展名:xlsx</div>
        {this.state.importUser ? <div style={{ color: 'red' }}>请选择上传文件</div> : ''}
      </Modal>
    )
  }
}

export default ImportUser

