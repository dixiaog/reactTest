// 平台站点维护
import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Input, Select, Avatar, Checkbox, message, Dropdown, Icon, Menu } from 'antd'
import styles from '../../System/System.less'
import SearchBar from '../../../components/SearchBar'
import Jtable from '../../../components/JcTable'
import AddAuthorize from './AddAuthorize'
import EditAuthorize from './EditAuthorize'
import { siteUpdateEnableStatus, updateEnableStatus, getChooseData } from '../../../services/system'
import styles1 from '../../Item/Item.less'
import { checkPremission, effectFetch } from '../../../utils/utils'

const Option = Select.Option
@connect(state => ({
  authorize: state.authorize,
}))
export default class Authorize extends Component {
  constructor(props) {
    super(props)
    this.state = {
        showAdd: false,
        showEdit: false,
        editRecord: null,
        selectedRows: [],
    }
  }

  componentDidMount() {
    // const { authorize } = getOtherStore()
    // if (!authorize || authorize.list.length === 0) {
    //   this.props.dispatch({
    //     type: 'authorize/fetch',
    //   })
    // }
    effectFetch('authorize', this.props.dispatch)
  }
  componentWillReceiveProps(nextProps) {
    const { selectedRows } = nextProps.authorize
    this.setState({
      selectedRows,
    })
  }

   // 选择群组
   onChange = (value) => {
    console.log(`selected ${value}`)
   }

  // 添加权限
  addAuthorize = () => {
      this.setState({
          showAdd: true,
      })
  }

    // 禁用操作
  confirm = (record) => {
      // alert('Click on Yes.')
      siteUpdateEnableStatus(record).then((json) => {
        if (json) {
          // 刷新
          this.props.dispatch({
            type: 'authorize/search',
          })
        }
      })
}

   // 编辑操作
   editHandler = (record) => {
    // this.props.dispatch({
    //   type: 'authorize/getChooseData',
    //   payload: record,
    // })
    getChooseData(record).then((json) => {
      if (json) {
        this.setState({
          editRecord: json,
          showEdit: true,
        })
      } else {
        this.props.dispatch({
          type: 'authorize/search',
          payload: this.props.authorize.searchParam,
        })
      }
    })
   }

  // 隐藏Modal
   hideModal = () => {
    this.props.dispatch({ type: 'authorize/clear' })
       this.setState({
           showAdd: false,
           showEdit: false,
           editRecord: null,
       })
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
        if ((e.key > ele.enableStatus) || (e.key < ele.enableStatus)) {
          if (ele.ID === undefined) {
            ids.push(ele.autoNo)
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
        updateEnableStatus(values).then((json) => {
          this.props.dispatch({
          type: 'authorize/search',
        })
            const data = this.state.selectedRows
            data.forEach((ele) => {
              Object.assign(ele, { enableStatus: e.key })
            })
        })
    }
  }

  render() {
    const { list, total, loading, selectedRows, selectedRowKeys, page, searchParam } = this.props.authorize
    const searchBarItem = [ // 搜索栏
      {
        decorator: 'siteName',
        components: (<Input placeholder="站点名称" size="small" />),
      },
      {
        decorator: 'shortName',
        components: (<Input placeholder="站点简称" size="small" />),
      },
      {
        decorator: 'enableStatus',
        components: (
          <Select style={{ marginTop: '4px' }} size="small" placeholder="请选择是否启用" onChange={this.onChange}>
            <Option value="1">已启用</Option>
            <Option value="0">禁用</Option>
          </Select>),
      },
    ]
    const searchBarProps = {
      colItems: searchBarItem,
      dispatch: this.props.dispatch,
      nameSpace: 'authorize',
      searchParam,
    }
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="1">启用</Menu.Item>
        <Menu.Item key="0">禁用</Menu.Item>
      </Menu>
    )
    // 操作栏
    const tabelToolbar = [
      <Button key={1} premission="SITES__ADD" icon="plus" type="primary" size="small" onClick={this.addAuthorize.bind(this)} >新增站点</Button>,
      <Dropdown key={2} premission="AUTHORIZE_UPDATE" overlay={menu}>
        <Button type="primary" size="small" premission="AUTHORIZE_UPDATA">
          启用/禁用 <Icon type="down" />
        </Button>
      </Dropdown>,
    ]
    const columns = [{
      title: '编号',
      dataIndex: 'key',
      key: 'key',
      width: 80,
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
      width: 100,
      render: (record) => {
        // <span>
          // {/* <Popconfirm placement="top" title={disableText} onConfirm={this.confirm.bind(this, record)} okText="确定" cancelText="取消">
          //   <a>启用/禁用</a>
          // </Popconfirm>
          // <Divider type="vertical" /> */}
          if (checkPremission('AUTHORIZE_EDIT')) {
            return <a onClick={this.editHandler.bind(this, record)}>编辑</a>
          }
        // </span>
        },
    },
    {
      title: '站点名称',
      dataIndex: 'siteName',
      key: 'siteName',
      width: 120,
    },
    {
      title: '站点简称',
      dataIndex: 'shortName',
      key: 'shortName',
      width: 120,
    },
    {
      title: '站点图标',
      dataIndex: 'siteIcon',
      key: 'siteIcon',
      width: 120,
      // render: (text, record) => {
      //   return (
      //     <Avatar shape="square" src={}{record.siteIcon} />
      //   )
      // },
      render: (text, record) => {
        if (record.siteIcon === '') {
          return <Avatar size="small" shape="square" icon="user" />
        } else {
          return <Avatar shape="square" src={text} />
        }
      },
    },
    {
      title: '启用状态',
      dataIndex: 'enableStatus',
      key: 'enableStatus',
      width: 120,
      className: styles1.columnCenter,
      render: (text, record) => (
        <Checkbox checked={record.enableStatus} />
      ),
    },
    {
      title: '授权地址',
      dataIndex: 'authorizeAddress',
      key: 'authorizeAddress',
      width: 120,
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
      nameSpace: 'authorize',
      tableName: 'authorizeTable',
      dispatch: this.props.dispatch,
      selectedRows,
      selectedRowKeys,
      rowKey: 'autoNo',
    }

    return (
      <div>
        <div className={styles.contentBoard}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <SearchBar {...searchBarProps} />
            </div>
            <Jtable {...tableProps} />
          </div>
        </div>
        <AddAuthorize show={this.state.showAdd} hideModal={this.hideModal} />
        {this.state.showEdit ? <EditAuthorize show={this.state.showEdit} hideModal={this.hideModal} record={this.state.editRecord} /> : null}
      </div>
    )
  }
}
