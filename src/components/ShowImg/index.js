/*
 * 图片显示组件
 */

import React from 'react'
import { Avatar, Modal} from 'antd'
import $ from 'jquery'

export default class ShowImg extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          pageX: 0,
          pageY: 0,
          showPicModal: false,
        }
    }
    render() {
      return (
        <div style={{ cursor: 'pointer' }}>
          <span
            onMouseOut={() => {
              $('#pic').css({
                'display': 'none',
              })
            }}
            onMouseMove={(e) => {
              if (document.documentElement.clientHeight - e.pageY > 200) {
                this.setState({ pageX: e.pageX, pageY: e.pageY }, () => {
                  $('#pic').css({
                    'display': 'block',
                    'left': this.state.pageX + 10,
                    'top': this.state.pageY + 20,
                  })
                  $('#img').attr({
                    'src': this.props.record.productImage,
                  })
                })
              } else {
                this.setState({ pageX: e.pageX, pageY: e.pageY }, () => {
                  $('#pic').css({
                    'display': 'block',
                    'left': this.state.pageX + 10,
                    'top': this.state.pageY - 200,
                  })
                  $('#img').attr({
                    'src': this.props.record.productImage,
                  })
                })
              }
            }}
            onClick={() => this.setState({ showPicModal: true })}
          >
            <Avatar size="large" shape="square" src={this.props.record.productImage} />
          </span>
           <Modal
            title={this.props.record.productName}
            visible={this.state.showPicModal}
            onCancel={() => this.setState({ showPicModal: false })}
            width={548}
            footer={null}
          >
            <Avatar style={{ width: 500, height: 500 }} shape="square" src={this.props.record.productImage} />
          </Modal>
        </div>
      )
    }
}
