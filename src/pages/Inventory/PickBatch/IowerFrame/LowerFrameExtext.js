/*
 * @Author: Wupeng
 * @Date: 2018-04-10 13:50:19
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-25 21:21:34
 * 生成移货下架 导入生成批次
 */
import React, { Component } from 'react'
import {
    Modal,
    Form,
    Upload,
    message,
    Button,
    Icon,
    Table,
    Alert,
} from 'antd'
import reqwest from 'reqwest'
import { getLocalStorageItem } from '../../../../utils/utils'
import config from '../../../../utils/config'

@Form.create()
class LowerFrameExtext extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fileList: [],
            visible: false,
        }
    }
    componentWillMount() {
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
      this.props.hidden()
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
          formData.append('locationType', this.props.locationType)
        //   formData.append('billNo', this.props.data.billNo)
          reqwest({
            url: `${config.WMS}/wm/bd/location/yhUpload`,
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
                this.props.Refresh()
              } else {
                message.error(data.errorMessage)
                this.setState({ loading: false, fileList: [] })
              }
            },
          })
        }
      }
    
    render() {
         // 款号 仓位 商品编码 商品名称 颜色/规格 库存数量 可下架数量
        // productNo locationNo skuNo productName productSpec inventoryNum lockedNum
        const importColumns = [{
            title: <div>款式编码</div>,
            dataIndex: 'productNo',
            key: 'productNo',
          }, {
            title: <div style={{ color: 'red' }}>仓位</div>,
            dataIndex: 'locationNo',
            key: 'locationNo',
          }, {
            title: <div style={{ color: 'red' }}>商品编码</div>,
            dataIndex: 'skuNo',
            key: 'skuNo',
          }, {
            title: <div>商品名称</div>,
            dataIndex: 'productName',
            key: 'productName',
          }, {
            title: <div>颜色/规格</div>,
            dataIndex: 'productSpec',
            key: 'productSpec',
          }, {
            title: <div style={{ color: 'red' }}>下架数量</div>,
            dataIndex: 'lockedNum',
            key: 'lockedNum',
          },
      ]
          const importData = [{
            key: '1',
            productNo: '1710101',
            locationNo: 'A-1-1-1-1',
            skuNo: '171010001',
            productName: '羽绒服',
            productSpec: 'ASDSX036001',
            lockedNum: '15',
          }, {
            key: '2',
            productNo: '1710101',
            locationNo: 'A-2-1-1-1',
            skuNo: '171010002',
            productName: '羽绒服',
            productSpec: 'ASDSX036001',
            lockedNum: '10',
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
            <Modal
              maskClosable={false}
              title="导入生成批次"
              visible={this.props.visible}
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
              导入批次信息的Excel文件，格式请参照下面,其中[仓位][商品编码][下架数量]必须包含，<br />
              导入时下架数量必须有值，若实际库存不足下架数量则以实际库存为准
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
        )
    }
}
export default LowerFrameExtext