import React, { createElement } from 'react'
import PropTypes from 'prop-types'
import { Dropdown, Tabs, Menu, Button, Icon } from 'antd'
import classNames from 'classnames'
import styles from './index.less'
import config from '../../utils/config'
import { saveOtherStore, getOtherStore } from '../../utils/otherStore'
import { setLocalStorageItem } from '../../utils/utils'

const { TabPane } = Tabs
export default class PageHeader extends React.Component {
  static contextTypes = {
    routes: PropTypes.array,
    params: PropTypes.object,
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  }
  constructor(props) {
    super(props)
    this.state = {
      tabList: [],
    }
  }
  componentWillMount() {
    this.setState({
      tabList: this.props.tabList,
    })
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.tabList) {
      this.setState({
        tabList: nextProps.tabList,
      })
    }
  }

  onChange = (key) => {
    if (this.props.onTabChange) {
      this.props.onTabChange(key)
    }
  }
  onEdit = (targetKey, action) => {
    this[action](targetKey)
  }
  getBreadcrumbProps = () => {
    return {
      routes: this.props.routes || this.context.routes,
      params: this.props.params || this.context.params,
      location: this.props.location || this.context.location,
      breadcrumbNameMap: this.props.breadcrumbNameMap || this.context.breadcrumbNameMap,
    }
  }
  itemRender = (route, params, routes, paths) => {
    const { linkElement = 'a' } = this.props
    const last = routes.indexOf(route) === routes.length - 1
    return (last || !route.component)
      ? <span>{route.breadcrumbName}</span>
      : createElement(linkElement, {
        href: paths.join('/') || '/',
        to: paths.join('/') || '/',
      }, route.breadcrumbName)
  }
  remove = (targetKey, cb) => {
    const { tabList } = this.state
    const delIndex = tabList.findIndex(item => item.key === targetKey)
    tabList.splice(delIndex, 1)
    let tempKey
    if (delIndex > 0) {
      tempKey = tabList[delIndex - 1].key
    } else if (delIndex === 0 && tabList.length) {
      tempKey = tabList[delIndex].key
    }
    // 关闭选项卡时,清空对应state数据(state名称需要与model对应)
    const originalStore = JSON.parse(localStorage.getItem('originalStore'))
    if (originalStore) {
      const store = Object.assign(getOtherStore(), { [targetKey]: originalStore[targetKey] })
      console.log(originalStore[targetKey])
      this.props.dispatch({
        type: `${targetKey}/changeState`,
        payload: originalStore[targetKey],
      })
      saveOtherStore(store)
    }
    this.setState({ tabList },
      () => { 
        if (cb){
          cb()
        }  
    })
    if (this.props.onTabChange) {
      this.props.onTabChange(tempKey)
    }
    // window.location.reload()
  }
  handleMenuClick = (e) => {
    switch (e.key) {
      case '-1': {
        const { tabList } = this.state
        const delIndex = tabList.find((item) => { return item.default })
        if (delIndex.tab !== '首页') {
          this.remove(delIndex.key)
        }
        break
      }
      case '-11': {
        const { tabList } = this.state
        const t1 = tabList.find((item) => { return item.key === 'analysis' })
        const t2 = tabList.find((item) => { return item.default })
        if (t1.tab === t2.tab) {
          tabList.splice(0, tabList.length, t1)
        } else {
          tabList.splice(0, tabList.length, t1, t2)
        }
        this.setState({ tabList })
        break
      }
      case '-111': {
        const { tabList } = this.state
        const t1 = tabList.find((item) => { return item.key === 'analysis' })
        const t2 = tabList.find((item) => { return item.default })
        tabList.splice(0, tabList.length, t1, t2)
        this.setState({ tabList })
        const delIndex = tabList.find((item) => { return item.default })
        this.remove(delIndex.key)
        break
      }
      default: break
    }
  }
  handleRefresh = () => {
    if (window.location.href.split('/')[window.location.href.split('/').length - 1] === 'searchOrder') {
      const originalStore = JSON.parse(localStorage.getItem('originalStore'))
      this.props.dispatch({
        type: `search/changeState`,
        payload: originalStore.search,
      })
      this.props.orderClean()
    }
    if (window.location.href.split('/')[window.location.href.split('/').length - 1] === 'moneyCheck') {
      this.props.moneyCheckClean()
    }
    if (window.location.href.split('/')[window.location.href.split('/').length - 1] === 'afterSearch') {
      this.props.afterSearchClean()
    }
    const { tabList } = this.state
    const tIndex = tabList.findIndex((item) => { return item.default })
    const t = tabList.find((item) => { return item.default })
    this.remove(t.key, () => {
      tabList.forEach((item) => { item.default = false })
      tabList.splice(tIndex, 0, t)
      this.setState({ tabList },() => {
        setLocalStorageItem('tabKeys',tabList.filter(e => e.key !== t.key).map(e=>e.key))
        setLocalStorageItem('forceRefresh',t.key)
      })
      this.props.onTabChange(t.key)
    })
    // this.setState({ tabList })
    // this.props.onTabChange(tabList[0].key)
    // console.log(tabList)
  }
  render() {
    const dropDownMenu = (
      <Menu onClick={this.handleMenuClick} className={styles.dropDownMenu}>
        <Menu.Item key="-1">关闭标签</Menu.Item>
        <Menu.Item key="-11">关闭其它全部</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="-111">关闭全部标签</Menu.Item>
      </Menu>)
    const operations = (
      <div >
        <Button onClick={this.handleRefresh} size={config.InputSize} style={{ border: 0, marginRight: 5 }}><Icon type="sync" /> 刷新</Button>
        <Dropdown overlay={dropDownMenu} placement="bottomRight" >
          <Button size={config.InputSize} style={{ border: 0 }}>操作<Icon type="down" /></Button>
        </Dropdown>
      </div>)

    const {
      title, logo, action, content, extraContent, className,
    } = this.props
    const { tabList } = this.state
    const clsString = classNames(styles.pageHeader, className)
    const tabDefaultValue = tabList && (tabList.filter(item => item.default)[0] || tabList[0])
    return (
      <div className={clsString}>
        <div className={styles.detail}>
          {logo && <div className={styles.logo}>{logo}</div>}
          <div className={styles.main}>
            <div className={styles.row}>
              {title && <h1 className={styles.title}>{title}</h1>}
              {action && <div className={styles.action}>{action}</div>}
            </div>
            <div className={styles.row}>
              {content && <div className={styles.content}>{content}</div>}
              {extraContent && <div className={styles.extraContent}>{extraContent}</div>}
            </div>
          </div>
        </div>
        {
          tabList &&
          tabList.length &&
          <Tabs
            hideAdd
            className={styles.tabs}
            activeKey={tabDefaultValue.key}
            onChange={this.onChange}
            type="editable-card"
            tabBarExtraContent={operations}
            onEdit={this.onEdit}
          >
            {
              tabList.map(item => <TabPane tab={item.tab} key={item.key} closable={item.key !== 'analysis'} />)
            }
          </Tabs>
        }
      </div>
    )
  }
}
