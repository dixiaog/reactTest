import React, { Component } from 'react'
import styles from './Print.less'

export default class Box extends Component {
  renderSquare = (i) => {
    return (
        <div key={i} style={{ width: '5%', height: '5%', borderRight: '1px dashed #eee', borderBottom: '1px dashed #eee', display: 'inline-block' }} />
    )
  }

	render() {
    const squares = []
    for (let i = 0; i < 10000; i++) {
      squares.push(this.renderSquare(i))
    }
    return (<div
      className={styles.tabaleGrid}
    >
        {squares}
    </div>)
	}
}
