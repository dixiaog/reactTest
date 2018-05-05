import React, { Component } from 'react'
import { connect } from 'dva'
import styles from './IndexPage.css'
import { Menu, Icon, Button, Card, Col, Breadcrumb } from 'antd'

const SubMenu = Menu.SubMenu

@connect(state => ({
  indexPage: state.indexPage,
}))
export default class IndexPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
    }
  }
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    })
  }
  render() {
    return (
      // <div className={styles.normal}>
      //   <h1 className={styles.title}>Yay! Welcome to dva!1111</h1>
      //   <div className={styles.welcome} />
      //   <ul className={styles.list}>
      //     <li>To get started, edit <code>src/index.js</code> and save to reload.</li>
      //     <li><a href="https://github.com/dvajs/dva-docs/blob/master/v1/en-us/getting-started.md">Getting Started</a></li>
      //   </ul>
      // </div>
      <div style={{ height: '100%' }}>
        <Card style={{ height: '100%' }}>
          <Col span={5}>
            <Menu
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              mode="inline"
              theme="dark"
              inlineCollapsed={this.state.collapsed}
              style={{ height: document.body.clientHeight }}
            >
              <Menu.Item key="1">
                <Icon type="pie-chart" />
                <span>Option 1</span>
              </Menu.Item>
              <Menu.Item key="2">
                <Icon type="desktop" />
                <span>Option 2</span>
              </Menu.Item>
              <Menu.Item key="3">
                <Icon type="inbox" />
                <span>Option 3</span>
              </Menu.Item>
              <SubMenu key="sub1" title={<span><Icon type="mail" /><span>Navigation One</span></span>}>
                <Menu.Item key="5">Option 5</Menu.Item>
                <Menu.Item key="6">Option 6</Menu.Item>
                <Menu.Item key="7">Option 7</Menu.Item>
                <Menu.Item key="8">Option 8</Menu.Item>
              </SubMenu>
              <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>Navigation Two</span></span>}>
                <Menu.Item key="9">Option 9</Menu.Item>
                <Menu.Item key="10">Option 10</Menu.Item>
                <SubMenu key="sub3" title="Submenu">
                  <Menu.Item key="11">Option 11</Menu.Item>
                  <Menu.Item key="12">Option 12</Menu.Item>
                </SubMenu>
              </SubMenu>
            </Menu>
          </Col>
          <Col span={19}>
          <Breadcrumb>
            <Breadcrumb.Item><Icon type="home" /></Breadcrumb.Item>
            <Breadcrumb.Item><a href="">Application Center</a></Breadcrumb.Item>
            <Breadcrumb.Item><a href="">Application List</a></Breadcrumb.Item>
            <Breadcrumb.Item>An Application</Breadcrumb.Item>
          </Breadcrumb>
            <Button type="primary" onClick={this.toggleCollapsed} style={{ marginLeft: 16 }}>
              <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
            </Button>
          </Col>
        </Card>
      </div>
    )
  }
}

// IndexPage.propTypes = {
// };

