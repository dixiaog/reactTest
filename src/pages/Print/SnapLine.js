import React, { Component } from 'react'
import PropTypes from 'prop-types'

let styles = {
  borderLeft: '1px dashed #108ee9',
  borderTop: '1px dashed #108ee9',
  position: 'absolute',
  zIndex: 1,
  // width: '1px',
  // height: '10000%',
  // top: '-5000%',
  // left: '0px',
	// cursor: 'move',
}

export default class SnapLine extends Component {
  static propTypes = {
    horizontal: PropTypes.bool,
  }
	render() {
    const { horizontal } = this.props
    if (horizontal) {
      styles = Object.assign(styles, { width: '10000%', height: '1px', top: '0px', left: '-5000%' })
    } else {
      styles = Object.assign(styles, { width: '1px', height: '10000%', top: '-5000%', left: '0px' })
    }
		return <div key style={{ ...styles }} />
	}
}
