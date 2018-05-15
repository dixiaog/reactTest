/*
 * @Author: tanmengjia
 * @Date: 2018-01-27 08:58:27
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-04 13:19:10
 * 特殊价格策略子商品导入
 */
import React, { Component } from 'react'
// import { connect } from 'dva'
import { Modal, Form, Col, Button, Table, Alert, Radio, Icon, Upload, message } from 'antd'
import reqwest from 'reqwest'
import { getLocalStorageItem } from '../../../utils/utils'
import config from '../../../utils/config'

const RadioGroup = Radio.Group

@Form.create()
export default class ImportCombination extends Component {
    constructor(props) {
        super(props)
        this.state = {
        fileList: [],
        loading: false,
        data: [{
          skuNo: 'R123AX10',
          productNo: 'R123BX10',
          specifyPrice: 800,
        }, {
          skuNo: 'R123AX11',
          productNo: 'R123BX10',
          specifyPrice: 850,
        }],
        value: 'N',
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
        formData.append('importValue', this.state.value)
        formData.append('strategyNo', this.props.strategyNo)
        formData.append('specifyType', this.props.specifyType)
        // You can use any AJAX library you like
        reqwest({
          url: `${config.APIV1}/dm/priceStrategy/ImportDB`,
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
                loading: false,
              })
              message.success('上传成功')
              this.setState({
                loading: false,
              })
              this.props.itemModalHidden()
              this.props.form.resetFields()
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
      const skuNo = (
        <div style={{ color: 'red' }}>
          商品编码
        </div>
      )
      const productNo = (
        <div style={{ color: 'red' }}>
          款式编码(货号)
        </div>
        )
      const specifyPrice = (
        <div style={{ color: 'red' }}>
          指定价格
        </div>
      )
      const columns = [{
          title: this.props.specifyType * 1 === 0 ? (skuNo) : (productNo),
          dataIndex: this.props.specifyType * 1 === 0 ? 'skuNo' : 'productNo',
          key: this.props.specifyType * 1 === 0 ? 'skuNo' : 'productNo',
          width: 100,
        }, {
          title: (specifyPrice),
          dataIndex: 'specifyPrice',
          key: 'specifyPrice',
          width: 100,
        }]
    const description = (
      <div>
        <div>1.导入EXCEL格式必须带标题，红色标题为必填.</div>
        <div>2.数量不建议太多，一次不能超过5000条.</div>
        <div>3.导入数据请注意大小写，尽量和商品资料中的编号一致，价格为2位小数.</div>
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
        }  else {
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
          title="导入商品"
          visible={this.props.importModalVisiable}
          onCancel={this.handleCancel}
          // onOk={this.handleOk}
          width="600px"
          key="888"
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
            <div style={{ marginBottom: '10px' }}>导入模式</div>
            <div>
              <RadioGroup value={this.state.value} onChange={onChange} >
                <div style={{ marginBottom: '10px' }}><Radio value="N">当导入商品编码或款式编码和已有商品重复时不导入</Radio></div>
                <div style={{ marginBottom: '10px' }}><Radio value="Y">当导入商品编码或款式编码和已有商品重复时覆盖价格</Radio></div>
              </RadioGroup>
            </div>
            <Col span={2}><div style={{ marginTop: '5px' }}>标题：</div></Col>
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
