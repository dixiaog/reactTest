import React from 'react'
import withRouter from 'umi/withRouter'
import Link from 'umi/link'
import router from 'umi/router'
import { connect } from 'dva'
import DocumentTitle from 'react-document-title'
import { ContainerQuery } from 'react-container-query'
import classNames from 'classnames'
import { Layout, Menu, Icon, Avatar, Dropdown, message, Spin, Tooltip } from 'antd'
import PageHeaderLayout from './PageHeaderLayout'
import styles from './BasicLayout.less'
import config from '../utils/config'
import ModifyPwd from '../pages/System/Users/ModifyPwd'
import { getLocalStorageItem, checkPremission, setLocalStorageItem } from '../utils/utils'
import { GetCompanys } from '../services/base/companys'


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
let loadTime = 0
@connect(state => ({
  currentUser: state.user.currentUser,
  collapsed: state.global.collapsed,
  isMinSize: state.global.isMinSize,
  fetchingNotices: state.global.fetchingNotices,
  notices: state.global.notices,
  menus: state.global.menus,
  tabList: state.global.tabList,
}))
class BasicLayout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tabList: this.props.tabList,
      show: false,
      companyName: '',
    }
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'global/getMenus',
    })
    GetCompanys(getLocalStorageItem('companyNo')).then((json) => {
      if (json) {
        if (json.list && json.list.length) {
          this.setState({
            companyName: json.list[0].companyName,
          })
        }
      }
    })
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'user/fetchCurrent',
    })
  }
  componentWillReceiveProps(nextProps){
    if(loadTime === 0 && nextProps.menus.length) {
      const currentK = this.getCurrentMenuSelectedKeys()
      if (currentK[0]) {
        const current = this.getCurrentMenu(nextProps)
        const { tabList } = this.state
        let isHad = false
        tabList.forEach((ele) => {
          Object.assign(ele, { default: false })
          if (ele.key === currentK[1]) {
            isHad = true
            Object.assign(ele, { default: true })
          }
        })
        if (current && Object.keys(current).length) {
          if (!isHad) {
            tabList.push({
              key: currentK[1],
              path: nextProps.location.pathname,
              tab: current.name,
              default: true,
            })
          }
        } else if (currentK[2] === 'giftStrategy') {
          tabList.push({
            key: currentK[2],
            path: nextProps.location.pathname,
            tab: '赠品规则',
            default: true,
          })
        } else if (currentK[2] === 'approveStrategy') {
        tabList.push({
          key: currentK[2],
          path: nextProps.location.pathname,
          tab: '订单审核',
          default: true,
        })
      } else {
        router.replace('/Exception/404')
        tabList.push({
          key: '404',
          path: '/Exception/404',
          tab: '页面不存在',
          default: true,
        })
      }
        this.setState({
          tabList,
        })
      }
      loadTime ++
    }
  }
  getPageTitle() {
    const { pathname } = this.props.location
    const { tabList } = this.state
    const titlePre = tabList.filter(e => e.path === pathname.toLowerCase())[0]
    return titlePre && titlePre.tab ? `${titlePre.tab}-${config.name}` : config.name
  }
  onCollapse = (collapsed) => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    })
  }
  onMenuClick = ({ key }) => {
    if (key === 'logout') {
      localStorage.clear()
      this.props.dispatch({
        type: 'login/logout',
      })
    }
    if (key === 'modify') {
      this.setState({
        show: true,
      })
    }
    if (key === 'myCompany' && checkPremission('COMPANY_LIST')) {
      const { tabList } = this.props
      let isHad = false
      tabList.forEach((ele) => {
        Object.assign(ele, { default: false })
        if (ele.key === 'companys') {
          isHad = true
          Object.assign(ele, { default: true })
        }
      })
      if (!isHad) {
        tabList.push({
          key: 'companys',
          path: '/base/companys',
          tab: '公司信息',
          default: true,
        })
      }
      this.props.dispatch({
        type: 'global/changeTabList',
        payload: tabList,
      })
      router.push('/base/companys')
    }
  }
  // 提交用户密码修改
  onSure = (values) => {
    console.log('用户密码', values)
  }
  // getMenuData = (data, parentPath) => {
  //   let arr = []
  //   data.forEach((item) => {
  //     if (item.children) {
  //       arr.push({ path: `${parentPath}/${item.path}`, name: item.name })
  //       arr = arr.concat(this.getMenuData(item.children, `${parentPath}/${item.path}`))
  //     }
  //   })
  //   return arr
  // }
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
  // 当前按钮信息
  getCurrentMenu(props) {
    const { location: { pathname }, menus } = props || this.props
    const keys = pathname.split('/').slice(1)
    if (menus.length) {
      const child = menus.filter(e => e.path === keys[0])[0]
      if(child && child.children.length) {
        return child.children.filter(e => e.path === keys[1])[0]
      } else {
        return {}
      }
    }
    return {}
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
    
    // this.props.dispatch(routerRedux.push(e.target.getAttribute('path')))
    router.replace(e.target.getAttribute('path'))
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
  orderClean = () => {
    this.props.dispatch({
      type: 'search/changeState',
      payload: { searchParam: {}, page: {}, selectedRowKeys: [], selectedRows: [] },
    })
  }
  moneyCheckClean = () => {
    this.props.dispatch({
      type: 'moneyCheck/changeState',
      payload: { searchParam: {}, page: {}, selectedRowKeys: [], selectedRows: [] },
    })
  }
  afterSearchClean = () => {
    this.props.dispatch({
      type: 'afterSearch/changeState',
      payload: { searchParam: {}, page: {}, selectedRowKeys: [], selectedRows: [] },
    })
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
    }, () => {
      setLocalStorageItem('tabKeys',tabList.map(e=>e.key) )
      router.replace(defalutTab.path)
    })
  }

  render() {
    const { currentUser, collapsed, menus } = this.props
    const { tabList } = this.state
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key='myCompany'><Icon type="home" />
          {this.state.companyName.length > 8 ?
            <Tooltip placement="topRight" title={this.state.companyName}>{this.state.companyName.substr(0,7)}......</Tooltip> : this.state.companyName}
        </Menu.Item>
        {/* <Menu.Item disabled><Icon type="user" />个人中心</Menu.Item> */}
        <Menu.Item key="modify"><Icon type="user" />修改密码</Menu.Item>
        {/* <Menu.Item disabled><Icon type="setting" />设置</Menu.Item> */}
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
        <div
          id='pic'
          style={{
            position: 'absolute',
            zIndex: '999999',
            display: 'none',
            width: 200,
            height: 200,
          }}
        >
          <img id="img" alt="" style={{ width: 200, height: 200 }} />
        </div>
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
          <Content style={{ height: '100%', overflowX: 'hidden' }}>
            <PageHeaderLayout
              tabList={tabList}
              onTabChange={this.handleTabChange}
              onCleanTab={this.handCleanTab}
              orderClean={this.orderClean}
              moneyCheckClean={this.moneyCheckClean}
              afterSearchClean={this.afterSearchClean}
              dispatch={this.props.dispatch}
            >
            {this.props.children}
            </PageHeaderLayout>
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

export default withRouter(BasicLayout)
