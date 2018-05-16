import React, { Component } from 'react'
import { connect } from 'dva'
import PublicTable from '../../../components/PublicTable'
import { Tag, Input, Popconfirm } from 'antd'
import { shouldUpdate } from '../../../utils/utils'

@connect(state => ({
  wechat: state.wechat,
}))
export default class User extends Component {
  constructor(props) {
    super(props)
    this.state = {
      role: false,
    }
  }
  componentDidMount() {
    if (shouldUpdate()) {
      this.props.dispatch({ type: 'wechat/fetch' })
    }
  }

  render() {
    const { list, total, page, loading, searchParam } = this.props.wechat
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
        title: '昵称',
        dataIndex: 'nickname',
        key: 'nickname',
        width: 60,
      },
      {
        title: 'openId',
        dataIndex: 'openid',
        key: 'openid',
        width: 100,
      },
      {
        title: '店铺编号',
        dataIndex: 'qrSceneStr',
        key: 'qrSceneStr',
        width: 100,
      },
      {
        title: '店铺名称',
        dataIndex: 'shopName',
        key: 'shopName',
        width: 100,
      },
      {
        title: '关注否',
        dataIndex: 'attention',
        key: 'attention',
        width: 80,
        render: (text) => {
          if (text) {
            return <Tag color="#108ee9">已关注</Tag>
          } else {
            return <Tag color="#f50">已取消</Tag>
          }
        },
      },
      {
        title: '操作',
        key: 'operation',
        width: 100,
        render: (text, record) => {
          return (
            <Popconfirm title="确认删除当前用户?" onConfirm={() => console.log('确定')} okText="确定" cancelText="取消">
              <a>删除</a>
            </Popconfirm>
          )
        },
      },
    ]
    const actionBar = [
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
      namespace: 'wechat',
      searchParam,
      searchBar,
    }
    return (
      <div>
        <PublicTable {...tableProps} />
      </div>
    )
  }
}
