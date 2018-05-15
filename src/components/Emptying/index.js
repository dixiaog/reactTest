import React, { Component } from 'react'
import { Modal, Icon } from 'antd'
import style from './index.less'

class Emptying extends Component {
    render() {
        const title = [<h2><Icon type="question-circle-o" className={style.icon} />请确认</h2>]
        return (
          <Modal
            title={title}
            visible={this.props.Emptyingvis}
            onOk={this.handleOk}
            onCancel={this.props.handelEmptyinghide}
          >
            <h3>请确认删除所有分类,一旦删除,将不可恢复。</h3>
            <h3>请仔细确认</h3>
          </Modal>
        )
    }
}

export default Emptying
