/*
 * @Author: tanmengjia
 * @Date: 2018-03-16 13:26:52
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-04-03 19:20:13
 * 可编辑选择地址
 */
import React from 'react'
import { Cascader, Spin } from 'antd'
import { getAllProvinceEnum, getAllRegionEnum } from '../../services/base/warehouse'

export default class EditProvinceCell extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      options: [],
      position: [],
      loading: false,
      editEnable: false,
      value1: '',
      isFirst: true,
    }
  }
  componentWillMount() {
    this.getAllProvince()
    getAllProvinceEnum().then((json) => {
      const options = json.map((ele) => {
        return {
          value: ele.regionNo,
          label: ele.regionName,
          isLeaf: false,
        }
      })
      if (this.props.wh) {
        this.addrIterator(options, this.props.wh)
      } else {
        this.setState({
          options,
        })
      }
    })
  }
  componentWillReceiveProps(nextProps) {
    const { editEnable, value } = nextProps
    this.setState({
        editEnable,
        value1: value,
    })
    if (nextProps.doClean) {
      this.addrIterator(this.state.options, nextProps.wh)
      this.setState({
        position: [],
      })
      this.props.cleanData()
    } else if (nextProps.wh && nextProps.wh.province && nextProps.wh.city && nextProps.wh.county
      && (nextProps.wh.province !== this.props.wh.province
        || nextProps.wh.county !== this.props.wh.county
        || nextProps.wh.city !== this.props.wh.city)) {
      if (this.state.options.length === 0) {
        this.getAllProvince()
      } else {
        this.setState({ loading: true })
        this.addrIterator(this.state.options, nextProps.wh)
      }
    }
  }
  onChangeGetProvince = (value, selectedOptions) => {
    this.setState({
      position: value,
    }, () => {
      this.props.addrSelect(selectedOptions.map(ele => ele.label))
    })
  }
  getAllProvince = () => {
    getAllProvinceEnum().then((json) => {
      const options = json.map((ele) => {
        return {
          value: ele.regionNo,
          label: ele.regionName,
          isLeaf: false,
        }
      })
      this.setState({
        options,
      })
    })
  }
  addrIterator = (options, wh) => {
    const { province, city, county } = wh
    const position = []
    let ex = options.filter(e => e.label === province)
    if (ex && ex.length) {
      const provinceNo = ex[0].value
      position.push(provinceNo)
      let citys = []
      getAllRegionEnum(provinceNo).then((json1) => {
        citys = json1.map((e) => {
          return {
            value: e.regionNo,
            label: e.regionName,
            isLeaf: false,
          }
        })
        ex = citys.filter(c => c.label === city)
        if (ex && ex.length) {
          const cityNo = ex[0].value
          position.push(cityNo)
          getAllRegionEnum(cityNo).then((json3) => {
            const areas = json3.map((e) => {
              return {
                value: e.regionNo,
                label: e.regionName,
                isLeaf: true,
              }
            })
            for (const c of citys) {
              if (c.label === city) {
                c.children = areas
              }
            }
            for (const op of options) {
              if (op.value === provinceNo) {
                op.children = citys
              }
            }
            ex = areas.filter(a => a.label === county)
            if (ex && ex.length) {
              const countyNo = ex[0].value
              position.push(countyNo)
            }
            this.setState({ options, loading: false, position }, () => {
              this.props.addrSelect([province, city, county])
            })
          })
        } else {
          this.setState({ options, loading: false, position }, () => {
            this.props.addrSelect([province, city, county])
          })
        }
      })
    } else {
      this.setState({ options, loading: false, position }, () => {
        this.props.addrSelect([province, city, county])
      })
    }
  }
  loadData = (selectedOptions) => {
    const { options } = this.state
    const targetOption = selectedOptions[selectedOptions.length - 1] // options.filter(e => selectedOptions[selectedOptions.length - 1].value === e.value)
    targetOption.loading = true
    getAllRegionEnum(targetOption.value).then((json) => {
      targetOption.loading = false
      targetOption.children = json.map((e) => {
        return {
          value: e.regionNo,
          label: e.regionName,
          isLeaf: selectedOptions.length === 2,
        }
      })
      this.setState({
        options: [...options],
      })
    })
  }
  render() {
    const { editEnable, value1 } = this.state
    return (editEnable ?
      <Spin spinning={this.state.loading}>
        <Cascader
          size="small"
          value={this.state.position}
          options={this.state.options}
          loadData={this.loadData}
          changeOnSelect
          onChange={this.onChangeGetProvince}
          placeholder="请选择地址"
        />
      </Spin>
      :
      <span>{value1}</span>)
  }
}
