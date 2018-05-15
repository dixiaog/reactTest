/*
 * @Author: jiangteng
 * @Date: 2017-12-24 08:51:54
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-04-26 13:20:28
 * 导入商品
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Upload, message, Button, Icon, Table } from 'antd'
import reqwest from 'reqwest'
import config from '../../../utils/config'
import { getLocalStorageItem } from '../../../utils/utils'

const text = (
  <div>
    <div>导入商品信息的Excel文件,格式请参考下面,其中<span style={{ color: 'red' }}>[商品编码][数量]</span>必须包含</div>
    <div>导入时如果原单据存在对应商品编码的商品资料,忽略该条导入信息</div>
  </div>
)
@connect(state => ({
  goodModal: state.goodModal,
  manager: state.manager,
}))
export default class ImportGood extends Component {
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
        const billNo = this.props.manager.billNo ? this.props.manager.billNo : this.props.billNo
        formData.append('billNo', billNo)
        // You can use any AJAX library you like
        reqwest({
          name: 'file',
          url: `${config.APIV1}/wm/purchase/uploadSku`,
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
              this.props.dispatch({
                type: 'goodModal/fetch',
                payload: { billNo },
              })
              message.success('商品导入成功')
              this.hideModal()
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
    const columns = [{
      title: <div style={{ color: 'red' }}>商品编码</div>,
      dataIndex: 'age',
      key: 'age',
      width: 140,
    }, {
      title: <div style={{ color: 'red' }}>数量</div>,
      dataIndex: 'address',
      key: 'address',
      width: 120,
    },
    {
      title: '单价',
      dataIndex: 'barcode',
      key: 'barcode',
      width: 120,
    }]
    const data = [{
      key: '1',
      age: 'A1235333',
      address: '111',
      category: '类别1',
    }, {
      key: '2',
      age: 'A1235334',
      address: '222',
      category: '类别2',
    }, {
      key: '3',
      age: 'A1235335',
      address: '3333',
      category: '类别3',
    }]
    const { show } = this.props
    const props = {
      onChange: this.onFileChange,
      name: 'file',
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
        width={1000}
        title={text}
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
          <Table
            columns={columns}
            dataSource={data}
            size="middle"
            pagination={false}
            rowKey={record => record.key}
            style={{ marginBottom: 20 }}
          />
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
