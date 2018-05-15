/*
 * @Author: tanmengjia
 * @Date: 2017-12-26 14:57:18
 * @Last Modified by: tanmengjia
 * 导入商品资料
 * @Last Modified time: 2018-04-19 09:54:59
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Form, Modal, Upload, message, Icon, Table } from 'antd'
import reqwest from 'reqwest'
import config from '../../../utils/config'
import { getLocalStorageItem } from '../../../utils/utils'

@connect(state => ({
  commonItemImport: state.commonItemImport,
}))
@Form.create()
export default class CommonItemImport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            importItemVisiable: false,
            loading: false,
            fileList: [],
            data: [{
              productNo: 'B12353S2',
              skuNo: 'A12353S2',
              standardNo: 'C12353S2',
              productName: '衬衣+西裤',
              shortName: '时尚男装',
              skus: 'A13140',
              location: '仓库1',
              costPrice: 300,
              standardBoxing: 20,
              referWeight: 10,
              retailPrice: 799,
              productSpec: '亮黑',
              brandName: '雪中飞',
              tagPrice: 800,
              inventorySync: '是',
              categoryNo: '羽绒服',
            }],
        }
      }
      onFileChange = () => {
        this.setState({
          importItemVisiable: false,
        })
      }
      handleOk = () => {
        if (this.state.fileList.length === 0) {
          this.setState({
            importItemVisiable: true,
          })
        } else {
          // 激活按钮加载状态
          this.setState({ loading: true })
          const { fileList } = this.state
          const formData = new FormData()
          fileList.forEach((file) => {
            formData.append('fileList', file)
          })
          // You can use any AJAX library you like
          reqwest({
            url: `${config.APIV1}/prodm/ceneralsku/upload`,
            headers: {
              'Authorization': `Basic ${getLocalStorageItem('token')}`,
              'CompanyNo': `${getLocalStorageItem('companyNo')}`,
              'UserNo': `${getLocalStorageItem('userNo')}`,
            },
            method: 'post',
            processData: false,
            data: formData,
            success: (json) => {
              if (json.success) {
                this.setState({
                  fileList: [],
                })
                message.success('上传成功')
                this.setState({ loading: false })
                this.props.form.resetFields()
                this.props.itemModalHidden()
                this.props.dispatch({
                  type: 'commonItem/search',
                })
              } else {
                message.error(json.errorMessage)
                this.setState({ loading: false, fileList: [] })
              }
            },
          })
        }
      }
      handleCancel = () => {
        this.props.form.resetFields()
        this.props.itemModalHidden()
        this.setState({ loading: false, fileList: [] })
      }
  render() {
    const skuNos = (
      <div style={{ color: 'red' }}>
        商品编码
      </div>
      )
    const productNames = (
      <div style={{ color: 'red' }}>
        商品名
      </div>
      )
    const retailPrices = (
      <div style={{ color: 'red' }}>
        基本售价
      </div>
      )
      const productNoa = (
        <div style={{ color: 'red' }}>
          款式编码
        </div>
        )
    const columns = [{
      title: (productNoa),
      dataIndex: 'productNo',
      key: 'productNo',
      width: 100,
    }, {
      title: (skuNos),
      dataIndex: 'skuNo',
      key: 'skuNo',
      width: 100,
    }, {
      title: '国际码',
      dataIndex: 'standardNo',
      key: 'standardNo',
      width: 100,
    }, {
      title: (productNames),
      dataIndex: 'productName',
      key: 'productName',
      width: 100,
    }, {
      title: '商品简称',
      dataIndex: 'shortName',
      key: 'shortName',
      width: 100,
    }, {
      title: '颜色及规格',
      dataIndex: 'productSpec',
      key: 'productSpec',
      width: 100,
    }, {
      title: (retailPrices),
      dataIndex: 'retailPrice',
      key: 'retailPrice',
      width: 100,
    }, {
      title: '成本价',
      dataIndex: 'costPrice',
      key: 'costPrice',
      width: 100,
    }, {
      title: '重量',
      dataIndex: 'referWeight',
      key: 'referWeight',
      width: 100,
    }, {
      title: '仓位',
      dataIndex: 'location',
      key: 'location',
      width: 100,
    }, {
      title: '品牌',
      dataIndex: 'brandName',
      key: 'brandName',
      width: 100,
    }, {
      title: '市场价',
      dataIndex: 'tagPrice',
      key: 'tagPrice',
      width: 100,
    }, {
      title: '同步库存',
      dataIndex: 'inventorySync',
      key: 'inventorySync',
      width: 100,
    }]
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
      <Modal
        maskClosable={false}
        title="导入商品信息"
        visible={this.props.importItemVisiable}
        onCancel={this.handleCancel}
        width="1000px"
        footer={[
          <Button key="back" onClick={this.handleCancel}>取消</Button>,
          <Button key="submit" type="primary" loading={this.state.loading} onClick={this.handleOk}>
              上传文件
          </Button>,
        ]}
      >
        <div>
          <div>
            <div>导入商品信息的Excel文件，格式请参照下面，其中[商品编码，商品名称，基本售价]必须包含.</div>
            <div>导入时如果存在对应商品编码的商品资料，则覆盖，没有则增加新的记录.</div>
            <div>覆盖时，如果导入的文件中没有指定，则不会覆盖该列，仓位为空的不会覆盖已有仓位.</div>
          </div>
          <br />
          <br />
          <br />
          <Table columns={columns} pagination={false} dataSource={this.state.data} bordered />
          <br />
          <Upload {...props}>
            <Button>
              <Icon type="upload" /> 上传文件
            </Button>
          </Upload>
        </div>
        <div style={{ marginTop: 8 }}>支持扩展名:xlsx</div>
        {this.state.importItemVisiable ? <div style={{ color: 'red' }}>请选择上传文件</div> : ''}
      </Modal>
    )
  }
}
