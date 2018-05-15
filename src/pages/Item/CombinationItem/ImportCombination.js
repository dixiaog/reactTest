/*
 * @Author: tanmengjia
 * @Date: 2017-12-28 09:08:03
 * @Last Modified by: tanmengjia
 * 导入组合商品
 * @Last Modified time: 2018-03-14 15:45:02
 */
import React, { Component } from 'react'
import { Modal, Form, Col, Button, Table, Alert, Radio, Icon, Upload, message } from 'antd'
import reqwest from 'reqwest'
import { getLocalStorageItem } from '../../../utils/utils'
import config from '../../../utils/config'

const RadioGroup = Radio.Group


const skuNo = (
  <div style={{ color: 'red' }}>
    组合商品编号
  </div>
)
const productName = (
  <div style={{ color: 'red' }}>
    组合商品名称
  </div>
)
const skus = (
  <div style={{ color: 'red' }}>
    子商品编码
  </div>
  )
const standardBoxing = (
  <div style={{ color: 'red' }}>
    数量
  </div>
)
const retailPrice = (
  <div style={{ color: 'red' }}>
    应占售价
  </div>
)
const productNo = (
  <div style={{ color: 'red' }}>
    组合款式编码
  </div>
)
const columns = [{
  title: (productNo),
    dataIndex: 'productNo',
    key: 'productNo',
    width: 100,
  }, {
    title: (skuNo),
    dataIndex: 'skuNo',
    key: 'skuNo',
    width: 100,
  }, {
    title: (productName),
    dataIndex: 'productName',
    key: 'productName',
    width: 100,
  }, {
    title: '组合商品简称',
    dataIndex: 'shortName',
    key: 'shortName',
    width: 100,
  }, {
    title: (skus),
    dataIndex: 'skus',
    key: 'skus',
    width: 100,
  }, {
    title: (standardBoxing),
    dataIndex: 'standardBoxing',
    key: 'standardBoxing',
    width: 100,
  }, {
    title: (retailPrice),
    dataIndex: 'retailPrice',
    key: 'retailPrice',
    width: 100,
  }, {
    title: '颜色及规格',
    dataIndex: 'productSpec',
    key: 'productSpec',
    width: 100,
  }]

@Form.create()
export default class ImportCombination extends Component {
    constructor(props) {
        super(props)
        this.state = {
        fileList: [],
        loading: false,
        data: [{
          productNo: 'B12353S2',
          skuNo: 'A12353S2',
          productName: '衬衣+西裤',
          shortName: '时尚男装',
          skus: 'A13140',
          standardBoxing: 20,
          retailPrice: 800,
          productSpec: '亮黑',
        }],
        value: 0,
        importModalVisiable: false,
        }
      }
  // 文件上传列表改变
  onFileChange = () => {
    this.setState({
      importModalVisiable: false,
    })
  }
    handleOk = () => {
      if (this.state.fileList.length === 0) {
        this.setState({
          importModalVisiable: true,
        })
      } else {
        // 激活按钮加载状态
        this.setState({ loading: true })
        const { fileList } = this.state
        const formData = new FormData()
        fileList.forEach((file) => {
          formData.append('fileList', file)
        })
        formData.append('value', this.state.value)
        // You can use any AJAX library you like
        reqwest({
          url: `${config.APIV1}/prodm/combo/upload`,
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
      this.setState({
          fileList: [],
          loading: false,
      })
    }
  render() {
    const onChange = (e) => {
        this.setState({
          value: e.target.value,
        })
      }
    const description = (
      <div>
        <div>导入商品信息的Excel文件，格式请参照下面，其中<a style={{ color: 'red' }}>红色标题</a>必须包含.</div>
        <div>导入时如果存在对应组合商品编码的商品资料，则
          <RadioGroup value={this.state.value} onChange={onChange}>
            <Radio value={0}>忽略</Radio>
            <Radio value={1}>覆盖</Radio>
          </RadioGroup>
          ，没有则增加新的记录.
        </div>
        <div>商品编码在普通商品资料中必须已经存在.</div>
      </div>
    )
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
      <div>
        <Modal
          maskClosable={false}
          title="导入组合商品"
          visible={this.props.importModalVisiable}
          onCancel={this.handleCancel}
          width="1000px"
          footer={[
            <Button key="back" onClick={this.handleCancel}>取消</Button>,
            <Button key="submit" type="primary" loading={this.state.loading} onClick={this.handleOk}>
                上传文件
            </Button>,
          ]}
        >
          <Alert
            description={description}
            type="info"
            showIcon
          />
          <br />
          <Table columns={columns} pagination={false} dataSource={this.state.data} />
          <br />
          <div>
            <Col span={1}><div style={{ marginTop: '5px' }}>标题：</div></Col>
            <Upload {...props} onChange={this.onFileChange}>
              <Button size="small">
                <Icon type="upload" /> 上传文件
              </Button>
            </Upload>
          </div>
          <Col span={1}><div /></Col>
          <div style={{ color: '#AAAAAA' }}>支持扩展名：.xls..</div>
          <Col span={1}><div /></Col>
          {this.state.importModalVisiable ? <div style={{ color: 'red' }}>请选择上传文件</div> : ''}
        </Modal>
      </div>
    )
  }
}
