import React from 'react'
// import { Link } from 'dva/router'
import DocumentTitle from 'react-document-title'
// import { Icon } from 'antd'
import styles from './UserLayout.less'
// import { getRouteData } from '../utils/utils'
import config from '../utils/config'

// const copyright = <div>Copyright <Icon type="copyright" /> {config.footerText}</div>

class UserLayout extends React.PureComponent {
  render() {
    return (
      <DocumentTitle title={config.name}>
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.header}>
              {/* <Link to="/">
                <img alt="" className={styles.logo} src="../assets/2018logo.png" />
              </Link> */}
            </div>
            {/* <div className={styles.desc}>全国最大、生产设备最为先进的品牌羽绒服生产商</div> */}
          </div>
          {this.props.children}
          {/* <GlobalFooter className={styles.footer} links={links} copyright={copyright} /> */}
        </div>
      </DocumentTitle>
    )
  }
}

export default UserLayout
