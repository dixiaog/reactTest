import React, { Component } from 'react'
import { Menu, Icon, Tabs, Dropdown, Avatar, Button, Tooltip } from 'antd'
import { connect } from 'dva'
import router from 'umi/router'
import styles from './PageHeader.less'
import ModifyPwd from './ModifyPwd'

const SubMenu = Menu.SubMenu
const TabPane = Tabs.TabPane
@connect(state => ({
  global: state.global,
  state: state,
}))
export default class PageHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
    }
  }
  componentDidMount() {
    // 浏览器自带刷新,这里要重新刷新页面,本地panes删除当前url页面
    const { tabList, menu } = this.props.global
    window.localStorage.setItem('tabList', JSON.stringify([tabList[0]]))
    window.localStorage.setItem('model', JSON.stringify(this.props.state))
    const url = window.location.href.split('/')[window.location.href.split('/').length -1]
    const index = tabList.findIndex(ele => ele.key === `/${url}`)
    if (index === -1) {
      const index = menu.findIndex(ele => ele.key === `/${url}`)
      if (index === -1) {
        router.push('/Exception/404')
      } else {
        tabList.push({ key: menu[index].key, title: menu[index].tab, url: menu[index].url })
        this.props.dispatch({ 
          type: 'global/changeState',
          payload: { tabList, current: menu[index].key, activeKey: menu[index].key, title: menu[index].tab },
        })
      }
    }
  }
  handleClick = (e) => {
    router.push(`${e.item.props.url}`)
    const { tabList } = this.props.global
    const panelArray = tabList.filter(ele => ele.key === e.key)
    if (!panelArray.length) {
      tabList.push({ key: e.key, title: e.item.props.children, url: e.item.props.url, closable: e.key === '1' ? false : true })
    }
    this.props.dispatch({
      type: 'global/changeState',
      payload: { title: e.item.props.children, tabList, current: e.key, activeKey: e.key },
    })
  }
  onChange = (activeKey) => {
    const { menu, tabList } = this.props.global
    // 把打开的页面存储到本地浏览器
    window.localStorage.setItem('tabList', JSON.stringify(tabList))
    const index = menu.findIndex(ele => ele.key === activeKey)
    this.props.dispatch({
      type: 'global/changeState',
      payload: { title: menu[index].tab, activeKey, current: activeKey },
    })
    router.push(menu[index].url)
  }
  onEdit = (targetKey, action) => {
    this[action](targetKey)
  }
  remove = (targetKey, callBack) => {
    if(targetKey.split('/').join('')) {
      let activeKey = this.props.global.activeKey
      const panesT = this.props.global.tabList
      const tabList = this.props.global.tabList.filter(tabs => tabs.key !== targetKey)
      window.localStorage.setItem('tabList', JSON.stringify(tabList))
      this.props.dispatch({
        type: 'global/changeState',
        payload: { tabList },
      })
      const model = window.localStorage.getItem('model')
      const index = panesT.findIndex(ele => ele.key === targetKey)
      const url = panesT[index].key.split('/').join('')
      this.props.dispatch({
        type: `${url}/changeState`,
        payload: { searchParam: JSON.parse(model)[panesT[index].key.split('/').join('')].searchParam, page: {} },
      })
      if (activeKey === targetKey) {
        this.props.dispatch({
          type: 'global/changeState',
          payload: {
            current: tabList[tabList.length - 1].key,
            activeKey: tabList[tabList.length - 1].key,
            title: tabList[tabList.length - 1].title,
          },
        })
        router.push(`${tabList[tabList.length - 1].url}`)
      }
      this.setState({
      }, () => {
        if (callBack) {
          callBack()
        }
      })
    }
  }
  // 关闭其他全部
  closeOther = () => {
    const tabList = []
    const activeKey = this.props.global.activeKey
    this.props.global.tabList.forEach(ele => {
      if (!ele.closable || ele.key === activeKey) {
        tabList.push(ele)
      }
    })
    this.props.dispatch({
      type: 'global/changeState',
      payload: { tabList },
    })
    window.localStorage.setItem('tabList', JSON.stringify(tabList))
  }
  // 关闭全部标签
  closeAll = () => {
    this.props.dispatch({
      type: 'global/changeState',
      payload: {
        tabList: [{
          key: '/',
          title: '首页', 
          url: '/',
          closable: false,
        }],
        activeKey: '/',
        current: '/',
      },
    })
    window.localStorage.setItem('tabList', JSON.stringify([{
      key: '1',
      title: '首页', 
      url: '/',
      closable: false,
    }]))
    router.push('/')
  }
  logout = () => {
    this.props.dispatch({
      type: 'global/changeState',
      payload: {
        tabList: [{
          key: '1',
          title: '首页', 
          url: '/',
          closable: false,
        }],
        current: '1',
        activeKey: '1',
      },
    })
    window.localStorage.clear()
    window.location.reload()
    router.replace('/login')
  }
  refresh = () => {
    const url = window.location.href.split('/')[window.location.href.split('/').length -1]
    if (url) {
      const url1 = `/${url}`
      this.remove(url1, () => {
        const { menu, tabList } = this.props.global
        const tab1 = menu.filter(ele => ele.key === url1)[0]
        tabList.push({ key: url1, title: tab1.tab, url: tab1.url, closable: url1 === '1' ? false : true })
        this.props.dispatch({
          type: 'global/changeState',
          payload: { title: tab1.tab, tabList, current: url1, activeKey: url1 },
        })
        router.push(tab1.url)
      })
    }
  }
  closeThis = () => {
    this.remove(this.props.global.activeKey)
  }
  hideModal = () => {
    this.setState({
      show: false,
    })
  }
  onSure = (values) => {
    console.log('用户密码', values)
  }
  onUserClick = ({ key }) => {
    if (key === 'myCompany') {
      alert('这是公司')
    }
  }
  render() {
    const { tabList, TabList, current, activeKey } = this.props.global
    const companyName =  window.localStorage.getItem('companyName')
    const menu = (
      <Menu className={styles.dropMenu} onClick={this.onUserClick}>
        <Menu.Item key='myCompany'><Icon type="home" />
          {companyName}
        </Menu.Item>
      </Menu>
    )
    const menuPanel = (
      <Menu style={{ top: 5, left: 10 }}>
        <Menu.Item>
          <a onClick={this.closeThis}>关闭当前标签</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={this.closeOther}>关闭其他全部</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={this.closeAll}>关闭全部标签</a>
        </Menu.Item>
      </Menu>
    )
    const operations = (
      <div >
        <Button onClick={this.refresh} size="small" style={{ border: 0, marginRight: 5 }}><Icon type="sync" /> 刷新</Button>
        <Dropdown overlay={menuPanel} placement="bottomRight" >
          <Button size="small" style={{ border: 0 }}>操作<Icon type="down" /></Button>
        </Dropdown>
      </div>)
    return (
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.left}>
            <Menu
              onClick={this.handleClick}
              selectedKeys={[current]}
              mode="horizontal"
              className={styles.menu}
            >
             {TabList.length && TabList.map((item, index) => 
                <SubMenu key={index} className={styles.menuItem} title={<span><Icon type="setting" />{item.text}</span>}>
                  {item.children && item.children.length ? item.children.map(ele => <Menu.Item key={ele.key} url={ele.url}>{ele.tab}</Menu.Item>) : null}
                </SubMenu>
            )}
            </Menu>
          </div>
          {/* <div className={styles.right}>
            <span> */}
              {/* <Avatar style={{ marginLeft: 10 }} size="small" icon="home" /> */}
              {/* <span style={{ marginLeft: 5, color: '#108EE9' }}>公司:</span>
              {companyName && companyName.length > 4 ?
                <Tooltip placement="topRight" style={{ marginLeft: 6 }} title={companyName}>{companyName.substr(0,3)}......</Tooltip>
                :
                <span style={{ marginLeft: 6 }}>{companyName}</span>}
            </span>
          </div> */}
          <div className={styles.right}>
            <a onClick={this.logout}>退出</a>
          </div>
          <div className={styles.right}>
            <a onClick={() => this.setState({ show: true })}>修改密码</a>
          </div>
          <div className={styles.right}>
            <Dropdown overlay={menu}>
              <span>
                {/* <Avatar size="small" icon="user" /> */}
                <span style={{ color: '#108EE9' }}>用户:</span>
                <span style={{ marginLeft: 6 }}>{window.localStorage.getItem('userName')}</span>
              </span>
            </Dropdown>
          </div>
        </div>
        <div className={styles.tabs}>
          <div className={styles.paneRight}>
            <Tabs
              onChange={this.onChange}
              activeKey={activeKey}
              type="editable-card"
              onEdit={this.onEdit}
              hideAdd={true}
              className={styles.tabs}
              tabBarExtraContent={operations}
            >
            {/* // 
            // activeKey={tabDefaultValue.key} */}
              {tabList.map(tabs => <TabPane tab={tabs.title} key={tabs.key} closable={tabs.closable}>{tabs.content}</TabPane>)}
            </Tabs>
          </div>
          {/* <div className={styles.refresh} style={{ marginLeft: 10, marginRight: 10 }}>
            <Dropdown overlay={menuPanel}>
              <a style={{ color: '#575757' }}>操作 <Icon type="down" /></a>
            </Dropdown>
          </div>
          <div className={styles.refresh} onClick={this.refresh}>
            <Icon type="reload" style={{ fontSize: 12, color: '#08c' }} />刷新
          </div> */}
        </div>
        {this.state.show ? <ModifyPwd show={this.state.show} hideModal={this.hideModal} onSure={this.onSure} /> : null}
      </div>
    )
  }
}
