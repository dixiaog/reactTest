import React from 'react'
import withRouter from 'umi/withRouter'
import Redirect from 'umi/redirect'
import BasicLayout from './BasicLayout'
import PrintLayout from './PrintLayout'
import UserLayout from './UserLayout'
import { LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import { requireAuth } from '../utils/utils'
import Error from '../pages/Exception/401'


class BaseLayout extends React.Component {
  render () {
    const { pathname } = this.props.location
    if (pathname.toLowerCase().split('/')[1] === 'user') {
      return <UserLayout {...this.props} />
    } else if (pathname.toLowerCase().split('/')[1] === 'print'){
      return requireAuth() ?
        <LocaleProvider locale={zhCN}>
          <PrintLayout {...this.props}/>
        </LocaleProvider> : <Redirect to="/User/Login" />
    } else if (pathname === '/Exception/401'){
      return <Error />
    }else {
      return requireAuth() ? <LocaleProvider locale={zhCN}><BasicLayout {...this.props}/></LocaleProvider> : <Redirect to="/User/Login" /> //<Error />
    }
    
  }
}

export default withRouter(BaseLayout)
