/*
 * @Author: wupeng
 * @Date: 2017-12-27 14:37:21
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-04-19 09:41:02
 * 导入安全库存
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Upload, message, Radio, Button, Icon, Table, Alert } from 'antd'
import reqwest from 'reqwest'
import { getLocalStorageItem } from '../../../utils/utils'
import config from '../../../utils/config'
const RadioGroup = Radio.Group


@connect(state => ({
    division: state.division,
  }))
@Form.create()
export default class DivisionExecl extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileList: [],
      value: 1,
      checked: true,
    }
  }
  onChange11 = (e) => {
    this.setState({
      value: e.target.value,
    })
  }
onChange = (e) => {
    this.setState({
        checked: e.target.checked,
    })
  }
  handleOk = () => {
    this.handleSubmit()
  }
  handleCancel = () => {
    this.props.form.resetFields()
    this.setState({
      fileList: [],
  })
  this.props.data.DivisionExeclotwo()
  }
  handleSubmit = () => {
    if (this.state.fileList.length !== 0) {
      // 激活按钮加载状态
      this.setState({ loading: true })
      const { fileList } = this.state
      const formData = new FormData()
      fileList.forEach((file) => {
        formData.append('file', file)
      })
      formData.append('uploadStatus', this.state.value)
      formData.append('warehouseNo', (this.props.division.searchParam.warehouseNo === undefined) ? '' : this.props.division.searchParam.warehouseNo)
      reqwest({
        url: `${config.APIV1}/prodm/warehouse/sku/inventory/uploadSafetyInventory`,
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
            })
            this.props.form.resetFields()
            this.props.dispatch({
              type: 'division/search',
              })
              this.props.data.DivisionExeclotwo()
          } else {
            this.setState({
              fileList: [],
            })
            message.error(`${(data.errorMessage === '0001') ? '上传失败' : data.errorMessage}`)
            this.setState({ loading: false })
            this.setState({
              loading: false,
            })
            this.props.form.resetFields()
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
      title: <div style={{ color: 'red' }}>安全库存</div>,
      dataIndex: 'safetyLowerLimit',
    },
]
    const importData = [{
      key: '1',
      skuNo: 'A12343S1',
      safetyLowerLimit: '12',
    }, {
        key: '2',
        skuNo: 'A12343S121',
        safetyLowerLimit: '34',
    }, {
        key: '3',
        skuNo: 'A1234233S1',
        safetyLowerLimit: '22',
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
        } else {
          this.setState({
            fileList: [file],
          })
          // (({ fileList }) => 
        // )
        }
        return false
      },
      fileList: this.state.fileList,
    }
    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
      }
    return (
      <div>
        <Modal
          maskClosable={false}
          title="导入安全库存"
          visible={this.props.data.DivisionExeclvis}
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
            description="导入商品信息的 Excel 文件，格式请参照下面：其中[商品编码][安全库存]必须包含"
            type="info"
            showIcon
          />
          <Table columns={importColumns} dataSource={importData} pagination={false} />
          <RadioGroup onChange={this.onChange11} value={this.state.value}>
            <Radio style={radioStyle} value={1}>使用导入的安全库存，覆盖原有的安全库存</Radio>
            <Radio style={radioStyle} value={2}>使用导入的安全库存，覆盖原有的安全库存，不在导入列表内的清空安全库存</Radio>
          </RadioGroup>
          <br />
          <Upload {...props} onChange={this.onFileChange}>
          标题&nbsp;:&nbsp;
            <Button>
              <Icon type="upload" /> 上传文件
            </Button>
          </Upload>
          <br />
          {/* <Checkbox onChange={this.onChange}>此列表以外的列以自定义属性的方式导入</Checkbox> */}
        </Modal>
      </div>
    )
  }
}
