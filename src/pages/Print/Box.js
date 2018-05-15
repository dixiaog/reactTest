import React, { Component } from 'react'
import PropTypes from 'prop-types'
import shouldPureComponentUpdate from './shouldPureComponentUpdate'

export default class Box extends Component {
	static propTypes = {
		title: PropTypes.string,
	}

	shouldComponentUpdate = shouldPureComponentUpdate
	render() {
		const { width, height, isPreview, printData } = this.props
		let { title } = this.props
		// console.log(title, printData)
		if (printData && printData) {
			title = printData
		}
		const styles = {
			border: isPreview ? '' : '1px dashed #e7e7e7',
			padding: '0.5rem 1rem',
			// cursor: 'move',
		}
		return (<div style={{ ...styles, width, height }}>{title}</div>)
	}
}
