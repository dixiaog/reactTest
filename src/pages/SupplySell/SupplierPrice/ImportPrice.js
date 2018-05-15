/*
 * @Author: jiangteng
 * @Date: 2017-12-24 08:51:54
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-04-03 21:01:23
 * 导入更新价
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Upload, message, Button, Icon, Table } from 'antd'
import reqwest from 'reqwest'
import config from '../../../utils/config'
import { getLocalStorageItem } from '../../../utils/utils'
import { downloadTemplate } from '../../../services/supplySell/supplierPrice'

@connect(state => ({
  supplierPrice: state.supplierPrice,
}))
export default class ImportPrice extends Component {
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
  // 下载模板
  download = () => {
    downloadTemplate()
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
          url: `${config.APIV1}/dm/priceDiscount/ImportDB`,
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
                type: 'supplierPrice/search',
              })
              message.success('导入成功')
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
      title: '吊牌价',
      dataIndex: 'address',
      key: 'address',
      width: 120,
    },
    {
      title: '1级供销价格',
      dataIndex: 'barcode',
      key: 'barcode',
      width: 120,
    }, {
      title: '2级供销价格',
      dataIndex: 'goodName',
      key: 'goodName',
      width: 120,
    }, {
      title: '3级供销价格',
      dataIndex: 'skuAttr',
      key: 'skuAttr',
      width: 120,
    }, {
      title: '4级供销价格',
      dataIndex: 'spec',
      key: 'spec',
      width: 120,
    }, {
      title: '5级供销价格',
      dataIndex: 'sale',
      key: 'sale',
      width: 120,
    }, {
      title: '1级分销管控价格',
      dataIndex: 'price',
      key: 'price',
      width: 120,
    }, {
      title: '2级分销管控价格',
      dataIndex: 'cost',
      key: 'cost',
      width: 120,
    }, {
      title: '3级分销管控价格',
      dataIndex: 'weight',
      key: 'weight',
      width: 120,
    }, {
      title: '4级分销管控价格',
      dataIndex: 'supplierSkuNo',
      key: 'supplierSkuNo',
      width: 120,
    }, {
      title: '5级分销管控价格',
      dataIndex: 'remark',
      key: 'remark',
      width: 120,
    }]
    const data = [{
      key: '1',
      age: 'A1235333',
      address: '12.33',
      category: '类别1',
    }, {
      key: '2',
      age: 'A1235334',
      address: '12.33',
      category: '类别2',
    }, {
      key: '3',
      age: 'A1235335',
      address: '12.33',
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
        title={
          <div>
            <div>导入商品信息的Excel文件,格式请参考下面,其中<span style={{ color: 'red' }}>[商品编码]</span>必须包含<a onClick={this.download}>"导入更新价格模板"(点击下载)</a></div>
            <div>导入时如果存在对应商品编码的商品资料,则更新对应的列,没有则不处理.</div>
            <div>如果导入的文件中没有指定对应列,则不会覆盖该列.</div>
          </div>
        }
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
