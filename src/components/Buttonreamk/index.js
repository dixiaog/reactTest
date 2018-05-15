/*
 * @Author: Wupeng
 * @Date: 2017-1-2 10:04:11
 * @Last Modified by;
 * 商品类目按钮
 * @Last Modified time:
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Menu, Dropdown, Icon } from 'antd'
import styles from './index.less'
import Remaxe from './Remaxe'
import DelectModel from './DelectModel'

@connect(state => ({
  category: state.category,
  edit: state.edit,
}))
class Buttonreamk extends Component {
  state = {
    Remaxevis: false,
    value: {},
    handle: [],
    text: null,
    DelectModelvis: false,
  }
  Specclassificationvis = () => {
    this.props.handleSpecclassificationvis()
  }
  handleMenuClick = (e) => {
    // 1 启用 2 禁用
    if (e.key === '1') {
      this.setState({
        Remaxevis: true,
        value: e,
        handle: this.props.handle[6][0].categoryName,
        text: `是否启用${this.props.handle[6][0].categoryName}`,
      })
    } else if (e.key === '2') {
      this.setState({
        Remaxevis: true,
        value: e,
        handle: this.props.handle[6][0].categoryName,
        text: `是否禁用${this.props.handle[6][0].categoryName}`,
      })
    }
  }


    render() {
    const handelCategoryMenu = this.props.handle[0]
    const handelAddSpecifications = this.props.handle[2]
    const handelEmptyingvis = this.props.handle[4]
    const selectedRows = this.props.handle[6]
      const menu = (
        <Menu onClick={this.handleMenuClick}>
          <Menu.Item key="1"><Icon type="check-circle-o" />启用</Menu.Item>
          <Menu.Item key="2"><Icon type="close-circle-o" />禁用</Menu.Item>
        </Menu>
      )
const Remaxedata = {
  Remaxevis: this.state.Remaxevis,
  Remaxeone: this.Remaxeone,
  Remaxetwo: this.Remaxetwo,
  value: this.state.value,
  handle: this.state.handle,
  text: this.state.text,
}

const DelectModeldata = {
  DelectModelvis: this.state.DelectModelvis,
  handelEmptyingvi: handelEmptyingvis,
  DelectModeltwo: this.DelectModeltwo,
}
        return (
          <div>
            <Button type="primary" className={styles.Button} onClick={this.Specclassificationvis} size="small">添加标准分类</Button>
            <Dropdown overlay={menu} disabled={(selectedRows.length === 1) ? false : true}>
              <Button className={styles.Button} size="small" >
        启用/禁用 <Icon type="down" />
              </Button>
            </Dropdown>
            <Button type="primary" className={styles.Button} onClick={handelCategoryMenu} size="small">添加自定义分类</Button>
            <Button type="primary" className={styles.Button} onClick={handelAddSpecifications} disabled={selectedRows.length === 1 ? false : true} size="small">添加类目规格</Button>
            <Button type="primary" className={styles.Button} onClick={this.DelectModelone} size="small">清空所有分类</Button>
            {/* <Button type="primary" className={styles.Button} onClick={handelimportTaobovis} size="small">导入我再淘宝商品的类目</Button> */}
            <Remaxe data={Remaxedata} />
            {this.state.DelectModelvis ? <DelectModel data={DelectModeldata} /> : null}
          </div>
        )
    }
}
export default Buttonreamk
