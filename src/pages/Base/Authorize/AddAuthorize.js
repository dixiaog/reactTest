// 平台站点维护新增
import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Input, Icon, Upload, message } from 'antd'
import config from '../../../utils/config'
import { siteSave } from '../../../services/system'
import { getLocalStorageItem } from '../../../utils/utils'

const FormItem = Form.Item

@connect(state => ({
  authorize: state.authorize,
}))
@Form.create()
export default class AddAuthorize extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      imageUrl: '',
      picture: '',
    }
  }

  getBase64 = (img, callback) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }
  // 关闭窗口
  hideModal = () => {
    const { hideModal } = this.props
    this.setState({
      confirmLoading: false,
      imageUrl: '',
    })
    hideModal()
    this.handleReset()
  }

  // 清空表单
  handleReset = () => {
    this.props.form.resetFields()
  }
  // 保存
  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          confirmLoading: true,
        })
        Object.assign(values, {
          siteIcon: this.state.picture,
        })
        siteSave(values).then((json) => {
          this.setState({
            confirmLoading: false,
          })
          if (json) {
            const { hideModal } = this.props
            hideModal()
            this.handleReset()
            this.props.dispatch({
              type: 'authorize/search',
            })
          }
        })
      }
      })
  }

  beforeUpload = (file) => {
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp'
    if (!isJPG) {
      message.error('头像只能选择图片')
    }
    return isJPG
  }

  handleChange = (info) => {
    this.setState({
      imageUrl: '',
    })
    if (info.file.status === 'uploading') {
      this.setState({ loading: true })
      return
    }
    if (info.file.status === 'done') {
      if (info.file.response.success) {
        message.success('头像上传成功')
        this.getBase64(info.file.originFileObj, imageUrl => this.setState({
          picture: info.file.response.data,
          imageUrl,
          loading: false,
        }))
      }
    } else if (info.file.status === 'error') {
      message.error('头像上传失败')
      this.setState({
        loading: false,
      })
    }
  }
  checkBlank = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (value.indexOf(' ') !== -1) {
        callback('站点名称不能输入空格')
      } else {
        callback()
    }
  }
  checkBlank1 = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (value.indexOf(' ') !== -1) {
        callback('站点简称不能输入空格')
      } else {
        callback()
    }
  }
  checkBlank2 = (rule, value, callback) => {
    if (!value) {
      callback()
    } else if (value.indexOf(' ') !== -1) {
        callback('授权地址不能输入空格')
      } else {
        callback()
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form
    // const { list } = this.props.roles
    const { show } = this.props
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    }
    const imgItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }

    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">选择覆盖</div>
      </div>
    )

    return (
      <div>
        <Modal
          title="新增平台站点"
          visible={show}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
          confirmLoading={this.state.confirmLoading}
        >
          <Form
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="站点名称"
            >
              {getFieldDecorator('siteName', {
                rules: [{
                    required: true, message: '请输入站点名称',
                },
                {
                  validator: this.checkBlank,
                }],
            })(
              <Input size={config.InputSize} placeholder="请输入站点名称" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="站点简称"
            >
              {getFieldDecorator('shortName', {
                rules: [{
                    required: true, message: '请输入站点简称',
                },
                {
                  validator: this.checkBlank1,
                }],
            })(
              <Input size={config.InputSize} placeholder="请输入站点简称" />
            )}
            </FormItem>

            <FormItem
              {...imgItemLayout}
              label="站点图标"
            >
              {getFieldDecorator('sitePicture', {
                rules: [{
                    required: true, message: '请选择站点图片',
                }],
            })(
              <div>
                <span style={{ float: 'left' }}>
                  <Upload
                    name="file"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    headers={{
                      'authorization': `Basic ${getLocalStorageItem('token')}`,
                      'CompanyNo': `${getLocalStorageItem('companyNo')}`,
                      'UserNo': `${getLocalStorageItem('userNo')}`,
                    }}
                    action={`${config.APIV1}/demo/ossupload`}
                    beforeUpload={this.beforeUpload}
                    onChange={this.handleChange}
                  >
                    {this.state.imageUrl ? <img src={this.state.imageUrl} alt="" style={{ width: '104px', height: '104px' }} /> : uploadButton}
                  </Upload>
                </span>
              </div>
            )}
            </FormItem>


            <FormItem
              {...formItemLayout}
              label="授权地址"
            >
              {getFieldDecorator('authorizeAddress', {
                rules: [{
                    required: true, message: '请输入授权地址',
                },
                {
                  validator: this.checkBlank2,
                }],
            })(
              <Input size={config.InputSize} placeholder="请输入授权地址" />
            )}
            </FormItem>
          </Form>
        </Modal>
      </div>)
  }
}
