import React from 'react'

class PrintLayout extends React.PureComponent {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

export default PrintLayout
