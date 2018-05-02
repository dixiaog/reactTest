import React from 'react'
import { Layout, Menu, Icon, Avatar, Dropdown, Tag, message, Spin } from 'antd'
import DocumentTitle from 'react-document-title'
import { connect } from 'dva'
import { Link, Route, Redirect, Switch, routerRedux } from 'dva/router'
import moment from 'moment'
import groupBy from 'lodash/groupBy'
import { ContainerQuery } from 'react-container-query'
import classNames from 'classnames'
// import { getNavData } from '../common/nav'
import PageHeaderLayout from './PageHeaderLayout'
// import { getRouteData } from '../utils/utils'
import config from '../utils/config'
import NotFound from '../routes/Exception/404'
import styles from './BasicLayout.less'
import ModifyPwd from '../routes/System/UserManager/ModifyPwd'

const { Header, Sider, Content } = Layout
const { SubMenu } = Menu

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
}

@connect(state => ({
  currentUser: state.user.currentUser,
  collapsed: state.global.collapsed,
  isMinSize: state.global.isMinSize,
  fetchingNotices: state.global.fetchingNotices,
  notices: state.global.notices,
  menus: state.global.menus,
  tabList: state.global.tabList,
}))
export default class BasicLayout extends React.Component {
  // static childContextTypes = {
  //   location: PropTypes.object,
  //   breadcrumbNameMap: PropTypes.object,
  // }
  constructor(props) {
    super(props)
    // 把一级 Layout 的 children 作为菜单项
    this.state = {
      // openKeys: this.getDefaultCollapsedSubMenus(props),
      tabList: this.props.tabList,
      show: false,
    }
  }
  // getChildContext() {
  //   const { location } = this.props
  //   const routeData = getRouteData('BasicLayout')
  //   const firstMenuData = getNavData().reduce((arr, current) => arr.concat(current.children), [])
  //   const menuData = this.getMenuData(firstMenuData, '')
  //   const breadcrumbNameMap = {}

