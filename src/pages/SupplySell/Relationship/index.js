/*
 * @Author: jiangteng
 * @Date: 2017-12-22 17:40:30
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-14 10:43:25
 * 供销-分销商主页面
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import { Divider, Button, Input, Tag, Select, Table, Popconfirm, message } from 'antd'
import styles from '../SupplySell.less'
import SearchBar from '../../../components/SearchBar'
import Jtable from '../../../components/JcTable'
import RelationModal from './RelationModal'
import RelationshipDetail from './RelationshipDetail'
import { checkPremission, effectFetch } from '../../../utils/utils'
import { isFreeze, getDetail, Shengxiao, isValid, getChildData, deleteDis, delRelationship, isSync } from '../../../services/supplySell/relationship'

const Option = Select.Option

@connect(state => ({
  relationship: state.relationship,
}))
export default class Relationship extends Component {
  constructor(props) {
    super(props)
    this.state = {
      one: true,
      two: true,
      three: true,
      four: true,
      five: true,
      seven: true,
      eight: true,
      relationModal: false,
      record: {},
      detail: false,
      Detail: {}, // 单条明详情
      loading: false,
      list: [],
      expandedRowKeys: [],
      expanded: false, // 记录是否是展开状态
      father: {},
    }
  }

  componentDidMount() {
    // this.props.dispatch({ type: 'relationship/fetch' })
    effectFetch('relationship', this.props.dispatch)
  }

  componentWillReceiveProps(nextProps) {
    const data = nextProps.relationship.selectedRows.length ? nextProps.relationship.selectedRows : nextProps.relationship.selectedRowsT
    if (data.length) {
      const one = (data[0].status === 0 || data[0].status === 2) ? false : !false
      const four = data[0].status === 0 ? false : !false
      const two = data[0].status === 1 ? false : !false
      const three = data[0].status === 3 ? false : !false
      const five = (data[0].status === 1 || data[0].status === 3) ? false : !false
      const seven = data[0].status === 0 ? false : !false
      const eight = data.length ? false : !false
      this.setState({
        one,
        two,
        three,
        four,
        five,
        seven,
        eight,
      })
    } else {
      this.setState({
        one: true,
        two: true,
        three: true,
        four: true,
        five: true,
        seven: true,
        eight: true,
      })
    }
  }
  getDetails = (record) => {
    this.setState({
      detail: true,
      record,
    })
    getDetail(Object.assign({ supplierNo: record.supplierNo, distributorNo: record.distributorNo })).then((json) => {
      if (json) {
        this.setState({
          Detail: json,
          one: true,
          two: true,
          three: true,
          four: true,
          five: true,
          seven: true,
          eight: true,
        })
      } else {
        this.setState({
          Detail: {},
        })
      }
    })
  }
  getChild = (expanded, record) => {
    this.setState({
      expanded,
    })
    this.props.dispatch({
      type: 'relationship/changeState',
      payload: { selectedRowKeys: [], selectedRows: [], selectedRowKeysT: [], selectedRowsT: [] },
    })
    this.setState({
      one: true,
      two: true,
      three: true,
      four: true,
      five: true,
      seven: true,
      eight: true,
    })
    if (expanded) {
      const t = []
      t.push(record.autoNo)
      this.setState({
        expandedRowKeys: t,
        loading: expanded,
        father: record,
      })
      getChildData(Object.assign({ supplierNo: record.distributorNo })).then((res) => {
        if (res.list) {
          this.setState({
            list: res.list,
            loading: false,
          })
        }
      })
    } else {
      this.setState({
        list: [],
        expandedRowKeys: [],
        father: {},
      })
    }
  }
  confirm = (record) => {
    if (record.status !== 0) {
      message.warning('只有待审核状态才可以删除!')
    } else {
      deleteDis(Object.assign({ distributorNo: record.distributorNo })).then((json) => {
        if (json) {
          this.props.dispatch({
            type: 'relationship/search',
          })
          this.getChild(true, this.state.father)
        }
      })
    }
  }
  editStatus = (status) => {
    const data = this.props.relationship.selectedRows[0] ? this.props.relationship.selectedRows[0] : this.props.relationship.selectedRowsT[0]
    isFreeze(Object.assign({ autoNo: data.autoNo, status })).then((json) => {
      if (json) {
        this.props.dispatch({
          type: 'relationship/search',
        })
        this.props.dispatch({
          type: 'relationship/changeState',
          payload: { selectedRowKeys: [], selectedRows: [] },
        })
        this.getChild(true, this.state.father)
      }
    })
  }
  // 生效
  Shengxiao = () => {
    const data = this.props.relationship.selectedRows[0] ? this.props.relationship.selectedRows[0] : this.props.relationship.selectedRowsT[0]
    Shengxiao(Object.assign({
      supplierNo: data.supplierNo,
      distributorNo: data.distributorNo,
      distributorName: data.distributorName,
      acronyms: data.supplierAcronyms,
      autoNo: data.autoNo,
    })).then((json) => {
      if (json) {
        this.setState({
          one: true,
          two: true,
          three: true,
          four: true,
          five: true,
          seven: true,
          eight: true,
        })
        this.props.dispatch({
          type: 'relationship/search',
        })
        this.props.dispatch({
          type: 'relationship/changeState',
          payload: { selectedRowKeys: [], selectedRows: [] },
        })
        this.getChild(true, this.state.father)
      }
    })
  }
  // 激活/作废
  isValid = (status) => {
    const data = this.props.relationship.selectedRows[0] ? this.props.relationship.selectedRows[0] : this.props.relationship.selectedRowsT[0]
    isValid(Object.assign({ autoNo: data.autoNo, billStatus: status, distributorNo: data.distributorNo })).then((json) => {
      if (json) {
        this.props.dispatch({
          type: 'relationship/search',
        })
        this.props.dispatch({
          type: 'relationship/changeState',
          payload: { selectedRowKeys: [], selectedRows: [] },
        })
        this.getChild(true, this.state.father)
      }
    })
  }
  // 开通/关闭自动同步
  Tongbu = () => {
    const data = this.props.relationship.selectedRows[0] ? this.props.relationship.selectedRows[0] : this.props.relationship.selectedRowsT[0]
    const params = data.inventorySync === 0 ? 1 : 0
    isSync(Object.assign({ autoNo: data.autoNo, inventorySync: params })).then((json) => {
      if (json) {
        this.props.dispatch({
          type: 'relationship/search',
        })
        this.props.dispatch({
          type: 'relationship/changeState',
          payload: { selectedRowKeys: [], selectedRows: [] },
        })
        this.getChild(true, this.state.father)
      }
    })
  }
  // 删除资料
  delete = () => {
    const data = this.props.relationship.selectedRows[0] ? this.props.relationship.selectedRows[0] : this.props.relationship.selectedRowsT[0]
    delRelationship(Object.assign({ distributorNo: data.distributorNo })).then((json) => {
      if (json) {
        this.props.dispatch({
          type: 'relationship/search',
        })
        this.getChild(true, this.state.father)
      }
    })
  }
  render() {
    const { list, total, loading, selectedRows, selectedRowKeys, page, searchParam } = this.props.relationship
    const searchBarItem = [ // 搜索栏
      {
        decorator: 'distributorNo',
        components: (<Input placeholder="分销|经销商编号" size="small" />),
      },
      {
        decorator: 'distributorName',
        components: (<Input placeholder="名称" size="small" />),
      },
      {
        decorator: 'distributorLevel',
        components: (
          <Select placeholder="选择级别" size="small">
            <Option value="1">1</Option>
            <Option value="2">2</Option>
            <Option value="3">3</Option>
            <Option value="4">4</Option>
            <Option value="5">5</Option>
          </Select>),
      },
      {
        decorator: 'distributorRemark',
        components: (<Input placeholder="供销商备注" size="small" />),
      },
      {
        decorator: 'supplierRemark',
        components: (<Input placeholder="分销商备注" size="small" />),
      },
      {
        decorator: 'status',
        components: (
          <Select placeholder="选择状态" size="small">
            <Option value="0">等待审核</Option>
            <Option value="1">已审核</Option>
            <Option value="2">作废</Option>
            <Option value="3">冻结</Option>
          </Select>),
      },
    ]

    const searchBarProps = {
      colItems: searchBarItem,
      dispatch: this.props.dispatch,
      nameSpace: 'relationship',
      searchParam,
    }

    const rowSelectionT = {
      onChange: (rowKeys, rows) => {
        this.props.dispatch({
          type: 'relationship/changeState',
          payload: { selectedRowKeysT: [], selectedRowsT: [] },
        })
        this.props.dispatch({
          type: 'relationship/changeState',
          payload: { selectedRowKeys: rowKeys, selectedRows: rows },
        })
      },
      type: 'radio',
    }

    // 操作栏
    const tabelToolbar = [
      <Button key={1} premission="RELATIONSHIP_LIST" type="primary" size="small" onClick={() => { this.setState({ relationModal: true }) }}>新增分销商</Button>,
      <Button key={2} premission="RELATIONSHIP_SX" onClick={this.Shengxiao} disabled={this.state.one} type="primary" size="small">审核生效</Button>,
      <Button key={3} premission="RELATIONSHIP_STATUS" onClick={this.editStatus.bind(this, '3')} disabled={this.state.two} type="primary" size="small">冻结</Button>,
      <Button key={4} premission="RELATIONSHIP_STATUS" onClick={this.editStatus.bind(this, '1')} disabled={this.state.three} type="primary" size="small">解除冻结</Button>,
      <Popconfirm key={5} premission="RELATIONSHIP_DELETE" title="请确认是否删除，删除后将无法恢复?" okText="确认" cancelText="取消" onConfirm={this.delete}>
        <Button disabled={this.state.four} type="primary" size="small">删除</Button>
      </Popconfirm>,
      <Button key={6} premission="RELATIONSHIP_ISVALID" onClick={this.isValid.bind(this, '2')} disabled={this.state.five} type="primary" size="small">作废</Button>,
      <Button key={7} premission="RELATIONSHIP_STATUS" onClick={this.editStatus.bind(this, '4')} disabled={this.state.seven} type="primary" size="small">拒绝分销</Button>,
      <Button key={8} premission="RELATIONSHIP_TONGBU" type="primary" size="small" onClick={this.Tongbu} disabled={this.state.eight}>开通/关闭自动同步</Button>,
     ]
    const columns = [{
      title: '序号',
      dataIndex: 'key',
      key: 'key',
      width: 50,
      className: styles.columnLeft,
      render: (text, record, index) => {
        return (
          <span>
            {index + 1}
          </span>
          )
        },
    },
    {
      title: '编号',
      dataIndex: 'distributorNo',
      key: 'distributorNo',
      width: 50,
      className: styles.columnLeft,
    },
    {
      title: '名称',
      dataIndex: 'distributorName',
      key: 'distributorName',
      width: 100,
      className: styles.columnLeft,
      render: (text, record) => (
        <a onClick={this.getDetails.bind(this, record)}>{text}</a>
      ),
    },
    {
      title: '操作',
      key: 'operation',
      width: 80,
      className: styles.columnLeft,
      render: record => (
        <div>
          {checkPremission('RELATIONSHIP_EDIT') ?
            <span>
              <a onClick={() => { this.setState({ relationModal: true, record }) }}>编辑</a>
              <Divider type="vertical" />
            </span> : null}
          {checkPremission('RELATIONSHIP_DELETE') ?
            <span>
              <Popconfirm title="请确认是否删除，删除后将无法恢复?" onConfirm={this.confirm.bind(this, record)} okText="确认" cancelText="取消">
                <a>删除</a>
              </Popconfirm>
            </span> : null}
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      className: styles.columnLeft,
      render: (text) => {
        switch (text) {
        case 0:
          return <Tag color="#87d068">等待审核</Tag>
        case 1:
          return <Tag color="#2db7f5">已审核</Tag>
        case 2:
          return <Tag color="green">作废</Tag>
        case 3:
          return <Tag color="#f50">冻结</Tag>
        default:
          return <Tag color="#f50">被拒绝</Tag>
        }
      },
    },
    {
      title: '助记符',
      dataIndex: 'distributorAcronyms',
      key: 'distributorAcronyms',
      width: 120,
      className: styles.columnLeft,
    },
    {
      title: '联系人',
      dataIndex: 'contacts',
      key: 'contacts',
      width: 80,
      className: styles.columnLeft,
    },
    {
      title: '电话',
      dataIndex: 'telNo',
      key: 'telNo',
      width: 100,
      className: styles.columnLeft,
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      width: 150,
      className: styles.columnLeft,
    },
    {
      title: '供销商备注',
      dataIndex: 'distributorRemark',
      key: 'distributorRemark',
      width: 150,
      className: styles.columnLeft,
    },
    {
      title: '分销商备注',
      dataIndex: 'supplierRemark',
      key: 'supplierRemark',
      width: 150,
      className: styles.columnLeft,
    },
    {
      title: '类型',
      dataIndex: 'relationshipType',
      key: 'relationshipType',
      width: 80,
      className: styles.columnLeft,
      render: (text) => {
        switch (text) {
        case 0:
          return '内部创建'
        default:
          return '外部创建'
        }
      },
    },
    {
      title: '级别',
      dataIndex: 'distributorLevel',
      key: 'distributorLevel',
      width: 60,
      className: styles.columnLeft,
    },
    {
      title: '库存同步否',
      dataIndex: 'inventorySync',
      key: 'inventorySync',
      width: 80,
      className: styles.columnLeft,
      render: (text) => {
        switch (text) {
        case 0:
          return <Tag color="#87d068">不同步</Tag>
         default:
          return <Tag color="#2db7f5">同步</Tag>
        }
      },
    },
    {
      title: '店铺授权数',
      dataIndex: 'authorizeShopNum',
      key: 'authorizeShopNum',
      width: 80,
      className: styles.columnLeft,
    },
  ]

    // 下级分销商
    const expandedRowRenderT = () => {
      const columnS = [{
        title: '序号',
        dataIndex: 'key',
        key: 'key',
        width: 50,
        className: styles.columnLeft,
        render: (text, record, index) => {
          return (
            <span>
              {index + 1}
            </span>
            )
          },
      },
      {
        title: '编号',
        dataIndex: 'distributorNo',
        key: 'distributorNo',
        width: 50,
        className: styles.columnLeft,
      },
      {
        title: '名称',
        dataIndex: 'distributorName',
        key: 'distributorName',
        width: 100,
        className: styles.columnLeft,
        render: (text, record) => (
          <a onClick={this.getDetails.bind(this, record)}>{text}</a>
        ),
      },
      {
        title: '操作',
        key: 'operation',
        width: 80,
        className: styles.columnLeft,
        render: () => {
          return '不可编辑'
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        className: styles.columnLeft,
        render: (text) => {
          switch (text) {
          case 0:
            return <Tag color="#87d068">等待审核</Tag>
          case 1:
            return <Tag color="#2db7f5">已审核</Tag>
          case 2:
            return <Tag color="green">作废</Tag>
          case 3:
            return <Tag color="#f50">冻结</Tag>
          default:
            return <Tag color="#f50">被拒绝</Tag>
          }
        },
      },
      {
        title: '助记符',
        dataIndex: 'distributorAcronyms',
        key: 'distributorAcronyms',
        width: 120,
        className: styles.columnLeft,
      },
      {
        title: '联系人',
        dataIndex: 'contacts',
        key: 'contacts',
        width: 80,
        className: styles.columnLeft,
      },
      {
        title: '电话',
        dataIndex: 'telNo',
        key: 'telNo',
        width: 100,
        className: styles.columnLeft,
      },
      {
        title: '地址',
        dataIndex: 'address',
        key: 'address',
        width: 150,
        className: styles.columnLeft,
      },
      {
        title: '供销商备注',
        dataIndex: 'supplierRemark',
        key: 'supplierRemark',
        width: 150,
        className: styles.columnLeft,
      },
      {
        title: '分销商备注',
        dataIndex: 'distributorRemark',
        key: 'distributorRemark',
        width: 150,
        className: styles.columnLeft,
      },
      {
        title: '类型',
        dataIndex: 'relationshipType',
        key: 'relationshipType',
        width: 80,
        className: styles.columnLeft,
        render: (text) => {
          switch (text) {
          case 0:
            return <span style={{ paddingLeft: 4 }}>内部创建</span>
          default:
            return <span style={{ paddingLeft: 4 }}>外部创建</span>
          }
        },
      },
      {
        title: '级别',
        dataIndex: 'distributorLevel',
        key: 'distributorLevel',
        width: 60,
        className: styles.columnLeft,
        render: (text) => {
          return <span style={{ paddingLeft: 5 }}>{text}</span>
        },
      },
      {
        title: '库存同步否',
        dataIndex: 'inventorySync',
        key: 'inventorySync',
        width: 80,
        className: styles.columnLeft,
        render: (text) => {
          switch (text) {
          case 0:
            return <span style={{ paddingLeft: 6 }}><Tag color="#87d068">不同步</Tag></span>
           default:
            return <span style={{ paddingLeft: 6 }}><Tag color="#2db7f5">同步</Tag></span>
          }
        },
      },
      {
        title: '店铺授权数',
        dataIndex: 'authorizeShopNum',
        key: 'authorizeShopNum',
        width: 80,
        className: styles.columnLeft,
        render: (text) => {
          return <span style={{ paddingLeft: 6 }}>{text}</span>
        },
      },
    ]
      return (
        <Table
          style={{ marginLeft: '64px' }}
          columns={columnS}
          dataSource={this.state.list}
          pagination={false}
          rowKey={record => record.autoNo}
          showHeader={false}
          loading={this.state.loading}
        />
      )
    }

    // 表格参数
    const tableProps = {
      toolbar: tabelToolbar,
      dataSource: list,
      total,
      ...page,
      loading,
      columns,
      nameSpace: 'relationship',
      dispatch: this.props.dispatch,
      selectedRows,
      selectedRowKeys,
      scroll: { x: 1800 },
      rowKey: 'autoNo',
      tableName: 'relationshipTable',
      rowSelection: rowSelectionT,
      expandedRowKeys: this.state.expandedRowKeys,
      expandedRowRender: expandedRowRenderT,
      onExpand: (expanded, record) => this.getChild(expanded, record),
    }

    const relationProps = {
      show: this.state.relationModal,
      hideModal: () => { this.setState({ relationModal: false, record: {} }) },
      record: this.state.record,
      getChild: () => { this.getChild(true, this.state.father) },
      expanded: this.state.expanded,
    }
    const relationDetailProps = {
      show: this.state.detail,
      hideModal: () => { this.setState({ detail: false, record: {} }) },
      detail: this.state.Detail,
      record: this.state.record,
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
        <RelationModal {...relationProps} />
        <RelationshipDetail {...relationDetailProps} />
      </div>
    )
  }
}
