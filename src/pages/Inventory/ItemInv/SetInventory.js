/*
 * @Author: tanmengjia
 * @Date: 2018-02-02 15:44:26
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-04-16 16:58:57
 * 添加虚拟库存/设置安全库存
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Col, Button, Table, Alert, Radio, Icon, Upload, message } from 'antd'
import reqwest from 'reqwest'
import { getLocalStorageItem } from '../../../utils/utils'
import config from '../../../utils/config'

const RadioGroup = Radio.Group

@connect(state => ({
  itemInv: state.itemInv,
}))
@Form.create()
export default class SetInventory extends Component {
    constructor(props) {
        super(props)
        this.state = {
        fileList: [],
        loading: false,
        data: [{
          skuNo: 'A12353S3',
          num: 12,
          lowest: 12,
          highest: 20,
        }, {
          skuNo: 'A12353S221',
          num: 34,
          lowest: 34,
          highest: 50,
        }, {
            skuNo: 'A3433S221T',
            num: 22,
            lowest: 22,
            highest: 100,
          }],
        value: 1,
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
          formData.append('file', file)
        })
        formData.append('uploadStatus', this.state.value)
        formData.append('uploadInventoryStatus', this.props.type)
        // You can use any AJAX library you like
        reqwest({
          url: `${config.APIV1}/prodm/sku/inventory/uploadInventory`,
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
                checkValue: false,
                value: 1,
             })
             this.props.dispatch({ type: 'itemInv/fetch' })
              message.success(json.errorMessage)
              this.props.itemModalHidden()
              this.props.form.resetFields()
            } else {
              message.error(json.errorMessage)
              this.setState({ loading: false, fileList: [] })
            }
          },
          // error: () => {
          // },
        })
      }
    }
    handleCancel = () => {
      this.props.form.resetFields()
      this.props.itemModalHidden()
      this.setState({
          fileList: [],
          loading: false,
          value: 1,
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
      const lowest = (
        <div style={{ color: 'red' }}>
          安全库存下限
        </div>
        )
      const highest = (
        <div style={{ color: 'red' }}>
            安全库存上限
        </div>
        )
      const num = (
        <div style={{ color: 'red' }}>
          数量
        </div>
      )
    const columns = [{
        title: (skuNo),
        dataIndex: 'skuNo',
        key: 'skuNo',
        width: 100,
    }, {
        title: (num),
        dataIndex: 'num',
        key: 'num',
        width: 100,
    }]
    const columns1 = [{
        title: (skuNo),
        dataIndex: 'skuNo',
        key: 'skuNo',
        width: 100,
    }, {
        title: (lowest),
        dataIndex: 'lowest',
        key: 'lowest',
        width: 100,
    }, {
        title: (highest),
        dataIndex: 'highest',
        key: 'highest',
        width: 100,
    }]
    const description = (
      <div>
        <div>导入商品信息的EXCEL文件，格式请参照下面，其中[商品编码][数量]必须包含.</div>
      </div>
    )
    const description1 = (
      <div>
        <div>导入商品信息的EXCEL文件，格式请参照下面，其中[商品编码][安全库存上限][安全库存下限]必须包含.</div>
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
          title={this.props.type === 1 ? '添加虚拟库存' : '导入安全库存'}
          visible={this.props.importModalVisiable}
          onCancel={this.handleCancel}
          // onOk={this.handleOk}
          width="600px"
          key="888"
          footer={[
            <Button key="back" onClick={this.handleCancel}>取消</Button>,
            <Button key="submit" type="primary" loading={this.state.loading} onClick={this.handleOk}>
                确定上传商品信息
            </Button>,
          ]}
        >
          <Alert
            description={this.props.type === 1 ? description : description1}
            type="info"
            showIcon
          />
          <br />
          <Table columns={this.props.type === 1 ? columns : columns1} pagination={false} dataSource={this.state.data} />
          <br />
          <div>
            <div>
              <RadioGroup value={this.state.value} onChange={onChange} >
                <div style={{ marginBottom: '10px' }}><Radio value={1}>使用导入的虚拟库存覆盖原有的{this.props.type === 1 ? '虚拟' : '安全'}库存</Radio></div>
                <div style={{ marginBottom: '10px' }}><Radio value={2}>使用导入的虚拟库存覆盖原有的{this.props.type === 1 ? '虚拟' : '安全'}库存，不在导入列表内的清空{this.props.type === 1 ? '虚拟' : '安全'}库存</Radio></div>
              </RadioGroup>
            </div>
            <Col span={2}><div style={{ marginTop: '5px' }}>标题：</div></Col>
            <Upload {...props} onChange={this.onFileChange}>
              <Button size="small">
                <Icon type="upload" /> 上传文件
              </Button>
            </Upload>
          </div>
          <Col span={2}><div /></Col>
          <div style={{ color: '#AAAAAA' }}>支持扩展名：.xls..</div>
          <Col span={2}><div /></Col>
          {this.state.importModalVisiable ? <div style={{ color: 'red' }}>请选择上传文件</div> : ''}
        </Modal>
      </div>
    )
  }
}
