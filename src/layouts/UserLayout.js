import React from 'react'
import PropTypes from 'prop-types'
import { Link, Route } from 'dva/router'
import DocumentTitle from 'react-document-title'
import { Icon } from 'antd'
import styles from './UserLayout.less'
// import { getRouteData } from '../utils/utils'
import config from '../utils/config'

const links = [{
  title: '帮助',
  href: '',
}, {
  title: '隐私',
  href: '',
}, {
  title: '条款',
  href: '',
}]

const copyright = <div>Copyright <Icon type="copyright" /> {config.footerText}</div>

class UserLayout extends React.PureComponent {
  // static childContextTypes = {
  //   location: PropTypes.object,
  // }
  // getChildContext() {
  //   const { location } = this.props
  //   return { location }
  // }
  getPageTitle() {
    const { location } = this.props
    const { pathname } = location
    let title = '雪冰电商'
    this.props.getRouteData('UserLayout').forEach((item) => {
      if (item.path === pathname) {
        title = `${item.name} - 雪冰电商`
      }
    })
    return title
  }
  render() {
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="" className={styles.logo} src="http://www.bosideng.com/Public/image/header/logo.png" />
              </Link>
            </div>
            <div className={styles.desc}>全国最大、生产设备最为先进的品牌羽绒服生产商</div>
          </div>
          {
            this.props.getRouteData('UserLayout').map(item =>
              (
                <Route
                  exact={item.exact}
                  key={item.path}
                  path={item.path}
                  component={item.component}
                />
              )
            )
          }
          {/* <GlobalFooter className={styles.footer} links={links} copyright={copyright} /> */}
        </div>
      </DocumentTitle>
    )
  }
}

export default UserLayout
