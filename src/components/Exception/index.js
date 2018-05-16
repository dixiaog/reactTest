import React, { createElement } from 'react'
import classNames from 'classnames'
import { Button } from 'antd'
import { connect } from 'dva'
import config from './typeConfig'
import styles from './index.less'

@connect(state => ({
  global: state.global,
}))
class BaseLayout extends React.Component {
  render () {
    const { className, linkElement = 'a', type, title, desc, img, actions, ...rest } = this.props
    const pageType = type in config ? type : '404'
    const clsString = classNames(styles.exception, className)
    return (
      <div className={clsString} {...rest}>
        <div className={styles.imgBlock}>
          <div
            className={styles.imgEle}
            style={{ backgroundImage: `url(${img || config[pageType].img})` }}
          />
        </div>
        <div className={styles.content}>
          <h1>{title || config[pageType].title}</h1>
          <div className={styles.desc}>{desc || config[pageType].desc}</div>
          <div className={styles.actions}>
            {
              actions ||
                createElement(linkElement, {
                  to: '/',
                  href: '/',
                }, <Button type="primary" onClick={() => {
                  this.props.dispatch({
                    type: 'global/changeState',
                    payload: { title: '首页', current: '/',  activeKey: '/' },
                  })
                }}>返回首页</Button>)
            }
          </div>
        </div>
      </div>
    )
  }
}

export default (BaseLayout)
