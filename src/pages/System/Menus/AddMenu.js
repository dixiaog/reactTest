/*
 * @Author: jiangteng
 * @Date: 2017-12-26 17:03:18
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-02-25 09:33:30
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-03-20 13:53:18
 * 添加菜单
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Select, Form, Input, InputNumber, Switch } from 'antd'
import config from '../../../utils/config'
import { getLocalStorageItem } from '../../../utils/utils'
import { saveMenus, editMenus } from '../../../services/sym/menus'

const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input

@Form.create()
@connect(state => ({
  menus: state.menus,
}))
export default class AddMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      checkSwitch: true,
      father: false,
      name: '请选择父级菜单',
      fatherName: undefined,
      quanxian: undefined,
      init: true,
      number: 0,
    }
  }
  componentWillReceiveProps(nextProps) {
      const { enableFlag, menuNo, permissionId } = nextProps.record
      if (this.state.init && enableFlag !== undefined) {
        this.setState({
          checkSwitch: enableFlag === 1,
          init: false,
        })
      }
      const data = this.props.menus.list
      const dataT = this.props.menus.group
      if (this.state.number === 0 || this.state.number === 1) {
        this.setState({
          number: this.state.number + 1,
        })
      }
      dataT.forEach((ele) => {
        if (ele.key === permissionId) {
          this.setState({
            quanxian: ele.value,
          })
        }
      })
      if (menuNo) {
        const array = []
        data.forEach((ele) => {
          if (ele.children) {
            array.push(ele.menuName)
          }
        })
        const flag = array.indexOf(nextProps.record.menuName)
        if (flag !== -1) {
          this.setState({
            father: true,
            name: '父级菜单无需选择',
          })
        } else { // 子菜单,寻找父级
          data.forEach((ele) => {
            if (ele.children) {
              ele.children.forEach((item) => {
                if (item.menuNo === menuNo) {
                  this.setState({
                    fatherName: ele.menuName,
                  })
                }
              })
            }
          })
        }
      }
  }
  // 切换开关
  onSwitch = (checked) => {
    this.setState({
      checkSwitch: checked,
    })
  }
  handleSubmit = () => {
    this.props.form.validateFields({ force: true }, (err, values) => {
        if (!err) {
          Object.assign(values, { enableFlag: this.state.checkSwitch ? 1 : 0 })
          const { menuNo } = this.props.record
          const companyNo = getLocalStorageItem('companyNo')
          const { group, list } = this.props.menus
          if (menuNo) {
            const params = {}
            if (this.state.father) {
              const newChildT = group.filter(ele => ele.value === values.permissionId)
              if (newChildT.length) { // 没有编辑
                params.permissionId = newChildT[0].key
              } else {
                params.permissionId = Number(values.permissionId)
              }
              params.parentMenuNo = null
            } else {
              const newChild = list.filter(ele => ele.menuName === values.fatherName)
              const newChildT = group.filter(ele => ele.value === values.permissionId)
              if (newChild.length) { // 没有编辑
                params.parentMenuNo = newChild[0].menuNo
              } else {
                params.parentMenuNo = Number(values.fatherName)
              }
              if (newChildT.length) { // 没有编辑
                params.permissionId = newChildT[0].key
              } else {
                params.permissionId = Number(values.permissionId)
              }
            }
            Object.assign(params, {
              menuNo: this.props.record.menuNo,
              menuName: values.menuName,
              menuIcon: values.menuIcon,
              menuRoute: values.menuRoute,
              sortOrder: values.sortOrder,
              enableFlag: values.enableFlag,
              menuType: values.menuType,
              remark: values.remark,
              companyNo,
            })
            editMenus(params).then((json) => {
              if (json) {
                this.hideModal()
                this.props.form.resetFields()
                this.props.dispatch({ type: 'menus/fetch' })
              }
            })
          } else {
            const params = {}
            if (values.fatherName === undefined) {
              params.parentMenuNo = null
            } else {
              params.parentMenuNo = Number(values.fatherName)
            }
            Object.assign(params, {
              menuName: values.menuName,
              menuIcon: values.menuIcon,
              menuRoute: values.menuRoute,
              permissionId: group.filter(ele => ele.value === values.permissionId)[0].key,
              sortOrder: values.sortOrder,
              enableFlag: values.enableFlag,
              menuType: values.menuType,
              remark: values.remark,
              companyNo,
            })
            saveMenus(params).then((json) => {
              if (typeof json === 'boolean' && json) {
                this.hideModal()
                this.props.form.resetFields()
                this.props.dispatch({ type: 'menus/fetch' })
              }
            })
          }
        }
      })
  }
  // 关闭窗口
  hideModal = () => {
    this.setState({
      checkSwitch: true,
      father: false,
      init: true,
      fatherName: undefined,
      quanxian: undefined,
      name: '请选择父级菜单',
      number: 0,
      // fa: false,
    })
    const { hideModal } = this.props
    hideModal()
    this.handleReset()
  }

  // 清空表单
  handleReset = () => {
    this.props.form.resetFields()
  }

  // 选择父级菜单
  handleChange = (value) => {
    console.log(`selected ${value}`)
  }

  // 选择权限资源
  handleChangeRole = (value) => {
    console.log(`selected ${value}`)
  }
  permissionIdCheck = (rule, value, cb) => {
    let flag = false
    for (let i = 0; i < this.props.menus.group.length; i++) {
      if (this.props.menus.group[i].value === value) {
        flag = true
        break
      } else {
        flag = false
      }
    }
    if (!flag) {
      cb('权限不存在')
    }
    cb()
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { menuNo, menuName, menuIcon, menuRoute, sortOrder, remark, menuType } = this.props.record
    const { show } = this.props
    const { group } = this.props.menus
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    }
    // 循环显示Option
    const renderOption = (item) => {
        return (
          <Option key={item.menuNo}>{item.menuName}</Option>
        )
    }
    return (
      <div>
        <Modal
          title={menuNo ? '编辑菜单' : '添加菜单'}
          visible={show}
          onOk={this.handleSubmit}
          onCancel={this.hideModal}
          bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
          maskClosable={false}
        >
          <Form>
            <FormItem
              {...formItemLayout}
              label="父级菜单"
            >
              {getFieldDecorator('fatherName', {
                initialValue: this.state.father && menuNo ? '父级菜单无需选择' : this.state.fatherName,
                rules: [{
                  required: false, message: '请选择父级菜单',
                }],
              })(
                <Select
                  size={config.InputSize}
                  placeholder={this.state.name}
                  onChange={this.handleChange}
                  style={{ marginTop: 4 }}
                  disabled={this.state.father}
                >
                  { this.props.menus.list.length ? this.props.menus.list.map((item, index) => renderOption(item, index)) : ''}
                </Select>
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="名称"
            >
              {getFieldDecorator('menuName', {
                initialValue: menuName,
                rules: [{
                    required: true, message: '请输入菜单名称',
                }],
            })(
              <Input size={config.InputSize} placeholder="请输入菜单名称" maxLength="20" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="图标"
            >
              {getFieldDecorator('menuIcon', {
                initialValue: menuIcon,
                rules: [{
                    required: true, message: '请输入图标名称',
                }],
            })(
              <Input size={config.InputSize} placeholder="请输入图标名称" maxLength="50" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="路由"
            >
              {getFieldDecorator('menuRoute', {
                initialValue: menuRoute,
                rules: [{
                    required: true, message: '请输入路由',
                }],
            })(
              <Input size={config.InputSize} placeholder="请输入路由" maxLength="100" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="权限资源"
            >
              {getFieldDecorator('permissionId', {
                // initialValue: this.state.permissionTitle,
                initialValue: this.state.quanxian,
                validateTrigger: ['onBlur'],
                rules: [{
                  required: true, message: '请选择权限资源',
                }, {
                  validator: this.permissionIdCheck,
                }],
              })(
                <Select
                  size={config.InputSize}
                  placeholder="请选择权限资源"
                  onChange={this.handleChangeRole}
                  style={{ marginTop: 4 }}
                  mode="combobox"
                  // disabled={this.state.father || !this.state.fa}
                >
                  {group.length ? group.map((ele, index) => <Option value={ele.value} key={index}>{ele.value}</Option>) : ''}
                </Select>
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="索引"
            >
              {getFieldDecorator('sortOrder', {
                initialValue: sortOrder,
              })(
                <InputNumber min={1} size={config.InputSize} maxLength="4" />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="类型"
            >
              {getFieldDecorator('menuType', {
                initialValue: menuType ? menuType : 0,
              })(
                <Select
                  size={config.InputSize}
                  style={{ marginTop: 4, width: 90 }}
                >
                  <Option value={0} key={0}>电脑</Option>
                  <Option value={1} key={1}>PDA</Option>
                </Select>
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="启用"
            >
              {getFieldDecorator('enableFlag')(
                <Switch checked={this.state.checkSwitch} onChange={this.onSwitch} />
            )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="备注"
            >
              {getFieldDecorator('remark', {
                initialValue: remark,
              })(
                <TextArea rows={4} maxLength="200" />
            )}
            </FormItem>
          </Form>
        </Modal>
      </div>)
  }
}
