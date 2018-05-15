// 平台占点维护编辑
import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Select, Form, Input, Icon, Upload, Avatar, message } from 'antd'
import config from '../../../utils/config'
import { siteEditSave } from '../../../services/system'
import { getLocalStorageItem } from '../../../utils/utils'

const FormItem = Form.Item
const Option = Select.Option

function beforeUpload(file) {
  const isPIC = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp'
  if (!isPIC) {
    message.warning('头像只能上传图片!')
  }
  return isPIC
}

const children = []
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>)
}

@connect(state => ({
    dictionary: state.dictionary,
}))
@Form.create()
export default class EditAuthorize extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      siteIcon: '',
      picturePath: '',
      first: '',
      number: 0,
      isFirst: true,
    }
  }
  componentWillMount() {
    this.setState({
      picturePath: this.props.record.siteIcon,
      first: this.props.record.siteIcon,
    })
  }
  // componentWillReceiveProps(nextProps) {
  //   if (this.state.number === 0 && this.state.isFirst) {
  //     this.setState({
  //       number: this.state.number + 1,
  //       picturePath: nextProps.record.siteIcon,
  //       first: nextProps.record.siteIcon,
  //       isFirst: false,
  //     })
  //   }
  // }

  getBase64 = (img, callback) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }
  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
        if (!err) {
          // 把auto加入到values中
          Object.assign(values, {
            autoNo: this.props.record.autoNo,
            originalPicture: this.state.first,
            nowPicture: this.state.picturePath,
          })
          siteEditSave(values).then((json) => {
            // this.setState({
            //   confirmLoading: false,
            // })
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
  // 关闭窗口
  hideModal = () => {
    const { hideModal } = this.props
    this.setState({
      number: 0,
    })
    hideModal()
    this.handleReset()
  }

  // 清空表单
  handleReset = () => {
    this.props.form.resetFields()
  }

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true })
      return
    }
    if (info.file.status === 'done') {
      if (info.file.response.success) {
        message.success('头像覆盖成功')
        this.getBase64(info.file.originFileObj, () => this.setState({
          // // picturePath: 'aaaaa' + 'info.file.response.data.pictureIds',
          // // picture: info.file.response.data.pictureIds,
          picturePath: info.file.response.data,
          loading: false,
        }))
      }
    } else if (info.file.status === 'error') {
      message.error('头像覆盖失败')
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
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">选择覆盖</div>
      </div>
    )
    const { getFieldDecorator } = this.props.form
    // const { list } = this.props.roles
    const { show, record } = this.props
    const { siteName, shortName, authorizeAddress } = record
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    }

    return (
      <div>
        <Modal
          title="编辑平台站点"
          visible={show}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
        >
          <Form
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="站点名称"
            >
              {getFieldDecorator('siteName', {
                initialValue: siteName,
                rules: [{
                    required: true, message: '站点名称',
                },
                {
                  validator: this.checkBlank,
                }],
            })(
              <Select
                style={{ marginTop: '3px' }}
                size={config.InputSize}
                mode="combobox"
                placeholder="站点名称"
              >
                {children}
              </Select>
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="站点简称"
            >
              {getFieldDecorator('shortName', {
                initialValue: shortName,
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
              {...formItemLayout}
              // label={(
              //   <span>
              // 站点图标&nbsp;
              //     <Tooltip title="可选,一个头像,上传既覆盖原有">
              //       <Icon type="exclamation-circle-o" />
              //     </Tooltip>
              //   </span>
              // )}
              label="站点图标"
            >
              <div>
                <span>
                  <Avatar
                    style={{ width: '100px', height: '100px', float: 'left', marginRight: '20px' }}
                    shape="square"
                    size="large"
                    src={this.state.picturePath}
                  />
                </span>
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
                    beforeUpload={beforeUpload}
                    onChange={this.handleChange}
                  >
                    {this.state.siteIcon ? <img src={this.state.siteIcon} alt="" /> : uploadButton}
                  </Upload>
                </span>
              </div>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="授权地址"
            >
              {getFieldDecorator('authorizeAddress', {
                initialValue: authorizeAddress,
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
