import React, { Component } from 'react'
import { connect } from 'dva'
import { Checkbox } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import JcTable from '../../components/JcTable/index'
import ShopsModal from './ShopModal'


@connect(state => ({
  shops: state.shops,
}))
export default class User extends Component {
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
  editModal = (shops) => {
    this.setState({
      shopsModalVisiable: true,
      add: false,
      shops,
    })
  }
  render () {
    const { location, shops } = this.props
    // , loading
    location.query = queryString.parse(location.search)
    const { list, selectedRowKeys, loading, selectedRows, page, total } = shops
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
            return (
              <span>
                <a onClick={this.editModal.bind(this, record)} >编辑</a>
              </span>
          )
        },
      }]
    const tableProps = {
      // rowSelection: {
      //   type: 'radio',
      // },
      // toolbar: tabelToolbar,
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
    return (
      <div>
        <Page inner>
          <JcTable {...tableProps} />
        </Page>
        {this.state.shopsModalVisiable ? <ShopsModal {...shopsModalProps}/> : null}
      </div>
    )
  }
}
