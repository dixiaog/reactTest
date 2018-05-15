import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DragSource } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import Resizable from 're-resizable'
import QRious from 'qrious'
import { utf16to8 } from '../../utils/utils'
import shouldPureComponentUpdate from './shouldPureComponentUpdate'
import ItemTypes from './ItemTypes'
import Box from './Box'

var JsBarcode = require('jsbarcode')
const boxSource = {
  beginDrag(props, monitor, component) {
    const { id, title, left, top, actived } = props
    const { width, height } = component.state
    return { id, title, left, top, actived, width, height }
  },
}

function getStyles(props) {
  const { left, top, isDragging, actived, cssDefault } = props
  const transform = `translate3d(${left}px, ${top}px, 0)`

  return {
    position: 'absolute',
    transform,
    WebkitTransform: transform,
    opacity: isDragging ? 0 : 1,
    height: isDragging ? 0 : '',
    zIndex: 2,
    backgroundColor: actived ? 'yellow' : 'transparent',
    ...cssDefault,
  }
}

@DragSource(ItemTypes.BOX, boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging(),
}))
export default class DraggableBox extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.any.isRequired,
    title: PropTypes.string.isRequired,
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    actived: PropTypes.bool.isRequired,
    cssDefault: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      width: 0,
      height: 0,
    }
  }

  componentWillMount() {
    this.setState({
      width: this.props.width,
      height: this.props.height,
    })
  }

  componentDidMount() {
    this.props.connectDragPreview(getEmptyImage(), {
      captureDraggingState: true,
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      width: nextProps.width,
      height: nextProps.height,
    })
  }

  shouldComponentUpdate = shouldPureComponentUpdate
  getDom() {
    const { item } = this.props
    switch (item.type) {
      case 2: { // 二维码
        const size = Math.min(item.width, item.height)
        const value = utf16to8(`{${item.value}}`)
        const qr = new QRious({ value, size })
        return (<img src={qr.toDataURL()} width={size} alt="" />)
      }
      case 3: { // 条形码
        const width = item.ext && item.ext.barcodeWidth ? item.ext.barcodeWidth * 1 : 1
        const size = item.height
        const canvas = document.createElement('canvas')
        const value = `${item.value}`
        // console.log('=====', value)
        console.log(this.props)
        JsBarcode(canvas, value, {
          format: 'CODE128',
          width,
          height: size - 4,
          fontSize: 12,
          margin: 2,
          displayValue: false,
        })
        const data = canvas.toDataURL()
        return (<img src={data} alt="" />)
      }
      default: {
        return `{${item.name}}`
      }
    }
  }
  resizeTrigger = (e, direction, ref, d) => {
    this.setState({
      width: this.state.width + d.width,
      height: this.state.height + d.height,
    })
    const { id } = this.props
    const { width, height } = this.state
    this.props.resizeTrigger(id, width, height)
    // this.props.dispatch({
    //   type: 'printModifyView/resizeTrigger',
    //   payload: { id, width, height },
    // })
    e.stopPropagation()
  }

  // 是否被选中
  activeTrigger() {
    const { id, actived } = this.props
    if (!actived) {
      this.props.activeFilter(id)
      // this.props.dispatch({
      //   type: 'printModifyView/activeFilter',
      //   payload: { id },
      // })
    }
  }

  renderBox(item, dom) {
    return this.props.connectDragSource(
      <div
        style={this.props.isPreview ?
        Object.assign(getStyles(this.props), { backgroundColor: 'transparent' })
      : getStyles(this.props)}
        onClick={this.activeTrigger.bind(this)}
      >
        { item.actived
        ?
          <Resizable
            onResizeStop={this.resizeTrigger.bind(this)}
            defaultSize={{
              width: this.state.width,
              height: this.state.height,
            }}
          >{dom}
          </Resizable> : dom }
      </div>,
  )
  }


  render() {
    const { item } = this.props
    switch (item.type) {
    case 1:
      return this.renderBox(item, <Box isPreview={this.props.isPreview} width={this.state.width} height={this.state.height} />)
    case 2:
      return this.renderBox(item, this.getDom())
    case 3:
      return this.renderBox(item, this.getDom())
    case 4:
      return this.renderBox(item, <Box isPreview={this.props.isPreview} title={item.title} width={this.state.width} height={this.state.height} />)
    case 5:
      return this.renderBox(item, <Box printData={this.props.printData} isPreview={this.props.isPreview} title={item.title} width={this.state.width} height={this.state.height} />)
    default:
      return this.renderBox(item, null)
    }
  }
}
