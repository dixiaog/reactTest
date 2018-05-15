import React, { Component } from 'react'
import { Modal, Icon } from 'antd'
import style from './index.less'

class ImportTaobo extends Component {
  state = {
    confirmLoading: false,
  }
  handleOk = () => {
    this.setState({
      // visible: false,
      confirmLoading: true,
    })
    setTimeout(() => {
      this.setState({
        // visible: false,
        confirmLoading: false,
      })
      this.props.handelimportTaobohide()
    }, 2000)
  }
    render() {
        const title = [<h2><Icon type="question-circle-o" className={style.icon} />请确认</h2>]
        return (
          <Modal
            title={title}
            visible={this.props.ImportTaobovis}
            onOk={this.handleOk}
            width={600}
            confirmLoading={this.state.confirmLoading}
            onCancel={this.props.handelimportTaobohide}
          >
            <h3 style={{ lineHeight: 1.6 }}>导入的分类直接作为根目录存在，如果分类已经存在，将不导入,<br />
            如果需要重新导入，请先删除该分类<br />
           如果是刚授权的店铺，可能需要一段时间（一般授权完30分钟内）<br />
           待商品信息完全下来才能导入 <br />  <br />
           从线上拉去分类信息需要一定时间，请耐心等待
           请确认导入？
            </h3>
            <h3>请仔细确认</h3>
          </Modal>
        )
    }
}

export default ImportTaobo
