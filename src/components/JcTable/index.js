import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { Table, Button, Popover } from 'antd'
import classnames from 'classnames'
import config from '../../utils/config'
// import TableTitleChoose from '../TableTitleChoose/index'
// import { DropOption } from 'components'
// import { Link } from 'react-router-dom'
// import queryString from 'query-string'
// import AnimTableBody from 'components/DataTable/AnimTableBody'
import styles from './index.less'

export default class JcTable extends Component {
  constructor (props) {
    super(props)
    this.state = {
      custormCols: [],
    }
  }
  render () {
    // tableProps isMotion,
    const { columns, showHeader, expandedRowRender,
            rowKey, dataSource, rowSelection, expandedRowKeys,
            total, current, pageSize, loading, noSelected, noTotal,
            nameSpace, dispatch, custormTableClass, pagination,
            selectedRowKeys, isPart, pageSizeOptions, pageProps, onExpand, noListChoose } = this.props
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
    const popSelectedCol = this.state.custormCols && this.state.custormCols.length
    ? this.state.custormCols.map(x => { if (x) { return x.title }else { return null}}).filter(x => x !== null) : []
    const colsChange = (cols) => {
      this.setState({
        custormCols: cols,
      })
    }
    // const popContent = (
    //   <TableTitleChoose
    //     tableName={this.props.tableName}
    //     columns={this.props.columns}
    //     colsChange={colsChange}
    //     dispatch={dispatch}
    //     popSelectedCol={popSelectedCol}
    //     isEdit={this.state.tableHasEdited}
    //   />)
    return (
      <div>
        <div className={this.props.toolbar || !noListChoose ? styles.tableaToolbar : null}>
        {/* 循环遍历按钮 */}
        {this.props.toolbar && this.props.toolbar.length ?
          <div className={styles.tabelToolbarItem}>
            {this.props.toolbar.map((e, index) => {
              // if (e.props.premission === 'TRUE' || (e.props.premission && premissions.indexOf(e.props.premission) > -1)) {
                return <span key={index}>{e}</span>
              // } else {
              //   return null
              // }
            })}
          </div> : null}
          {/* {noListChoose ? null :
          <Popover content={popContent} placement="bottomRight">
            <Button size={config.InputSize} className={styles.listChoose}>列表选项</Button>
          </Popover>} */}
        </div>
        <Table
          dataSource={dataSource}
          className={classnames(tableClassName, { [styles.nolist]: dataSource.length === 0 })}
          rowSelection={noSelected ? null : rowSelectionEx}
          // bordered
          scroll={{ x: 1250, y: 1100 }}
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
      </div>
    )
  }
}