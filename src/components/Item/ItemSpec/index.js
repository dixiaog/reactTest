/*
 * @Author: chenjie
 * @Date: 2017-12-11 15:38:57
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-02 13:58:58
 * 商品规格
 */

import React, { Component } from 'react'
import { Button, Row, Col, Divider, message } from 'antd'
import styles from './index.less'
import EditableCheckBox from '../../EditableCheckBox'

export default class ItemSpec extends Component {
    // constructor(props) {
    //   super(props)
    //   this.state = {
    //   }
    // }
    splitEle = (specVal) => {
      const type0 = []
      const type1 = []
      specVal.forEach((ele, i) => {
        if (ele.type === 0) {
          type0.push(
            <Col className={styles.checkCol} span={4} key={`${ele.specName}${i}`}>
              <EditableCheckBox {...ele} onChange={this.handleSpecChange} i={i} custormSpecChange={this.custormSpecChange} />
              {/* <Checkbox onChange={this.handleSpecChange.bind(this)} value={ele.name}>{ele.name}</Checkbox> */}
            </Col>)
        } else {
          console.log('eleeleele', ele)
          type1.push(
            <Col className={styles.checkCol} span={4} key={`${ele.specName}${i}`}>
              <EditableCheckBox {...ele} onChange={this.handleSpecChange} i={i} custormSpecChange={this.custormSpecChange} />
            </Col>)
        }
      })
      return { type0, type1 }
    }
    handleSpecChange = (checked, value) => {
      const { spec } = this.props
        spec.specVal.forEach((ele) => {
          if (ele.name === value) {
            Object.assign(ele, { checked })
          }
        })
      this.props.handleSpecChange(spec, this.props.i)
    }
    custormSpecChange = (i, value) => {
      const { spec } = this.props
      const list = spec.specVal.filter(e => e.name === value)
      if (list.length) {
        // spec.specVal[i].checked = false
        message.error('规格属性重复')
        // this.props.handleSpecChange(spec, this.props.i)
      } else {
        spec.specVal[i].name = value
        this.props.handleSpecChange(spec, this.props.i)
      }
    }
    addCheckBox = () => {
      const { spec } = this.props
      spec.specVal.push({
        type: 1,
        name: '自定义',
        wEnable: true,
        checked: false,
        isNew: true,
      })
      this.props.specsCountChange(spec, this.props.i)
    }
    render() {
      const { spec } = this.props
      const splitEleType = spec.specVal && spec.specVal.length ? this.splitEle(spec.specVal) : []
      return (
        <div>
          <Divider>{ `${spec.specName}` }</Divider>
          {spec.specVal && spec.specVal.length ?
            <div>
              <Row className={styles.checkRow}>
                {splitEleType.type0.length ? splitEleType.type0.map(ele => ele) : null}
              </Row>
              </div> 
              : null
            }
              <div>{ `${spec.specName}->自定义` }</div>
              <Row className={styles.checkRow}>
                {splitEleType.type1 && splitEleType.type1.length ? splitEleType.type1.map(ele => ele) : null}
              </Row>
              <Button onClick={this.addCheckBox.bind(this)}>{`添加自定义${spec.specName}`}</Button>
            
        </div>)
    }
}
