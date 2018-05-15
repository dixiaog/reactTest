/*
 * @Author: Chen Xinjie
 * @Date: 2017-12-28 10:00:05
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-14 09:43:08
 * 公司信息维护
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Select, Input, Tag, Dropdown, Icon, Menu, message, Modal } from 'antd'
import Jtable from '../../../components/JcTable'
import SearchBar from '../../../components/SearchBar'
import styles from '../Base.less'
import AddModal from './AddModal'
import EditModal from './EditModal'
import { checkPremission, effectFetch } from '../../../utils/utils'

const { Option } = Select
const confirm = Modal.confirm

@connect(state => ({
  companys: state.companys,
}))

export default class Companys extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editModalVisiable: false,
      addModalVisiable: false,
      company: {},
    }
  }

  componentDidMount() {
    // 此处获取外部store判断是否需要重新加载页面
    // const { companys } = getOtherStore()
    // if (!companys || companys.list.length === 0) {
    //   this.props.dispatch({
    //     type: 'companys/search',
    //   })
    // }
    effectFetch('companys', this.props.dispatch)
  }

  enable = (e) => {
    const { selectedRows } = this.props.companys
    if (selectedRows.length) {
      const values = {}
      if (e.key === '1') {
        Object.assign(values, {
          enableStatus: 1,
        })
      } else {
        Object.assign(values, {
          enableStatus: 0,
        })
      }
      const companyNos = selectedRows.map((item) => { return (item.companyNo) })
      Object.assign(values, {
        companyNos: companyNos.toString(),
      })

      this.props.dispatch({
        type: 'companys/enable',
        payload: values,
      })
    } else {
      message.warning('至少选择一条信息')
    }
  }

  enableChage = (e) => {
    const $this = this // 弹出层不在一个界面
    confirm({
      title: '操作提示',
      content: '确定要启用/禁用吗?',
      onOk() {
        $this.enable(e)
      },
      onCancel() {
      },
    })
  }

  // 编辑
  editModal = (company) => {
    this.setState({
      editModalVisiable: true,
      company,
    })
  }

  render() {
    const { list, loading, searchParam, total, page, selectedRowKeys, selectedRows } = this.props.companys
    const menu = (
      <Menu onClick={this.enableChage} >
        <Menu.Item key="1"><Icon type="check-circle-o" />启用 </Menu.Item>
        <Menu.Item key="2"><Icon type="close-circle-o" />禁用</Menu.Item>
      </Menu>
    )
    // 菜单栏
    const tabelToolbar = [
      <Button key={1} premission="COMPANY_ADD" type="primary" size="small" onClick={() => { this.setState({ addModalVisiable: true, company: {} }) }}>新增公司</Button>,
      <Dropdown key={2} premission="COMPANY_ENABLE" overlay={menu}>
        <Button type="primary" size="small">
            启用/禁用 <Icon type="down" />
        </Button>
      </Dropdown>,
    ]
    // 列头
    const columns = [
      {
      title: '公司名称',
      dataIndex: 'companyName',
      key: 'companyName',
      width: 120,
      }, {
      title: '启用状态',
      dataIndex: 'enableStatus',
      key: 'enableStatus',
      width: 120,
      render: (text) => {
        if (text * 1 === 1) {
          return <Tag color="#2db7f5" >启用</Tag>
        } else if (text * 1 === 0) {
          return <Tag color="#ccc" >禁用</Tag>
        } else {
          return <Tag color="#87d068">备用</Tag>
        }
      },
      }, {
      title: '公司简称',
      dataIndex: 'shortName',
      key: 'shortName',
      width: 160,
      }, {
      title: '公司类型',
      dataIndex: 'companyType',
      key: 'companyType',
      width: 70,
      render: (text, record) => (
        record.companyType === 0 ? '系统公司' : '标准公司'
      ),
      },
      {
      title: '操作',
      dataIndex: 'opreation',
      key: 'opreation',
      width: 120,
      className: styles.columnCenter,
      render: (text, record) => {
          if (checkPremission('COMPANY_EDIT')) {
            return (
              <span>
                <a onClick={this.editModal.bind(this, record)} >编辑</a>
              </span>
            )
          } else {
            return null
          }
        },
      },
    ]

     // 表格参数
     const tableProps = {
      toolbar: tabelToolbar,
      noSelected: false,
      dataSource: list,
      total,
      ...page,
      loading,
      columns,
      nameSpace: 'companys',
      tableName: 'companysTable',
      dispatch: this.props.dispatch,
      selectedRows,
      selectedRowKeys,
      rowKey: 'companyNo',
    }

  // 查询
  const searchBarItem = [{
    decorator: 'companyName',
    components: <Input placeholder="公司名称" size="small" />,
  }, {
    decorator: 'enableStatus',
    components: (
      <Select placeholder="状态" size="small" style={{ marginTop: 4 }}>
        <Option value="">全部</Option>
        <Option value={1}>启用</Option>
        <Option value={0}>禁用</Option>
      </Select>
    ),
  },
  ]

  // 搜索栏参数
  const searchBarProps = {
    colItems: searchBarItem,
    dispatch: this.props.dispatch,
    nameSpace: 'companys',
    searchParam,
  }

  // 编辑
  const editModalProps = {
    editModalVisiable: this.state.editModalVisiable,
    dispatch: this.props.dispatch,
    companyModalHidden: () => {
      this.setState({
        editModalVisiable: false,
      })
    },
    company: this.state.company,
  }

  // 新增
  const addModalProps = {
    addModalVisiable: this.state.addModalVisiable,
    dispatch: this.props.dispatch,
    companyModalHidden: () => {
      this.setState({
        addModalVisiable: false,
      })
    },
    company: {},
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
      { this.state.editModalVisiable ? <EditModal {...editModalProps} /> : null}
      { this.state.addModalVisiable ? <AddModal {...addModalProps} /> : null}
    </div>
  )
  }
}
