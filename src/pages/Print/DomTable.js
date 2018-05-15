/*
 * @Author: jchen
 * @Date: 2017-10-28 09:02:48
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-04-20 09:46:38
 * 拖拽表格数据
 */
import React, { Component } from 'react'
import { DropTarget, DragSource } from 'react-dnd'
import ItemTypes from './ItemTypes'
import styles from './Print.less'
import DomColumn from './DomCol'


const tableTarget = {
  drop() {},
}
const tableSource = {
  beginDrag(props) {
    const id = 'table'
    const left = props.tableStyle.left || 0
    const top = props.tableStyle.top || 0
    return { id, left, top }
  },
}

@DragSource(ItemTypes.BOX, tableSource, (connect, monitor) => ({
  connectDragSourceTable: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
@DropTarget(ItemTypes.TABLE, tableTarget, connect => ({
  connectDropTargetTable: connect.dropTarget(),
}))
class Table extends Component {
  // static propTypes = {
  //   connectDragSourceTable: PropTypes.func.isRequired,
  //   isDragging: PropTypes.bool.isRequired,
  //   children: PropTypes.node
  // }

  findColumn(id) {
    const column = this.props.tableColumns.filter(c => c.id === id)[0]
    return { column, index: this.props.tableColumns.indexOf(column) }
  }
  moveColumn(id, atIndex) {
    const { column, index } = this.findColumn(id)
    this.props.removeColumn([
      [index, 1],
      [atIndex, 0, column],
    ])
    // this.props.dispatch({ type: 'printModifyView/removeColumn',
    // splice: [
    //   [index, 1],
    //   [atIndex, 0, column],
    // ] })
  }

  renderTableColumn = (column, key) => {
    const tableHelp = {
      minTDHeight: 30,
      minTHHeight: 30,
    }
    return (<DomColumn
      printData={this.props.printData ? this.props.printData[column.id] : null }
      isPreview={this.props.isPreview}
      dispatch={this.props.dispatch}
      key={key}
      i={key}
      id={column.id}
      column={column}
      tableHelp={tableHelp} />)
  }

  render() {
    const { hideSourceOnDrag, connectDragSourceTable, tableStyle, connectDropTargetTable, isDragging, tables } = this.props
    if (isDragging && hideSourceOnDrag) {
      return null
    }
    const opacity = isDragging ? 1 : 1
    return tables && tables.length ? connectDragSourceTable(connectDropTargetTable(
      <div className={styles.tableWarper} style={{ ...tableStyle, opacity }}>
        <div className={styles.table}>
          {tables.map((item, key) => this.renderTableColumn(item, key))}
        </div>
      </div>
  )) : null
  }
}

export default Table
