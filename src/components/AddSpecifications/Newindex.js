/*
 * @Author: Wupeng
 * @Date: 2018-02-09 14:07:12
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-12 15:12:17
 * 编辑类目规格
 */
import React, { Component } from 'react'
import { Modal, Form, Input, message, Button, Row, Col, Popconfirm, Tooltip } from 'antd'
import { updateSaveSpec, checkUpdateSpec } from '../../services/category/category'
import EditableCell from './EditableCell'
import styles from './index.less'

// const FormItem = Form.Item

@Form.create()
class Newindex extends Component {
  constructor(props) {
    super(props)
    this.state = {
      specList: [],
      loading: false,
      EditableCellvis: false,
      EditableCellv: {},
      EditableCellindex: null,
      delectProductSpec: [],
      updateProductSpec: [],
    }
}
componentWillMount() {
 this.setState({
  colorArray: this.props.data.NewRecore,
  specList: this.props.data.NewAddrecord,
 })
}
remove = (k) => {
  const specListx = this.state.specList
  for (let i = 0; i < specListx.length; i++) {
    if (k.specName === specListx[i].specName) {
      specListx.splice(i, 1)
      this.setState({
        specList: specListx,
      })
return
    } else {
      // console.log('删除失败')
    }
  }
  }
handeOk = () => {
  this.setState({
    loading: true,
  })
const payload = Object.assign({
  categoryNo: this.state.colorArray.categoryNo,
  companyNo: this.state.colorArray.companyNo,
  autoNo: this.state.colorArray.autoNo,
  specList: this.state.specList,
  delectProductSpec: this.state.delectProductSpec,
  updateProductSpec: this.state.updateProductSpec,
})
// console.log(payload)
updateSaveSpec({
  ...payload,
}).then((json) => {
  if (json) {
    // console.log('保存成功')
    this.setState({
      specList: [],
      loading: false,
    })
    this.props.data.Newindextwo()
  } else {
    // console.log('保存失败')
    this.setState({
      loading: false,
    })
  }
})
}
  add = (e) => {
    if (this.state.specList.length === 0) {
      const specLists = this.state.specList
      specLists.push({
        specName: `${this.props.form.getFieldValue(`names[${e}]`)}`,
        productSpec: '',
        key: e,
        list: e,
        categoryNo: this.state.colorArray.categoryNo,
        companyNo: this.state.colorArray.companyNo,
      })
      this.setState({
        specList: specLists,
      })
    } else {
      for (let i = 0; i < this.state.specList.length; i++) {
        if (this.props.form.getFieldValue(`names[${i}]`) === undefined) {
          return
        } else {
          const specLists = this.state.specList
          for (let j = 0; j < specLists.length; j++) {
            if (this.props.form.getFieldValue(`names[${e}]`) === specLists[j].specName) {
              return
            } else {
              const lists = this.state.specList.length
              specLists.push({
                specName: `${this.props.form.getFieldValue(`names[${e}]`)}`,
                productSpec: '',
                key: lists,
                list: lists,
                categoryNo: this.state.colorArray.categoryNo,
                companyNo: this.state.colorArray.companyNo,
              })
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
        // console.log('Received values of form: ', values)
      }
    })
  }
  delect = (index, j) => {
    const updateProductSpecs = this.state.updateProductSpec
    const arr = this.state.specList
    const delectspecName = arr[index].specName
    const arrindex = arr[index]
    const autoNos = arr[index].autoNo
    const productSpec = arrindex.productSpec.split(',')
    const productSpecname = productSpec[j]
    productSpec.splice(j, 1)
    // console.log(arr, productSpec)
    // 类目编号，属性值，属性名称
    const payload = Object.assign({
      autoNo: autoNos,
      categoryNo: this.state.colorArray.categoryNo,
      specName: delectspecName,
      productSpec: productSpecname,
    })
    // console.log(payload)
    checkUpdateSpec({
      ...payload,
    }).then((json) => {
      if (json) {
        // updateProductSpec
        updateProductSpecs.push(payload)
        arr[index].productSpec = productSpec.toString()
        // console.log('arr===', updateProductSpecs, this.state.specList)
        this.setState({
          updateProductSpec: updateProductSpecs,
        })
      } else {
        return true
      }
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
buttonspect = (value, index, list) => {
  if (String(document.getElementById(list).value.trim()).length > 50) {
    message.warning('属性值长度不能大于50')
    document.getElementById(list).value = ''
    return
  }
  if (document.getElementById(list).value.trim() === '') {
    message.warning('不能输入空值')
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
EditableCellone = (v, index) => {
  if (v.specName === '颜色') {
    message.error('颜色不允许修改')
  } else if (v.specName === '尺码') {
    message.error('尺码不允许修改')
  } else {
    this.setState({
      EditableCellvis: true,
      EditableCellv: v,
      EditableCellindex: index,
    })
  }
}
EditableCelltwo = () => {
  this.setState({
    EditableCellvis: false,
    EditableCellv: {},
    EditableCellindex: null,
  })
}
EditableCelltroo = (v, index) => {
  const speclistw = this.state.specList
  speclistw[index].specName = v
  this.setState({
    EditableCellvis: false,
    EditableCellv: {},
    EditableCellindex: null,
    specList: speclistw,
  })
}
EditableCelldelect = (index) => {
  const payload = Object.assign({
    categoryNo: this.state.colorArray.categoryNo,
    specName: this.state.specList[index].specName,
    productSpec: this.state.specList[index].productSpec,
  })
  checkUpdateSpec({
    ...payload,
  }).then((json) => {
    if (json) {
      const delectProductSpes = this.state.delectProductSpec
      delectProductSpes.push(this.state.specList[index])
      const specliste = this.state.specList
      specliste.splice(index, 1)
      this.setState({
        specList: specliste,
        EditableCellvis: false,
        EditableCellv: {},
        EditableCellindex: null,
        delectProductSpec: delectProductSpes,
      })
    } else {
      return false
    }
  })
}
    render() {
      const childre = this.state.specList.map((v, index) => {
        const productSpec = v.productSpec.split(',')
        const In = [
          <Col spen={20} offset={4} key={`a-${index}`} >
            <Input
              size="small"
              id={`${v.list}`}
              placeholder={`请输入${v.specName}`}
              style={{ width: '200px' }}
            />
          </Col>]
        const sh = [
          <Col spen={16} offset={4} key={`c-${index}`}>
            <Button
              size="small"
              type="primary"
              style={{ width: '200px' }}
              onClick={this.buttonspect.bind(this, v.specName, index, v.list)}
            >
              {`新增${v.specName}`}
            </Button>
          </Col>]
        return (
          <div>
            <Row gutter={10}>
              <Col
                className={styles.gutterrow}
                span={4}
                style={{ backgropundColor: 'red' }}
                onClick={this.EditableCellone.bind(this, v, index)}
              >
                <div
                  className={styles.gutterbox}
                  style={{ textAlign: 'rigth' }}
                  title={`点击可修改${v.specName}的值`}
                >
                  {`${v.specName}:`}
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
      const EditableCelldata = {
        EditableCellvis: this.state.EditableCellvis,
        EditableCelltwo: this.EditableCelltwo,
        EditableCelldelect: this.EditableCelldelect,
        EditableCellv: this.state.EditableCellv,
        EditableCellindex: this.state.EditableCellindex,
        EditableCelltroo: this.EditableCelltroo,
      }
        return (
          <Modal
            title="编辑类目规格"
            visible={this.props.data.Newindexvis}
            width={1000}
            // onOk={this.handeOk}
            bodyStyle={{ height: 500, overflowX: 'hidden' }}
            onCancel={this.props.data.Newindextwo}
            maskClosable={false}
            footer={[
              <Button onClick={this.props.data.Newindextwo}>取消</Button>,
              <Button type="primary" loading={this.state.loading} onClick={this.handeOk}>保存</Button>,
            ]}
          >
            <Row span={24}>
              <Col span={4} style={{ textAlign: 'right', paddingRight: '10px' }}>
            属性值:
              </Col>
              <Col span={20} offset={0.1}>
                <div style={[{ width: 800 }, styles.contentBoard]} >
                  <div className={styles.gutterexample}>
                    {childre}
                  </div>
                </div>
              </Col>
            </Row>
            {this.state.EditableCellvis ? <EditableCell {...EditableCelldata} /> : null}
          </Modal>
        )
    }
}
export default Newindex
