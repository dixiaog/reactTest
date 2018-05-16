import React, { Component } from 'react'
import { connect } from 'dva'
import PublicTable from '../../../components/PublicTable'
import { Button, Input } from 'antd'
import { shouldUpdate } from '../../../utils/utils'
import SoftModal from './SoftModal'

@connect(state => ({
  software: state.software,
}))
export default class Software extends Component {
  constructor(props) {
    super(props)
    this.state = {
      software: false,
    }
  }
  componentDidMount() {
    if (shouldUpdate()) {
      this.props.dispatch({ type: 'software/fetch' })
    }
  }

  render() {
    const { list, total, page, loading, searchParam } = this.props.software
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
        title: '应用名称',
        dataIndex: 'appname',
        key: 'appname',
        width: 100,
      },
      {
        title: '版本号',
        dataIndex: 'appversion',
        key: 'appversion',
        width: 100,
      },
      {
        title: '产品名称',
        dataIndex: 'productname',
        key: 'productname',
        width: 100,
      },
      {
        title: '操作',
        key: 'operation',
        width: 100,
        render: (text, record) => {
          return (
            <a>下载</a>
          )
        },
      },
    ]
    const actionBar = [
      <Button type="primary" size="small" onClick={() => this.setState({ software: true })}>新增应用</Button>,
    ]
    const searchBar = [
      {
        decorator: 'appname',
        components: (<Input placeholder="请输入应用名称" size="small" />),
      },
      {
        decorator: 'appversion',
        components: (<Input placeholder="请输入版本号" size="small" />),
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
      namespace: 'software',
      searchParam,
      searchBar,
    }
    return (
      <div>
        <PublicTable {...tableProps} />
        <SoftModal show={this.state.software} hideModal={() => this.setState({ software: false })} />
      </div>
    )
  }
}
