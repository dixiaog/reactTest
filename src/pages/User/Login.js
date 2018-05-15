import React, { Component } from 'react'
import { connect } from 'dva'
import { routerRedux, Link } from 'dva/router'
import { Form, Input, Tabs, Button, Icon, Checkbox, Alert } from 'antd'
import styles from './Login.less'
import { setLocalStorageItem, getLocalStorageItem, checkEmpty } from '../../utils/utils'

const FormItem = Form.Item
const { TabPane } = Tabs

@connect(state => ({
  login: state.login,
}))
@Form.create()
export default class Login extends Component {
  state = {
    type: 'account',
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.login.status) {
      setLocalStorageItem('token', nextProps.login.token)
      setLocalStorageItem('user', JSON.stringify(nextProps.login.userDTO))
      setLocalStorageItem('companyNo', nextProps.login.userDTO.companyNo)
      setLocalStorageItem('nickName', nextProps.login.userDTO.nickName)
      setLocalStorageItem('userName', nextProps.login.userDTO.userName)
      setLocalStorageItem('userNo', nextProps.login.userDTO.userNo)
      setLocalStorageItem('userId', nextProps.login.userDTO.userId)
      setLocalStorageItem('distributorNo', nextProps.login.userDTO.distributorNo)
      setLocalStorageItem('menus', nextProps.login.menus)
      setLocalStorageItem('premissions', nextProps.login.premissions)
      setLocalStorageItem('roles', `${nextProps.login.userDTO.systemRoles},${nextProps.login.userDTO.defineRoles}`)
      this.props.dispatch(routerRedux.push('/'))
    }
  }

  componentWillUnmount() {
    if (!checkEmpty(getLocalStorageItem('token'))) {
      this.props.dispatch(routerRedux.push('/'))
    }
    clearInterval(this.interval)
  }

  onSwitch = (key) => {
    this.setState({
      type: key,
    })
  }

  onGetCaptcha = () => {
    // let count = 59
    // this.setState({ count })
    // this.interval = setInterval(() => {
    //   count -= 1
    //   this.setState({ count })
    //   if (count === 0) {
    //     clearInterval(this.interval)
    //   }
    // }, 1000)
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { type } = this.state
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.props.dispatch({
          type: `login/${type}Submit`,
          payload: values,
        })
      }
    })
  }

  renderMessage = (message) => {
    return <Alert style={{ marginBottom: 24 }} message={message} type="error" showIcon />
  }

  render() {
    const { form, login } = this.props
    const { getFieldDecorator } = form
    const { type } = this.state
    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit}>
          <Tabs animated={false} className={styles.tabs} activeKey={type} onChange={this.onSwitch}>
            <TabPane tab="账户密码登录" key="account">
              {login.status === 'error' && login.type === 'account' && login.submitting === false && this.renderMessage('账户或密码错误')}
              <FormItem>
                {getFieldDecorator('userNo', {
                  rules: [
                    {
                      required: type === 'account',
                      message: '请输入账户名！',
                    },
                  ],
                })(<Input size="large" prefix={<Icon type="user" className={styles.prefixIcon} />} placeholder="001306" />)}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: type === 'account',
                      message: '请输入密码！',
                    },
                  ],
                })(<Input size="large" prefix={<Icon type="lock" className={styles.prefixIcon} />} type="password" placeholder="123456" />)}
              </FormItem>
            </TabPane>
            {/* <TabPane tab="手机号登录" key="mobile">
              {
                login.status === 'error' &&
                login.type === 'mobile' &&
                login.submitting === false &&
                this.renderMessage('验证码错误')
              }
              <FormItem>
                {getFieldDecorator('mobile', {
                  rules: [{
                    required: type === 'mobile', message: '请输入手机号！',
                  }, {
                    pattern: /^1\d{10}$/, message: '手机号格式错误！',
                  }],
                })(
                  <Input
                    size="large"
                    prefix={<Icon type="mobile" className={styles.prefixIcon} />}
                    placeholder="手机号"
                  />
                )}
              </FormItem>
              <FormItem>
                <Row gutter={8}>
                  <Col span={16}>
                    {getFieldDecorator('captcha', {
                      rules: [{
                        required: type === 'mobile', message: '请输入验证码！',
                      }],
                    })(
                      <Input
                        size="large"
                        prefix={<Icon type="mail" className={styles.prefixIcon} />}
                        placeholder="验证码"
                      />
                    )}
                  </Col>
                  <Col span={8}>
                    <Button
                      disabled={count}
                      className={styles.getCaptcha}
                      size="large"
                      onClick={this.onGetCaptcha}
                    >
                      {count ? `${count} s` : '获取验证码'}
                    </Button>
                  </Col>
                </Row>
              </FormItem>
            </TabPane> */}
          </Tabs>
          <FormItem className={styles.additional}>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(<Checkbox className={styles.autoLogin}>自动登录</Checkbox>)}
            <a className={styles.forgot} href="">
              忘记密码
            </a>
            <Button size="large" loading={login.submitting} className={styles.submit} type="primary" htmlType="submit">
              登录
            </Button>
          </FormItem>
        </Form>
        <div className={styles.other}>
          {/* 其他登录方式 */}
          {/* <span className={styles.iconAlipay} />
          <span className={styles.iconTaobao} />
          <span className={styles.iconWeibo} /> */}
          <Link className={styles.register} to="/user/register">
            注册账户
          </Link>
        </div>
      </div>
    )
  }
}
