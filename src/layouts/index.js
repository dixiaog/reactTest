// import Redirect from 'umi/redirect'
import { LocaleProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import React from 'react'
import withRouter from 'umi/withRouter'
import { connect } from 'dva'
import Title from './Title'
import Login from '../pages/Login/index'
import Error404 from '../pages/Exception/404.js'
import Error401 from '../pages/Exception/401.js'

@connect(state => ({
  global: state.global,
}))
class BaseLayout extends React.Component {
  render () {
    const { pathname } = this.props.location
    const { menu, tabList } = this.props.global
    if (pathname === '/login') {
      return <Login />
    } else if (window.localStorage.getItem('token')) {
      let flag = []
      if (menu && menu.length) {
        flag = menu.filter(ele => ele.url === pathname)
        const index = tabList.findIndex(ele => ele.url === pathname)
        if (index === -1) {
          const index = menu.findIndex(ele => ele.url === pathname)
          if(index !== -1) {
            tabList.push({ key: menu[index].key, title: menu[index].tab, url: menu[index].url })
            this.props.dispatch({ 
              type: 'global/changeState',
              payload: { tabList, current: menu[index].key, activeKey: menu[index].key, title: menu[index].tab },
            })
          }
        }
      }
      if (flag.length) {
        return (
          <LocaleProvider locale={zh_CN}>
            <div>
              <Title />
              {this.props.children}
            </div>
          </LocaleProvider>
        )
      } else {
        return (
          <Error404 />
        )
      }
    } else {
      // return <Redirect to="/login" />
      return <Error401 />
    }
  }
}

export default withRouter(BaseLayout)