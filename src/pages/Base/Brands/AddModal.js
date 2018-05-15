/*
 * @Author: Chen Xinjie
 * @Date: 2018-01-04 09:16:23
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-14 19:38:40
 * 新增品牌资料维护
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Input, message, Upload, Icon, Tooltip, Switch } from 'antd'
import config from '../../../utils/config'
import { getLocalStorageItem } from '../../../utils/utils'
import { Save } from '../../../services/base/brands'

const FormItem = Form.Item
@connect(state => ({
    brands: state.brands,
    loading: false,
    imageUrl: '',
    picture: '',
}))
@Form.create()
export default class AddModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      distributeAuthorizeFlag: true,
    }
  }
  // 切换开关
  onSwitch = (checked) => {
    this.setState({
      distributeAuthorizeFlag: checked,
    })
  }
  getBase64 = (img, callback) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }
  handleOk = () => {
    this.handleSubmit()
  }
  handleCancel = () => {
    this.setState({
      distributeAuthorizeFlag: false,
    })
    this.props.form.resetFields()
    this.props.brandModalHidden()
  }
  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        Object.assign(values, {
          distributeAuthorize: this.state.distributeAuthorizeFlag ? 1 : 0,
          enableStatus: 1,
          brandIcon: this.state.picture,
          brandName: values.brandName ? values.brandName.trim() : undefined,
          shortName: values.shortName ? values.shortName.trim() : undefined,
        })
        Save(values).then((json) => {
          if (json) {
            const { dispatch } = this.props
            this.props.form.resetFields()
            this.props.brandModalHidden()
            dispatch({
              type: 'brands/search',
            })
          }
        })
      }
    })
  }
  beforeUpload = (file) => {
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp'
    if (!isJPG) {
      message.error('品牌图标只能上传图片!')
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
        message.success('品牌图标上传成功')
        this.getBase64(info.file.originFileObj, imageUrl => this.setState({
          picture: info.file.response.data,
          imageUrl,
          loading: false,
        }))
      }
    } else if (info.file.status === 'error') {
      message.error('品牌图标上传失败')
      this.setState({
        loading: false,
      })
    }
  }

  handleConfirmBrandName = (rule, value, callback) => {
    if (!value || value.trim() === '') {
        callback('品牌名称不能为空！')
    }
    callback()
  }

  handleConfirmShortName = (rule, value, callback) => {
    if (!value || value.trim() === '') {
        callback('品牌简称不能为空！')
    }
    callback()
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { brand } = this.props
    const { brandName, shortName } = brand
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        md: { span: 16 },
      },
    }

  const uploadButton = (
    <div>
      <Icon type={this.state.loading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">选择图标</div>
    </div>
  )

    return (
      <div>
        <Modal
          maskClosable={false}
          title="新增品牌资料"
          visible={this.props.addModalVisiable}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
        >
          <Form
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="品牌名称"
            >
              {getFieldDecorator('brandName', {
                initialValue: brandName,
                rules: [
                  { required: true, message: '请输入品牌名称' },
                  { max: 10, message: '品牌名称不能超过10个字符' },
                  { validator: this.handleConfirmBrandName },
            ],
            })(
              <Input size={config.InputSize} />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="品牌简称"
            >
              {getFieldDecorator('shortName', {
                initialValue: shortName,
                rules: [{
                  required: true, message: '请输入品牌简称',
                },
                { max: 10, message: '品牌简称不能超过10个字符' },
                { validator: this.handleConfirmShortName },
              ],
            })(
              <Input size={config.InputSize} />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={(
                <span>
                  品牌图标&nbsp;
                  <Tooltip title="可选,一个图标,上传既覆盖原有">
                    <Icon type="exclamation-circle-o" />
                  </Tooltip>
                </span>
              )}
            >
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
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="是否允许分销商授权"
            >
              {getFieldDecorator('distributeAuthorizeFlag')(
                <Switch checked={this.state.distributeAuthorizeFlag} onChange={this.onSwitch} />
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}
