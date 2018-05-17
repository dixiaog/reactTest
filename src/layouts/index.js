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
    const { tabList, panes } = this.props.global
    if (pathname === '/login') {
      return <Login />
    } else if (window.localStorage.getItem('token')) {
      let flag = []
      if (tabList && tabList.length) {
        flag = tabList.filter(ele => ele.url === pathname)
        const index = panes.findIndex(ele => ele.url === pathname)
        if (index === -1) {
          const index = tabList.findIndex(ele => ele.url === pathname)
          if(index !== -1) {
            panes.push({ key: tabList[index].key, title: tabList[index].tab, url: tabList[index].url })
            this.props.dispatch({ 
              type: 'global/changeState',
              payload: { panes, current: tabList[index].key, activeKey: tabList[index].key, title: tabList[index].tab },
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