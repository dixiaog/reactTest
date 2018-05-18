import React, { Component } from 'react'
import { connect } from 'dva'
import PublicTable from '../../../components/PublicTable'
import { Tag, Input, Popconfirm, Button, Divider } from 'antd'
import { isRefresh } from '../../../utils/utils'
import ShopModal from './ShopModal'

@connect(state => ({
  shop: state.shop,
}))
export default class Shop extends Component {
  constructor(props) {
    super(props)
    this.state = {
      shop: false,
      record: {},
    }
  }
  componentDidMount() {
    if (isRefresh()) {
      this.props.dispatch({ type: 'shop/fetch' })
    }
  }

  render() {
    const { list, total, page, loading, searchParam } = this.props.shop
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
        title: '采购中心',
        dataIndex: 'procurementCenter',
        key: 'procurementCenter',
        width: 60,
      },
      {
        title: '店铺编号',
        dataIndex: 'shopNo',
        key: 'shopNo',
        width: 100,
      },
      {
        title: '店铺名称',
        dataIndex: 'shopName',
        key: 'shopName',
        width: 100,
      },
      {
        title: '状态',
        dataIndex: 'shopStatus',
        key: 'shopStatus',
        width: 80,
        render: (text) => {
          if (text) {
            return <Tag color="#108ee9">有效</Tag>
          } else {
            return <Tag color="#f50">删除</Tag>
          }
        },
      },
      {
        title: '微信地址',
        dataIndex: 'wechatUrl',
        key: 'wechatUrl',
        width: 100,
      },
      {
        title: '操作',
        key: 'operation',
        width: 100,
        render: (text, record) => {
          return (
            <div>
              <a onClick={() => this.setState({ shop: true, record })}>详情</a>
              <Divider type="vertical" />
              <Popconfirm title="确认删除当前店铺?" onConfirm={() => console.log('确定')} okText="确定" cancelText="取消">
                <a>删除</a>
              </Popconfirm>
            </div>
          )
        },
      },
    ]
    const actionBar = [
      <Button type="primary" size="small" onClick={() => this.setState({ shop: true })}>新增店铺</Button>,
    ]
    const searchBar = [
      {
        decorator: 'qrSceneStr',
        components: (<Input placeholder="请输入店铺编号" size="small" />),
      },
      {
        decorator: 'nickname',
        components: (<Input placeholder="请输入昵称" size="small" />),
      },
    ]
    const tableProps = {
      total,
      ...page,
      columns,
      data: list,
      rowKey: 'id',
      actionBar,
      dispatch: this.props.dispatch,
      loading,
      namespace: 'shop',
      searchParam,
      searchBar,
    }
    return (
      <div>
        <PublicTable {...tableProps} />
        <ShopModal show={this.state.shop} hideModal={() => this.setState({ shop: false, record: {} })} record={this.state.record} />
      </div>
    )
  }
}
