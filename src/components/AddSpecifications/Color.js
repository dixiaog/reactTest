/*
 * @Author: Wupeng
 * @Date: 2018-02-07 13:29:03
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-12 15:12:03
 * 添加类目规格
 */
import React, { Component } from 'react'
import { Modal, Form, Input, message, Icon, Button, Row, Col, Tooltip, Popconfirm } from 'antd'
import { addCategorySpec } from '../../services/category/category'
import styles from './index.less'

const FormItem = Form.Item

// let uuid = 0
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
 this.setState({
  colorspeclistf: this.props.data.colorrecord,
  colorArray: this.props.data.colorarray,
 })
}
// 删除类目属性值
remove = (k) => {
  const specListx = this.state.specList
  for (let i = 0; i < specListx.length; i++) {
    if (k.specName === specListx[i].specName) {
      specListx.splice(i, 1)
      this.setState({
        specList: specListx,
      })
      this.props.form.resetFields(`names[${this.state.specList.length}]`)
    return
    } else {
      console.log('删除失败')
      return
    }
  }
  }
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
  add = (e) => {
    if (this.state.colorspeclistf.length > 0) {
      const colorspeclistf = this.state.colorspeclistf
      for (let i = 0; i < colorspeclistf.length; i++) {
        if (colorspeclistf[i].specName === this.props.form.getFieldValue(`names[${e}]`)) {
          message.warning(`${colorspeclistf[i].specName}已经存在，不允许添加`)
          return
        }
      }
    }
    if (this.props.form.getFieldValue(`names[${e}]`) === undefined || this.props.form.getFieldValue(`names[${e}]`) === '') {
      message.warning('属性名不能为空')
      return
    }
    if (this.state.specList.length === 0) {
      const specLists = this.state.specList
      specLists.push(
        { specName: `${this.props.form.getFieldValue(`names[${e}]`)}`, productSpec: '', list: e, categoryNo: this.state.colorArray.categoryNo, companyNo: this.state.colorArray.companyNo }
      )
      this.setState({
        specList: specLists,
      })
    } else {
      for (let i = 0; i < this.state.specList.length; i++) {
        if (this.props.form.getFieldValue(`names[${i}]`) === undefined) {
          console.log('报错了')
          return
        } else {
          const specLists = this.state.specList
          for (let j = 0; j < specLists.length; j++) {
            if (this.props.form.getFieldValue(`names[${e}]`) === specLists[j].specName) {
              message.warning(`${specLists[j].specName}已经存在，不允许添加`)
              return
            } else {
              console.log('继续添加')
              const lists = this.state.specList.length
              specLists.push(
                { specName: `${this.props.form.getFieldValue(`names[${e}]`)}`, productSpec: '', list: lists, categoryNo: this.state.colorArray.categoryNo, companyNo: this.state.colorArray.companyNo }
              )
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

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
      }
    })
  }
  delextcancel= (index, j) => {
    console.log('用户取消了删除')
  }
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
handeelonch = (rules, value, callback) => {
if (value.indexOf(' ') !== -1) {
  callback('不能输入空格')
} else if (value.length > 50) {
  callback('属性值不能大于50')
} else {
  callback()
}
}
render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    }
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    }
    const oldformItems = this.state.colorspeclistf.map((k, index) => {
      return (
        <FormItem
          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
          label={index === 0 ? '已有属性名称' : ''}
          required={false}
        >
          {getFieldDecorator(`colorspecname[${index}]`, {
            initialValue: k.specName,
            validateTrigger: ['onChange', 'onBlur'],
          })(
            <Input disabled={!false} style={{ width: '60%', marginRight: 8 }} />
          )}
        </FormItem>
      )
    })
    const formItems = this.state.specList.map((k, index) => {
      return (
        <FormItem
          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
          label={index === 0 ? '属性名称' : ''}
          required={false}
        >
          {getFieldDecorator(`names[${index}]`, {
            initialValue: k.specName,
          })(
            <Input onChange={this.handelonchange.bind(this, index)} style={{ width: '60%', marginRight: 8 }} />
          )}
          <Icon
            className={styles.dynamicdeletebutton}
            type="minus-circle-o"
            onClick={this.remove.bind(this, k)}
          />
        </FormItem>
      )
    })
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
    const childre = this.state.specList.map((v, index) => {
      const productSpec = v.productSpec.split(',')
      const In = [
        <Col spen={16} offset={4} >
          <Input size="small" id={`${v.list}`} placeholder={`请输入${v.specName}`} style={{ width: '200px' }} />
        </Col>]
      const sh = [
        <Col spen={16} offset={4} >
          <Button size="small" type="primary" style={{ width: '200px' }} onClick={this.buttonspect.bind(this, v.specName, index, v.list)}>{`新增${v.specName}`}</Button>
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
        bodyStyle={{ height: 500, overflowX: 'hidden' }}
        onCancel={this.props.data.colortwo}
        maskClosable={false}
        footer={[
          <Button onClick={this.props.data.colortwo}>取消</Button>,
          <Button type="primary" loading={this.state.loading} onClick={this.handeOk}>保存</Button>,
            ]}
      >
        <Form onSubmit={this.handleSubmit}>
          {(this.state.colorspeclistf.length === 0) ? null : oldformItems}
          {formItems}
          <FormItem
            {...(this.state.specList.length === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
            label={this.state.specList.length === 0 ? '属性名称' : ''}
            required={false}
          >
            {getFieldDecorator(`names[${this.state.specList.length}]`, {
              initialValue: '',
              validateTrigger: ['onChange', 'onBlur'],
              rules: [{ validator: this.handeelonch }],
            })(
              <Input style={{ width: '60%', marginRight: 8 }} id={`names[${this.state.specList.length}]`} />
            )}
          </FormItem>
          <FormItem {...formItemLayoutWithOutLabel}>
            <Button type="dashed" onClick={this.add.bind(this, this.state.specList.length)} style={{ width: '60%' }}>
              <Icon type="plus" /> 新增规格
            </Button>
          </FormItem>
        </Form>
        <Row span={24}>
          <Col span={4} style={{ textAlign: 'right', paddingRight: '10px' }}>
          属性值:
          </Col>
          <Col span={8} offset={0.1}>
          <div style={{ width: 500 }} className={styles.contentBoard}>
              <div className={styles.gutterexample}>
                {(this.state.colorspeclistf.length === 0) ? null : oldchildre}
                {childre}
              </div>
            </div>
          </Col>
        </Row>
      </Modal>
    )
  }
}
export default Color
