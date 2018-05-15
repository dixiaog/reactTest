/*
 * @Author: tanmengjia
 * @Date: 2018-02-02 13:21:12
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-04-16 16:59:11
 * 同步店铺库存
 */
import React, { Component } from 'react'
import { Modal, Form, Col, Button, Alert, Radio, Input, Checkbox } from 'antd'

const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group
const { TextArea } = Input

@Form.create()
export default class ImportCombination extends Component {
    constructor(props) {
        super(props)
        this.state = {
        itemType: '0',
        text: '',
        choose3: true,
        }
      }
    onChange = (e) => {
      this.setState({
        itemType: e.target.value,
      })
      if (e.target.value * 1 === 3) {
        this.setState({
          choose3: false,
        })
      } else {
        this.setState({
          choose3: true,
        })
      }
    }
    changeText = (e) => {
      this.setState({
        text: e.target.value,
      })
    }
    handleOk = () => {
        this.props.itemModalHidden()
        this.props.form.resetFields()
    }
    handleCancel = () => {
      this.props.form.resetFields()
      this.props.itemModalHidden()
    }
  render() {
      const description = (
        <div style={{ color: '#A14715' }}>同步库存操作后台进行，整个过程需要5分钟或更长(根据商品数量多少)，请耐心等待</div>
      )
    return (
      <Modal
        maskClosable={false}
        title="同步店铺库存(请勾选需要同步库存的店铺)"
        visible={this.props.synchronousModalVisiable}
        onCancel={this.handleCancel}
        // onOk={this.handleOk}
        width="600px"
        key="888"
        footer={[
          <Button key="submit" type="primary" onClick={this.handleOk}>
            确定
          </Button>,
        ]}
      >
        <Alert message={description} type="warning" />
        <br />
        <RadioGroup onChange={this.onChange} value={this.state.itemType}>
          <Col span={13} style={{ marginBottom: '5px' }}><Radio value="0">全部商品<a style={{ color: 'red' }}>(全部商品，包含无库存资料商品，无库存资料作0库存处理)</a></Radio></Col>
          <Col span={13} style={{ marginBottom: '5px' }}><Radio value="1">有库存商品<a style={{ color: 'red' }}>(必须有库存资料商品才有效)</a></Radio></Col>
          <Col span={13} style={{ marginBottom: '5px' }}>
            <Radio value="2">勾选商品{ this.state.itemType * 1 === 2 && this.props.selectedRows.length < 1 ? <a style={{ color: 'red' }}>(请选择需要上传库存的商品资料)</a> : ''}</Radio></Col>
          <Col span={13} style={{ marginBottom: '5px' }}>
            <Radio value="3">输入商品{ this.state.itemType * 1 === 3 && this.state.text === '' ? <a style={{ color: 'red' }}>(请输入至少一个商品编码)</a> : ''}</Radio></Col>
        </RadioGroup>
        <TextArea disabled={this.state.choose3} placeholder="输入商品编码，多个商品编码以英文逗号分隔" rows={4} style={{ marginBottom: '20px' }} onChange={this.changeText} />
        <br />
        <div>
          <CheckboxGroup key="992">
            {/* onChange={this.choose} value={this.state.chooseLevel} disabled={this.state.isOpen} */}
            <Col span={24} style={{ marginBottom: '5px' }}><Checkbox value="1" >阿里巴巴7号店铺【上传库存未启用!】</Checkbox></Col>
            <Col span={24} style={{ marginBottom: '5px' }}><Checkbox value="2" >A店铺</Checkbox></Col>
          </CheckboxGroup>
        </div>
        {/* <CheckboxGroup onChange={this.choose1} value={this.state.chooseSell} disabled={this.state.isOpen1}>
            { this.props.distributor.length && this.props.distributor.map((ele) => {
            return (
            <Col span={6} key={ele.distributorNo}><Checkbox value={ele.distributorNo} >{ele.distributorName}</Checkbox></Col>
            )
            })
            }
        </CheckboxGroup> */}
        {/* <br /> */}
      </Modal>
    )
  }
}
