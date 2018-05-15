import React, { Component } from 'react'
import PropTypes from 'prop-types'
import shouldPureComponentUpdate from './shouldPureComponentUpdate'
import Box from './Box'

const styles = {
	display: 'inline-block',
	// transform: 'rotate(-7deg)',
	// WebkitTransform: 'rotate(-7deg)',
}

export default class BoxDragPreview extends Component {
	static propTypes = {
		title: PropTypes.string.isRequired,
	}

	constructor(props) {
		super(props)
		this.tick = this.tick.bind(this)
	}

	componentDidMount() {
		// this.interval = setInterval(this.tick, 500)
	}
	shouldComponentUpdate = shouldPureComponentUpdate
	componentWillUnmount() {
		// clearInterval(this.interval)
	}

	tick() {
		this.setState({
			tickTock: !this.state.tickTock,
		})
	}

	render() {
		const { width, height } = this.props

		return (
  <div style={styles}>
    <Box width={width} height={height} yellow />
  </div>
		)
	}
}
