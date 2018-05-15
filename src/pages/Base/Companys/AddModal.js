/*
 * @Author: Chen Xinjie
 * @Date: 2018-01-02 10:40:53
 * @Last Modified by: Chen Xinjie
 * @Last Modified time: 2018-03-08 10:51:02
 * 新增编辑公司信息维护
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Input, Popover, Progress } from 'antd'
import config from '../../../utils/config'
import { Save } from '../../../services/base/companys'
import styles from './Companys.less'

const FormItem = Form.Item
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
    companys: state.companys,
}))
@Form.create()
export default class CompanyModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      phone: '',
    }
  }
  getPasswordStatus = () => {
    const { form } = this.props
    const value = form.getFieldValue('passWord')
    if (value && value.length > 9) {
      return 'ok'
    }
    if (value && value.length > 5) {
      return 'pass'
    }
    return 'pool'
  }

  handleOk = () => {
    this.handleSubmit()
  }
  handleCancel = () => {
    this.props.form.resetFields()
    this.props.companyModalHidden()
    this.setState({
      phone: '',
    })
  }
  handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        Object.assign(values, {
          enableStatus: 1,
          companyName: values.companyName.trim(),
          shortName: values.shortName.trim(),
         })
        Save(values).then((json) => {
          if (json) {
            const { dispatch } = this.props
            this.props.form.resetFields()
            this.props.companyModalHidden()
            dispatch({
              type: 'companys/search',
            })
          }
        })
      }
    })
  }

  checkPhone = (rule, value, callback) => {
    if (!value) {
      this.setState({
        phone: '请输入管理员账号',
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
    const { company } = this.props
    const { companyName, shortName } = company
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

    return (
      <div>
        <Modal
          maskClosable={false}
          title="编辑公司信息"
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
              label="公司名称"
            >
              {getFieldDecorator('companyName', {
                initialValue: companyName,
                rules: [{
                  required: true, message: '请输入公司名称',
                },
                { max: 25, message: '公司名称不能超过25个字符' }],
            })(
              <Input size={config.InputSize} />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="公司简称"
            >
              {getFieldDecorator('shortName', {
                initialValue: shortName,
                rules: [{
                  required: true, message: '请输入公司简称',
                },
                { max: 10, message: '公司简称不能超过10个字符' }],
            })(
              <Input size={config.InputSize} />
            )}
            </FormItem>
            <FormItem
              help={this.state.phone}
              {...formItemLayout}
              label="管理员账号"
            >
              {getFieldDecorator('userNo', {
                initialValue: '',
                rules: [{
                  required: true, message: '请输入管理员账号',
                },
                {
                  validator: this.checkPhone,
                }],
            })(
              <Input size={config.InputSize} />
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
                {getFieldDecorator('passWord', {
                  rules: [{
                    required: true, message: '请输入密码',
                  }, {
                    validator: this.checkPassword,
                  }],
                })(
                  <Input onBlur={this.onBlur} type="password" autocomplete="new-password" placeholder="请输入密码" maxLength="16" size={config.InputSize} />
                )}
              </Popover>
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}
