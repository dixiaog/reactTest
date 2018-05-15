import React, { Component } from 'react'
import { connect } from 'dva'
import { Table, Icon, Button, Checkbox, Dropdown, Menu, message } from 'antd'
import styles from './Menus.less'
import AddMenu from './AddMenu'
import { editEnableFlag } from '../../../services/sym/menus'
import { checkPremission, getLocalStorageItem } from '../../../utils/utils'

@connect(state => ({
    menus: state.menus,
}))
export default class Menus extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expandedRowKeys: [],
      showModal: false,
      record: {},
      selectedRows: [],
    }
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'menus/fetch',
    })
  }
  componentWillReceiveProps(nextProps) {
    const { list } = nextProps.menus
    const menuNo = []
    if (this.props.menus.list.length !== list.length && list.length) {
      list.forEach((ele) => {
        menuNo.push(ele.menuNo)
      })
      this.setState({
        expandedRowKeys: menuNo,
      })
    } else {
      list.forEach((ele) => {
        menuNo.push(ele.menuNo)
      })
      this.setState({
        expandedRowKeys: menuNo,
      })
    }
  }

  handleMenuClick = (e) => {
    const values = {}
    if (e.key * 1 === 0) {
      Object.assign(values, {
        Enable: 0,
      })
    } else if (e.key * 1 === 1) {
      Object.assign(values, {
        Enable: 1,
      })
    }
      const ids = []
      this.state.selectedRows.forEach((ele) => {
        if ((e.key > ele.enableFlag) || (e.key < ele.enableFlag)) {
          if (ele.ID === undefined) {
            ids.push(ele.menuNo)
          } else {
            ids.push(ele.ID)
          }
        }
      })
      if (ids.length === 0) {
        message.warn('未选择菜单或状态无需变更')
      } else {
        Object.assign(values, {
          IDLst: ids,
        })
        editEnableFlag(values).then((json) => {
          if (json) {
            this.props.dispatch({
              type: 'menus/fetch',
            })
            const data = this.state.selectedRows
            data.forEach((ele) => {
              Object.assign(ele, { enableFlag: e.key })
            })
          }
        })
    }
}

  handlerExpend = (expand, record) => {
    console.log(expand, record)
    const { expandedRowKeys } = this.state
    if (expand) {
      expandedRowKeys.push(record.menuNo)
    } else {
      const index = expandedRowKeys.findIndex(ele => ele === record.menuNo)
      expandedRowKeys.splice(index, 1)
    }
    this.setState({ expandedRowKeys })
  }

  // 开启Modal
  addMenu = () => {
    this.setState({
      showModal: true,
    })
  }

  // 隐藏Modal
  hideModal = () => {
    this.setState({
      showModal: false,
      record: {},
    })
  }

  // 编辑菜单
  editMenu = (record) => {
    this.setState({
      showModal: true,
      record,
    })
  }

  render() {
    const { list, loading } = this.props.menus
    const allExpandRowKeys = []
    const columns = [{
      title: '名称',
      dataIndex: 'menuName',
      key: 'menuName',
      width: 250,
      render: (text, record) => {
        return (
          <span className={styles.gridLine}>
            {allExpandRowKeys.indexOf(record.menuRoute) > -1 ? (
              <div>
                <i className={styles.gridVertical} />
                <i className={styles.gridNode} />
              </div>
              ) : null }
            {text}
          </span>)
        },
    },
    {
      title: '图标',
      dataIndex: 'menuIcon',
      key: 'menuIcon',
      width: 150,
      render: (text, record) => (
        <Icon type={record.menuIcon} />
      ),
    },
    {
      title: '启用状态',
      dataIndex: 'enableFlag',
      key: 'enableFlag',
      width: 80,
      render: (text, record) => (
        <Checkbox checked={record.enableFlag} />
      ),
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 150,
      render: (text, record, index) => {
        return (
          <span className={styles.gridLineKey} style={{ paddingLeft: '40px' }}>
            {allExpandRowKeys.indexOf(record.menuRoute) === -1 ? (
              <div>
                <i className={styles.gridVerticalKey} />
                <i className={styles.gridNodeKey} />
                {index + 1}
              </div>
              ) : <div style={{ marginLeft: '-40px' }}>{index + 1}</div>}
          </span>)
        },
    },
    {
      title: '路由',
      dataIndex: 'menuRoute',
      key: 'menuRoute',
      width: 150,
      render: (text, record) => {
        return (
          <span className={styles.gridLineKey} style={{ paddingLeft: '40px' }}>
            {allExpandRowKeys.indexOf(record.menuRoute) === -1 ? (
              <div>
                <i className={styles.gridVerticalKey} />
                <i className={styles.gridNodeKey} />
                {text}
              </div>
              ) : <div style={{ marginLeft: '-40px' }}>--</div>}
          </span>)
        },
    },
    {
      title: '类型',
      dataIndex: 'menuType',
      key: 'menuType',
      width: 150,
      render: (text) => { return text === 0 ? '电脑' : 'PDA' },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 150,
    },
    {
      title: '权限编号',
      dataIndex: 'permissionId',
      key: 'permissionId',
      width: 150,
    },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (record) => {
        if (record.companyNo * 1 === getLocalStorageItem('companyNo') * 1) {
          return <a onClick={this.editMenu.bind(this, record)}>编辑</a>
        } else {
          return null
        }
      },
    },
    ]

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRows,
        })
      },
      onSelect: (record, selected, selectedRows) => {
        this.setState({
          selectedRows,
        })
      },
      onSelectAll: (selected, selectedRows) => {
        this.setState({
          selectedRows,
        })
      },
    }

    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="1">启用</Menu.Item>
        <Menu.Item key="0">禁用</Menu.Item>
      </Menu>
    )
    return (
      <div style={{ backgroundColor: 'white' }}>
        <div className={styles.tableaToolbar} style={{ paddingTop: '8px', paddingLeft: '16px' }}>
          {checkPremission('MENUS_SAVE') ? <Button icon="plus" style={{ marginRight: '16px' }} type="primary" size="small" onClick={this.addMenu.bind(this)} >添加菜单</Button> : null}
          {checkPremission('MENUS_ENABLE') ?
            <Dropdown overlay={menu}>
              <Button type="primary" size="small">
                启用/禁用 <Icon type="down" />
              </Button>
            </Dropdown> : null}
        </div>
        <Table
          style={{ backgroundColor: 'white' }}
          bordered
          columns={columns}
          dataSource={list}
          loading={loading}
          rowKey={record => record.menuNo}
          pagination={false}
          expandedRowKeys={this.state.expandedRowKeys}
          onExpand={(expanded, record) => this.handlerExpend(expanded, record)}
          rowSelection={rowSelection}
          scroll={{ y: document.body.clientHeight - 200 }}
        />
        <AddMenu
          show={this.state.showModal}
          hideModal={this.hideModal}
          menus={list}
          record={this.state.record}
          dispatch={this.props.dispatch}
        />
      </div>
    )
  }
}
