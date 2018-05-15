/*
 * @Author: Wupeng
 * @Date: 2018-02-07 13:29:03
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-12 15:12:09
 * 添加类目规格
 */
import React, { Component } from 'react'
import { Modal, Form, Input, message, Icon, Button, Row, Col, Tooltip, Popconfirm } from 'antd'
import { addCategorySpec } from '../../services/category/category'
import styles from './index.less'


@Form.create()

class Color extends Component {
  constructor(props) {
      super(props)
      this.state = {
        specList: [],
        loading: false,
        colorspeclistf: [],
      }
  }
  componentWillMount() {
    // console.log(this.props)
    this.setState({
     colorspeclistf: this.props.data.colorrecord,
     colorArray: this.props.data.colorarray,
    })
   }
  reome = (e, k) => {
    const specListx = this.state.specList
    specListx.splice(e, 1)
    this.setState({
       specList: specListx,
    })
  }
  // 确定保存
  handeOk = () => {
    this.setState({
      loading: true,
    })
  const payload = Object.assign({
    categoryNo: this.state.colorArray.categoryNo,
    specList: this.state.specList,
  })
  addCategorySpec({
    ...payload,
  }).then((json) => {
    if (json) {
      console.log('保存成功')
      this.setState({
        specList: [],
        loading: false,
      })
      this.props.data.colortwo()
    } else {
      console.log('保存失败')
      this.setState({
        loading: false,
      })
    }
  })
  }
  // 用户添加属性名
  add = (e) => {
    const adt = document.getElementById(`names[${e}]`).value
    if (this.state.colorspeclistf.length > 0) {
      const colorspeclistf = this.state.colorspeclistf
      for (let i = 0; i < colorspeclistf.length; i++) {
        if (colorspeclistf[i].specName === adt) {
          message.warning(`${colorspeclistf[i].specName}已经存在，不允许添加`)
          return
        }
      }
    }
    if (adt === undefined || adt === '') {
      message.warning('属性名不能为空')
      return
    }
    if (this.state.specList.length === 0) {
      const color = document.getElementById(`names[${e}]`).value
      const specLists = this.state.specList
      specLists.push({
          specName: color,
          productSpec: '',
          list: e,
          categoryNo: this.state.colorArray.categoryNo,
          companyNo: this.state.colorArray.companyNo,
      })
      document.getElementById(`names[${e}]`).value = ''
      this.setState({
          specList: specLists,
      })
    } else {
      for (let i = 0; i < this.state.specList.length; i++) {
        if (adt === undefined) {
          console.log('报错了')
          return
        } else {
          const specLists = this.state.specList
          for (let j = 0; j < specLists.length; j++) {
            if (adt === specLists[j].specName) {
              message.warning(`${specLists[j].specName}已经存在，不允许添加`)
              return
            } else { 
              const color = document.getElementById(`names[${e}]`).value
              // const specLists = this.state.specList
              specLists.push({
                  specName: color,
                  productSpec: '',
                  list: e,
                  categoryNo: this.state.colorArray.categoryNo,
                  companyNo: this.state.colorArray.companyNo,
              })
              document.getElementById(`names[${e}]`).value = ''
              this.setState({
                  specList: specLists,
              })
              return
            }
          }
        }
      }
    }
  }
  // 取消删除
  delextcancel = () => {
    console.log('用户删除取消')
  }
  // 删除属性
  delect = (index, j) => {
    const arr = this.state.specList
    const arrindex = arr[index]
    const productSpec = arrindex.productSpec.split(',')
    productSpec.splice(j, 1)
    arrindex.productSpec = productSpec.toString()
    arr[index] = arrindex
    this.setState({
      specList: arr,
    })
  }
  text = (productSpec, index) => {
    const chs = []
      for (let j = 0; j < productSpec.length; j++) {
        chs.push(
          <Col className={styles.gutterrow} span={3}>
            <div className={styles.gutterbox}>
              <Popconfirm
                title={`是否删除${productSpec[j]}`}
                onConfirm={this.delect.bind(this, index, j)}
                onCancel={this.delextcancel.bind(this, index)}
                okText="确定"
                cancelText="取消"
              >
                <Tooltip placement="bottom" title={`点击可以删除${productSpec[j]}`}>
                  <span>{`${productSpec[j]}`}</span>
                </Tooltip>
              </Popconfirm>
            </div>
          </Col>
          )
      }
      return (
        chs
      )
  }
  oldtext = (productSpec) => {
    const chs = []
      for (let j = 0; j < productSpec.length; j++) {
        chs.push(
          <Col className={styles.gutterrow} span={3}>
            <div className={styles.gutterbox}>
              <Tooltip title={`${productSpec[j]}`}>
                <span>{`${productSpec[j]}`}</span>
              </Tooltip>
            </div>
          </Col>
          )
      }
      return (
        chs
      )
  }
//   新增属性值
buttonspect = (value, index, list) => {
  if (String(document.getElementById(list).value.trim()).length > 50) {
    message.warning('属性值长度不能大于50')
    document.getElementById(list).value = ''
    return
  }
  if (document.getElementById(list).value.trim() === '') {
    message.warning('输入的值不能为空')
  } else {
    const text = document.getElementById(list).value
    const specLists = this.state.specList
    let s = 0
    for (let i = 0; i < specLists.length; i++) {
      if (value === specLists[i].specName) {
        s = i
        break
      }
    }
    if ((specLists[s].productSpec).length === 0) {
      specLists[s].productSpec = text
      this.setState({
          specList: specLists,
        })
        document.getElementById(list).value = ''
      return
    } else {
      const productSpecs = specLists[s].productSpec.split(',')
      for (let j = 0; j < productSpecs.length; j++) {
        if (text === productSpecs[j]) {
          message.warning(`${text}已经存在不允许添加`)
          return
        }
        }
        productSpecs.push(text)
        specLists[s].productSpec = productSpecs.toString()
        this.setState({
          specList: specLists,
        })
    }
      document.getElementById(list).value = ''
  }
}
  // 新增属性名校验
  handelonchange = (index, e) => {
    const specLists = this.state.specList
    if (e.target.value.length === 0) {
      message.warning('属性值不能为空，删除请点击右侧按钮！')
      e.target.value = specLists[index].specName
      return true
    } else if (e.target.value.length > 50) {
      e.target.value = specLists[index].specName
      return true
    } else {
      specLists[index].specName = `${e.target.value}`
      this.setState({
        specList: specLists,
      })
    }
  }
  render() {
    //   样式
      const Row1 = {
        marginBottom: 20,
      }
      const Input1 = {
        width: '50%',
      }
      const Input2 = {
        backgroundColor: '#FFFAFA',
        width: '90%',
      }
      const div1 = {
        fontSize: 12,
        color: 'black',
        padding: 10,
        textAlign: 'right',
      }
      const bodyStyle = {
        height: 500,
        overflowX: 'hidden',
      }
      const Button1 = {
        width: '200px',
      }
    //   便利的数据
    // 旧的数据
      const oldformItems = this.state.colorspeclistf.map((k, index) => {
          return (
            <Row style={Row1} type="flex" justify="space-around" align="middle">
              <Col span={18} push={6}>
                <Input
                  style={Input1}
                  disabled={!false}
                  value={k.specName}
                  addonAfter={<Icon
                    type="close-circle"
                  />}
                />
              </Col>
              <Col span={6} pull={18}>
                <div style={div1}>
                  {(index === 0) ? '已有属性名' : null}
                </div>
              </Col>
            </Row>
          )
      })
    //   新的数据
      const FormItems = this.state.specList.map((k, index) => {
          return (
            <Row style={Row1} type="flex" justify="space-around" align="middle">
              <Col span={18} push={6}>
                <Input
                  style={Input1}
                  id={`names[${index}]`}
                  value={k.specName}
                  onChange={this.handelonchange.bind(this, index)}
                  addonAfter={<Icon
                    type="close-circle"
                    onClick={this.reome.bind(this, index, k.specName)}
                  />}
                />
              </Col>
              <Col span={6} pull={18}>
                <div style={div1}>
                  {(index === 0) ? '属性名' : null}
                </div>
              </Col>
            </Row>
          )
      })
    //   旧的属性值
    const oldchildre = this.state.colorspeclistf.map((v) => {
        const productSpec = v.productSpec.split(',')
        return (
          <div>
            <Row gutter={16}>
              <Col className={styles.gutterrow} span={4}>
                <div className={styles.gutterbox} style={{ textAlign: 'rigth' }}>
                  <Tooltip title={`${v.specName}`}>
                    <span>{`${v.specName}:`}</span>
                  </Tooltip>
                </div>
              </Col>
              {this.oldtext(productSpec)}
            </Row>
          </div>
        )
      })
    //   新的属性值
    const childre = this.state.specList.map((v, index) => {
        const productSpec = v.productSpec.split(',')
        const In = [
          <Col spen={16} offset={4} >
            <Input size="small" id={`${v.list}`} placeholder={`请输入${v.specName}`} style={Button1} />
          </Col>]
        const sh = [
          <Col spen={16} offset={4} >
            <Button
              size="small"
              type="primary"
              style={Button1}
              onClick={this.buttonspect.bind(this, v.specName, index, v.list)}
            >
              {`新增${v.specName}`}
            </Button>
          </Col>]
        return (
          <div>
            <Row gutter={16}>
              <Col className={styles.gutterrow} span={4}>
                <div className={styles.gutterbox} style={{ textAlign: 'rigth' }}>
                  <Tooltip title={`${v.specName}`}>
                    <span>{`${v.specName}:`}</span>
                  </Tooltip>
                </div>
              </Col>
              {this.text(productSpec, index)}
            </Row>
            <br />
            {In}
            <br />
            {sh}
            <br />
          </div>
        )
      })
      return (
        <Modal
          title="添加类目规格"
          visible={this.props.data.colorvis}
          width={1000}
          bodyStyle={bodyStyle}
          onCancel={this.props.data.colortwo}
          maskClosable={false}
          footer={[
            <Button
              onClick={this.props.data.colortwo}
            >
            取消
            </Button>,
            <Button
              type="primary"
              loading={this.state.loading}
              onClick={this.handeOk}
            >
            保存
            </Button>,
            ]}
        >
          {(this.state.colorspeclistf.length === 0) ? null : oldformItems}
          {FormItems}
          <Row style={Row1} type="flex" justify="space-around" align="middle">
            <Col span={18} push={6}>
              <Input style={Input1} id={`names[${this.state.specList.length}]`} />
            </Col>
            <Col span={6} pull={18}>
              <div style={div1}>
                {(this.state.specList.length === 0) ? '属性名' : null}
              </div>
            </Col>
          </Row>
          <Row style={Row1}>
            <Col span={18} push={6}>
              <Button style={Input1} onClick={this.add.bind(this, this.state.specList.length)}>
                <Icon type="plus" /> 新增规格
              </Button>
            </Col>
            <Col span={6} pull={18}>
              {null}
            </Col>
          </Row>
          <Row>
            <Col span={18} push={6}>
              <div style={[Input2, styles.contentBoard]}>
                <div className={styles.gutterexample}>
                  {(this.state.colorspeclistf.length === 0) ? null : oldchildre}
                  {childre}
                </div>
              </div>
            </Col>
            <Col span={6} pull={18}>
              <div style={div1}>
                属性值
              </div>
            </Col>
          </Row>
        </Modal>
      )
  }
}

export default Color
