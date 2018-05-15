import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Radio } from 'antd'
import { save } from '../../../services/opening/opening'

const RadioGroup = Radio.Group

@connect(state => ({
    opening: state.opening,
    deialsmodal: state.deialsmodal,
    selectList: [],
  }))
export default class OpeningModal extends Component {
    state = {
        positionList: [],
        value: null,
    }
   componentWillMount() {
       this.setState({
        positionList: this.props.data.positionList,
       })
   }
componentWillReceiveProps() {
    this.setState({
        value: null,
    })
}
onChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  }
onOk = () => {
    if (this.state.value === null) {
        console.log('用户没有选中数据，我也没办法')
    } else {
        const payload = Object.assign({
          warehouseNo: this.state.value,
        })
        save({
            ...payload,
        }).then((json) => {
            if (json) {
              this.props.dispatch({
                type: 'opening/search',
              })
              this.props.data.OpeningNewdatavisond()
            } else {
                console.log('添加期初库存保存失败')
            }
        })
    }
}
handleCancel = () => {
    this.props.data.OpeningNewdatavisond()
}

render() {
    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
      }
    return (
      <Modal
        title={<div>请选择仓库</div>}
        visible={this.props.data.OpeningNewvis}
        onCancel={this.handleCancel}
        okText="确定"
        cancelText="取消"
        maskClosable={false}
        onOk={this.onOk}
      >
        {/* <h1>请选择仓库</h1> */}
        <div style={{ overflow: 'auto', height: 600 }}>
        <RadioGroup onChange={this.onChange} value={this.state.value}>
          {this.state.positionList.map(e =>
            <Radio style={radioStyle} value={e.warehouseNo}>{e.warehouseName}</Radio>
          )}
        </RadioGroup>
        </div>
      </Modal>
    )
}
}
