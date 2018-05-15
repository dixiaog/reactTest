import React from 'react'
import PropTypes from 'prop-types'
import 'font-awesome/css/font-awesome.css'

export default class Jicon extends React.Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    className: PropTypes.string,
    size: PropTypes.oneOf(['lg', '2x', '3x', '4x', '5x']),
    rotate: PropTypes.oneOf(['45', '90', '135', '180', '225', '270', '315']),
    flip: PropTypes.oneOf(['horizontal', 'vertical']),
    fixedWidth: PropTypes.bool,
    spin: PropTypes.bool,
    pulse: PropTypes.bool,
    stack: PropTypes.oneOf(['1x', '2x']),
    inverse: PropTypes.bool,
    Component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  }
  static defaultProps = {
    Component: 'i',
  }
  render() {
    const {
      Component,
      type, size, rotate, flip, spin, fixedWidth, stack, inverse,
      pulse, className, ...props
    } = this.props
    let classNames = `fa fa-${type} ${type}`
    if (size) {
      classNames = `${classNames} fa-${size}`
    }
    if (rotate) {
      classNames = `${classNames} fa-rotate-${rotate}`
    }
    if (flip) {
      classNames = `${classNames} fa-flip-${flip}`
    }
    if (fixedWidth) {
      classNames = `${classNames} fa-fw`
    }
    if (spin) {
      classNames = `${classNames} fa-spin`
    }
    if (pulse) {
      classNames = `${classNames} fa-pulse`
    }

    if (stack) {
      classNames = `${classNames} fa-stack-${stack}`
    }
    if (inverse) {
      classNames = `${classNames} fa-inverse`
    }

    if (className) {
      classNames = `${classNames} ${className}`
    }
    return <Component {...props} className={classNames} />
  }
}
