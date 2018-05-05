import React, { Component } from 'react'
import { connect } from 'dva'
import { Checkbox, Button, Input, Select, Modal } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import JcTable from '../../components/JcTable/index'
import SearchBar from '../../components/SearchBar/index'
import { DropOption } from 'components'
import ShopsModal from './ShopModal'
import styles from './shops.less'

const { Option } = Select
const { confirm } = Modal

@connect(state => ({
  shops: state.shops,
}))
export default class Shops extends Component {
  constructor (props) {
    super(props)
    this.state = {
      shops: null,
      shopsModalVisiable: false,
      add: true,
    }
  }
  componentWillMount () {
    this.props.dispatch({
      type: 'shops/fetch',
    })
  }
  onDeleteItem = (record) => {
    console.log('record', record)
  }
  handleMenuClick = (record, e) => {
    if (e.key === '1') {
      this.editModal(record)
    } else if (e.key === '2') {
      confirm({
        title: '确定删除这条记录?',
        onOk: () => { this.onDeleteItem(record) },
      })
    }
  }
  editModal = (shops) => {
    this.setState({
      shopsModalVisiable: true,
      add: false,
      shops,
    })
  }
  deleteAll = () => {
    const { selectedRows, selectedRowKeys } = this.props.shops
    const aa = selectedRows.length
    console.log('selectedRows', selectedRows, 'selectedRowKeys', selectedRowKeys)
    alert(`准备删除选中的${aa}条数据`)
  }
  render () {
    const { location, shops } = this.props
    // , loading
    location.query = queryString.parse(location.search)
    const { list, selectedRowKeys, loading, selectedRows, page, total, searchParam } = shops
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
        title: '店铺名称',
        dataIndex: 'shopName',
        key: 'shopName',
        width: 120,
      },
      {
        title: '店铺简称',
        dataIndex: 'shortName',
        key: 'shortName',
        width: 120,
      },
      {
        title: '店铺地址',
        dataIndex: 'address',
        key: 'address',
        width: 120,
      },
      {
        title: '店铺等级',
        dataIndex: 'shopLevel',
        key: 'shopLevel',
        width: 120,
        render: (text) => {
          return (
            text ? <div>{text}级</div>: null
          )
        },
      },
      {
        title: '店主性别',
        dataIndex: 'sex',
        key: 'sex',
        width: 120,
        render: (text) => {
          return (
            text === 1 ? <div>男</div> : <div>女</div>
          )
        },
      },
      {
        title: '启用',
        dataIndex: 'enable',
        key: 'enable',
        width: 120,
        render: (text) => {
          return(
            <Checkbox checked={text === 1}/>
          )
        },
      },
      {
        title: '操作',
        dataIndex: 'opreation',
        key: 'opreation',
        width: 140,
        render: (text, record) => {
          return <DropOption onMenuClick={e => this.handleMenuClick(record, e)} menuOptions={[{ key: '1', name: <a>编辑</a> }, { key: '2', name: <a>删除</a> }]} />
        },
        // render: (text, record) => {
        //     return (
        //       <span>
        //         <a onClick={this.editModal.bind(this, record)} >编辑</a>
        //       </span>
        //   )
        // },
      }]
      console.log('selectedRows', selectedRows, selectedRowKeys)
    const tabelToolbar = [
      <Button type="primary" size="small" key={1} onClick={() => this.setState({ add: true, shopsModalVisiable: true })}>新增店铺</Button>,
      <Button type="primary" size="small" key={2} onClick={this.deleteAll} disabled={!(selectedRows && selectedRows.length)}>批量删除</Button>,
    ]
    const tableProps = {
      // rowSelection: {
      //   type: 'radio',
      // },
      toolbar: tabelToolbar,
      dataSource: list,
      total,
      ...page,
      loading,
      columns,
      nameSpace: 'shops',
      dispatch: this.props.dispatch,
      selectedRows,
      selectedRowKeys,
      rowKey: 'shopNo',
      tableName: 'shopsTable',
    }
  const shopsModalProps = {
    shopsModalVisiable: this.state.shopsModalVisiable,
    shops: this.state.shops,
    dispatch: this.props.dispatch,
    add: this.state.add,
    shopsModalHidden: () => {
      this.setState({
        shopsModalVisiable: false,
        shops: null,
        add: true,
      })
    },
  }
  const searchBarItem = [{
    decorator: 'comboNo',
    components: <Input placeholder="商品编码" size="small" />,
    }, {
      decorator: 'comboNo',
      components: <Input placeholder="商品编码" size="small" />,
    }, {
      decorator: 'comboNo',
      components: <Input placeholder="商品编码" size="small" />,
    }, {
      decorator: 'comboNo',
      components: <Input placeholder="商品编码" size="small" />,
    }, {
      decorator: 'comboNo',
      components: <Input placeholder="商品编码" size="small" />,
    }, {
      decorator: 'comboNo',
      components: <Input placeholder="商品编码" size="small" />,
    }, {
      decorator: 'enableStatus',
      components: (
        <Select placeholder="商品是否启用" size="small" style={{ marginTop: 4 }}>
          <Option value="1">启用</Option>
          <Option value="2">备用</Option>
          <Option value="0">禁用</Option>
        </Select>
      ),
    }]
  const searchBarProps = {
    colItems: searchBarItem,
    dispatch: this.props.dispatch,
    nameSpace: 'combinationItem',
    searchParam,
  }
    return (
      <div>
        <Page inner>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <SearchBar {...searchBarProps} />
            </div>
            <JcTable {...tableProps} />
          </div>
        </Page>
        {this.state.shopsModalVisiable ? <ShopsModal {...shopsModalProps}/> : null}
      </div>
    )
  }
}
