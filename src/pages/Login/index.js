import React, { Component } from 'react'
import { connect } from 'dva'
import DocumentTitle from 'react-document-title'
import { Link } from 'dva/router'
import { Form, Input, Tabs, Button, Icon, Checkbox, Alert } from 'antd'
import styles from './Login.less'

const FormItem = Form.Item
const { TabPane } = Tabs

@connect(state => ({
  login: state.login,
  global: state.global,
}))
@Form.create()
export default class Login extends Component {
  state = {
    type: 'account',
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'global/changeState',
      payload: { title: '登录' },
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.login.toIndex) {
      this.props.dispatch({
        type: 'login/changeState',
        payload: { toIndex: false },
      })
      this.props.dispatch({
        type: 'global/changeState',
        payload: { title: '首页' },
      })
    }
  } 

  onSwitch = (key) => {
    this.setState({
      type: key,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'login/login',
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
      <DocumentTitle title={`测试-${this.props.global.title}`}>
        <div className={styles.login}>
          <div className={styles.main}>
            <Form onSubmit={this.handleSubmit}>
              <Tabs animated={false} className={styles.tabs} activeKey={type} onChange={this.onSwitch}>
                <TabPane tab="账户密码登录" key="account">
                  {login.status === 'error' && login.type === 'account' && login.submitting === false && this.renderMessage('账户或密码错误')}
                  <FormItem>
                    {getFieldDecorator('userNo', {
                      initialValue: 'admin',
                      rules: [
                        {
                          required: type === 'account',
                          message: '请输入账户名！',
                        },
                      ],
                    })(<Input size="large" prefix={<Icon type="user" className={styles.prefixIcon} />} placeholder="admin" />)}
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('password', {
                      initialValue: '123456',
                      rules: [
                        {
                          required: type === 'account',
                          message: '请输入密码！',
                        },
                      ],
                    })(<Input size="large" prefix={<Icon type="lock" className={styles.prefixIcon} />} type="password" placeholder="123456" />)}
                  </FormItem>
                </TabPane>
              </Tabs>
              <FormItem className={styles.additional}>
                {/* {getFieldDecorator('remember', {
                  valuePropName: 'checked',
                  initialValue: true,
                })(<Checkbox className={styles.autoLogin}>自动登录</Checkbox>)} */}
                {/* <a className={styles.forgot} href="">
                  忘记密码
                </a> */}
                <Button size="large" loading={login.submitting} className={styles.submit} type="primary" htmlType="submit">
                  登录
                </Button>
              </FormItem>
            </Form>
            {/* <div className={styles.other}>
              <Link className={styles.register} to="/user/register">
                注册账户
              </Link>
            </div> */}
          </div>
        </div>
      </DocumentTitle>
    )
  }
}
