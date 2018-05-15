/*
 * @Author: Chen Xinjie
 * @Date: 2017-12-28 15:57:26
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-14 19:37:20
 * 品牌资料维护
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Button, Select, Input, Avatar, Dropdown, Icon, Menu, message, Modal, Tag } from 'antd'
import Jtable from '../../../components/JcTable'
import SearchBar from '../../../components/SearchBar'
import styles from '../Base.less'
import EditModal from './EditModal'
import AddModal from './AddModal'
import { checkPremission, effectFetch } from '../../../utils/utils'

const { Option } = Select
const confirm = Modal.confirm

@connect(state => ({
  brands: state.brands,
}))

export default class Brands extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editModalVisiable: false,
      addModalVisiable: false,
      brand: {},
    }
  }

  componentDidMount() {
    // 此处获取外部store判断是否需要重新加载页面
    // const { brands } = getOtherStore()
    // if (!brands || brands.list.length === 0) {
    //   this.props.dispatch({
    //     type: 'brands/search',
    //   })
    // }
    effectFetch('brands', this.props.dispatch)
  }

  enable = (e) => {
    const { selectedRows } = this.props.brands
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
      const brandNos = selectedRows.map((item) => { return (item.brandNo) })
      Object.assign(values, {
        brandNo: brandNos.toString(),
      })
      this.props.dispatch({
        type: 'brands/enable',
        payload: values,
      })
    } else {
      message.warning('至少选择一条数据')
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

  editModal = (brand) => {
    this.setState({
      editModalVisiable: true,
      addModalVisiable: false,
      brand,
    })
  }

  addModal = () => {
    this.setState({
      editModalVisiable: false,
      addModalVisiable: true,
      brand: {},
    })
  }

  render() {
    const { list, loading, searchParam, total, page, selectedRowKeys, selectedRows } = this.props.brands
    const menu = (
      <Menu onClick={this.enableChage} >
        <Menu.Item key={1}><Icon type="check-circle-o" /> 启用</Menu.Item>
        <Menu.Item key={0}><Icon type="close-circle-o" /> 禁用</Menu.Item>
      </Menu>
    )
    // 菜单栏
    const tabelToolbar = [
      <Button key={1} premission="BRANDS_ADD" type="primary" size="small" onClick={() => { this.setState({ addModalVisiable: true, brand: {} }) }}>新增品牌</Button>,
      <Dropdown key={2} premission="BRANDS_ENABLE" overlay={menu}>
        <Button type="primary" size="small">
            启用/禁用 <Icon type="down" />
        </Button>
      </Dropdown>,
    ]
    // 列头
    const columns = [
      {
      title: '品牌名称',
      dataIndex: 'brandName',
      key: 'brandName',
      width: 120,
      }, {
      title: '品牌图标',
      dataIndex: 'brandIcon',
      key: 'brandIcon',
      width: 120,
      render: (text) => {
        return <Avatar src={text} />
        },
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
      title: '是否允许分销商授权',
      dataIndex: 'distributeAuthorize',
      key: 'distributeAuthorize',
      width: 160,
      render: (text) => {
        if (text * 1 === 1) {
          return <Tag color="#2db7f5" >允许</Tag>
        } else if (text * 1 === 0) {
          return <Tag color="#ccc" >不允许</Tag>
        }
        },

      }, {
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
      nameSpace: 'brands',
      tableName: 'brandsTable',
      dispatch: this.props.dispatch,
      selectedRows,
      selectedRowKeys,
      rowKey: 'brandNo',
    }

  // 查询
  const searchBarItem = [{
    decorator: 'brandName',
    components: <Input placeholder="品牌名称" size="small" />,
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
    nameSpace: 'brands',
    searchParam,
  }

  // 编辑
  const editModalProps = {
    editModalVisiable: this.state.editModalVisiable,
    dispatch: this.props.dispatch,
    brandModalHidden: () => {
      this.setState({
        editModalVisiable: false,
        brand: {},
      })
    },
    brand: this.state.brand,
  }

  // 新增
  const addModalProps = {
    addModalVisiable: this.state.addModalVisiable,
    dispatch: this.props.dispatch,
    brandModalHidden: () => {
      this.setState({
        addModalVisiable: false,
      })
    },
    brand: {},
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