  //   routeData.concat(menuData).forEach((item) => {
  //     breadcrumbNameMap[item.path] = item.name
  //   })
  //   return { location, breadcrumbNameMap }
  // }
  componentWillMount() {
    const currentK = this.getCurrentMenuSelectedKeys()
    if (currentK[0]) {
      const current = this.props.getRouteData('BasicLayout').find((e) => { return e.path.split('/')[2] === this.getCurrentMenuSelectedKeys()[1] })
      const { tabList } = this.state
      let isHad = false
      tabList.forEach((ele) => {
        Object.assign(ele, { default: false })
        if (ele.key === currentK[1]) {
          isHad = true
          Object.assign(ele, { default: true })
        }
      })
      if (!isHad) {
        tabList.push({
          key: currentK[1],
          path: current.path,
          tab: current.name,
          default: true,
        })
      }
      this.setState({
        tabList,
      })
    }
    this.props.dispatch({
      type: 'global/getMenus',
    })
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'user/fetchCurrent',
    })
  }
  componentWillReceiveProps(nextProps) {
    // console.log('layout nextProps', nextProps)
  }
  componentWillUnmount() {
    clearTimeout(this.resizeTimeout)
  }
  onCollapse = (collapsed) => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    })
  }
  onMenuClick = ({ key }) => {
    if (key === 'logout') {
      this.props.dispatch({
        type: 'login/logout',
      })
    }
    if (key === 'modify') {
      this.setState({
        show: true,
      })
    }
  }
  // 提交用户密码修改
  onSure = (values) => {
    console.log('用户密码', values)
  }
  getMenuData = (data, parentPath) => {
    let arr = []
    data.forEach((item) => {
      if (item.children) {
        arr.push({ path: `${parentPath}/${item.path}`, name: item.name })
        arr = arr.concat(this.getMenuData(item.children, `${parentPath}/${item.path}`))
      }
    })
    return arr
  }
  getDefaultCollapsedSubMenus(props) {
    const currentMenuSelectedKeys = [...this.getCurrentMenuSelectedKeys(props)]
    currentMenuSelectedKeys.splice(-1, 1)
    if (currentMenuSelectedKeys.length === 0) {
      return ['dashboard']
    }
    return currentMenuSelectedKeys
  }
  getCurrentMenuSelectedKeys(props) {
    const { location: { pathname }, menus } = props || this.props
    const keys = pathname.split('/').slice(1)
    if (menus.length) {
      if (keys.length === 1 && keys[0] === '') {
        return [menus[0].key]
      }
    }
    return keys
  }
  getNavMenuItems(menusData, parentPath = '') {
    if (!menusData) {
      return []
    }
    return menusData.map((item) => {
      if (!item.name) {
        return null
      }
      let itemPath
      if (item.path.indexOf('http') === 0) {
        itemPath = item.path
      } else {
        itemPath = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/')
      }
      let title
      if (item.children && item.children.some(child => child.name)) {
        if (parentPath === '') {
          title = item.icon ? (
            this.props.isMinSize ?
          (<Icon type={item.icon} style={{ fontSize: 20 }} />) :
            (
              <span>
                <Icon type={item.icon} />
                <span>{item.name}</span>
              </span>)
          ) : item.name
        } else {
          title = item.icon ? (
            <span>
              <Icon type={item.icon} />
              <span>{item.name}</span>
            </span>
          ) : item.name
        }

        return (
          <SubMenu
            title={
              title
            }
            key={item.key || item.path}
          >
            {this.getNavMenuItems(item.children, itemPath)}
          </SubMenu>
        )
      }
      const icon = item.icon && <Icon type={item.icon} />
      return (
        <Menu.Item className={styles.menuItem} key={item.key || item.path}>
          {
            /^https?:\/\//.test(itemPath) ? (
              <a
                href={itemPath}
                target={item.target}
                onClick={this.addToTablist.bind(this)}
                name={item.name}
                itemk={item.path}
                path={itemPath}
              >
                {icon}<span>{item.name}</span>
              </a>
            ) : (
              <Link
                onClick={this.addToTablist.bind(this)}
                to={itemPath}
                name={item.name}
                itemk={item.path}
                path={itemPath}
                target={item.target}
                replace={itemPath === this.props.location.pathname}
              >
                {icon}<span>{item.name}</span>
              </Link>
            )
          }
        </Menu.Item>
      )
    })
  }

  getPageTitle() {
    const { location } = this.props
    const { pathname } = location
    let title = config.name
    this.props.getRouteData('BasicLayout').forEach((item) => {
      if (item.path === pathname) {
        title = `${item.name} - ${config.name}`
      }
    })
    return title
  }

  getNoticeData() {
    const { notices = [] } = this.props
    if (notices.length === 0) {
      return {}
    }
    const newNotices = notices.map((notice) => {
      const newNotice = { ...notice }
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow()
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id
      }
      if (newNotice.extra && newNotice.status) {
        const color = ({
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        })[newNotice.status]
        newNotice.extra = <Tag color={color} style={{ marginRight: 0 }}>{newNotice.extra}</Tag>
      }
      return newNotice
    })
    return groupBy(newNotices, 'type')
  }

    // 关闭用户密码修改页面
    hideModal = () => {
      this.setState({
        show: false,
      })
    }

  addToTablist = (e) => {
    const { tabList } = this.state
    let isHad = false
    tabList.forEach((ele) => {
      Object.assign(ele, { default: false })
      if (ele.key === e.target.getAttribute('itemk')) {
        isHad = true
        Object.assign(ele, { default: true })
      }
    })
    if (!isHad) {
      tabList.push({
        key: e.target.getAttribute('itemk'),
        path: e.target.getAttribute('path'),
        tab: e.target.getAttribute('name'),
        default: true,
      })
    }
    // this.setState({
    //   tabList,
    // })
    this.props.dispatch({
      type: 'global/changeTabList',
      payload: tabList,
    })
    this.props.dispatch(routerRedux.push(e.target.getAttribute('path')))
    e.preventDefault()
  }
  // handleOpenChange = (openKeys) => {
    // const lastOpenKey = openKeys[openKeys.length - 1]
    // const isMainMenu = this.props.menus.some(
    //   item => lastOpenKey && (item.key === lastOpenKey || item.path === lastOpenKey)
    // )
    // this.setState({
    //   openKeys: isMainMenu ? [lastOpenKey] : [...openKeys],
    // })
  // }
  toggle = () => {
    const { collapsed } = this.props
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: !collapsed,
    })
    this.resizeTimeout = setTimeout(() => {
      const event = document.createEvent('HTMLEvents')
      event.initEvent('resize', true, false)
      window.dispatchEvent(event)
    }, 600)
  }
  handleNoticeClear = (type) => {
    message.success(`清空了${type}`)
    this.props.dispatch({
      type: 'global/clearNotices',
      payload: type,
    })
  }
  handleNoticeVisibleChange = (visible) => {
    if (visible) {
      this.props.dispatch({
        type: 'global/fetchNotices',
      })
    }
  }
  handCleanTab = () => {
    this.setState({
      tabList: [{
        key: 'analysis',
        path: '/dashboard/analysis',
        tab: '首页',
        default: true,
      }],
    })
  }
  handleTabChange = (key) => {
    const { dispatch } = this.props
    const { tabList } = this.state
    const defalutTab = tabList.find((e) => { return e.key === key })
    tabList.forEach((ele) => {
      Object.assign(ele, { default: false })
      if (ele.key === key) {
        Object.assign(ele, { default: true })
      }
    })
    this.setState({
      tabList,
    })
    dispatch(routerRedux.push(defalutTab.path))
  }

  render() {
    const { currentUser, collapsed, menus } = this.props
    const { tabList } = this.state
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item disabled><Icon type="user" />个人中心</Menu.Item>
        <Menu.Item key="modify"><Icon type="user" />修改密码</Menu.Item>
        <Menu.Item disabled><Icon type="setting" />设置</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
      </Menu>
    )

    // Don't show popup menu when it is been collapsed
    const menuProps = collapsed ? {} : {
      // openKeys: this.state.openKeys,
    }
    const layout = (
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsedWidth={0}
          collapsed={collapsed}
          breakpoint="sm"
          onCollapse={this.onCollapse}
          width={0}
          className={styles.sider}
        >
          {/*  <div className={styles.logo}>
            <Link to="/">
              <img src="http://www.bosideng.com/Public/image/header/logo.png" alt="logo" />
              <h1 style={{ fontFamily: 'cursive' }}>雪冰电商</h1>
            </Link>
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            {...menuProps}
            onOpenChange={this.handleOpenChange}
            selectedKeys={this.getCurrentMenuSelectedKeys()}
            style={{ margin: '16px 0', width: '100%' }}
          >
            {this.getNavMenuItems(menus)}
          </Menu> */}
        </Sider>
        <Layout className={styles.mainLayOut}>
          <Header className={styles.header}>
            <Icon
              className={styles.trigger}
              type={collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
              style={{ display: 'none' }}
            />
            <Menu
              mode="horizontal"
              {...menuProps}
              onOpenChange={this.handleOpenChange}
              selectedKeys={this.getCurrentMenuSelectedKeys()}
              style={{ height: 40 }}
            >
              {this.getNavMenuItems(menus)}
            </Menu>
            <div className={styles.right}>
              {/* <HeaderSearch
                className={`${styles.action} ${styles.search}`}
                placeholder="站内搜索"
                dataSource={['搜索提示一', '搜索提示二', '搜索提示三']}
                onSearch={(value) => {
                  console.log('input', value) // eslint-disable-line
                }}
                onPressEnter={(value) => {
                  console.log('enter', value) // eslint-disable-line
                }}
              /> */}
              {/* <NoticeIcon
                className={styles.action}
                count={currentUser.notifyCount}
                onItemClick={(item, tabProps) => {
                  console.log(item, tabProps) // eslint-disable-line
                }}
                onClear={this.handleNoticeClear}
                onPopupVisibleChange={this.handleNoticeVisibleChange}
                loading={fetchingNotices}
                popupAlign={{ offset: [20, -16] }}
              >
                <NoticeIcon.Tab
                  list={noticeData['通知']}
                  title="通知"
                  emptyText="你已查看所有通知"
                  emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
                />
                <NoticeIcon.Tab
                  list={noticeData['消息']}
                  title="消息"
                  emptyText="您已读完所有消息"
                  emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
                />
                <NoticeIcon.Tab
                  list={noticeData['待办']}
                  title="待办"
                  emptyText="你已完成所有待办"
                  emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
                />
              </NoticeIcon> */}
              {currentUser && currentUser.userName ? (
                <Dropdown overlay={menu}>
                  <span className={`${styles.action} ${styles.account}`}>
                    <Avatar size="small" className={styles.avatar} icon="user" src={currentUser.userPicture} />
                    <span id="userName">{this.props.isMinSize ? null : currentUser.userName}</span>
                  </span>
                </Dropdown>
              ) : <Spin size="small" style={{ marginLeft: 8 }} />}
            </div>
          </Header>
          <Content style={{ padding: '24px 24px 0', height: '100%', overflowX: 'hidden' }}>
            <PageHeaderLayout
              tabList={tabList}
              onTabChange={this.handleTabChange}
              onCleanTab={this.handCleanTab}
            >
              <Switch>
                {
                  this.props.getRouteData('BasicLayout').map(item =>
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
                <Redirect exact from="/" to="/dashboard/analysis" />
                <Route component={NotFound} />
              </Switch>
            </PageHeaderLayout>
            {/* <GlobalFooter
              links={[{
                title: 'Pro 首页',
                href: 'http://pro.ant.design',
                blankTarget: true,
              }, {
                title: 'GitHub',
                href: 'https://github.com/ant-design/ant-design-pro',
                blankTarget: true,
              }, {
                title: 'Ant Design',
                href: 'http://ant.design',
                blankTarget: true,
              }]}
              copyright={
                <div>
                  Copyright <Icon type="copyright" /> {config.footerText}
                </div>
              }
            /> */}
          </Content>
        </Layout>
      </Layout>
    )
    return (
      <div>
        <DocumentTitle title={this.getPageTitle()}>
          <ContainerQuery query={query}>
            {params => <div className={classNames(params)}>{layout}</div>}
          </ContainerQuery>
        </DocumentTitle>
        <ModifyPwd show={this.state.show} hideModal={this.hideModal} onSure={this.onSure} />
      </div>
    )
  }
}

