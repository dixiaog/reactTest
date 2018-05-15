import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DragLayer  } from 'react-dnd'


@DragLayer(monitor => ({
  item: monitor.getItem(),
  itemType: monitor.getItemType(),
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging(),
}))
export default class TableLayer extends Component {
  static propTypes = {
    black: PropTypes.bool,
  }

  render() {
    const { black } = this.props
    const fill = black ? 'black' : 'white'
    const stroke = black ? 'white' : 'black'

    return (<div
      style={{
        backgroundColor: fill,
        color: stroke,
        width: '100%',
        height: '100%',
      }}
    >{this.props.children}</div>)
  }
}
