/*
 * @Author: jchen
 * @Date: 2017-10-11 13:31:41
 * Ant Table 组件二次封装
 * @isPart true:上下两个表格，false：一个表格
 */

import React from 'react'
import { Table, Button, Popover } from 'antd'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import styles from './index.less'
import TableTitleChoose from '../TableTitleChoose'
import config from '../../utils/config'
import { getLocalStorageItem } from '../../utils/utils'
import { pageCusSearch } from '../../services/base/pageCustom'

class JTable extends React.Component {
  static propTypes = {
    current: PropTypes.number,
    pageSize: PropTypes.number,
  }
  static defaultProps = {
      current: 1,
      pageSize: 20,
  }
  constructor(props) {
    super(props)
    this.state = {
      custormCols: [],
      tableHasEdited: false,
    }
  }

  componentWillMount() {
  }
  componentDidMount() {
    const { columns } = this.props
    pageCusSearch({
      componentName: this.props.tableName,
      componentType: 0,
    }).then((json) => {
      console.log('json1', json)
      if (json.length) {
        const customInfo = JSON.parse(json[0].customInfo)
        const listss = []
        console.log('customInfo.selectedRowKeys', customInfo.selectedRowKeys)
        customInfo.selectedRowKeys.forEach((e) => {
          listss.push(columns.find(row => e === (typeof row.title === 'string' ? row.title : row.titleEx)))
        })
        console.log('listss', listss)
        this.setState({
          custormCols: listss,
          tableHasEdited: true,
        })
      } else {
        this.setState({
          custormCols: this.props.columns,
        })
      }
    }).catch((err) => {
      console.log('----', err)
    })
  }
  colsChange = (cols) => {
    console.log('cols', cols)
    this.setState({
      custormCols: cols,
    })
  }
  render() {
    const { dispatch, loading,
      dataSource, rowSelection, pageProps, nameSpace, isPart,
      selectedRowKeys, total, current, pageSize, noSelected,
      expandedRowRender, pagination, onRow,
      noListChoose, custormTableClass, noScroll, showHeader, onExpand, expandedRowKeys, noTotal, pageSizeOptions } = this.props
    const rowKey = this.props.rowKey ? this.props.rowKey : 'key'
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
    console.log('this.state.custormCols', this.state.custormCols)
    const popSelectedCol = this.state.custormCols && this.state.custormCols.length
    ? this.state.custormCols.map(x => {
      if (x) {
      return typeof x.title === 'string' ? x.title : x.titleEx
    }else { return null}}).filter(x => x !== null) : []

    const text = (
      <div>暂无数据</div>
    )
    const popContent = (
      <TableTitleChoose
        tableName={this.props.tableName}
        columns={this.props.columns}
        colsChange={this.colsChange}
        dispatch={dispatch}
        popSelectedCol={popSelectedCol}
        isEdit={this.state.tableHasEdited}
      />)
      let xscoll = 0
      this.state.custormCols.length && this.state.custormCols.forEach((ele) => {
        if (ele) {
          xscoll += ele.width * 1
        }
      })
      let scroll
      if (this.props.scroll) {
        scroll = this.props.scroll.y ? this.props.scroll : Object.assign(this.props.scroll, { y: document.body.clientHeight - 240 })
      } else {
        scroll = { x: xscoll + 100, y: document.body.clientHeight - 240 }
      }
      const tableClassName = custormTableClass ? styles[custormTableClass] : (isPart ? styles.tablecPart : styles.tablec)
      const premissions = getLocalStorageItem('premissions')
  return (
    <div>
      <div className={this.props.toolbar || !noListChoose ? styles.tableaToolbar : null}>
        {/* 循环遍历按钮 */}
        {this.props.toolbar && this.props.toolbar.length ?
          <div className={styles.tabelToolbarItem}>
            {this.props.toolbar.map((e, index) => {
              if (e.props.premission === 'TRUE' || (e.props.premission && premissions.indexOf(e.props.premission) > -1)) {
                return <span key={index}>{e}</span>
              } else {
                return null
              }
            })}
          </div> : null}
        {noListChoose ? null :
        <Popover content={popContent} placement="bottomRight">
          <Button size={config.InputSize} className={styles.listChoose}>列表选项</Button>
        </Popover>}
      </div>
      <Table
        className={classNames(tableClassName, { [styles.nolist]: dataSource.length === 0 })}
        rowSelection={noSelected ? null : rowSelectionEx}
        columns={this.state.custormCols}
        dataSource={dataSource}
        onExpand={onExpand}
        rowKey={record => (record.id ? record.id : record[rowKey])}
        loading={loading}
        size="middle"
        pagination={pagination === undefined ? pagePropsEx : false}
        expandedRowRender={expandedRowRender ? expandedRowRender : null}
        scroll={noScroll ? {} : scroll}
        showHeader={showHeader === undefined ? true : false}
        expandedRowKeys={expandedRowKeys ? expandedRowKeys : []}
        locale={{ emptyText: text }}
        onRow={onRow}
      />
    </div>
  )
 }
}

export default JTable
