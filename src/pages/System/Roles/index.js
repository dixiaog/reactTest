/*
 * @Author: chenjie
 * @Date: 2017-12-16 17:15:04
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-04-26 14:41:53
 * 角色维护
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Card, Checkbox, Popover, Icon, Col, Row, Input, Alert, message } from 'antd'
import styles from './Roles.less'
import AddRole from './AddRole'
import EditRole from './EditRole'
import { bindRoleMenu } from '../../../services/system'
import { getLocalStorageItem } from '../../../utils/utils'

const Search = Input.Search

const addChecked = (data) => {
  let Num = 0
  data.forEach((ele) => {
    if (ele.children) {
      if (Num === 0) {
        Num++
        Object.assign(ele, { indeterminate: false })
        addChecked(ele.children)
      } else {
        addChecked(ele.children)
      }
    }
    Object.assign(ele, { checked: false })
  })
  return data
}

// 全选/全不选
let status = null
const checkedAll = (data) => {
  data.forEach((ele) => {
    if (ele.children) {
      checkedAll(ele.children)
    }
    Object.assign(ele, { checked: status, indeterminate: false })
  })
  return data
}

@connect(state => ({
    roles: state.roles,
}))
export default class Roles extends Component {
  constructor(props) {
    super(props)
    this.state = {
      checkAllIndeterminate: false, // 全选按钮横岗状态
      checkAll: false, // 全选按钮是否选中
      rolePowers: [],
      showModal: false, // 添加页面
      editModal: false, // 编辑页面
      roleName: '',
      roleNo: null,
      roleLists: [],
      searchRoleNo: null,
      item: {},
      loading: false,
      disFlag: false,
      math: null,
    }
  }

    componentDidMount() {
      this.props.dispatch({ type: 'roles/fetch' })
    }

    componentWillReceiveProps(nextProps) {
      this.setState({
        rolePowers: nextProps.roles.rolePowers,
        roleLists: nextProps.roles.list,
      }, () => this.getMenuT(this.state.item))
    }

    // 本地查询角色
    onChangeSearch = (e) => {
      const { list } = this.props.roles
      const value = e.target.value
      const newArray = []
      list.forEach((ele) => {
        const flag = ele.roleName.indexOf(value)
        if (flag !== -1) {
          newArray.push(ele)
        }
      })
      this.setState({
        roleLists: newArray,
      })
    }

    onCheckAllChange = () => {
      if (this.state.checkAll) {
        status = false
      } else {
        status = true
      }
      const data = checkedAll(this.state.rolePowers, status)
      this.setState({
        rolePowers: data,
        checkAllIndeterminate: false,
        checkAll: !this.state.checkAll,
      })
    }

    // 一级菜单选择
    onChangeOne = (e) => {
      const NewPowerList = this.state.rolePowers
      for (const ele in NewPowerList) {
        if (NewPowerList[ele].key === e.target.fatherKey) {
          NewPowerList[ele].children.forEach((element) => {
            // 改变一级状态
            if (element.key === e.target.selfKey) {
              if (element.children) {
                element.children.forEach((eleChild) => {
                  // 改变二级状态
                  Object.assign(eleChild, { checked: e.target.checked })
                })
              }
              Object.assign(element, { indeterminate: false })
              Object.assign(element, { checked: e.target.checked })
            }
          })
          this.setState({
            rolePowers: NewPowerList,
          })
          // 此处触发全按钮状态
          this.checkAllbtn(NewPowerList)
        }
      }
    }

    // 二级菜单选择
    onChangeTwo = (e) => {
      const NewPowerList = this.state.rolePowers
      for (const ele in NewPowerList) {
        if (NewPowerList[ele].key === e.target.fatherKey) {
          NewPowerList[ele].children.forEach((element) => {
            if (element.children) {
              element.children.forEach((eleChild) => {
                if (eleChild.key === e.target.selfKey) {
                  // 此处表示改变二级菜单CheckBox状态
                  Object.assign(eleChild, { checked: e.target.checked })

                  // 如果是选中状态
                  if (e.target.checked === true) {
                    let checkedSta = true
                    let indeterminateSta = false
                    // 选中的时候如果有一个没选中,那么一级菜单就不选中
                    // 这里改变一级菜单
                    for (const t in element.children) {
                      if (element.children[t].checked === false) {
                        checkedSta = false
                        indeterminateSta = true
                        break
                      }
                    }
                    Object.assign(element, { checked: checkedSta })
                    Object.assign(element, { indeterminate: indeterminateSta })
                  } else { // 如果是取消状态
                    let indeterminateSta = false
                    for (const t in element.children) {
                      if (element.children[t].checked === true) {
                        indeterminateSta = true
                        break
                      }
                    }
                    Object.assign(element, { checked: false })
                    Object.assign(element, { indeterminate: indeterminateSta })
                  }
                  this.setState({
                    rolePowers: NewPowerList,
                  })
                  // 此处触发全按钮状态
                  this.checkAllbtn(NewPowerList)
                }
              })
            }
          })
          break
        }
      }
    }

    // 获取菜单
    getMenu = (item) => {
      const isBeLong = getLocalStorageItem('roles').split(',').indexOf(item.roleNo.toString()) > -1 ? true : false
      let disFlag = false
      if (item.companyNo === 0 && !isBeLong && getLocalStorageItem('userNo') !== 'admin') {
        disFlag = true
      }
      const powers = this.state.rolePowers
      if (item.roleNo !== this.state.searchRoleNo) {
        this.setState({
          searchRoleNo: item.roleNo,
        })
        // 清除rolePowers
        this.setState({
          checkAllIndeterminate: false, // 全选按钮横岗状态
          checkAll: false, // 全选按钮是否选中
          disFlag,
        })
        powers.forEach((ele) => {
          if (ele.children) {
            ele.children.forEach((oneChild) => {
              if (oneChild.children) {
                oneChild.children.forEach((element) => {
                  Object.assign(element, { checked: false, disabled: disFlag })
                })
              }
              Object.assign(oneChild, { indeterminate: false, checked: false, disabled: disFlag })
            })
          }
        })
        const menuList = item.menuList.split(',')
        const permissionList = item.permissionList.split(',')
        // 先查找二级菜单
        permissionList.forEach((menu) => {
          powers.forEach((ele) => {
            if (ele.children) {
              ele.children.forEach((element) => {
                if (element.children) {
                  element.children.forEach((haha) => {
                    if (haha.key === Number(menu)) {
                      Object.assign(haha, { checked: true })
                    }
                  })
                }
              })
            }
          })
        })
        // 再查找一级菜单
        // let trueData = 0
        menuList.forEach((menu) => {
          powers.forEach((ele) => {
            if (ele.children) { // 必定为true
              ele.children.forEach((element) => {
                if (element.children.length) {
                  const trueData = element.children.filter(me => me.checked === true)
                  if (trueData.length === 0) {
                    Object.assign(element, { indeterminate: false, checked: false })
                  } else if (trueData.length === element.children.length) {
                    Object.assign(element, { indeterminate: false, checked: true })
                  } else {
                    Object.assign(element, { indeterminate: true, checked: false })
                  }
                } else {
                  if (element.key === Number(menu)) {
                    Object.assign(element, { checked: true })
                  }
                }
              })
            }
          })
        })
        // 判断全选按钮状态
        let trueNumber = 0
        let childrenNumber = 0
        powers.forEach((ele) => {
          ele.children.forEach((eleT) => {
            const trueData = eleT.children.filter(me => me.checked === true)
            trueNumber = Number(trueNumber) + trueData.length
            childrenNumber = Number(childrenNumber) + eleT.children.length
          })
        })
       if (trueNumber === 0) {
          this.setState({
            checkAllIndeterminate: false, // 全选按钮横岗状态
            checkAll: false, // 全选按钮是否选中
            rolePowers: powers,
          })
        } else if (trueNumber !== childrenNumber) {
          this.setState({
            checkAllIndeterminate: true, // 全选按钮横岗状态
            checkAll: false, // 全选按钮是否选中
            rolePowers: powers,
          })
        } else {
          this.setState({
            checkAllIndeterminate: false, // 全选按钮横岗状态
            checkAll: true, // 全选按钮是否选中
            rolePowers: powers,
          })
        }
      }
    }
    // 获取菜单
    getMenuT = (item) => {
      const powers = this.state.rolePowers
      if (item.roleNo === this.state.searchRoleNo) {
        this.setState({
          searchRoleNo: item.roleNo,
        })
        powers.forEach((ele) => {
          if (ele.children) {
            ele.children.forEach((oneChild) => {
              if (oneChild.children) {
                oneChild.children.forEach((element) => {
                  Object.assign(element, { checked: false })
                })
              }
              Object.assign(oneChild, { indeterminate: false, checked: false })
            })
          }
        })
        const menuList = item.menuList.split(',')
        const permissionList = item.permissionList.split(',')
        // 先查找二级菜单
        permissionList.forEach((menu) => {
          powers.forEach((ele) => {
            if (ele.children) {
              ele.children.forEach((element) => {
                if (element.children) {
                  element.children.forEach((haha) => {
                    if (haha.key === Number(menu)) {
                      Object.assign(haha, { checked: true })
                    }
                  })
                }
              })
            }
          })
        })
        // 再查找一级菜单
        // let trueData = 0
        menuList.forEach((menu) => {
          powers.forEach((ele) => {
            if (ele.children) { // 必定为true
              ele.children.forEach((element) => {
                // trueData = 0
                if (element.children.length) {
                  const trueData = element.children.filter(me => me.checked === true)
                  if (trueData.length === 0) {
                    Object.assign(element, { indeterminate: false, checked: false })
                  } else if (trueData.length === element.children.length) {
                    Object.assign(element, { indeterminate: false, checked: true })
                  } else {
                    Object.assign(element, { indeterminate: true, checked: false })
                  }
                } else {
                  if (element.key === Number(menu)) {
                    Object.assign(element, { checked: true })
                  }
                }
              })
            }
          })
        })

        // 判断全选按钮状态
        let trueNumber = 0
        let childrenNumber = 0
        powers.forEach((ele) => {
          if (ele.children) {
            const trueData = ele.children.filter(me => me.checked === true)
            trueNumber = Number(trueNumber) + trueData.length
            childrenNumber = Number(childrenNumber) + ele.children.length
          }
        })
       if (trueNumber === 0) {
          this.setState({
            rolePowers: powers,
          })
        } else if (trueNumber !== childrenNumber) {
          this.setState({
            rolePowers: powers,
          })
        } else {
          this.setState({
            rolePowers: powers,
          })
        }
      }
    }

    // 全选按钮状态改变
    checkAllbtn = (data) => {
      const NewData = [] // 取出一级和二级菜单数组
      data.forEach((ele) => {
        NewData.push(ele.children)
      })
      const oneArray = [] // 一级菜单checked状态数组
      const twoArray = [] // 二级菜单checked状态数组
      NewData.forEach((ele) => {
        ele.forEach((item) => {
          if (item.children) { // 如果有children,那么取出二级菜单
            oneArray.push(item.checked) // 先把checked放进去
            item.children.forEach((child) => {
              twoArray.push(child.checked)
            })
          } else {
            oneArray.push(item.checked)
          }
        })
      })
      const oneMenu = oneArray.indexOf(false) // 一级菜单没有找到false
      const oneMenuAllTrue = oneArray.indexOf(true) // 一级菜单没有找到true
      const twoMenuAllTrue = twoArray.indexOf(true) // 二级菜单没有找到true
      if (oneMenu === -1) { // 一级菜单没有找到false,表示全选了
        this.setState({
          checkAllIndeterminate: false, // 全选按钮横岗状态
          checkAll: true, // 全选按钮是否选中
        })
      } else if (oneMenuAllTrue === -1 && twoMenuAllTrue === -1) {
        this.setState({
          checkAllIndeterminate: false, // 全选按钮横岗状态
          checkAll: false, // 全选按钮是否选中
        })
      } else {
        this.setState({
          checkAllIndeterminate: true, // 全选按钮横岗状态
          checkAll: false, // 全选按钮是否选中
        })
      }
    }

  // 添加角色
  addRole = () => {
    this.setState({
      showModal: true,
    })
  }

  // 上传角色
  uploadRole = () => {
    this.setState({
      loading: true,
    })
    const data = this.state.rolePowers
    const menuList = []
    const permissionList = []
    data.forEach((ele) => {
      if (ele.children) {
        ele.children.forEach((item) => {
          if (item.children) {
            item.children.forEach((element) => {
              if (element.checked === true) {
                permissionList.push(element.key)
              }
            })
          }
          // 推入一级
          if (item.checked === true || item.indeterminate === true) {
            menuList.push(item.key)
          }
        })
      }
    })
    bindRoleMenu(Object.assign({ menuList: menuList.toString(), permissionList: permissionList.toString(), roleNo: this.state.searchRoleNo })).then((json) => {
      if (json) {
        const params = {}
        Object.assign(params, { menuList: menuList.toString(), permissionList: permissionList.toString(), roleNo: this.state.searchRoleNo })
        this.setState({
          item: params,
        })
        this.props.dispatch({
          type: 'roles/fetchT',
        })
        this.setState({
          loading: false,
        })
        message.success('角色权限绑定成功')
      } else {
        this.setState({
          loading: false,
        })
        message.error('角色权限绑定失败')
      }
    })
  }

  // 隐藏弹窗
  hideModal = () => {
    this.setState({
      showModal: false,
      editModal: false,
    })
  }

  // 编辑成功后更改角色
  update = (roleName) => {
    const roleLists = this.state.roleLists
    const index = roleLists.findIndex(ele => ele.roleNo === this.state.roleNo)
    Object.assign(roleLists[index], { roleName })
    this.setState({
      roleLists,
    })
  }
  // 编辑角色
  editRole = (item) => {
    this.setState({
      roleName: item.roleName,
      roleNo: item.roleNo,
      editModal: true,
    })
  }

    render() {
        const { loading } = this.props.roles
        const { rolePowers } = this.state
        const loop = data => data.map((item) => {
          let edit = null
          let systemIcon = null
          let style = {}
          if (String(item.companyNo) === getLocalStorageItem('companyNo') && item.roleNo === this.state.searchRoleNo && String(item.companyNo) === '0') {
            edit = (
              <a onClick={this.editRole.bind(this, item)}>
                <Icon type="form" style={{ marginLeft: '10px' }} />
              </a>
            )
            systemIcon = <Icon type="star-o" style={{ color: 'red', marginRight: 5 }} />
            style = { margin: '10px', fontWeight: 'bold', color: 'red' }
          } else if (String(item.companyNo) === getLocalStorageItem('companyNo') && item.roleNo === this.state.searchRoleNo && String(item.companyNo) !== '0') {
            edit = (
              <a onClick={this.editRole.bind(this, item)}>
                <Icon type="form" style={{ marginLeft: '10px' }} />
              </a>
            )
            style = { margin: '10px', fontWeight: 'bold', color: 'red' }
          } else if (String(item.companyNo) === getLocalStorageItem('companyNo') && String(item.companyNo) === '0') {
            edit = (
              <a onClick={this.editRole.bind(this, item)}>
                <Icon type="form" style={{ marginLeft: '10px' }} />
              </a>
            )
            systemIcon = <Icon type="star-o" style={{ color: 'red', marginRight: 5 }} />
            style = { margin: '10px' }
          } else if (String(item.companyNo) === getLocalStorageItem('companyNo') && String(item.companyNo) !== '0') {
            edit = (
              <a onClick={this.editRole.bind(this, item)}>
                <Icon type="form" style={{ marginLeft: '10px' }} />
              </a>
            )
            style = { margin: '10px' }
          } else if (String(item.companyNo) !== getLocalStorageItem('companyNo') && item.roleNo === this.state.searchRoleNo && String(item.companyNo) === '0') {
            systemIcon = <Icon type="star-o" style={{ color: 'red', marginRight: 5 }} />
            style = { margin: '10px', fontWeight: 'bold', color: 'red' }
          } else if (String(item.companyNo) !== getLocalStorageItem('companyNo') && item.roleNo === this.state.searchRoleNo && String(item.companyNo) !== '0') {
            style = { margin: '10px', fontWeight: 'bold', color: 'red' }
          } else if (String(item.companyNo) === '0') {
            systemIcon = <Icon type="star-o" style={{ color: 'red', marginRight: 5 }} />
            style = { margin: '10px' }
          } else {
            style = { margin: '10px' }
          }
          const isBeLong = getLocalStorageItem('roles').split(',').indexOf(item.roleNo.toString()) > -1 ? <Icon type="pushpin-o" style={{ color: '#108ee9', marginRight: 5 }} /> : null
          return (
            <div onClick={this.getMenu.bind(this, item)} style={style} key={item.roleNo}>
              {systemIcon}
              {isBeLong}
              {`${item.roleNo} - ${item.roleName}`}
              {edit}
            </div>
          )
        })

        // 循环显示每一个卡片
        const renderPowers = (item, index) => {
          return (
            // 循环显示卡片,调用renderOne循环显示一级菜单
            <Card title={item.name} style={{ marginTop: 10 }} key={index}>
              { item.children.map((ele, oneIndex) => renderOne(ele, oneIndex, item.key)) }
            </Card>
          )
        }
        const renderCheck = (ele, index, key) => {
          return (
            <div key={index} style={{ marginBottom: 8 }}>
              <Checkbox
                key={index}
                value={ele.name}
                onChange={this.onChangeTwo}
                checked={ele.checked}
                fatherKey={key}
                selfKey={ele.key}
                disabled={ele.disabled}
              >
                {ele.name.split('-')[1]}
              </Checkbox>
            </div>
          )
        }
        const Two = (data, key) => {
          return (
            <div>
              { data.map((ele, index) => renderCheck(ele, index, key)) }
            </div>
          )
        }

        // 循环显示每个卡片中的一级CheckBox
        const renderOne = (ele, oneIndex, key) => {
          if (ele.children) {
            return (
              <Col span={6} style={{ marginTop: 10 }} key={oneIndex}>
                <Checkbox
                  key={oneIndex}
                  value={ele.name}
                  onChange={this.onChangeOne}
                  indeterminate={ele.indeterminate}
                  checked={ele.checked}
                  fatherKey={key}
                  selfKey={ele.key}
                  disabled={ele.disabled}
                >
                  {ele.name}
                </Checkbox>
                { ele.children.length ?
                  <Popover content={Two(ele.children, key)} title="功能列表">
                    <Icon type="down-circle" />
                  </Popover> : '' }
              </Col>
            )
          } else {
            return (
              <Col span={6} style={{ marginTop: 10 }} key={oneIndex}>
                <Checkbox
                  key={oneIndex}
                  value={ele.name}
                  onChange={this.onChangeOne}
                  checked={ele.checked}
                  selfKey={ele.key}
                  fatherKey={key}
                  disabled={ele.disabled}
                >
                  {ele.name}
                </Checkbox>
              </Col>
            )
          }
        }

        return (
          <Row style={{ height: '100%', backgroundColor: 'white' }}>
            <Col span={5}>
              <Card bordered={false} loading={loading} className={styles.roleLeft}>
                <Button premission="TRUE" type="primary" icon="plus" size="small" onClick={this.addRole}>添加角色</Button>
                <Search size="small" style={{ marginBottom: 8, marginTop: 8 }} placeholder="请输入角色名称" onChange={this.onChangeSearch} />
                <Card hoverable style={{ marginTop: '10px' }}>
                  <Alert
                    message={
                      <span>
                        <Icon type="star-o" style={{ color: 'red' }} /> 表示系统角色 <br />
                        <Icon type="pushpin-o" style={{ color: '#108ee9' }} /> 表示当前所属 <br />
                      </span>
                    }
                    type="info"
                  />
                  <div style={{ height: document.body.clientHeight - 220, overflowX: 'hidden' }}>
                    {this.state.roleLists.length ? loop(this.state.roleLists) : '未查找到角色'}
                  </div>
                </Card>
              </Card>
            </Col>
            <Col span={19}>
              <div className={styles.rolePowers}>权限列表</div>
              <Card
                bordered={false}
                loading={loading}
                className={styles.roleRight}
                style={{ height: document.body.clientHeight - 120, overflowX: 'hidden' }}
              >
                { this.state.searchRoleNo !== null ?
                  <div>
                    <Checkbox
                      indeterminate={this.state.checkAllIndeterminate}
                      onChange={this.onCheckAllChange}
                      checked={this.state.checkAll}
                      disabled={this.state.disFlag}
                    >
                    全选
                    </Checkbox>
                    { rolePowers.length ? rolePowers.map((item, index) => renderPowers(item, index)) : '' }
                    <Button
                      disabled={this.state.disFlag}
                      loading={this.state.loading}
                      style={{ float: 'right', marginRight: '30px', marginTop: '20px' }}
                      type="primary"
                      onClick={this.uploadRole}
                    >
                      确定
                    </Button>
                  </div> : <div style={{ fontWeight: 'bold', fontSize: 20 }}>点击左侧角色名查看相应权限列表</div> }
              </Card>
            </Col>
            <AddRole show={this.state.showModal} hideModal={this.hideModal} />
            <EditRole update={(roleName) => this.update(roleName)} show={this.state.editModal} hideModal={this.hideModal} roleName={this.state.roleName} roleNo={this.state.roleNo} />
          </Row>
        )
    }
}
