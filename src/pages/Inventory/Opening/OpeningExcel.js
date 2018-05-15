/*
 * @Author: wupeng
 * @Date: 2017-12-27 14:37:21
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-03-31 14:05:01
 * 导入期初库存
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Upload, message, Button, Icon, Table, Alert } from 'antd'
import reqwest from 'reqwest'
// import styles from './index.less'
import { getLocalStorageItem } from '../../../utils/utils'
import config from '../../../utils/config'

@connect(state => ({
    deialsmodal: state.deialsmodal,
  }))
@Form.create()
export default class OpeningExcel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileList: [],
      visible: false,
    }
  }
  componentWillMount() {
    this.setState({
      visible: this.props.data.OpeningExcelvis,
    })
  }

  handleOk = () => {
    this.handleSubmit()
  }
  handleCancel = () => {
    this.props.form.resetFields()
    this.setState({
      fileList: [],
      visible: false,
  })
  this.props.data.OpeningExceltwo()
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
      formData.append('billNo', this.props.data.billNo)
      reqwest({
        url: `${config.APIV1}/wm/WmInitInventory/upload`,
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
            // this.props.form.resetFields()
            this.props.data.OpeningExceltwo()
          } else {
            message.error(data.errorMessage)
            this.setState({ loading: false, fileList: [] })
            // this.props.form.resetFields()
          }
        },
      })
    }
  }

  render() {
    const importColumns = [{
      title: <div style={{ color: 'red' }}>商品编码</div>,
      dataIndex: 'skuNo',
    }, {
      title: <div style={{ color: 'red' }}>仓位</div>,
      dataIndex: 'locationNo',
    }, {
      title: <div style={{ color: 'red' }}>数量</div>,
      dataIndex: 'billNum',
    }, {
      title: <div style={{ color: 'red' }}>成本价</div>,
      dataIndex: 'costPrice',
    },
]
// 供应商名	供应商分类	联系人	联系地址	电话	手机	旺旺	传真	开户银行	银行账户	备注
// supplierName classifyNo address contacts telNo mobileNo alitmNo faxNo bankName bankAccount remark
    const importData = [{
      key: '1',
      skuNo: 'A12343S1',
      locationNo: 'A-1-1-1-1',
      billNum: '100',
      costPrice: '129.9',
    }, {
        key: '2',
        skuNo: 'A12343S2',
        locationNo: 'A-1-1-1-1',
        billNum: '101',
        costPrice: '129.9',
      },
    ]

    const props = {
      action: '//jsonplaceholder.typicode.com/posts/',
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
          title="导入期初库存"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          mask={false}
          bodyStyle={{ overflowX: 'hidden' }}
          width={750}
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
              导入商品信息的Excel文件，格式请参照下面,务必按标准文件格式编辑，如果商品编码全部为数字请注意在<br />
              excel中对编码列设定为文本格式，否则可能不正确
              </p>
            }
            type="info"
            showIcon
          />
          <Table columns={importColumns} dataSource={importData} pagination={false} />
          <Upload {...props} onChange={this.onFileChange}>
            <br />
            <Button>
              <Icon type="upload" /> 上传文件
            </Button>
          </Upload>
        </Modal>
      </div>
    )
  }
}
