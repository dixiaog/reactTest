/*
 * @Author: Chen Xinjie
 * @Date: 2018-01-02 14:11:53
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-14 19:40:23
 * 新增编辑品牌资料维护
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Input, message, Upload, Avatar, Tooltip, Icon, Switch } from 'antd'
import config from '../../../utils/config'
import { getLocalStorageItem } from '../../../utils/utils'
import { Update, GetViewData } from '../../../services/base/brands'

const FormItem = Form.Item
@connect(state => ({
    brands: state.brands,
    loading: false,
    status: 'block',
    float: 'left',
    picture: '',
    picturePath: '',
    upload: '选择覆盖',
}))
@Form.create()
export default class EditModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  componentWillMount() {
    const { brand } = this.props
    this.setState({
      picturePath: brand.brandIcon,
    })
    if (brand.brandNo) {
      GetViewData(brand).then((json) => {
        this.setState({
          brand: json,
          distributeAuthorizeFlag: json.distributeAuthorize === 1,
          picturePath: json.brandIcon,
        })
      })
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
    this.props.form.resetFields()
    this.props.brandModalHidden()
    this.setState({
      brand: {},
      distributeAuthorizeFlag: false,
    })
  }
  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        Object.assign(values, {
          distributeAuthorize: this.state.distributeAuthorizeFlag ? 1 : 0,
          brandNo: this.state.brand.brandNo,
          enableStatus: this.state.brand.enableStatus,
          brandIcon: this.state.picture,
          shortName: values.shortName ? values.shortName.trim() : undefined,
        })
        Update(values).then((json) => {
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
    if (info.file.status === 'uploading') {
      this.setState({ loading: true })
      return
    }
    if (info.file.status === 'done') {
      if (info.file.response.success) {
        message.success('品牌图标上传成功')
        this.getBase64(info.file.originFileObj, () => this.setState({
          picture: info.file.response.data,
          picturePath: info.file.response.data,
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
      <span>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">选择覆盖</div>
      </span>
    )
    return (
      <div>
        <Modal
          maskClosable={false}
          title="编辑品牌资料"
          visible={this.props.editModalVisiable}
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
              { brandName }
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
                <span>
                  <Avatar
                    style={{ width: '100px', height: '100px', float: 'left', marginRight: '20px' }}
                    shape="square"
                    size="large"
                    // src={brandIcon}
                    src={this.state.picturePath}
                  />
                </span>
                <span style={{ float: this.state.float }}>
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
                    {uploadButton}
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
