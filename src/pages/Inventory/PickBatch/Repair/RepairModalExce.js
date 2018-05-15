/*
 * @Author: Wupeng
 * @Date: 2018-04-10 13:50:19
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-25 19:55:00
 *生成整补任务 导入生成批次
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
// import styles from './index.less'
import { getLocalStorageItem } from '../../../../utils/utils'
import config from '../../../../utils/config'

@Form.create()
class RepairModalExce extends Component {
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
          console.log(this.props.locationType)
          formData.append('locationType', this.props.locationType)
        //   formData.append('billNo', this.props.data.billNo)
          reqwest({
            // url: `${config.WMS}/wm/bd/location/yhUpload`,
            url: `${config.WMS}/wm/bd/location/zbUpload`,
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
                this.props.RefreshExce()
              } else {
                message.error(data.errorMessage)
                this.setState({ loading: false, fileList: [] })
              }
            },
          })
        } else {
          message.config({
            top: 100,
          })
          message.error('请选择上传文件')
        }
      }
    
    render() {
         // 款号 仓位 商品编码 商品名称 颜色/规格 库存数量 可下架数量
        // productNo locationNo skuNo productName productSpec inventoryNum lockedNum
        const importColumns = [{
            title: <div style={{ color: 'red' }}>商品编码</div>,
            dataIndex: 'skuNo',
          }, {
            title: <div>款号</div>,
            dataIndex: 'productName',
          }, {
            title: <div>颜色/规格</div>,
            dataIndex: 'productSpec',
          }, {
            title: <div style={{ color: 'red' }}>待补货数</div>,
            dataIndex: 'lockedNum',
          },
      ]
          const importData = [{
            key: '1',
            locationNo: 'A-1-1-1-1',
            skuNo: 'X801100180569001',
            productName: 'X8011001',
            productSpec: '黑色/170',
            lockedNum: '15',
          }, {
            key: '2',
            skuNo: 'X801100180569002',
            productName: 'X8011001',
            productSpec: '黑色/170',
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
              }  else {
                console.log(file)
                this.setState(() => ({
                  fileList: [file],
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
              导入批次信息的Excel文件，格式请参照下面,其中[商品编码][待补货数]必须包含，<br />
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
export default RepairModalExce