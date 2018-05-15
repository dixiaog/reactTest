/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-10 16:26:49
 * 新增/修改分销商
 */

import React, { Component } from 'react'
import { Modal, Form, Input, Button, Switch, InputNumber, Card, Popover, Progress, notification } from 'antd'
import pinyin from 'tiny-pinyin'
import { connect } from 'dva'
import config from '../../../utils/config'
import { userNo } from '../../../services/system'
import { saveRelationship, editRelationship, checkcustomerNo } from '../../../services/supplySell/relationship'
import styles from '../SupplySell.less'
import AddressCas from '../../../components/AddressCas'

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
const FormItem = Form.Item
const { TextArea } = Input

@Form.create()
@connect(state => ({
  relationship: state.relationship,
}))
export default class RelationModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmLoading: false,
      help: '',
      phone: '',
      userName: '',
      visible: false,
      checked: true,
      init: true,
      userNo: true,
      password: true,
      show: 'block',
      mobile: undefined,
      login: undefined,
      num: '',
      distributorAcronyms: undefined,
      distributorName: '',
      warehouse: {},
      addrClean: false,
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.record.inventorySync !== undefined && this.state.init) {
      this.setState({
        checked: nextProps.record.inventorySync === 0 ? false : !false,
        init: false,
        userNo: false,
        password: false,
        show: 'none',
        distributorAcronyms: nextProps.record.distributorAcronyms,
        warehouse: { province: nextProps.record.province, city: nextProps.record.city, county: nextProps.record.county },
      })
    } else if (nextProps.record.inventorySync === undefined) {
      this.setState({
        show: 'block',
        userNo: true,
        password: true,
        init: true,
      })
    }
  }
  onBlur = () => {
    this.setState({
      visible: false,
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
  switch = (e) => {
    this.setState({
      checked: e,
    })
  }
  userNo = () => {
    this.setState({
      login: this.state.mobile,
    })
  }
  addrSelect = (selectedOptions) => {
    const { setFieldsValue } = this.props.form
    if (selectedOptions[0] === undefined) {
      setFieldsValue({
        addressDetail: [],
      })
    } else {
      setFieldsValue({
        addressDetail: selectedOptions,
      })
    }
    this.setState({
      addrClean: false,
    })
  }
  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
        if (!err) {
          this.setState({
            confirmLoading: true,
          })
          Object.assign(values, { inventorySync: this.state.checked ? 1 : 0 })
          if (values.addressDetail.length === 3) {
            Object.assign(values, {
              province: values.addressDetail[0],
              city: values.addressDetail[1],
              county: values.addressDetail[2],
              acronyms: values.distributorAcronyms,
             })
             delete values.addressDetail
             if (this.props.record.autoNo === undefined) {
              saveRelationship(values).then((json) => {
                if (json) {
                  this.hideModal()
                  this.props.dispatch({
                    type: 'relationship/search',
                  })
                } else {
                  this.setState({
                    confirmLoading: false,
                  })
                }
              })
             } else {
              delete values.userNo
              delete values.password
              Object.assign(values, { distributorNo: this.props.record.distributorNo, autoNo: this.props.record.autoNo })
              editRelationship(values).then((json) => {
                if (json) {
                  if (this.props.expanded) {
                    this.props.getChild()
                  }
                  this.hideModal()
                  this.props.dispatch({
                    type: 'relationship/search',
                  })
                } else {
                  this.setState({
                    confirmLoading: false,
                  })
                }
              })
             }
          } else {
            notification['error']({
              message: '级联地址不完整',
              description: '请选择三级地址',
            })
          }
        }
      })
  }

  // 关闭窗口
  hideModal = () => {
    const { hideModal } = this.props
    this.setState({
      confirmLoading: false,
      visible: false,
      phone: '',
      userName: '',
      checked: true,
      init: true,
      userNo: true,
      password: true,
      show: 'block',
      mobile: undefined,
      login: undefined,
      distributorAcronyms: undefined,
      distributorName: '',
      warehouse: {},
      addrClean: true,
      help: '',
    })
    hideModal()
    this.handleReset()
  }
  // 清空表单
  handleReset = () => {
    this.props.form.resetFields()
  }
  checkDistributorName = (rule, value, callback) => {
    const data = value ? value.split('') : []
    const newData = []
    const ArrayT = []
    if (data.length) {
      data.forEach((ele) => {
        if (pinyin.isSupported()) {
          newData.push(pinyin.convertToPinyin(ele))
        }
      })
      newData.forEach((ele, index) => {
        if (index < 20) {
          ArrayT.push(ele.charAt(0))
        }
      })
      this.setState({
        distributorAcronyms: ArrayT.join(''),
      })
    } else {
      this.setState({
        distributorAcronyms: undefined,
      })
    }
    if (!value) {
      this.setState({
        distributorName: '请输入名称',
      })
      callback('error')
    } else if (value.indexOf(' ') !== -1) {
      this.setState({
        distributorName: '名称不允许输入空格',
      })
      callback('error')
    } else {
      this.setState({
        distributorName: '',
      })
      callback()
    }
  }
  checkPhone = (rule, value, callback) => {
    this.setState({
      mobile: value,
    })
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
        callback()
      }
    }
  }
  checkCustomerNo = (rule, value, callback) => {
    if (!value) {
      callback()
    } else {
      checkcustomerNo({ customerNo: value }).then((json) => {
        if (json) {
          callback()
        } else {
          callback('客户编号重复,请修改')
        }
      })
    }
  }
  checkName = (rule, value, callback) => {
    if (this.props.record.autoNo === undefined) {
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
        userNo({ userNo: value }).then((json) => {
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
    } else {
      callback()
    }
  }
  checkNum = (rule, value, callback) => {
    if (!value) {
      this.setState({
        num: '请输入店铺授权数',
      })
      callback('error')
    } else if (value) {
      if (value < 0) {
        this.setState({
          num: '请输入不小于0的整数',
        })
        callback('error')
      } else if (parseInt(value, 10) !== value) {
        this.setState({
          num: '请输入不带小数位的整数',
        })
        callback('error')
      } else {
        this.setState({
          num: '',
        })
        callback()
      }
    } else {
      this.setState({
        num: '',
      })
      callback()
    }
  }
  checkPassword = (rule, value, callback) => {
    if (this.props.record.autoNo === undefined) {
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
          callback()
        }
      }
    } else {
      callback()
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
    const { getFieldDecorator } = this.props.form
    const { distributorNo, distributorName, contacts, telNo, address, province, city, county, distributorRemark, authorizeShopNum, status } = this.props.record
    const { show } = this.props
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    }
    return (
      <div>
        <Modal
          title={distributorNo !== undefined ? '编辑分销商' : '新增分销商'}
          visible={show}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
          maskClosable={false}
          footer={status !== 0 && status ? [<Button key="back" onClick={this.hideModal}>关闭</Button>] : [
            <Button key="back" onClick={this.hideModal}>取消</Button>,
            <Button key="submit" type="primary" loading={this.state.confirmLoading} onClick={this.handleSubmit}>
              确定
            </Button>,
          ]}
        >
          <Form
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="分销编号"
            >
              {getFieldDecorator('distributorNo', {
                initialValue: distributorNo,
              })(
                <Input placeholder="系统自动生成" size={config.InputSize} readOnly={!false} />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="客户编号"
            >
              {getFieldDecorator('customerNo', {
                // initialValue: customerNo,
                validateTrigger: ['onBlur'],
                rules: [{
                    required: true, message: '请输入客户编号',
                }, {
                  validator: this.checkCustomerNo,
                }],
            })(
              <Input readOnly={status !== 0 && status} size={config.InputSize} placeholder="请输入客户编号" maxLength="100" />
            )}
            </FormItem>
            <FormItem
              help={this.state.distributorName}
              {...formItemLayout}
              label="分销名称"
            >
              {getFieldDecorator('distributorName', {
                initialValue: distributorName,
                rules: [{
                    required: true, message: '请输入名称',
                }, {
                  validator: this.checkDistributorName,
                }],
            })(
              <Input readOnly={status !== 0 && status} size={config.InputSize} placeholder="请输入名称" maxLength="100" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="助记符"
            >
              {getFieldDecorator('distributorAcronyms', {
                initialValue: this.state.distributorAcronyms,
            })(
              <Input readOnly={!false} maxHeight="20" size={config.InputSize} placeholder="根据分销名称生成" maxLength="20" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="联系人"
            >
              {getFieldDecorator('contacts', {
                initialValue: contacts,
                rules: [{
                  required: true, message: '请输入联系人',
                }],
              })(
                <Input readOnly={status !== 0 && status} size={config.InputSize} placeholder="请输入联系人" maxLength="50" />
            )}
            </FormItem>
            <FormItem
              help={this.state.phone}
              {...formItemLayout}
              label="手机号码"
            >
              {getFieldDecorator('telNo', {
                initialValue: telNo,
                rules: [{
                  required: true, message: '请输入手机号码',
                }, {
                  validator: this.checkPhone,
                }],
              })(
                <Input readOnly={status !== 0 && status} onBlur={this.userNo} size={config.InputSize} placeholder="请输入手机号码" maxLength="11" />
            )}
            </FormItem>
            <Card style={{ width: '266px', marginLeft: '114px', display: this.state.show }} hoverable>
              <FormItem
                help={this.state.userName}
                {...formItemLayout}
                label="账号"
              >
                {getFieldDecorator('userNo', {
                  initialValue: this.state.login,
                  validateTrigger: ['onBlur'],
                  rules: [{
                    required: this.state.userNo, message: '请输入账号',
                  }, {
                    validator: this.checkName,
                  }],
                })(
                  <Input autocomplete="off" size={config.InputSize} placeholder="请输入账号" maxLength="20" />
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
                      required: this.state.password, message: '请输入密码',
                    }, {
                      validator: this.checkPassword,
                    }],
                  })(
                    <Input autocomplete="off" onBlur={this.onBlur} type="password" placeholder="请输入密码" maxLength="16" size={config.InputSize} />
                  )}
                </Popover>
              </FormItem>
            </Card>
            <FormItem
              {...formItemLayout}
              label="地址"
            >
              {getFieldDecorator('addressDetail', {
                initialValue: province ? [province, city, county] : '',
                rules: [{
                  required: true, message: '请选择收货地址',
                }],
              })(
                <AddressCas disabled={status !== 0 && status} doClean={this.state.addrClean} addrSelect={this.addrSelect} wh={this.state.warehouse} />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="具体地址"
            >
              {getFieldDecorator('address', {
                initialValue: address,
                rules: [{
                  required: true, message: '请输入具体地址',
                }],
              })(
                <Input readOnly={status !== 0 && status} size={config.InputSize} placeholder="请输入具体地址" maxLength="250" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="库存同步否"
            >
              {getFieldDecorator('inventorySync', {
                // initialValue: enableStatus,
              })(
                <Switch disabled={status !== 0 && status} checked={this.state.checked} onChange={this.switch} />
            )}
            </FormItem>
            <FormItem
              help={this.state.num}
              {...formItemLayout}
              label="店铺授权数"
            >
              {getFieldDecorator('authorizeShopNum', {
                initialValue: authorizeShopNum,
                rules: [{
                  validator: this.checkNum,
                }, {
                  required: true, message: '请输入店铺授权数',
                }],
              })(
                <InputNumber readOnly={status !== 0 && status} size={config.InputSize} step={1} min={0} maxLength="10" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="备注"
            >
              {getFieldDecorator('distributorRemark', {
                initialValue: distributorRemark,
              })(
                <TextArea readOnly={status !== 0 && status} rows={4} maxLength="200" />
            )}
            </FormItem>
          </Form>
        </Modal>
      </div>)
  }
}
