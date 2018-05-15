/*
 * @Author: Wupeng
 * @Date: 2017-1-5 10:04:11
 * @Last Modified by;
 * 商品类目 复制属性到其他类目
 * @Last Modified time:
 */

import React, { Component } from 'react'
import { Modal, Checkbox, Radio } from 'antd'
import { addToOtherAttribute } from '../../../services/category/category'
import styles from './index.less'

const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group

const defaultCheckedList = []
class CopyProperties extends Component {
    state = {
        copyType: 0,
        checkedList: defaultCheckedList,
        indeterminate: false,
        checkAll: false,
        confirmLoading: false,
        plainOptions: [],
     }
     componentWillReceiveProps() {
      this.setState({
        plainOptions: this.props.CopyPropertiesvisData.labeldata,
       })
     }
     onChangeListss = (checkedList) => {
      this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < this.state.plainOptions.length),
      checkAll: checkedList.length === this.state.plainOptions.length,
    })
  }
  onCheckAllChange = (e) => {
    const checked = []
    if (e.target.checked) {
      for (let i = 0; i < this.state.plainOptions.length; i++) {
        checked[i] = this.state.plainOptions[i].value
      }
    }
    this.setState({
      checkedList: e.target.checked ? checked : [],
      indeterminate: false,
      checkAll: e.target.checked,
    })
  }
  onChange = (e) => {
    this.setState({
      copyType: e.target.value,
    })
  }
  onCancel = () => {
    this.setState({
      checkAll: false,
      plainOptions: [],
      checkedList: [],
    })
    this.props.handelCopyPropertieshide()
  }
    handleOk = () => {
      this.setState({
        confirmLoading: true,
      })
      const cateList = []
        for (let i = 0; i < this.props.CopyPropertiesvisData.data.length; i++) {
          for (let j = 0; j < this.state.checkedList.length; j++) {
            if (String(this.props.CopyPropertiesvisData.data[i].categoryName) === String(this.state.checkedList[j])) {
              cateList[j] = this.props.CopyPropertiesvisData.data[i]
            }
          }
        }
        const payload = {
          // attributeList 选择的属性集合
          attributeList: this.props.CopyPropertiesvisData.selectedRows,
          // cateList 勾选的类目集合名称
          cateList,
          copyType: this.state.copyType,
        }
        addToOtherAttribute({
          ...payload,
        }).then(() => {
           setTimeout(() => {
            this.setState({
              confirmLoading: false,
              checkAll: false,
              plainOptions: [],
              checkedList: [],
            })
            this.props.handelCopyPropertieshide()
           }, 1000)
        })
    }
    render() {
        const radioStyle = {
            // display: 'block',
            height: '30px',
            lineHeight: '30px',
          }
        return (
          <Modal
            cancelText="取消"
            okText="确定"
            maskClosable={false}
            title="请选择复制方式和目标类目"
            visible={this.props.CopyPropertiesvis}
            onOk={this.handleOk}
            width={800}
            confirmLoading={this.state.confirmLoading}
            onCancel={this.onCancel}
          >
            <RadioGroup onChange={this.onChange} value={this.state.copyType}>
              <Radio style={radioStyle} value={0}>添加到目标类目中有属性列表，碰到相同的属性（已属性号判断为依据）则直接覆盖</Radio>
              <Radio style={radioStyle} value={1}>禁用目标类目中原有所有属性类目，添加新的属性，碰到相同的类目则直接覆盖（包括启用禁用）</Radio>
            </RadioGroup>
            <hr />
            <div>
            <div className={styles.contentBoard}>
                <Checkbox
                  indeterminate={this.state.indeterminate}
                  onChange={this.onCheckAllChange}
                  checked={this.state.checkAll}
                >
                 全选
                </Checkbox>
                <br />
              </div>
              <div>
              <br />
              <CheckboxGroup style={radioStyle} options={this.state.plainOptions} value={this.state.checkedList} onChange={this.onChangeListss} /><br />
              <br />
              </div>
            </div>
          </Modal>
        )
    }
}
export default CopyProperties
