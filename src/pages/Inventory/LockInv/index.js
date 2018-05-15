import React, { Component } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Button, Input, Select, Icon, Tag, Tooltip } from 'antd'
import styles from '../Inventory.less'
import SearchBar from '../../../components/SearchBar'
import Jtable from '../../../components/JcTable'
// import { getOtherStore } from '../../../utils/otherStore'
import { getAllShop } from '../../../services/utils'
import AddLockInvModal from './addLockInvModal'
import PreviewLockInvModal from './previewLockInvModal'
import AddLockInvByUrlModal from './addLockInvByUrlModal'
import EditLockInvs from './editLockInvs'
import GetLocksModal from './getLocksModal'
import { unLockBill } from '../../../services/inventory/lockInv'
import { effectFetch } from '../../../utils/utils'

const Option = Select.Option
@connect(state => ({
    lockInv: state.lockInv,
    editLocks: state.editLocks,
}))
export default class LockInvList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            shops: [],
            // previewData: {
            //   wmLockInventoryDto: {},
            //   LockInventoryList: [],
            // },
            previewData: {},
            addLockInvVisiable: false,
            addLockInvByUrlVisiable: false,
            previewLockInvVisiable: false,
            editLockInvsVisiable: false,
            getLocksModalVisiable: false,
            billNo: null,
        }
    }
    componentWillMount() {
        // const { lockInv } = getOtherStore()
        // if (!lockInv || lockInv.list.length === 0) {
        //   this.props.dispatch({ type: 'lockInv/fetch' })
        // }
      effectFetch('lockInv', this.props.dispatch)
    }
    componentDidMount() {
        getAllShop().then((json) => {
            this.setState({
                shops: json,
            })
        })
    }
    getDetailModal = (billNo) => {
      this.setState({
        billNo,
        getLocksModalVisiable: true,
      })
    }
    hiddenModal = () => {
      this.props.dispatch({
        type: 'lockInv/search',
      })
      this.setState({
        addLockInvVisiable: false,
        addLockInvByUrlVisiable: false,
        previewLockInvVisiable: false,
        editLockInvsVisiable: false,
        getLocksModalVisiable: false,
        billNo: null,
      })
    }
    previewLockInv = (json) => {
      this.setState({
        previewData: json,
        previewLockInvVisiable: true,
      })
    }
    unLockByBill = (billNo) => {
      unLockBill({ billNo }).then((json) => {
        if (json) {
          this.props.dispatch({
            type: 'lockInv/search',
          })
        }
      })
    }
    render() {
    const { list, total, loading, selectedRows, selectedRowKeys, page, searchParam } = this.props.lockInv
    const columns = [{
      title: '编号',
      dataIndex: 'key',
      key: 'key',
      width: 50,
      render: (text, record, index) => {
        return (
          <span>
            {index + 1}
          </span>
          )
        },
    },
    {
      title: '锁定单号',
      dataIndex: 'billNo',
      key: 'billNo',
      width: 120,
    },
    {
      title: '锁定名称',
      dataIndex: 'lockName',
      key: 'lockName',
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 100,
      render: (text, record) => {
          return <a onClick={this.getDetailModal.bind(this, record.billNo)}>详情</a>
      },
    },
    {
      title: '锁定类型',
      dataIndex: 'lockType',
      key: 'lockType',
      width: 100,
      render: (text) => {
          if (text * 1 === 0) {
              return <Tag color="#2db7f5" >店铺</Tag>
          } else {
              return <Tag color="#87d068" >按链接</Tag>
          }
      },
    },
    {
      title: '店铺名称',
      dataIndex: 'shopName',
      key: 'shopName',
      width: 200,
    },
    {
      title: '过期时间',
      dataIndex: 'expireTime',
      key: 'expireTime',
      width: 200,
      render: (text, record) => {
        if (record.expireTime > record.createTime) {
          return moment(text).format('YYYY-MM-DD')
        } else {
          return '-'
        }
      },
    },
    {
      title: '手工解锁',
      dataIndex: 'isUnlock',
      key: 'isUnlock',
      width: 100,
      render: (text, record) => {
          if (text === 0) {
              return <a onClick={this.unLockByBill.bind(this, record.billNo)}>[解锁]</a>
          } else {
              return <span>已解锁</span>
          }
      },
    },
    {
      title: '解锁时间',
      dataIndex: 'unlockTime',
      key: 'unlockTime',
      width: 200,
      render: (text, record) => {
        if (record.isUnlock) {
          return moment(text).format('YYYY-MM-DD')
        } else {
          return '-'
        }
      },
    },
    {
      title: '解锁人员',
      dataIndex: 'unlockUser',
      key: 'unlockUser',
      width: 150,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 200,
      render: text => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
      key: 'createUser',
      width: 150,
    },
  ]
    // 操作栏
    const tabelToolbar = [
      <Tooltip key={1} title="只有存在库存的数据挑选之后才会返回数据列表" premission="TRUE">
        <Button type="primary" size="small" onClick={() => { this.setState({ addLockInvVisiable: true }) }} ><Icon type="plus" />新增库存锁定单</Button>
      </Tooltip>,
      <Tooltip key={2} title="只有存在库存的数据挑选之后才会返回数据列表" premission="TRUE">
        <Button type="primary" size="small" onClick={() => { this.setState({ addLockInvByUrlVisiable: true }) }} ><Icon type="plus" />新增库存锁定单(按链接)</Button>
      </Tooltip>,
      <Button
        key={3}
        premission="TRUE"
        type="primary"
        size="small"
        onClick={() => {
          this.setState({ editLockInvsVisiable: true })
          this.props.dispatch({
            type: 'editLocks/fetch',
          })
        }}
      >
        <Icon type="swap" />调整锁定数
      </Button>,
      <Button key={4} premission="TRUE" type="primary" size="small" onClick={this.getDetailModal.bind(this, '')}><Icon type="search" /> 查看锁定数据</Button>,
    ]
      const searchBarItem = [{
        decorator: 'shopNo',
        components: (
          <Select placeholder="店铺" size="small" style={{ marginTop: 4 }}>
            {this.state.shops.map(e => <Option key={e.shopNo}>{e.shopName}</Option>)}
          </Select>
        ),
      }, {
        decorator: 'skuNo',
        components: <Input placeholder="商品编码" size="small" />,
      }, {
        decorator: 'shopSkuNo',
        components: <Input placeholder="店铺商品编码" size="small" />,
      }, {
        decorator: 'lockName',
        components: <Input placeholder="锁定名称" size="small" />,
      }, {
        decorator: 'isUnlock',
        components: (
          <Select placeholder="锁定状态" size="small" style={{ marginTop: 4 }}>
            <Option value={0}>未解锁</Option>
            <Option value={1}>已解锁</Option>
          </Select>
        ),
      }]
      const searchBarProps = {
        colItems: searchBarItem,
        dispatch: this.props.dispatch,
        nameSpace: 'lockInv',
        searchParam,
      }
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
            nameSpace: 'lockInv',
            dispatch: this.props.dispatch,
            selectedRows,
            selectedRowKeys,
            rowKey: 'billNo',
            tableName: 'lockInvTable',
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
            { this.state.addLockInvVisiable ? <AddLockInvModal
              previewData={this.state.previewData}
              previewLockInv={this.previewLockInv} shops={this.state.shops} visiable={this.state.addLockInvVisiable} hidden={this.hiddenModal} /> : null }
            { this.state.addLockInvByUrlVisiable ? <AddLockInvByUrlModal
              previewData={this.state.previewData}
              previewLockInv={this.previewLockInv} shops={this.state.shops} visiable={this.state.addLockInvByUrlVisiable} hidden={this.hiddenModal} /> : null }
            <PreviewLockInvModal previewData={this.state.previewData} visiable={this.state.previewLockInvVisiable} hidden={this.hiddenModal} />
            <EditLockInvs shops={this.state.shops} visiable={this.state.editLockInvsVisiable} hidden={this.hiddenModal} />
            <GetLocksModal billNo={this.state.billNo} shops={this.state.shops} visiable={this.state.getLocksModalVisiable} hidden={this.hiddenModal} />
          </div>
        )
    }
}
