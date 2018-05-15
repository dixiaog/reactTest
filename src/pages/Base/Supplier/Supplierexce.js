/*
 * @Author: wupeng
 * @Date: 2017-12-27 14:37:21
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-27 17:02:44
 * 导入商品库容信息
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Table, Upload, message, Button, Icon, Alert } from 'antd'
import reqwest from 'reqwest'
// import styles from './index.less'
import { getLocalStorageItem } from '../../../utils/utils'
import config from '../../../utils/config'

@connect(state => ({
  supplier: state.supplier,
}))
@Form.create()
export default class Supplierexce extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileList: [],
      visible: false,
    }
  }
  componentWillReceiveProps(nextProps) {
      if (nextProps.supplierIm.supplierImportvisble) {
        this.setState({
          visible: nextProps.supplierIm.supplierImportvisble,
        })
      }
  }

  handleOk = () => {
    this.handleSubmit()
    this.props.supplierIm.supplierIndex()
  }
  handleCancel = () => {
    this.props.form.resetFields()
    this.setState({
      fileList: [],
      visible: false,
  })
  this.props.supplierIm.supplierIndex()
  }
  handleSubmit = () => {
    if (this.state.fileList.length !== 0) {
      // 激活按钮加载状态
      this.setState({ loading: true })
      const { fileList } = this.state
      const formData = new FormData()
      fileList.forEach((file) => {
        formData.append('fileList', file)
      })
      formData.append('value', this.state.value)
      reqwest({
        url: `${config.APIV1}/dm/bdsupplier/upload`,
        headers: {
          'Authorization': `Basic ${getLocalStorageItem('token')}`,
          'CompanyNo': `${getLocalStorageItem('companyNo')}`,
          'UserNo': `${getLocalStorageItem('userNo')}`,
        },
        method: 'post',
        processData: false,
        data: formData,
        success: (data) => {
          if (data.data) {
            this.setState({
              fileList: [],
            })
            message.success(data.errorMessage)
            this.setState({
              loading: false,
              visible: false,
            })
            this.props.form.resetFields()
            this.props.dispatch({
              type: 'supplier/fetch',
              })
          } else {
            message.error(data.errorMessage)
            this.setState({ loading: false, fileList: [] })
            this.props.form.resetFields()
          }
        },
      })
    }
  }

  render() {
    const importColumns = [{
      title: <div style={{ color: 'red' }}>供应商名</div>,
      dataIndex: 'supplierName',
      width: 80,
    }, {
      title: '供应商分类',
      dataIndex: 'classifyNo',
      width: 90,
    }, {
      title: '联系人',
      dataIndex: 'contacts',
      width: 80,
    }, {
      title: '联系地址',
      dataIndex: 'address',
      width: 80,
    }, {
      title: '电话',
      dataIndex: 'telNo',
      width: 50,
    }, {
      title: '手机',
      dataIndex: 'mobileNo',
      width: 50,
    }, {
      title: '旺旺',
      dataIndex: 'alitmNo',
      width: 50,
    }, {
      title: '传真',
      dataIndex: 'faxNo',
      width: 50,
    }, {
      title: '开户银行',
      dataIndex: 'bankName',
      width: 80,
    }, {
      title: '银行账户',
      dataIndex: 'bankAccount',
      width: 80,
    }, {
      title: '备注',
      dataIndex: 'remark',
      width: 50,
    },
    ]
// 供应商名	供应商分类	联系人	联系地址	电话	手机	旺旺	传真	开户银行	银行账户	备注
// supplierName classifyNo address contacts telNo mobileNo alitmNo faxNo bankName bankAccount remark
    const importData = [{
      key: '1',
      supplierName: '张三',
      classifyNo: 1,
      contacts: '李四',
      address: '白茆',
      bankName: '建设银行',
      remark: '备注',
    }, {
      key: '2',
      supplierName: '授田',
      classifyNo: 1,
      contacts: '李四',
      address: '白茆',
      bankName: '建设银行',
      remark: '备注',
    },
    ]

    const props = {
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
        } else if (this.state.fileList.length === 1) {
          message.warning('一次只能上传一个文件')
        } else {
          this.setState(({ fileList }) => ({
            fileList: [...fileList, file],
          }))
        }
        return false
      },
      fileList: this.state.fileList,
    }

    return (
      <div>
        <Modal
          maskClosable={false}
          title="导入新的供应商"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          bodyStyle={{ overflowX: 'hidden' }}
          width={880}
          footer={[
            <Button key="back" onClick={this.handleCancel}>取消</Button>,
            <Button key="submit" type="primary" loading={this.state.loading} onClick={this.handleOk}>
                上传文件
            </Button>,
          ]}
        >
          <Alert
            description={
              <p>
              导入供应商信息的 Excel 文件，格式请参照下面，
              其中[供应商名]必须包含。<br />
                {/* 导入时如果原单据存在对应<span style={{ color: 'red' }}>[供应商名]</span>的资料，则更新其他列，
              不存在的供应商则新建供应商信息。<br /> */}
              EXCEL的列请设置为文本格式，不然可能会出现类型转换错误的问题
              </p>
              }
            type="info"
            showIcon
          />
          <Table columns={importColumns} dataSource={importData} pagination={false} />
          <br />
          <Upload {...props} onChange={this.onFileChange}>
            <Button>
              <Icon type="upload" /> 上传文件
            </Button>
          </Upload>
        </Modal>
      </div>
    )
  }
}
