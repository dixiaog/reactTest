/*
 * @Author: jiangteng
 * @Date: 2018-01-03 08:38:56
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-01-04 14:54:32
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-05 15:19:49
 * 商品维护导入
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Table, Form, Modal, Upload, Icon, Button, message, notification } from 'antd'
import reqwest from 'reqwest'
import config from '../../utils/config'
import { getLocalStorageItem } from '../../utils/utils'

const text = (
  <div>
    <div>导入商品信息的Excel文件,格式请参考下面,其中<span style={{ color: 'red' }}>红色标题</span>必须包含</div>
    <div>导入时如果存在对应商品编码的商品资料,则覆盖,没有则增加新的记录</div>
  </div>
)
@connect(state => ({
  items: state.items,
}))
@Form.create()
export default class GoodImport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileList: [],
      loading: false,
      init: false,
      checked: false,
    }
  }

  onChange = (e) => {
    this.setState({
      checked: e.target.checked,
    })
  }
  handleCancel = () => {
    this.setState({
      fileList: [],
      init: false,
    })
    const { hideModal } = this.props
    hideModal()
  }

  // 确认上传文件
  handleUpload = () => {
    if (this.state.fileList.length === 0) {
      this.setState({
        init: true,
      })
    } else {
      // 激活按钮加载状态
      this.setState({ loading: true })
      const { fileList } = this.state
      const formData = new FormData()
      fileList.forEach((file) => {
        formData.append('file', file)
      })
      // You can use any AJAX library you like
      reqwest({
        url: `${config.APIV1}/prodm/sku/upload`,
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
            message.success('上传成功')
            this.setState({
              loading: false,
            })
            this.props.form.resetFields()
            this.props.hideModal()
                this.props.dispatch({
                  type: 'items/search',
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
            // message.error(data.errorMessage)
            this.setState({ loading: false, fileList: [] })
            this.props.form.resetFields()
          }
        },
        // success: (json) => {
        //   console.log('json', json)
        //   if (json.data) {
        //     this.setState({
        //       fileList: [],
        //     })
        //     message.success('上传成功')
        //     this.setState({ loading: false })
        //     this.props.hideModal()
        //     this.props.dispatch({
        //       type: 'items/search',
        //     })
        //   } else {
        //     message.error(json.errorMessage)
        //     this.setState({ loading: false })
        //   }
        // },
        // error: () => {
        //   message.error('上传失败')
        //   this.setState({ loading: false })
        // },
      })
    }
  }

  render() {
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
    const columns = [{
      title: <div style={{ color: 'red' }}>分类</div>,
      dataIndex: 'name',
      key: 'name',
      width: 80,
    }, {
      title: <div style={{ color: 'red' }}>款式编码</div>,
      dataIndex: 'age',
      key: 'age',
      width: 80,
    }, {
      title: <div style={{ color: 'red' }}>商品编码</div>,
      dataIndex: 'address',
      key: 'address',
      width: 70,
    },
    {
      title: '国际条形码',
      dataIndex: 'barcode',
      key: 'barcode',
      width: 80,
    }, {
      title: '商品名',
      dataIndex: 'goodName',
      key: 'goodName',
      width: 60,
    }, {
      title: '商品属性',
      dataIndex: 'skuAttr',
      key: 'skuAttr',
      width: 70,
    }, {
      title: <div style={{ color: 'red' }}>颜色及规格</div>,
      dataIndex: 'category',
      key: 'category',
      width: 80,
    },
    //  {
    //   title: '颜色及规格编号',
    //   dataIndex: 'spec',
    //   key: 'spec',
    //   width: 120,
    // },
     {
      title: '基本售价',
      dataIndex: 'sale',
      key: 'sale',
      width: 60,
    }, {
      title: '市场|吊牌价',
      dataIndex: 'price',
      key: 'price',
      width: 60,
    }, {
      title: '成本价',
      dataIndex: 'cost',
      key: 'cost',
      width: 50,
    }, {
      title: '重量',
      dataIndex: 'weight',
      key: 'weight',
      width: 50,
    }, {
      title: '供应商名',
      dataIndex: 'supplier',
      key: 'supplier',
      width: 80,
    }, {
      title: '供应商商品编码',
      dataIndex: 'supplierSkuNo',
      key: 'supplierSkuNo',
      width: 80,
    },
    //  {
    //   title: '备注',
    //   dataIndex: 'remark',
    //   key: 'remark',
    //   width: 120,
    // },
     {
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
      width: 60,
    }]
    const data = [{
      key: '1',
      name: 'John Brown',
      age: 32,
      address: '111',
      category: '颜色,规格',
    }, {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: '222',
      category: '白色,180',
    }, {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: '3333',
      category: '红色,175',
    }]
    const { show } = this.props
    return (
      <div>
        <Modal
          title={text}
          maskClosable={false}
          visible={show}
          onCancel={this.handleCancel}
          width={1000}
          footer={[
            <Button key="cancel" onClick={this.handleCancel}>取消</Button>,
            <Button key="submit" type="primary" loading={this.state.loading} onClick={this.handleUpload}>
              上传文件
            </Button>,
          ]}
        >
          <Table
            columns={columns}
            dataSource={data}
            size="middle"
            pagination={false}
            rowKey={record => record.key}
            scroll={{ x: 900 }}
          />
          <div style={{ marginTop: 10 }}>
            <Upload {...props} onChange={this.onFileChange}>
              <Button>
                <Icon type="upload" /> 上传文件
              </Button>
            </Upload>
          </div>
          <div style={{ marginTop: 8 }}>支持扩展名:xlsx</div>
          {!this.state.fileList.length && this.state.init ? <div style={{ color: 'red' }}>请选择上传文件</div> : ''}
          {/* <Checkbox style={{ marginTop: 10 }} checked={this.state.checked} onChange={this.onChange}>此列表以外的列,以自定义属性的方式导入</Checkbox> */}
        </Modal>
      </div>
    )
  }
}
