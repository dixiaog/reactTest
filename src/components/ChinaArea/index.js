/*
 * @Author: chenjie
 * @Date: 2017-12-29 10:05:20
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-04-26 14:28:22
 * 中国区域选择
 */
import React, { Component } from 'react'
import { Modal, Icon, Checkbox, Row, Popover } from 'antd'
import { chainArea } from '../../utils/chainArea'
import { checkEmpty } from '../../utils/utils'

export default class ChinaArea extends Component {
    constructor(props) {
        super(props)
        this.state = {
            areas: [],
        }
    }
    componentWillMount() {
       this.areaInit()
    }
    componentWillReceiveProps(nextProps) {
      const { areas } = this.state
      if (!nextProps.visiable) {
        this.areaInit()
        return false
      }
      let selectedArea = []
      if (!checkEmpty(nextProps.editDestination)) {
        selectedArea = nextProps.editDestination.split(',')
        for (const selected of selectedArea) {
          if (selected.indexOf('(') > -1) {
            const selectedA = selected.split('(')[0]
            const chooseArea = selected.split('(')[1].split(')')[0].split(',')
            for (const area of areas) {
              for (const p of area.province) {
                if (p.name === selectedA) {
                  for (const c of p.citys) {
                    if (chooseArea.indexOf(c.name) > -1) {
                      c.checked = true
                    }
                  }
                }
              }
            }
          } else {
            for (const area of areas) {
              for (const p of area.province) {
                if (p.name === selected) {
                  p.checked = true
                }
              }
            }
          }
        }
        this.setState({
          areas,
        }, () => { this.disabledSelected() })
      } else {
        this.areaInit(() => { this.disabledSelected() })
      }
    }
    areaInit = (cb) => {
      chainArea.forEach((area) => {
        Object.assign(area, { checked: false, disabled: false })
        if (area.province) {
            area.province.forEach((p) => {
                Object.assign(p, { checked: false, disabled: false })
                if (p.citys) {
                    p.citys.forEach(city => Object.assign(city, { checked: false, indeterminate: false, disabled: false }))
                }
            })
        }
        })
      this.setState({
        areas: chainArea,
      }, () => { cb ? cb() : null })
    }
    disabledSelected = () => {
      const { areas } = this.state
      console.log('this.props.otherDestination', this.props.otherDestination)
      if (!checkEmpty(this.props.otherDestination)) {
        const selectedArea = this.props.otherDestination.split(',')
        for (const selected of selectedArea) {
          if (selected.indexOf('(') > -1) {
            const selectedA = selected.split('(')[0]
            const chooseArea = selected.split('(')[1].split(')')[0].split(',')
            for (const area of areas) {
              for (const p of area.province) {
                if (p.name === selectedA) {
                  for (const c of p.citys) {
                    if (chooseArea.indexOf(c.name) > -1) {
                      c.disabled = true
                    }
                  }
                }
              }
            }
          } else {
            for (const area of areas) {
              for (const p of area.province) {
                if (p.name === selected) {
                  p.disabled = true
                }
              }
            }
          }
        }
      }
      this.setState({ areas })
    }

