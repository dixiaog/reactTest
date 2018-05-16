import React, { Component } from 'react'
import { connect } from 'dva'
import update from 'immutability-helper'
import { Table, Row, Col, Form, Button, Popover, Checkbox, List, Icon } from 'antd'
import styles from './index.less'

const FormItem = Form.Item
const itemCol = {
  xs: { span: 24, offset: 0 },
  sm: { span: 24, offset: 0 },
  md: { span: 5, offset: 1 },
  lg: { span: 5, offset: 1 },
  xl: { span: 3, offset: 1 },
}
const itemFirstCol = {
  xs: { span: 24, offset: 0 },
  sm: { span: 24, offset: 0 },
  md: { span: 5, offset: 0 },
  lg: { span: 3, offset: 0 },
  xl: { span: 3, offset: 0 },
}
@connect(state => ({
  global: state.global,
}))
@Form.create()
export default class PublicTable extends Component {
  static defaultProps = {
    current: 1,
    pageSize: 20,
  }
  constructor(props) {
    super(props)
    this.state = {
      columns: [],
      listColumns: [],
      collapse: false,
    }
  }
  componentDidMount() {
    const listColumns = this.props.columns
    this.setState({
      columns: listColumns,
    })
    listColumns.forEach(ele => Object.assign(ele, { checked: true }))
    const initialArray = []
    const newArray = update(initialArray, {$push: listColumns})
    this.setState({
      listColumns: newArray,
    })
  }
  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      this.props.dispatch({
        type: `${this.props.namespace}/search`,
        payload: { searchParam: values },
      })
      this.props.dispatch({
        type: `${this.props.namespace}/changeState`,
        payload: { searchParam: values, loading: true },
      })
    })
  }
  handleReset = () => {
    this.props.form.resetFields()
    if (this.props.global.refresh) {
      const model = window.localStorage.getItem('model')
      const url = window.location.href.split('/')[window.location.href.split('/').length - 1]
      this.props.dispatch({
        type: `${url}/fetch`,
        payload: { searchParam: JSON.parse(model)[url].searchParam, page: {} },
      })
      this.props.dispatch({
        type: `${url}/changeState`,
        payload: { searchParam: JSON.parse(model)[url].searchParam, page: {} },
      })
      this.props.dispatch({
        type: 'global/changeState',
        payload: { refresh: false },
      })
    } else {
      this.props.dispatch({
        type: `${this.props.namespace}/search`,
        payload: { searchParam: {} },
      })
      this.props.dispatch({
        type: `${this.props.namespace}/changeState`,
        payload: { searchParam: {}, loading: true },
      })
    }
  }

  onChange = (title) => {
    const listColumns = this.state.listColumns
    let columns = this.state.columns
    const index = listColumns.findIndex(ele => ele.title === title)
    Object.assign(listColumns[index], { checked: !listColumns[index].checked })
    if(!listColumns[index].checked) {
      const columnsIndex = columns.findIndex(ele => ele.title === listColumns[index].title)
      columns.splice(columnsIndex, 1)
    } else {
      columns = listColumns.filter(ele => ele.checked)
    }
    this.setState({
      listColumns,
      columns,
    })
  }
  render() {
    const { refresh } = this.props.global
    const { getFieldDecorator } = this.props.form
    const { data, rowKey, scroll, current, total, pageSize,
      actionBar, dispatch, loading, namespace, searchParam, searchBar } = this.props
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        dispatch({
          type: `${namespace}/changeState`,
          payload: { selectedRows, selectedRowKeys },
        })
      },
    }
    const pagination = {
      current,
      total,
      showTotal: () => { return `当前显示 ${((current - 1) * pageSize) + 1} 到 ${current * pageSize > total ? total : current * pageSize} 条数据,共 ${total} 条数据` },
      pageSize,
      showSizeChanger: true,
      pageSizeOptions: ['20', '50', '100'],
      size: 'small',
      onChange: (PageIndex) => {
        dispatch({
          type: `${namespace}/search`,
          payload: {
            page: {
              current: PageIndex,
              pageSize,
            },
          },
        })
        dispatch({
          type: `${namespace}/changeState`,
          payload: {
            page: {
              current: PageIndex,
              pageSize,
            },
            loading: true,
          },
        })
      },
      onShowSizeChange: (c, PageSize) => {
        dispatch({
          type: `${namespace}/search`,
          payload: Object.assign(searchParam, { current: c, pageSize: PageSize }),
        })
        this.props.dispatch({
          type: `${namespace}/changeState`,
          payload: {
            page: {
              current: c,
              pageSize: PageSize,
            },
            loading: true,
          },
        })
      },
    }
    const content = (
      <List
        size="small"
        bordered
        dataSource={this.state.listColumns}
        renderItem={item => (<List.Item><Checkbox onChange={this.onChange.bind(this, item.title)} checked={item.checked} style={{ marginRight: 10, fontSize: 10 }} />{item.title}</List.Item>)}
      />
    )
    refresh ? this.handleReset() : null
    const formItem = (ele, index, initVal, flag) => {
      return (
        <Col {...flag} key={index}>
          <FormItem key={index}>
            {getFieldDecorator(ele.decorator, {
              initialValue: initVal,
            })(
              ele.components
            )}
            </FormItem>
        </Col>
      )
    }
    return (
      <div>
        <div className={styles.searchBar}>
          <span className={styles.panelLeft}>
            <Form>
              <Row>
                {searchBar && searchBar.length ? searchBar.map((ele, index) => {
                  let initVal = searchParam && searchParam[ele.decorator] !== undefined ? searchParam[ele.decorator] : undefined
                  if (index <= 5) {
                    if (index % 6 === 0) {
                      return (
                        formItem(ele, index, initVal, itemFirstCol)
                      )
                    } else {
                      return (
                        formItem(ele, index, initVal, itemCol)
                      )
                    }
                  } else {
                    if (index % 6 === 0 && this.state.collapse) {
                      return (
                        formItem(ele, index, initVal, itemFirstCol)
                      )
                    } else if (this.state.collapse) {
                      return (
                        formItem(ele, index, initVal, itemCol)
                      )
                    }
                  }
                }
                ) : null}
                </Row>
            </Form>
          </span>
          <span style={{ float: 'right', marginTop: 14, marginRight: 9 }}>
            { searchBar && searchBar.length ? <span>
              <Button type="primary" onClick={this.handleSubmit} size="small">搜索</Button>
              <Button style={{ marginLeft: 10 }} onClick={this.handleReset} size="small">清空</Button>
            </span> : null}
            {searchBar && searchBar.length > 6 ?
              <a onClick={() => this.setState({ collapse: !this.state.collapse })} style={{ marginLeft: 10, fontSize: 10 }}>{this.state.collapse ?
                '收起' : '展开'}<Icon type={`${this.state.collapse ?
                  'up' : 'down'}`} /></a> : ''}
          </span>
        </div>
        <div className={styles.antBtn}>
          {actionBar && actionBar.length ? actionBar.map((ele, index) => 
            <span key={index} className={styles.btn}>{ele}</span>
          ) : ''}
          <span style={{ float: 'right' }}>
            <Popover placement="bottomRight" content={<div className={styles.popover}>{content}</div>} trigger="hover">
              <Button style={{ marginRight: 9 }} size="small">列表选项</Button>
            </Popover>
          </span>
        </div>
        <div className={data.length ? this.state.collapse ? styles.tableCollapse : styles.table : styles.tableNoData}>
          <Table
            columns={this.state.columns}
            dataSource={data}
            rowKey={record => record[rowKey]}
            size="small"
            scroll={ scroll ? Object.assign(scroll, { y: document.body.clientHeight - 240 }) : Object.assign({}, { y: document.body.clientHeight - 240 })}
            rowSelection={rowSelection}
            pagination={pagination}
            loading={loading}
          />
        </div>
      </div>
    )
  }
}
