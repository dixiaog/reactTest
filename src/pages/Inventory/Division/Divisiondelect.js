import React, { Component } from 'react'
import { Modal } from 'antd'

export default class DelectList extends Component {
state = {

}
onOk = () => {
    this.props.data.Divisiondelecttwo()
}
handleCancel = () => {
    this.props.data.Divisiondelecttwo()
}

render() {
    return (
      <Modal
        title="请确认"
        visible={this.props.data.Divisiondelectvis}
        onCancel={this.handleCancel}
        mask={false}
        maskClosable={false}
        onOk={this.onOk}
      >
        <p style={{ lineHeight: 2 }}>所有库存商品数量归零，该功能为前期未启用库存管理，准备精确化库存管理<br />
        使用该功能前，请关闭所有的库存上传功能，代库存整理完毕在启用库存上传<br /><br /><br />
        系统将根据库存情况自动生成一张盘点单平衡当前库存
          <br /><br />
        您只能清理你说负责的仓库存存，其他仓库的库存不能清理
          <br /><br />
        请确认当前库存商品数量归0？
        </p>
      </Modal>
    )
}
}
