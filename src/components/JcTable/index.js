import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { Table, Modal } from 'antd'
import classnames from 'classnames'
// import { DropOption } from 'components'
// import { Link } from 'react-router-dom'
// import queryString from 'query-string'
// import AnimTableBody from 'components/DataTable/AnimTableBody'
import styles from './index.less'

const { confirm } = Modal


export default class JcTable extends Component {
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
    // tableProps isMotion,
    const { columns, showHeader, expandedRowRender,
            rowKey, dataSource, rowSelection, expandedRowKeys,
            total, current, pageSize, loading, noSelected, noTotal,
            nameSpace, dispatch, custormTableClass, pagination,
            selectedRowKeys, isPart, pageSizeOptions, pageProps, onExpand } = this.props
            // tableName,
    const rowSelectionEx = Object.assign({
      selectedRowKeys,
      onChange: (keys, selectedRows) => {
        dispatch({
          type: `${nameSpace}/changeState`,
          payload: {
            selectedRows,
            selectedRowKeys: keys,
          },
        })
      },
    }, rowSelection)
    const tableClassName = custormTableClass ? styles[custormTableClass] : (isPart ? styles.tablecPart : styles.tablec)
    const pagePropsEx = Object.assign({
      total,
      current,
      showTotal: noTotal ? null : () => { return `当前显示 ${((current - 1) * pageSize) + 1} 到 ${current * pageSize > total ? total : current * pageSize} 条数据,共 ${total} 条数据` },
      pageSize,
      onChange: (PageIndex) => {
        dispatch({
          type: `${nameSpace}/search`,
          payload: {
            page: { current: PageIndex, pageSize },
          },
        })
      },
      showSizeChanger: true,
      pageSizeOptions: pageSizeOptions && pageSizeOptions.length ? pageSizeOptions : ['20', '50', '100'],
      onShowSizeChange: (c, PageSize) => {
        dispatch({
          type: `${nameSpace}/search`,
          payload: {
            page: { current: c, pageSize: PageSize },
          },
        })
      },
      // style: { marginRight: '20px' },
    }, pageProps)
    const text = (
      <div>暂无数据</div>
    )
    return (
      <Table
        dataSource={dataSource}
        className={classnames(tableClassName, { [styles.nolist]: dataSource.length === 0 })}
        rowSelection={noSelected ? null : rowSelectionEx}
        // bordered
        scroll={{ x: 1250, y: 1250 }}
        columns={columns}
        loading={loading}
        // simple
        rowKey={record => (record.id ? record.id : record[rowKey])}
        pagination={pagination === undefined ? pagePropsEx : false}
        size="middle"
        onExpand={onExpand}
        expandedRowRender={expandedRowRender ? expandedRowRender : null}
        showHeader={showHeader === undefined ? true : false}
        expandedRowKeys={expandedRowKeys ? expandedRowKeys : []}
        locale={{ emptyText: text }}
      />
    )
  }
}