import React from 'react'
import classNames from 'classnames'
import { Button } from 'antd'
import config from './typeConfig'
import styles from './index.less'

export default ({ className, linkElement = 'a', type, title, desc, img, actions, ...rest }) => {
  const pageType = type in config ? type : '500'
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
        <h1>401</h1>
        <div className={styles.desc}>登陆失效，请重新登陆</div>
        <div className={styles.actions}>
          <Button type="primary" onClick={() => {
            window.location.href = `/#/user/login`
            window.location.reload()
        }}>返回登陆页面</Button>
        </div>
      </div>
    </div>
  )
}
