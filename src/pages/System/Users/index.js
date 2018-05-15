/*
 * @Author: jiangteng
 * @Date: 2017-12-22 17:40:30
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-14 16:40:12
 * 用户列表
 */

import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Card, Button, Input, Select, Dropdown, Menu, Icon, Avatar, message, Tag } from 'antd'
import styles from '../System.less'
import SearchBar from '../../../components/SearchBar'
import Jtable from '../../../components/JcTable'
import EditUser from './EditUser' // 编辑用户
import AddUser from './AddUser' // 添加用户
import ForceModify from './ForceModify' // 管理员强制修改密码
import ModifyRole from './ModifyRole' // 批量修改角色
import BindShop from './BindShop' // 批量绑定店铺
import BindBusMan from './BindBusMan' // 批量绑定分销商
import ImportUser from './ImportUser' // 批量绑定分销商
import { checkPremission } from '../../../utils/utils'
import { download } from '../../../services/system'

const { Option, OptGroup } = Select

@connect(state => ({
  users: state.users,
}))
export default class UserManager extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showEdit: false, // 控制是否展示编辑用户
      showAdd: false, // 控制是否展示新建用户
      showForce: false, // 控制是否展示管理员修改密码
      modifyRole: false, // 控制是否展示批量修改密码
      bindShop: false, // 控制是否展示批量绑定店铺
      bindBusMan: false, // 控制是否展示批量绑定分销商
      importUser: false, // 控制是否展示导入用户
      userRecord: {}, // 用户信息
      selectedRow: [], // 选中的用户信息
      modal: false,
      title: '',
    }
  }

  componentDidMount() {
    this.props.dispatch({ type: 'users/fetch' })
  }

  // 创建用户
  createUser = () => {
    this.setState({
      showAdd: true,
    })
  }

  // 强制修改密码
  editPwd = (selectedRows) => {
    if (selectedRows.length === 0) {
      message.warning('请选择一位用户进行密码重置')
    } else if (selectedRows.length !== 1) {
      message.warning('只能选择一位用户进行密码重置')
    } else {
      this.setState({
        showForce: true,
        selectedRow: selectedRows, // 保存选中的用户信息
      })
    }
  }

  // 批量修改角色
  bindRole = (selectedRows) => {
    if (selectedRows.length === 0) {
      message.warning('至少选择一位用户')
    } else {
      this.setState({
        modifyRole: true,
      })
    }
  }

  // 批量绑定店铺
  bindShop = (selectedRows) => {
    if (selectedRows.length === 0) {
      message.warning('至少选择一位用户')
    } else {
      this.setState({
        bindShop: true,
      })
    }
  }

  // 批量绑定分销商
  bindTman = (selectedRows) => {
    if (selectedRows.length === 0) {
      message.warning('至少选择一位用户')
    } else {
      this.setState({
        bindBusMan: true,
      })
    }
  }

  // 用户导入
  importUser = () => {
    this.setState({
      importUser: true,
    })
  }

  // 用户导入模板下载
  userDown = () => {
    download()
  }

  // 编辑用户信息表
  editHandler = (record) => {
    this.setState({
      showEdit: true,
      userRecord: record,
    })
  }

  // 隐藏用户Modal
  hideModal = () => {
    this.setState({
      showEdit: false,
      showAdd: false,
      showForce: false,
      modifyRole: false,
      bindShop: false,
      bindBusMan: false,
      importUser: false,
      modal: false,
    })
  }

  // 禁用/启用
  showConfirm = (key) => {
    if (this.props.users.selectedRows.length === 0) {
      message.warning('至少选择一位用户')
    } else if (key.key === '1') {
      this.setState({
        title: '启用',
        modal: true,
      })
    } else {
      this.setState({
        title: '禁用',
        modal: true,
      })
    }
  }

  // 启用或者禁用
  ableOrUnable = () => {
    if (this.state.title === '启用') {
      this.props.dispatch({
        type: 'users/enable',
        payload: 'Y',
      })
    } else {
      this.props.dispatch({
        type: 'users/enable',
        payload: 'N',
      })
    }
    this.setState({
      modal: false,
    })
  }

  renderRole = (ele, index) => {
    return <Option value={ele.value} key={index}>{ele.label}</Option>
  }

  render() {
    const { list, total, loading, selectedRows, selectedRowKeys, page, searchParam, sysRole, defRole } = this.props.users
    const searchBarItem = [ // 搜索栏
      {
        decorator: 'userNo',
        components: (<Input placeholder="请输入用户名" size="small" />),
      },
      {
        decorator: 'userNameJ',
        components: (<Input placeholder="请输入姓名" size="small" />),
      },
      {
        decorator: 'roleNo',
        components: (
          <Select
            style={{ width: '100%', marginTop: '3px' }}
            size="small"
            placeholder="请选择角色"
          >
            <OptGroup label="系统角色">
              { sysRole.length ? sysRole.map((ele, index) => this.renderRole(ele, index)) : ''}
            </OptGroup>
            <OptGroup label="自定义角色">
              { defRole.length ? defRole.map((ele, index) => this.renderRole(ele, index)) : ''}
            </OptGroup>
          </Select>
        ),
      },
    ]

    const menu = (
      <Menu onClick={this.showConfirm.bind(this)}>
        <Menu.Item key="1">启用</Menu.Item>
        <Menu.Item key="2">禁用</Menu.Item>
      </Menu>
    )

    const searchBarProps = {
      colItems: searchBarItem,
      dispatch: this.props.dispatch,
      nameSpace: 'users',
      searchParam,
    }

    // 操作栏
    const tabelToolbar = [
      <Button key={1} premission="USER_MANAGE_ADD" icon="plus" type="primary" size="small" onClick={this.createUser.bind(this)} >创建用户</Button>,
      <Button
        key={2}
        type="primary"
        premission="USER_MANAGE_FORCEPAS"
        size="small"
        disabled={!selectedRows.length}
        onClick={this.editPwd.bind(this, selectedRows)}
      >重置密码
      </Button>,
      <Dropdown key={3} disabled={!selectedRows.length} premission="USER_MANAGER_ISVALID" overlay={menu}>
        <Button type="primary" size="small">
          启用/禁用 <Icon type="down" />
        </Button>
      </Dropdown>,
      <Button key={4} premission="USER_MANAGE_BINDROLE" disabled={!selectedRows.length} type="primary" size="small" onClick={this.bindRole.bind(this, selectedRows)} >批量修改角色</Button>,
      <Button key={5} premission="USER_MANAGE_BINDSHOP" disabled={!selectedRows.length} type="primary" size="small" onClick={this.bindShop.bind(this, selectedRows)} >批量绑定店铺</Button>,
      <Button key={6} premission="USER_MANAGER_IMPORTU" type="primary" size="small" onClick={this.importUser.bind(this)} >用户导入</Button>,
      <Button key={7} premission="USER_MANAGER_DOWN" type="primary" size="small" onClick={this.userDown.bind(this)} >用户导入模板下载</Button>,
    ]
    const columns = [{
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      width: 60,
      render: (text, record, index) => {
        return (
          <span>
            {index + 1}
          </span>
          )
        },
    },
    {
      title: '操作',
      key: 'operation',
      width: 60,
      render: (text, record) => {
        return (
          <div>
            {
            checkPremission('USER_MANAGE_EDIT') ?
              <a onClick={this.editHandler.bind(this, record)}>编辑</a> : null
            }
          </div>
        )
      },
    },
    {
      title: '用户名',
      dataIndex: 'userNo',
      key: 'userNo',
      width: 100,
    },
    {
      title: '角色',
      dataIndex: 'Role',
      key: 'Role',
      width: 160,
      render: (text, record) => {
        if (record.defineRoleName) {
          return record.defineRoleName
        } else {
          return record.systemRoleName
        }
      },
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
      key: 'nickName',
      width: 120,
    },
    {
      title: '头像',
      dataIndex: 'userPicture',
      key: 'userPicture',
      width: 80,
      render: (text, record) => {
        if (record.userPicture === '') {
          return <Avatar shape="square" icon="user" />
        } else {
          return <Avatar shape="square" src={text} />
        }
      },
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      key: 'userName',
      width: 80,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: 80,
      render: (text) => {
        if (text === 'FEMALE') {
          return '女'
        } else if (text === 'MALE') {
          return '男'
        } else {
          return '保密'
        }
      },
    },
    {
      title: '手机',
      dataIndex: 'mobileNo',
      key: 'mobileNo',
      width: 100,
    },
    {
      title: '所属公司',
      dataIndex: 'distributorNo',
      key: 'distributorNo',
      width: 120,
      render: (text, record) => {
        if (record.distributorNo === 0) {
          return '本公司'
        } else {
          return record.distributorName
        }
      },
    },
    {
      title: '电子邮箱',
      dataIndex: 'emailNo',
      key: 'emailNo',
      width: 180,
    },
    {
      title: '店铺名称',
      dataIndex: 'storeName',
      key: 'storeName',
      width: 160,
    },
    {
      title: '状态',
      dataIndex: 'validFlag',
      key: 'validFlag',
      width: 80,
      render: (text, record) => {
        if (record.validFlag === 'Y') {
          return <Tag color="#108ee9">启用</Tag>
        } else {
          return <Tag color="#f50">禁用</Tag>
        }
      },
    },
  ]
    // 表格参数
    const tableProps = {
      rowSelection: {
        hideDefaultSelections: true,
      },
      toolbar: tabelToolbar,
      dataSource: list,
      total,
      ...page,
      loading,
      columns,
      nameSpace: 'users',
      dispatch: this.props.dispatch,
      selectedRows,
      selectedRowKeys,
      scroll: { x: 1600 },
      rowKey: 'userIdJson',
      tableName: 'usersTable',
    }
    return (
      <div>
        <Card bordered={false} className={styles.contentBoard}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <SearchBar {...searchBarProps} />
            </div>
            <Jtable {...tableProps} />
          </div>
        </Card>
        {this.state.showEdit ? <EditUser show={this.state.showEdit} record={this.state.userRecord} hideModal={this.hideModal} /> : null}
        {this.state.showAdd ? <AddUser show={this.state.showAdd} hideModal={this.hideModal} /> : null}
        {this.state.showForce ? <ForceModify show={this.state.showForce} hideModal={this.hideModal} record={this.state.selectedRow} /> : null}
        {this.state.modifyRole ? <ModifyRole show={this.state.modifyRole} hideModal={this.hideModal} /> : null}
        {this.state.bindShop ? <BindShop show={this.state.bindShop} hideModal={this.hideModal} /> : null}
        {this.state.bindBusMan ? <BindBusMan show={this.state.bindBusMan} hideModal={this.hideModal} /> : null}
        {this.state.importUser ? <ImportUser show={this.state.importUser} hideModal={this.hideModal} /> : null}
        <Modal
          title={`${this.state.title}用户`}
          visible={this.state.modal}
          onOk={this.ableOrUnable}
          onCancel={this.hideModal}
          okText="确认"
          cancelText="取消"
          closable={false}
          maskClosable={false}
        >
          <p style={{ fontSize: 16 }}>
            <Icon
              type="question-circle-o"
              style={{ color: '#08c', fontWeight: 'bold', marginRight: 10 }}
            />
            {this.props.users.selectedRows.length === 1 ? `是否${this.state.title}选中用户` : `是否批量${this.state.title}用户`}
          </p>
        </Modal>
      </div>
    )
  }
}
