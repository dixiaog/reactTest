import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import classnames from 'classnames'
import { DropOption } from 'components'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import AnimTableBody from 'components/DataTable/AnimTableBody'
import styles from './List.less'

const { confirm } = Modal


export default class List extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }
  handleMenuClick = (record, e) => {
    if (e.key === '1') {
      this.props.onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: '确定删除这条记录?',
        onOk () {
          this.props.onDeleteItem(record.id)
        },
      })
    }
  }
  render () {
    const { isMotion, location } = this.props
    location.query = queryString.parse(location.search)
    const columns = [{
        title: 'Avatar',
        dataIndex: 'avatar',
        key: 'avatar',
        width: 64,
        className: styles.avatar,
        render: text => <img alt="avatar" width={24} src={text} />,
      }, {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => <Link to={`user/${record.id}`}>{text}</Link>,
      }, {
        title: 'NickName',
        dataIndex: 'nickName',
        key: 'nickName',
      }, {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
      }, {
        title: 'Gender',
        dataIndex: 'isMale',
        key: 'isMale',
        render: text => (<span>{text
          ? 'Male'
          : 'Female'}</span>),
      }, {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone',
      }, {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
      }, {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
      }, {
        title: 'CreateTime',
        dataIndex: 'createTime',
        key: 'createTime',
      }, {
        title: 'Operation',
        key: 'operation',
        width: 100,
        render: (text, record) => {
          return <DropOption onMenuClick={e => this.handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '编辑' }, { key: '2', name: '删除' }]} />
        },
      }]
    const AnimateBody = (props) => {
      return <AnimTableBody {...props} />
    }
  
    const CommonBody = (props) => {
      return <tbody {...props} />
    }
    return (
      <Table
        {...this.props}
        className={classnames(styles.table, { [styles.motion]: isMotion })}
        bordered
        scroll={{ x: 1250 }}
        columns={columns}
        simple
        rowKey={record => record.id}
        components={{
          body: { wrapper: isMotion ? AnimateBody : CommonBody },
        }}
      />
    )
  }
}