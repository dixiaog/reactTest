/*
 * @Author: Wupeng
 * @Date: 2018-03-30 14:06:29
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-03-30 14:42:00
 * 库存分仓 库存范围不是整数的提示框
 */
import React, { Component } from "react"
import { Modal, Alert, Button } from 'antd'

class Numdel extends Component {
    constructor(props) {
        super (props)
        this.state = {
            visible: true,
        }
    }
    componentWillReceiveProps(nextprops) {
        this.setState({
            visible: nextprops.data.Numdelvis,
        })
    }
    render() {
        return(
            <div>
                <Modal
                  title="提示"
                  maskClosable={false}
                  visible={this.state.visible}
                  footer={[
                    <Button type="primary" onClick={this.props.data.Numdeltwo}>确定</Button>,
                  ]}
                >
                 <div>
                 <Alert
                    description="请输入整数"
                    type="warning"
                    showIcon
                    />
                 </div>
                </Modal>
            </div>
        )
    }
}
export default Numdel