/*
 * @Author: jiangteng
 * @Date: 2018-01-23 15:00:38
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-04-21 16:53:15
 * 查询池Modal
 */

import React, { Component } from 'react'
import { Input, List, Icon, message } from 'antd'
import { getOmQueryPoolList, addOmQueryPool, delOmQueryPool } from '../../../services/order/search'

const Search = Input.Search
export default class SearchPool extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
    }
  }
  componentWillMount() {
    getOmQueryPoolList({ poolType: 0 }).then((json) => {
      if (json && json.list) {
        this.setState({
          list: json.list,
        })
      }
    })
  }
  addPool = (value) => {
    if (value.indexOf(' ') !== -1) {
      message.warning('数据池名称不允许输入空格')
    } else {
      const index = this.state.list.findIndex(ele => ele.poolName === value)
      if (index === -1) {
        addOmQueryPool({
          json: JSON.stringify(this.props.poolDate),
          poolName: value,
          poolType: 0,
        }).then((json) => {
          if (json) {
            getOmQueryPoolList({ poolType: 0 }).then((json1) => {
              if (json1 && json1.list) {
                this.setState({
                  list: json1.list,
                })
              }
            })
          }
        })
      } else {
        message.warning('数据池名称已经存在,不允许重复添加')
      }
    }
  }
  selectQuery = (content) => {
    this.props.selectQuery(content)
  }
  deleteQuery = (autoNo) => {
    delOmQueryPool({
      autoNo,
    }).then((json) => {
      if (json) {
        const { list } = this.state
        this.setState({
          list: list.filter(e => e.autoNo !== autoNo),
        })
      }
    })
  }

  render() {
    return (
      <div>
        <div style={{ height: 300, overflowX: 'hidden' }}>
          <List
            itemLayout="horizontal"
            dataSource={this.state.list}
            renderItem={item => (
              <List.Item actions={[<a onClick={this.deleteQuery.bind(this, item.autoNo)}><Icon type="delete" /></a>]}>
                <a onClick={this.selectQuery.bind(this, item.poolContent)}>{item.poolName}</a>
              </List.Item>
            )}
          />
        </div>
        <Search
          placeholder="新增数据池名"
          onSearch={value => this.addPool(value)}
          enterButton="新增"
          maxLength="50"
          size="small"
        />
      </div>)
  }
}
