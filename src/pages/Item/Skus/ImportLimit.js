/*
 * @Author: Chen Xinjie
 * @Date: 2017-12-27 14:37:21
 * @Last Modified by: Chen Xinjie
 * @Last Modified time: 2018-03-16 14:04:51
 * 导入商品库容信息
 */

import React, { Component } from 'react'
import { Modal, Form, Table, Upload, message, notification, Button, Icon } from 'antd'
import reqwest from 'reqwest'
import styles from './Skus.less'
import { getLocalStorageItem } from '../../../utils/utils'
import config from '../../../utils/config'

@Form.create()
export default class SkuImportLimit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileList: [],
    }
  }

  handleOk = () => {
    this.handleSubmit()
  }
  handleCancel = () => {
    this.props.form.resetFields()
    this.props.skuModalHidden()
    this.setState({
      fileList: [],
  })
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
      formData.append('value', this.state.value)
      // You can use any AJAX library you like
      reqwest({
        url: `${config.APIV1}/prodem/skus/upload`,
        headers: {
          'Authorization': `Basic ${getLocalStorageItem('token')}`,
          'CompanyNo': `${getLocalStorageItem('companyNo')}`,
          'UserNo': `${getLocalStorageItem('userNo')}`,
        },
        method: 'post',
        processData: false,
        data: formData,
        success: (data) => {
          const { success, errorMessage } = data
          if (success) {
            this.setState({
              fileList: [],
            })
            message.success(errorMessage)
            this.setState({ loading: false })
            this.props.form.resetFields()
            this.props.skuModalHidden()
            this.props.dispatch({
              type: 'skus/search',
              })
          } else {
            notification.error({
              message: '上传失败',
              description: data.errorMessage.split('!').map((e, i) => {
                if (i !== data.errorMessage.split('!').length - 1) {
                  return <span>{`${e}!`}<br /></span>
                } else {
                  return null
                }
              }),
              duration: 3,
            })
            this.setState({ loading: false })
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
      title: '零售库容上限',
      dataIndex: 'retailCapacityLimit',
    }, {
      title: '整存库容上限',
      dataIndex: 'entireCapacityLimit',
    }, {
      title: '标准装箱数量',
      dataIndex: 'standardBoxing',
    },
    ]

    const importData = [{
      key: '1',
      skuNo: 'NSYRF171010-1',
      retailCapacityLimit: 10,
      entireCapacityLimit: 50,
      standardBoxing: 10,
    }, {
      key: '2',
      skuNo: 'NSYRF171010-2',
      retailCapacityLimit: 5,
      entireCapacityLimit: 20,
      standardBoxing: 20,
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
          title="导入库容上限"
          visible={this.props.importLimitVisiable}
          onCancel={this.handleCancel}
          bodyStyle={{ overflowX: 'hidden' }}
          width={700}
          footer={[
            <Button key="back" onClick={this.handleCancel}>取消</Button>,
            <Button key="submit" type="primary" loading={this.state.loading} onClick={this.handleOk}>
                上传文件
            </Button>,
          ]}
        >
          <p className={styles.warn}>导入商品信息的 Excel 文件，格式请参照下面，其中[商品编码]必须包括。
            <br />
          根据导入商品编号，更新零售库容上限、整存库容上限、标准装箱数量数据。
          </p>
          <Table columns={importColumns} dataSource={importData} pagination={false} />
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
