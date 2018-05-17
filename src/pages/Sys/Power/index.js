/*
 * @Author: tanmengjia
 * @Date: 2018-05-16 13:53:48
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-17 13:33:54
 * 权限管理
 */
import React, { Component } from 'react'
import { connect } from 'dva'
import PublicTable from '../../../components/PublicTable'
import { Button, Input, Divider, notification } from 'antd'
import { shouldUpdate } from '../../../utils/utils'
import PowerModal from './PowerModal'
import { deletePower } from '../../../services/system'
// import DistributePower from './DistributePower'

@connect(state => ({
  power: state.power,
}))
export default class Power extends Component {
  constructor(props) {
    super(props)
    this.state = {
      record: null,
      powerVisible: false,
    }
  }
  componentDidMount() {
    if (shouldUpdate()) {
      this.props.dispatch({ type: 'power/fetch' })
    }
  }
  details = (record) => {
    console.log('详情', record)
    this.setState({
      record,
      powerVisible: true,
    })
  }
  delete = (id) => {
    console.log('删除', id)
    deletePower(id).then((json) => {
      if (json) {
        notification.success({
          message: '操作成功',
        })
        this.props.dispatch({ type: 'power/search' })
      }
    })
  }
  render() {
    const { list, total, page, loading, searchParam } = this.props.power
    //  selectedRows,
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
        title: 'id',
        dataIndex: 'id',
        key: 'id',
        width: 60,
      },
      {
        title: '群组',
        dataIndex: 'groupname',
        key: 'groupname',
        width: 100,
      },
      {
        title: '名称',
        dataIndex: 'powerName',
        key: 'powerName',
        width: 200,
      },
      {
        title: '简称',
        dataIndex: 'title',
        key: 'title',
        width: 200,
      },
      {
        title: '路径',
        dataIndex: 'routeUrl',
        key: 'routeUrl',
        width: 600,
      },
      {
        title: '操作',
        dataIndex: 'do',
        key: 'do',
        width: 100,
        render: (text, record) => {
          return(
            <div>
              <span>
                <a onClick={this.details.bind(this, record)}>详情</a>
                <Divider type="vertical" />
                <a onClick={this.delete.bind(this, record.id)}>删除</a>
              </span>
            </div>
          )
        }
      },
    ]
    const actionBar = [
      <Button type="primary" size="small" onClick={() => this.setState({ powerVisible: true })}>添加资源</Button>,
    ]
    const searchBar = [
      {
        decorator: 'groupname',
        components: (<Input placeholder="资源群组" size="small" />),
      },
      {
        decorator: 'powerName',
        components: (<Input placeholder="资源名称" size="small" />),
      },
      {
        decorator: 'title',
        components: (<Input placeholder="资源简称" size="small" />),
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
      namespace: 'power',
      searchParam,
      searchBar,
    }
    return (
      <div>
        <PublicTable {...tableProps} />
        {this.state.powerVisible ? <PowerModal powerVisible={this.state.powerVisible} record={this.state.record} hideModal={() => this.setState({ powerVisible: false, record: null })} /> : null}
      </div>
    )
  }
}
