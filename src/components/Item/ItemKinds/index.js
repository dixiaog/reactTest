/*
 * @Author: chenjie
 * @Date: 2017-12-08 16:51:07
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-04-26 14:29:36
 * 选择商品分类（暂弃）
 */

import React, { Component } from 'react'
import { Modal } from 'antd'

export default class ItemKinds extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
      handleOk = () => {
        this.handleSubmit()
      }
      handleCancel = () => {
      }
      handleSubmit = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
           console.log(values)
          }
        })
      }
      render() {
        return (
          <div>
            <Modal
              title="请选择商品分类"
              visible={this.props.itemKindVisiable}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              // width={800}
            >
              123
            </Modal>
          </div>
        )
      }
}