    areaIndeterminate = (aindex) => {
      const { areas } = this.state
      let flag = true
      areas.province.forEach((p) => { if (!p.checked) flag = false })
      if (flag) {
        areas[aindex] = true
      } else {
        areas[aindex].indeterminate = true
      }
    }
    handleOnChange = (aindex, pindex, cindex, e) => {
     const { areas } = this.state
     if (typeof cindex === 'number') {
        if (e.target.checked) {
          areas[aindex].province[pindex].citys[cindex].checked = true
        } else {
          areas[aindex].province[pindex].citys[cindex].checked = false
          areas[aindex].province[pindex].checked = false
          areas[aindex].checked = false
        }
     } else {
        if (typeof pindex === 'number') {
         if (cindex.target.checked) {
            areas[aindex].province[pindex].checked = true
            areas[aindex].province[pindex].citys.forEach(city => Object.assign(city, { checked: true }))
         } else {
            areas[aindex].province[pindex].checked = false
            areas[aindex].province[pindex].citys.forEach(city => Object.assign(city, { checked: false }))
         }
        } else {
            if (pindex.target.checked) {
                areas[aindex].checked = true
                areas[aindex].province.forEach((p) => {
                    Object.assign(p, { checked: true })
                    p.citys.forEach(city => Object.assign(city, { checked: true }))
                })
            } else {
                areas[aindex].checked = false
                areas[aindex].province.forEach((p) => {
                    Object.assign(p, { checked: false })
                    p.citys.forEach(city => Object.assign(city, { checked: false }))
                })
            }
        }
     }
     this.setState({ areas })
    }
    resetArea = () => {
        chainArea.forEach((area) => {
            Object.assign(area, { checked: false })
            if (area.province) {
              area.province.forEach((p) => {
                  Object.assign(p, { checked: false })
                  if (p.citys) {
                      p.citys.forEach(city => Object.assign(city, { checked: false, indeterminate: false }))
                  }
              })
            }
          })
          this.setState({
            areas: chainArea,
          })
    }
    handleOk = () => {
      const areaList = []
      const { areas } = this.state
      areas.forEach((area) => {
        if (area.checked) {
          area.province.forEach(p => areaList.push(p.name))
        } else {
          area.province.forEach((p) => {
              if (p.checked) {
                areaList.push(p.name)
              } else {
                  const cityList = []
                  p.citys.forEach((city) => { if (city.checked) cityList.push(city.name) })
                  if (cityList.length) {
                    areaList.push(`${p.name}(${cityList.join(',')})`)
                  }
              }
          })
        }
      })
      this.props.editArea(areaList.join(','))
      this.props.hidden()
      this.resetArea()
    }
    handleCancel = () => {
        this.props.hidden()
        this.resetArea()
    }
    renderCitys = (citys, aindex, pindex) => {
        return (
          <div style={{ width: 100 }}>
            {citys.map((city, cindex) => <Checkbox
                onChange={this.handleOnChange.bind(this, aindex, pindex, cindex)}
                checked={city.checked}
                disabled={city.disabled}
                style={{ marginBottom: 5, marginLeft: 0 }}
              >
                {city.name}
              </Checkbox>)}
          </div>)
    }
    render() {
        const { areas } = this.state
        const hasIndeterminate = (list) => {
            let flag = false
            list.forEach((e) => { if (e.checked) flag = true })
            return flag
        }
        const isDisabeld = (list) => {
          let flag = true
          list.forEach((e) => { if (!e.disabled) flag = false })
          return flag
      }
        return (
          <div>
            <Modal
              title="选择区域"
              visible={this.props.visiable}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              width={800}
              bodyStyle={{ maxHeight: 500, overflowX: 'hidden' }}
            >
              { areas.map((area, aindex) => {
                return (
                  <Row style={{ marginBottom: 5 }} key={aindex}>
                    <Checkbox
                     indeterminate={area.checked ? false : hasIndeterminate(area.province)}
                     onChange={this.handleOnChange.bind(this, aindex)}
                     checked={area.checked}
                     disabled={isDisabeld(area.province)}
                    >
                      <span style={{ fontWeight: 'bold', fontSize: 16 }}>{area.name}</span>
                  </Checkbox>
                    { area.province ? area.province.map((p, pindex) => {
                        return (
                          <Checkbox
                            indeterminate={p.checked ? false : hasIndeterminate(p.citys)}
                            onChange={this.handleOnChange.bind(this, aindex, pindex)}
                            checked={p.checked}
                            disabled={p.disabled}
                            style={{ marginBottom: 5 }}
                          >{p.name} { p.citys ?
                            <Popover content={this.renderCitys(p.citys, aindex, pindex)}><a><Icon type="down-circle-o" /></a></Popover> : null }
                          </Checkbox>)
                    }) : null }
                  </Row>)
              })}
            </Modal>
          </div>)
    }
}
