/*
 * @Author: jiangteng
 * @Date: 2017-12-22 17:41:12
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-14 16:18:48
 * 新增用户
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { message, Select, Card, Checkbox, Input, Form, Modal, Icon, Tooltip, Upload, Radio, Switch, Progress, Popover } from 'antd'
import styles from './CheckPwd.less'
import config from '../../../utils/config'
import { getLocalStorageItem } from '../../../utils/utils'
import { addUser, userNo } from '../../../services/system'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option
const CheckboxGroup = Checkbox.Group

const passwordStatusMap = {
  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  pool: <div className={styles.error}>强度：弱</div>,
}

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  pool: 'exception',
}

@connect(state => ({
  users: state.users,
}))
class AddUser extends Component {
  constructor(props) {
    super(props)
    this.state = {
      help: '',
      phone: '',
      userName: '',
      roleInf: '',
      visible: false,
      checkSwitch: true,
      options: [],
      imageUrl: '',
      loading: false,
      roleList: [],
      userNo: '',
      defineList: [],
      systemList: [],
      init: false,
      storeList: [],
      customerList: [],
      picture: '',
      warehouseList: [],
      confirmLoading: false,
    }
  }

  // 获取需要检验的用户名并保存
  onUserNo = (e) => {
    this.setState({
      userNo: e.target.value,
    })
  }

  // 切换开关
  onSwitch = (checked) => {
    this.setState({
      checkSwitch: checked,
    })
  }

  onBlur = () => {
    this.setState({
      visible: false,
    })
  }

  onChange = (checkedList) => {
    this.setState({
      defineList: checkedList,
      systemList: [],
      init: true,
    })
  }

  onChangeSys = (checkedList) => {
    this.setState({
      systemList: checkedList,
      init: true,
    })
  }

  onChangeStore = (checkedList) => {
    this.setState({
      storeList: checkedList,
    })
  }

  onChangeCustomer = (e) => {
    this.setState({
      customerList: e,
    })
  }

  onChangeWarehouse = (e) => {
    this.setState({
      warehouseList: e,
    })
  }

  getPasswordStatus = () => {
    const { form } = this.props
    const value = form.getFieldValue('password')
    if (value && value.length > 9) {
      return 'ok'
    }
    if (value && value.length > 5) {
      return 'pass'
    }
    return 'pool'
  }

  getBase64 = (img, callback) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
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
    console.log('info', info)
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
      } else {
        this.setState({
          loading: false,
        })
        message.error(info.file.response.errorMessage)
      }
    } else if (info.file.status === 'error') {
      message.error('头像上传失败')
      this.setState({
        loading: false,
      })
    }
  }

  handleChangeEmail = (value) => {
    let options
    if (!value || value.indexOf('@') >= 0) {
      options = []
    } else {
      options = ['gmail.com', '163.com', 'qq.com'].map((domain) => {
        const email = `${value}@${domain}`
        return <Option key={email}>{email}</Option>
      })
    }
    this.setState({ options })
  }

  // 关闭弹窗
  hideModal = () => {
    this.setState({
      visible: false,
      help: '',
      phone: '',
      userName: '',
      checkSwitch: true,
      confirmLoading: false,
    })
    const { hideModal } = this.props
    hideModal()
    this.handleReset()
  }

  // 清空表单
  handleReset = () => {
    this.props.form.resetFields()
  }

  // 确认
  okHandler = (e) => {
    const { shopList, sysRole, defRole, customerList, warehouseList } = this.props.users
    const systemNo = []
    const defineNo = []
    const storeNo = []
    const distributorNo = []
    const warehouseNo = []

    this.state.systemList.forEach((ele) => {
      for (const t in sysRole) {
        if (sysRole[t].label === ele) {
          systemNo.push(sysRole[t].value)
          break
        }
      }
    })

    this.state.defineList.forEach((ele) => {
      for (const t in defRole) {
        if (defRole[t].label === ele) {
          defineNo.push(defRole[t].value)
          break
        }
      }
    })

    this.state.storeList.forEach((ele) => {
      for (const t in shopList) {
        if (shopList[t].value === ele) {
          storeNo.push(shopList[t].title)
          break
        }
      }
    })

    this.state.customerList.forEach((ele) => {
      for (const t in customerList) {
        if (customerList[t].value === ele) {
          distributorNo.push(customerList[t].title)
          break
        }
      }
    })

    this.state.warehouseList.forEach((ele) => {
      for (const t in warehouseList) {
        if (warehouseList[t].value === ele) {
          warehouseNo.push(warehouseList[t].title)
          break
        }
      }
    })
    e.preventDefault()
    if (!this.state.defineList.length && !this.state.systemList.length) {
      this.setState({
        init: true,
      })
    }
    this.props.form.validateFields({ force: true },
      (err, values) => {
        if (!err && (this.state.defineList.length || this.state.systemList.length)) {
          const param = {
            userPicture: this.state.picture,
            systemRoles: systemNo.toString(),
            defineRoles: defineNo.toString(),
            storeList: storeNo.toString(),
            distributorName: this.state.customerList.toString(),
            distributorNo: Number(distributorNo),
            warehouseName: this.state.warehouseList.toString(),
            warehouseNo: Number(warehouseNo),
            validFlag: values.validFlag === true ? 'Y' : 'N',
          }
          Object.assign(values, param)
          this.setState({
            confirmLoading: true,
          })
          addUser(values).then((json) => {
            if (json) {
              const { hideModal } = this.props
              hideModal()
              this.handleReset()
              this.props.dispatch({
                type: 'users/search',
              })
            } else {
              this.setState({
                confirmLoading: false,
              })
            }
          })
        }
      }
    )
    this.setState({
      visible: false,
    })
  }

  checkPassword = (rule, value, callback) => {
    if (!value) {
      this.setState({
        help: '请输入密码',
      })
      callback('error')
    } else {
      this.setState({
        help: '',
        visible: true,
      })
      if (value.length < 6 || value.length > 16) {
        this.setState({
          help: '密码长度不符(长度为6~16)',
          visible: true,
        })
        callback('error')
      } else if (/^\d+$/.test(value) || value.indexOf(' ') !== -1) {
        this.setState({
          help: '不能是纯数字，不能包含空格',
          visible: true,
        })
        callback('error')
      } else {
        const { form } = this.props
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true })
        }
        callback()
      }
    }
  }

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不匹配')
    } else {
      callback()
    }
  }

  checkPhone = (rule, value, callback) => {
    if (!value) {
      this.setState({
        phone: '请输入手机号码',
      })
      callback('error')
    } else {
      this.setState({
        phone: '',
      })
      if (value.length !== 11) {
        this.setState({
          phone: '请输入11位手机号码',
        })
        callback('error')
      } else if (!(/^1[345678]\d{9}$/.test(value))) {
        this.setState({
          phone: '请输入正确的手机号码',
        })
        callback('error')
      } else {
        const { form } = this.props
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true })
        }
        callback()
      }
    }
  }

  checkName = (rule, value, callback) => {
    const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
    const reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
    if (!value) {
      this.setState({
        userName: '请输入用户名',
      })
      callback('error')
    } else if (pattern.test(value)) {
      this.setState({
        userName: '不允许输入中文和特殊字符',
      })
      callback('error')
    } else if (reg.test(value)) {
      this.setState({
        userName: '不允许输入中文和特殊字符',
      })
      callback('error')
    } else {
        userNo({ userNo: this.state.userNo }).then((json) => {
          if (json === null) {
            this.setState({
              userName: '用户名重复,请更换用户名',
            })
            callback('error')
          } else {
            this.setState({
              userName: '',
            })
            callback()
          }
        })
        const { form } = this.props
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true })
          callback()
        }
      }
    }

  renderPasswordProgress = () => {
    const { form } = this.props
    const value = form.getFieldValue('password')
    const passwordStatus = this.getPasswordStatus()
    return value && value.length ?
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div> : null
    }

  render() {
    const { shopList, warehouseList, sysRole, defRole } = this.props.users
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传头像</div>
      </div>
    )
    const imageUrl = this.state.imageUrl
    const { show } = this.props
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
    }
    return (
      <Modal
        title="创建用户"
        visible={show}
        onOk={this.okHandler}
        onCancel={this.hideModal}
        confirmLoading={this.state.confirmLoading}
        maskClosable={false}
      >
        <Form style={{ height: '400px', overflowX: 'hidden' }}>
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                头像&nbsp;
                <Tooltip title="可选,一个头像">
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
                  {imageUrl ? <img src={imageUrl} alt="" style={{ width: '104px', height: '104px' }} /> : uploadButton}
                </Upload>
              </span>
            </div>
          </FormItem>
          <FormItem
            help={this.state.userName}
            {...formItemLayout}
            label="用户名"
          >
            {getFieldDecorator('userNo', {
              validateTrigger: ['onBlur'],
              rules: [{
                required: true, message: '请输入用户名',
              }, {
                validator: this.checkName,
              }],
            })(
              <Input
                placeholder="请输入用户名"
                onChange={this.onUserNo}
                size={config.InputSize}
                maxLength="20"
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="用户昵称"
          >
            {getFieldDecorator('nickName', {
              rules: [{
                required: true, message: '请输入用户昵称',
              }],
            })(
              <Input placeholder="请输入用户昵称" size={config.InputSize} maxLength="36" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="姓名"
          >
            {getFieldDecorator('userName', {
              rules: [{
                required: true, message: '请输入姓名',
              }],
            })(
              <Input placeholder="请输入姓名" size={config.InputSize} maxLength="30" />
            )}
          </FormItem>
          <FormItem
            help={this.state.phone}
            {...formItemLayout}
            label="手机"
          >
            {getFieldDecorator('mobileNo', {
              rules: [{
                required: true, message: '请输入手机号码',
              },
              {
                validator: this.checkPhone,
              }],
            })(
              <Input placeholder="请输入手机号码" maxLength="11" size={config.InputSize} />
            )}
          </FormItem>
          <FormItem
            help={this.state.help}
            {...formItemLayout}
            label="密码"
          >
            <Popover
              content={
                <div style={{ padding: '4px 0' }}>
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div style={{ marginTop: 10 }}>密码要求：由6-16位字符组成，字母区分大小写(不能是纯数字，不能包含空格)</div>
                </div>
              }
              overlayStyle={{ width: 240 }}
              placement="right"
              visible={this.state.visible}
            >
              {getFieldDecorator('password', {
                rules: [{
                  required: true, message: '请输入密码',
                }, {
                  validator: this.checkPassword,
                }],
              })(
                <Input onBlur={this.onBlur} type="password" placeholder="请输入密码" maxLength="16" size={config.InputSize} />
              )}
            </Popover>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="密码确认"
          >
            {getFieldDecorator('confirm', {
              rules: [{
                required: true, message: '请确认密码',
              }, {
                validator: this.checkConfirm,
              }],
            })(
              <Input
                size="small"
                type="password"
                placeholder="请确认密码"
                maxLength="16"
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="邮箱"
          >
            {getFieldDecorator('emailNo', {
              rules: [{
                type: 'email', message: '邮箱格式错误',
              }],
            })(
              <Select
                mode="combobox"
                style={{ marginTop: 4 }}
                onChange={this.handleChangeEmail}
                filterOption={false}
                placeholder="请输入邮箱"
                size={config.InputSize}
                maxLength="70"
              >
                {this.state.options}
              </Select>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="性别"
          >
            {getFieldDecorator('gender', {
                initialValue: 'SECRET',
            })(
              <RadioGroup>
                <Radio value="SECRET">保密</Radio>
                <Radio value="MALE">男</Radio>
                <Radio value="FEMALE">女</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="是否管理员"
          >
            {getFieldDecorator('adminFlag', {
                initialValue: 0,
            })(
              <RadioGroup>
                <Radio value={0}>否</Radio>
                <Radio value={1}>是</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="启用/禁用"
          >
            {getFieldDecorator('validFlag', {
              initialValue: true,
            })(
              <Switch checked={this.state.checkSwitch} onChange={this.onSwitch} />
            )}
          </FormItem>
          <FormItem
            help={this.state.roleInf}
            {...formItemLayout}
            label="角色列表"
          >
            {getFieldDecorator('roleList', {
              initialValue: this.state.roleList,
              rules: [{
                required: true, message: '请选择角色',
              }],
            })(
              !this.state.systemList.length && !this.state.defineList.length && this.state.init ?
              (
                <Card hoverable style={{ width: 300, marginTop: 10, borderColor: '#f5222d' }}>
                  <div style={{ marginTop: '5px', marginBottom: '5px', fontWeight: 'bold' }}>系统角色:</div>
                  <CheckboxGroup disabled={this.state.defineList.length ? true : false} value={this.state.systemList} onChange={this.onChangeSys}>
                    { sysRole.length ? sysRole.map((ele, index) => { return <Checkbox style={{ margin: '5px' }} value={ele.label} key={index} title={String(ele.value)}>{ele.label}</Checkbox> }) : '' }
                  </CheckboxGroup>
                  <div style={{ marginTop: '5px', marginBottom: '5px', fontWeight: 'bold' }}>自定义角色:</div>
                  <CheckboxGroup value={this.state.defineList} onChange={this.onChange}>
                    { defRole ? defRole.map((ele, index) => { return <Checkbox style={{ margin: '5px' }} value={ele.label} key={index} title={String(ele.value)}>{ele.label}</Checkbox> }) : '' }
                  </CheckboxGroup>
                </Card>
            ) :
            (
              <Card hoverable style={{ width: 300, marginTop: 10 }}>
                <div style={{ marginTop: '5px', marginBottom: '5px', fontWeight: 'bold' }}>系统角色:</div>
                <CheckboxGroup disabled={this.state.defineList.length ? true : false} value={this.state.systemList} onChange={this.onChangeSys}>
                  { sysRole.length ? sysRole.map((ele, index) => { return <Checkbox style={{ margin: '5px' }} value={ele.label} key={index} title={String(ele.value)}>{ele.label}</Checkbox> }) : '' }
                </CheckboxGroup>
                <div style={{ marginTop: '5px', marginBottom: '5px', fontWeight: 'bold' }}>自定义角色:</div>
                <CheckboxGroup value={this.state.defineList} onChange={this.onChange}>
                  { defRole ? defRole.map((ele, index) => { return <Checkbox style={{ margin: '5px' }} value={ele.label} key={index} title={String(ele.value)}>{ele.label}</Checkbox> }) : '' }
                </CheckboxGroup>
              </Card>
            )
            )}
          </FormItem>
          { !this.state.systemList.length && !this.state.defineList.length && this.state.init ? <div style={{ color: '#f5222d', marginLeft: '76px' }}>请选择角色</div> : '' }
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                店铺列表&nbsp;
                <Tooltip title="请选择店铺列表">
                  <Icon type="exclamation-circle-o" />
                </Tooltip>
              </span>
            )}
          >
            <Card hoverable style={{ width: 300, marginTop: 10 }}>
              <CheckboxGroup value={this.state.storeList} onChange={this.onChangeStore}>
                { shopList.length ? shopList.map((ele, index) => { return <Checkbox style={{ margin: '5px' }} value={ele.label} key={index} title={String(ele.value)}>{ele.label}</Checkbox> }) : '' }
              </CheckboxGroup>
            </Card>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label={(
              <span>
                授权仓库&nbsp;
                <Tooltip title="请选择授权仓库">
                  <Icon type="exclamation-circle-o" />
                </Tooltip>
              </span>
            )}
          >
            <Card hoverable style={{ width: 300, marginTop: 10 }}>
              <CheckboxGroup onChange={this.onChangeWarehouse} value={this.state.warehouseList}>
                { warehouseList.length ?
                  warehouseList.map((ele, index) =>
                  <Checkbox
                    disabled={ele.value !== this.state.warehouseList[0] && this.state.warehouseList.length !== 0}
                    style={{ margin: '5px' }}
                    value={ele.value}
                    key={index} 
                    title={String(ele.title)}
                  >
                    {ele.value}
                  </Checkbox>
                  )
                  :'' }
              </CheckboxGroup>
            </Card>
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(AddUser)
