/*
 * @Author: jchen
 * @Date: 2017-10-11 13:31:41
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-14 20:24:37
 * 列表选项组件
 */

import React from 'react'
import { Table } from 'antd'
import { DragDropContext, DragSource, DropTarget } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import update from 'immutability-helper'
import styles from './index.less'
import { pageCusSave, pageCusEditSave } from '../../services/base/pageCustom'

function dragDirection(
    dragIndex,
    hoverIndex,
    initialClientOffset,
    clientOffset,
    sourceClientOffset,
  ) {
    const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2
    const hoverClientY = clientOffset.y - sourceClientOffset.y
    if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
      return 'downward'
    }
    if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
      return 'upward'
    }
  }
  let BodyRow = (props) => {
    const {
      isOver,
      connectDragSource,
      connectDropTarget,
      moveRow,
      dragRow,
      clientOffset,
      sourceClientOffset,
      initialClientOffset,
      ...restProps
    } = props
    const style = { cursor: 'move' }
    let className = restProps.className
    if (isOver && initialClientOffset) {
      const direction = dragDirection(
        dragRow.index,
        restProps.index,
        initialClientOffset,
        clientOffset,
        sourceClientOffset
      )
      if (direction === 'downward') {
        className += styles.dropDownward // ' drop-over-downward'
      }
      if (direction === 'upward') {
        className += styles.dropUpward // ' drop-over-upward'
      }
    }
    return connectDragSource(
      connectDropTarget(
        <tr
          {...restProps}
          className={className}
          style={style}
        />
      )
    )
  }
  const rowSource = {
    beginDrag(props) {
      return {
        index: props.index,
      }
    },
  }
  const rowTarget = {
    drop(props, monitor) {
      const dragIndex = monitor.getItem().index
      const hoverIndex = props.index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      // Time to actually perform the action
      props.moveRow(dragIndex, hoverIndex)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      monitor.getItem().index = hoverIndex
    },
  }
  BodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    sourceClientOffset: monitor.getSourceClientOffset(),
  }))(
    DragSource('row', rowSource, (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      dragRow: monitor.getItem(),
      clientOffset: monitor.getClientOffset(),
      initialClientOffset: monitor.getInitialClientOffset(),
    }))(BodyRow)
  )

@DragDropContext(HTML5Backend)
class TableTitleChoose extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            selectedRowKeys: [],
            isEdit: false,
        }
    }
    componentWillMount() {
      // pageCusSearch({
      //   componentName: this.props.tableName,
      //   componentType: 0,
      // }).then((json) => {
      //   if (json.length) {
      //     const customInfo = JSON.parse(json[0].customInfo)
      //     this.setState({
      //       data: customInfo.data,
      //       selectedRowKeys: customInfo.selectedRowKeys,
      //       isEdit: true,
      //     }, () => {
      //       // this.props.colsChange(this.state.data.filter(ele => this.state.selectedRowKeys.indexOf(ele.title) > -1))
      //     })
      //   }
      //   // console.log(json)
      // })
        this.setState({
            data: this.props.columns,
            selectedRowKeys: this.props.popSelectedCol,
            isEdit: this.props.isEdit,
        })
    }
    componentWillReceiveProps(nextProps) {
      const { isEdit } = this.state
      const selectedRowKeys = nextProps.popSelectedCol
      if (!isEdit) {
        pageCusSave({
          componentName: this.props.tableName,
          componentType: 0,
          customInfo: JSON.stringify({
            selectedRowKeys,
          }),
        })
      } else {
        pageCusEditSave({
          componentName: this.props.tableName,
          componentType: 0,
          customInfo: JSON.stringify({
            selectedRowKeys,
          }),
        })
      }
    }
    components = {
        body: {
          row: BodyRow,
        },
      }
    handleOnSelect = (record, selected, selectedRows) => {
      this.setState({
        selectedRowKeys: selectedRows.map(x => x.title),
      })

      this.props.colsChange(selectedRows)
    }
    moveRow = (dragIndex, hoverIndex) => {
      const { data } = this.state
      const dragRow = data[dragIndex]

      this.setState(
          update(this.state, {
          data: {
              $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
          },
          }),
      )
      this.props.colsChange(this.state.data.filter(ele => {
        return typeof ele.title === 'string' ? this.state.selectedRowKeys.indexOf(ele.title) > -1 : this.state.selectedRowKeys.indexOf(ele.titleEx) > -1
      }
      ))
    }
    render() {
      console.log('this.state.selectedRowKeys',this.state.selectedRowKeys)
        return (
          <div>
            <Table
              columns={[{
                title: 'title',
                dataIndex: 'title',
                key: 'title',
            }]}
              dataSource={this.state.data}
              components={this.components}
              onRow={(record, index) => ({
                index,
                moveRow: this.moveRow,
            })}
              pagination={false}
              showHeader={false}
              bordered={false}
              rowSelection={{
                type: 'checkbox',
                selectedRowKeys: this.state.selectedRowKeys,
                onSelect: this.handleOnSelect.bind(this),
              }}
              rowKey={record => record.title}
              scroll={{ y: 260 }}
              size="small"
              className={styles.chooseTable}
            />
          </div>
          )
    }
}

export default TableTitleChoose
