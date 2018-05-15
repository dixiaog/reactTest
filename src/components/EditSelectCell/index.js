/*
 * @Author: chenjie
 * @Date: 2017-12-12 13:46:05
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-04-02 20:58:27
 * 可编辑的Select
 */

import React, { Component } from 'react'
import { Select } from 'antd'

const { Option } = Select

export default class EditSelectCell extends Component {
    constructor(props) {
      super(props)
      this.state = {
          editEnable: false,
          value: '',
          typeData: [],
      }
    }
    componentWillMount() {
        // const { editEnable, value } = this.props
        // this.setState({
        //     editEnable,
        //     value,
        // })
    }
    componentWillReceiveProps(nextProps) {
        const { editEnable, value, typeData } = nextProps
        this.setState({
            editEnable,
            value,
            typeData,
        })
    }
    handleInputChange = (e) => {
       this.setState({
           value: e,
       }, () => {
        this.props.onInputChange(this.state.value, this.props.record, this.props.column)
       })
    }
    handleInputBlur = (e) => {
        // this.props.onInputChange(e.target.value, this.props.autoNo, this.props.column)
        e.stopPropagation()
     }
    render() {
        const { editEnable, value, typeData } = this.state
        return (editEnable ?
          <Select defaultValue={value} size="small" onChange={this.handleInputChange.bind(this)} style={this.props.width ? { width: this.props.width } : 200}>
            { typeData && typeData.length ? typeData.map(ele => <Option key={ele.value} value={ele.value}>{ele.name}</Option>) : null}
          </Select>
          :
          <span>{this.props.value && typeData && typeData.length ?
            (typeData.filter(row => row.value === this.props.value).length ? typeData.filter(row => row.value === this.props.value)[0].name : this.props.value) : null}</span>)
    }
}
