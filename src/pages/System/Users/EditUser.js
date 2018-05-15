/*
 * @Author: jiangteng
 * @Date: 2017-12-22 17:41:12
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-14 16:37:33
 * 用户编辑
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Select, Card, Checkbox, Input, Form, Modal, Avatar, Icon, Tooltip, Upload, message, Radio, Switch } from 'antd'
import config from '../../../utils/config'
import { getLocalStorageItem } from '../../../utils/utils'
import { userNoCheck, editUser } from '../../../services/system'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option
const CheckboxGroup = Checkbox.Group

@connect(state => ({
  users: state.users,
}))
class EditUser extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      loading: false,
      phone: '',
      userName: '',
      number: 0,
      status: 'block',
      float: 'left',
      gender: 'SECRET',
      init: true,
      defineList: [],
      systemList: [],
      storeList: [],
      customerList: [],
      warehouseList: [],
      initNo: '',
      validFlag: null,
      upload: '选择覆盖',
      picturePath: '',
      editcompanyNo: null,
    }
  }

  componentWillMount() {
    const { systemRoleName, defineRoleName, storeName, distributorName, warehouseName, companyNo } = this.props.record
    if (defineRoleName) {
      this.setState({
        validFlag: this.props.record.validFlag === 'Y' ? true : false,
        picturePath: this.props.record.userPicture,
        initNo: this.props.record.userNo,
        warehouseList: warehouseName ? warehouseName.split(',') : [],
        customerList: distributorName ? distributorName.split(',') : [],
        storeList: storeName ? storeName.split(',') : [],
        defineList: defineRoleName ? defineRoleName.split(',') : [],
        editcompanyNo: companyNo,
      })
    } else {
      this.setState({
        validFlag: this.props.record.validFlag === 'Y' ? true : false,
        picturePath: this.props.record.userPicture,
        initNo: this.props.record.userNo,
        warehouseList: warehouseName ? warehouseName.split(',') : [],
        customerList: distributorName ? distributorName.split(',') : [],
        storeList: storeName ? storeName.split(',') : [],
        editcompanyNo: companyNo,
        systemList: systemRoleName ? systemRoleName.split(',') : [],
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.number === 0 && nextProps.record.validFlag !== undefined) {
      if (this.props !== nextProps) {
        this.setState({
          number: 1,
        })
      }
    }
  }

  onChange = (e) => {
    this.setState({
      gender: e.target.value,
    })
  }

  onChangeDef = (checkedList) => {
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

  // 切换开关
  onSwitch = (checked) => {
    this.setState({
      validFlag: checked,
    })
  }

    getBase64 = (img, callback) => {
      const reader = new FileReader()
      reader.addEventListener('load', () => callback(reader.result))
      reader.readAsDataURL(img)
    }

    handleChange = (info) => {
      if (info.file.status === 'uploading') {
        this.setState({ loading: true })
        return
      }
      console.log('info', info)
      if (info.file.status === 'done') {
        if (info.file.response.success) {
          message.success('头像覆盖成功')
          this.getBase64(info.file.originFileObj, () => this.setState({
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

  beforeUpload = (file) => {
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp'
    if (!isJPG) {
      message.error('头像只能选择图片')
    }
    return isJPG
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
      number: 0,
      status: 'block',
      float: 'left',
      userName: '',
      phone: '',
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
    e.preventDefault()
    if (!this.state.defineList.length && !this.state.systemList.length) {
      this.setState({
        init: true,
      })
    }
    this.props.form.validateFields(
      (err, values) => {
        if (!err && (this.state.defineList.length || this.state.systemList.length)) {
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
          const param = {
            userPicture: this.state.picturePath,
            systemRoles: systemNo.toString(),
            defineRoles: defineNo.toString(),
            storeList: storeNo.toString(),
            distributorName: this.state.customerList.toString(),
            distributorNo: Number(distributorNo),
            warehouseName: this.state.warehouseList.toString(),
            warehouseNo: Number(warehouseNo),
            validFlag: this.state.validFlag === true ? 'Y' : 'N',
            userId: this.props.record.userIdJson,
            companyNo: values.companyName ? Number(values.companyName.title) : this.state.editcompanyNo,
          }
          Object.assign(values, param)
          delete values.companyName
          this.setState({
            confirmLoading: true,
          })
          editUser(values).then((json) => {
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
  }

  checkPhone = (rule, value, callback) => {
    if (!value) {
      this.setState({
        phone: '请输入手机号码！',
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
    } else if (this.state.initNo !== value) {
        userNoCheck({ userNo: value }).then((json) => {
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
      } else {
        const { form } = this.props
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true })
        }
        callback()
      }
    }

  render() {
    const { sysRole, defRole, shopList, warehouseList } = this.props.users
    const uploadButton = (
      <span>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">{this.state.upload}</div>
      </span>
    )
    const { show } = this.props
    const { userName, nickName, userNo, mobileNo, gender, emailNo, adminFlag } = this.props.record
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
    }

    return (
      <Modal
        title="编辑用户"
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
                <Tooltip title="可选,一个头像,上传既覆盖原有">
                  <Icon type="exclamation-circle-o" />
                </Tooltip>
              </span>
            )}
          >
            <div>
              <span style={{ display: this.state.status }}>
                { this.state.picturePath === '' ? (
                  <Avatar
                    style={{ width: '100px', height: '100px', float: 'left', marginRight: '20px' }}
                    size="large"
                    shape="square"
                    icon="user"
                  />)
                  :
                  <Avatar
                    style={{ width: '100px', height: '100px', float: 'left', marginRight: '20px' }}
                    shape="square"
                    size="large"
                    src={this.state.picturePath}
                  /> }
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
            help={this.state.userName}
            {...formItemLayout}
            label="用户名"
          >
            {getFieldDecorator('userNo', {
              validateTrigger: ['onBlur'],
              initialValue: userNo,
              rules: [{
                required: true, message: '请输入用户名',
              }, {
                validator: this.checkName,
              }],
            })(
              <Input
                placeholder="请输入用户名"
                size={config.InputSize}
                readOnly
                maxLength="20"
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="用户昵称"
          >
            {getFieldDecorator('nickName', {
              initialValue: nickName,
              rules: [{
                required: true, message: '请输入用户昵称',
              }],
            })(
              <Input placeholder="请输入用户昵称" size={config.InputSize} maxLength="38" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="姓名"
          >
            {getFieldDecorator('userName', {
              initialValue: userName,
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
              initialValue: mobileNo,
              rules: [{
                required: true, message: '请输入手机号码',
              },
              {
                validator: this.checkPhone,
              }],
            })(
              <Input placeholder="请输入手机号码" size={config.InputSize} maxLength="11" />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="邮箱"
          >
            {getFieldDecorator('emailNo', {
              initialValue: emailNo,
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
              initialValue: gender,
            })(
              <RadioGroup setFieldsValue={this.state.gender} onChange={this.onChange}>
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
              initialValue: adminFlag,
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
            {getFieldDecorator('validFlag')(
              <Switch checked={this.state.validFlag} onChange={this.onSwitch} />
            )}
          </FormItem>
          <FormItem
            help={this.state.roleInf}
            {...formItemLayout}
            label="角色列表"
          >
            {getFieldDecorator('roleList', {
              initialValue: true,
              rules: [{
                required: true,
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
                  <CheckboxGroup value={this.state.defineList} onChange={this.onChangeDef}>
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
                <CheckboxGroup value={this.state.defineList} onChange={this.onChangeDef}>
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
                  >
                    {ele.value}
                  </Checkbox>
                  )
                  :
                  '' }
              </CheckboxGroup>
            </Card>
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(EditUser)
