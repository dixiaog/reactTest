/*
 * @Author: chenjie
 * @Date: 2017-12-08 18:04:11
 * @Last Modified by: chenjie
 * 新增（编辑）商品资料
 * @Last Modified time: 2018-05-10 14:10:29
 */
import React, { Component } from 'react'
import update from 'immutability-helper'
import numeral from 'numeral'
import { Modal, Form, Input, Select, Button, notification, message, Cascader, Radio, Card, Divider, Table, Spin } from 'antd'
import ItemSpec from '../../components/Item/ItemSpec'
import { getCategoryAttributeByNo, getCategorySpecByNo } from '../../services/api'
import { save, getAllSupplier } from '../../services/item/items'
import config from '../../utils/config'
import { moneyCheck, cnamesReview, getAllAttribute, checkEmpty } from '../../utils/utils'
import { getItemClass } from '../../services/capacity'

const FormItem = Form.Item
const { Option } = Select
const RadioGroup = Radio.Group
@Form.create()
export default class ItemModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cnames: [],
      specs: [],
      choosedSpecs: [],
      colData: [],
      custormCol: [],
      attributeName: [],
      getName: [],
      lastCn: '',
      oldProductNo: '',
      oldCategoryNo: '',
      getCategoryNo: [],
      bdSkuDtoNO: '',
      bdSkuDto: {},
      supplierList: [],
      loading: false,
      // skulist: [],
    }
  }
  componentDidMount() {
    Math.random()
    getItemClass().then((json) => {
      if (json.length) {
        const data = cnamesReview(json)
        const data1 = json
        data.forEach((ele) => {
          Object.assign(ele, { value: ele.categoryNo })
          Object.assign(ele, { label: ele.categoryName })
          Object.assign(ele, { children: ele.children })
        })
        data1.forEach((ele) => {
          Object.assign(ele, { categoryNo: ele.categoryNo })
          Object.assign(ele, { categoryName: ele.categoryName })
        })
        this.setState({
          cnames: data,
          getName: data1,
        })
      }
    })
    getAllSupplier().then(json => this.setState({ supplierList: json }))
  }
  componentWillReceiveProps(nextProps) {
    const oldAutoNo = []
    const maplist = []
    if (nextProps.lists.length !== 0 && nextProps.lists.length !== this.props.lists.length) {
      if (nextProps.lists.bdSkuDTO.colorSizeList[0]) {
        nextProps.lists.bdSkuDTO.colorSizeList[0].productSpec.split(',').forEach(() => {
          maplist.push([])
        })
      }
      this.setState({
        bdSkuDtoNO: nextProps.lists.bdSkuDTO.autoNo,
        oldProductNo: nextProps.lists.bdSkuDTO.productNo, // 原有productNo存入state
        oldCategoryNo: nextProps.lists.bdSkuDTO.categoryNo, // 传入的类目
        colData: nextProps.lists.bdSkuDTO.colorSizeList,
        bdSkuDto: nextProps.lists.bdSkuDTO,
        loading: true,
      }, () => {
        if (this.state.oldCategoryNo) {
          getItemClass().then((cnameOrigin) => {
            const aa = getAllAttribute(cnameOrigin, this.state.oldCategoryNo)
            getCategoryAttributeByNo({ categoryNo: aa[aa.length - 1] }).then((json1) => {
              // this.setState({
              //   colData: json,
              // })
              const attributeName = []
              json1.forEach((ele) => {
                if (ele.optionalValue) {
                  const result = ele.optionalValue.split(',')
                  attributeName.push({ attributeName: ele.attributeName, attributeNo: ele.attributeNo, optionalValue: result, inputFlag: ele.inputFlag })
                }
              })
              this.setState({
                attributeName, // 商品属性
                getCategoryNo: aa,
                loading: false,
                lastCn: aa[aa.length - 1],
              })
            })
            getCategorySpecByNo({ categoryNo: aa[aa.length - 1] }).then((json1) => {
              nextProps.lists.bdSkuDTO.colorSizeList.forEach((ele) => {
                oldAutoNo.push(ele.autoNo)
                const productSpecs = ele.productSpec.split(',')
                // const specMappings = ele.specMapping.split(':')
        
                productSpecs.forEach((s, i) => {
                  if (maplist[i].indexOf(s) === -1) {
                    maplist[i].push(s)
                  }
                })
              })
              // let spec = []
              const handleData = []
              const choosedSpecs = []
              json1.forEach((ele, i) => {
                const result1 = ele.productSpec.split(',')
                const val = []
                const map = maplist[i]
                result1.forEach((ele1) => {
                  const mapIndex =map && map.length ? map.findIndex(m => m === ele1) : -1
                  if (mapIndex > -1) {
                    val.push({ type: 0, name: ele1, wEnable: false, checked: true })
                    map.splice(mapIndex, 1)
                  } else {
                    val.push({ type: 0, name: ele1, wEnable: false, checked: false })
                  }
                })
                map && map.length && map.forEach(m => val.push({ type: 1, name: m, wEnable: false, checked: true }))
                handleData.push({ specName: ele.specName, specVal: val })
                choosedSpecs.push([...val.filter(e => e.checked)])
              })
              this.setState({
                specs: handleData,
                choosedSpecs,
                loading: false,
              }, () => {
                const { custormCol, colData } = this.tableRender(choosedSpecs)
                this.setState(update(this.state, {
                  custormCol: { $set: custormCol },
                  colData: { $set: colData },
                }))
              })
            })
          })
        }
      })
    }
  }
  // nextProps.lists.bdSkuDTO.
  handleOk = () => {
    this.handleSubmit()
  }
  handleCancel = () => {
    this.props.form.resetFields()
    this.props.itemModalHidden()
  }
  handleSubmit = () => {
    if (this.state.colData.length === 0) {
      notification.error({
        message: '提交失败',
        description: '商品编码Sku不能为空',
      })
      return false
    } else {
      let flag = false
      this.state.colData.forEach((e) => {
        if (checkEmpty(e.skuNo)) {
          flag = true
        }
      })
      if (flag) {
        notification.error({
          message: '提交失败',
          description: '列表中存在空的sku',
        })
        return false
      }
    }

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { bdSkuDto, bdSkuDtoNO, oldProductNo, supplierList, colData } = this.state
        colData.length && colData.forEach((v) => {
          Object.assign(v, {
            retailPrice: v.retailPrice.toString().replace(/,/g,''),
            costPrice: v.costPrice.toString().replace(/,/g,''),
          })
        })
        if (values.brandNo) {
          const bname = this.props.brands.filter(ele => ele.brandNo === values.brandNo)
          Object.assign(values, { colorSizeList: colData, brandName: bname[0].brandName })
        } else {
          Object.assign(values, { colorSizeList: colData })
        }
        let yes = true
        if (values.supplierName) {
          if (supplierList.filter(e => e.supplierName === values.supplierName).length) {
            Object.assign(values, { supplierNo: supplierList.filter(e => e.supplierName === values.supplierName)[0].supplierNo })
          } else {
            message.error('供应商不存在，请重新选择')
            const {setFieldsValue } = this.props.form
            setFieldsValue({ supplierName: '' })
            yes = false
          }
        }
        const lastv = {}
        lastv.categoryNo = this.state.getName.filter(row => row.categoryNo * 1 === this.state.lastCn * 1)[0].categoryNo
        lastv.categoryName = this.state.getName.filter(row => row.categoryNo * 1 === this.state.lastCn * 1)[0].categoryName
        const attrName = []
        this.state.attributeName.forEach((ele, i) => {
          attrName.push({
            attributeName: ele.attributeName,
            attributeNo: ele.attributeNo,
            optionalValue: ele.optionalValue.filter(row => row === values.attributeNo[i])[0] ? ele.optionalValue.filter(row => row === values.attributeNo[i])[0] : values.attributeNo[i],
            productNo: values.productNo,
          })
        })
        Object.assign(values, {
          productType: bdSkuDto.productType,
          categoryNo: lastv.categoryNo,
          categoryName: lastv.categoryName,
          autoNo: bdSkuDtoNO === '' ? null : bdSkuDtoNO,
          oldProductNo: oldProductNo === '' ? null : oldProductNo,
        })
        const bdSkuAndAttributeDTO = []
        Object.assign(bdSkuAndAttributeDTO, { bdSkuDTO: values, skuAttributeList: attrName })
        if (yes) {
          save(bdSkuAndAttributeDTO).then((json) => {
            if (json) {
              this.handleCancel()
              this.props.dispatch({ type: 'items/search' })
              this.props.dispatch({ type: 'commonItem/search' })
              notification.success({
                message: '操作成功',
              })
            }
          })
        }
      }
    })
  }
  handleCnameChange = (v) => {
    this.setState({
      lastCn: v[v.length - 1],
      loading: true,
    })
    if(v && v.length) {
      getCategorySpecByNo({ categoryNo: v[v.length - 1] }).then((json) => {
        let spec = []
        const handleData = []
        const choosedSpecs = json && json.length && json.map((ele, i) => {
          if (ele.productSpec) {
            const result1 = ele.productSpec.split(',')
            const val = []
            result1.forEach((ele1) => {
              // result1.type =
              val.push({ type: ele.specType, name: ele1, wEnable: false, checked: false })
            })
            spec = { productSpec: result1, specClassification: ele.specClassification, specType: ele.specType, specName: ele.specName }
            handleData.push({ specName: ele.specName, specVal: val })
          } else {
            handleData.push({ specName: ele.specName, specVal: [] })
          }
          return { specName: ele.specName, specVal: [] }
        })
        this.setState({
          spec, // 商品规格
          specs: handleData,
          choosedSpecs,
          loading: false,
        }, () => {
        })
      })
      getCategoryAttributeByNo({ categoryNo: v[v.length - 1] }).then((json) => {
        const attributeName = []
        json && json.length && json.forEach((ele) => {
          const result = ele.optionalValue.split(',')
          attributeName.push({ attributeName: ele.attributeName, attributeNo: ele.attributeNo, optionalValue: result, inputFlag: ele.inputFlag })
        })
        this.setState({
          colData: [],
          choosedSpecs: [],
          attributeName, // 商品属性
          loading: false,
        }, () => {
        })
      })
    } else {
      this.setState({
        colData: [],
        choosedSpecs: [],
        attributeName: [], // 商品属性
        loading: false,
        spec: [], // 商品规格
        specs: [],
      })
    }
  }
  handleSpecChange = (spec, i) => {
    const { choosedSpecs } = this.state
    const specV = []
    spec.specVal.forEach((ele) => { if (ele.checked) specV.push(ele) })
    choosedSpecs[i] = specV
    const { custormCol, colData } = this.tableRender(choosedSpecs)
    this.setState({
      colData: [],
    }, () => {
      this.setState(update(this.state, {
        specs: { $splice: [[i, 1], [i, 0, spec]] },
        choosedSpecs: { $set: choosedSpecs },
        custormCol: { $set: custormCol },
        colData: { $set: colData },
      }))
    })
  }
  specsCountChange = (spec, i) => {
    this.setState(update(this.state, {
      specs: { $splice: [[i, 1], [i, 0, spec]] },
    }))
  }
  checkSpecKinds = (specs) => {
    let flag = specs.length > 0
    specs.forEach((spec) => {
      if (spec.length === 0) {
        flag = false
      }
    })
    return flag
  }
  descartes = (args) => {
    let rs = []
    // A. 校验并转换为JS数组
    for (let i = 0; i < args.length; i++) {
      if (!(args[i] instanceof Array)) {
        return false // 参数必须为数组
      }
    }
    // 两个笛卡尔积换算
    const bothDescartes = (m, n) => {
      const r = []
      for (let i = 0; i < m.length; i++) {
        for (let ii = 0; ii < n.length; ii++) {
          let t = []
          if (m[i] instanceof Array) {
            t = m[i].slice(0) // 此处使用slice目的为了防止t变化，导致m也跟着变化
          } else {
            t.push(m[i].name) // 存储规格字段name
          }
          t.push(n[ii].name)
          r.push(t)
        }
      }
      return r
    }
    // 多个笛卡尔基数换算
    for (let i = 0; i < args.length; i++) {
      if (i === 0) {
        rs = args[i]
      } else {
        rs = bothDescartes(rs, args[i])
      }
    }
    return rs
  }
  tablePriceInputBlur = (e) => {
    const { colData } = this.state
    if (!moneyCheck(e.target.value.replace(/,/g,''))) {
      colData[e.target.getAttribute('i')][`${e.target.getAttribute('colname')}`] = ''
      if (e.target.getAttribute('colname') === 'referWeight') {
        message.error('请正确填写重量格式')
      } else {
        message.error('请正确填写金额格式')
      }
    } else {
      colData[e.target.getAttribute('i')][`${e.target.getAttribute('colname')}`] = numeral(e.target.value.replace(/,/g,'')).format('0,00.00')
    }
    this.setState({ colData: [] }, () => { this.setState({ colData }) })
  }
  tableInputBlur = (e) => {
    const { colData } = this.state
    colData[e.target.getAttribute('i')][`${e.target.getAttribute('colname')}`] = e.target.value
    this.setState({ colData })
  }
  tableRender = (choosedSpecs) => {
    const { getFieldValue } = this.props.form
    const { specs } = this.state
    const columns = [{
      title: '基本售价	',
      dataIndex: 'retailPrice',
      width: 100,
      render: (text, record, index) => {
        return (<Input i={index} colname="retailPrice" defaultValue={text} onBlur={this.tablePriceInputBlur.bind(this)} size={config.InputSize} />)
      },
    }, {
      title: '成本价',
      dataIndex: 'costPrice',
      width: 80,
      render: (text, record, index) => {
        return (<Input i={index} colname="costPrice" defaultValue={text} onBlur={this.tablePriceInputBlur.bind(this)} size={config.InputSize} />)
      },
    }, {
      title: '重量(KG)',
      dataIndex: 'referWeight',
      width: 80,
      render: (text, record, index) => {
        return (<Input i={index} colname="referWeight" defaultValue={text} onBlur={this.tablePriceInputBlur.bind(this)} size={config.InputSize} />)
      },
    }, {
      title: '商品编码',
      dataIndex: 'skuNo',
      render: (text, record, index) => {
        return (<Input i={index} colname="skuNo" defaultValue={text} onBlur={this.tableInputBlur.bind(this)} size={config.InputSize} />)
      },
    }, {
      title: '商品条形码',
      dataIndex: 'barcode',
      render: (text, record, index) => {
        return (<Input i={index} colname="barcode" defaultValue={text} onBlur={this.tableInputBlur.bind(this)} size={config.InputSize} />)
      },
    }]
    if (this.checkSpecKinds(choosedSpecs)) {
      const specCol = []
      specs.forEach((spec, i) => {
        specCol.push({
          title: spec.specName,
          dataIndex: `col${i}`,
        })
      })
      const custormCol = specCol.concat(columns)
      const colData = []
      const descartesList = this.descartes(choosedSpecs)
      if (descartesList) {
        descartesList.forEach((dec, k) => {
          const dateM = {}
          const datac = []
          if (dec.length === undefined) {
            dateM.col0 = dec.name
            datac.push(dec.type)
          } else {
            dec.forEach((e, i) => {
              dateM[`col${i}`] = dec[i]
            })
            const color1 = choosedSpecs[0].filter(ele => ele.name === dec[0])[0]
            const size1 = choosedSpecs[1].filter(ele => ele.name === dec[1])[0]
            const typec = color1.type
            const types = size1.type
            datac.push(typec, types)
          }
          if (this.state.colData.length) {
            let oldData
            if (this.state.colData[0].col0) {
              this.state.colData.forEach((e) => {
                let have = true
                Object.keys(dateM).forEach((m) => {
                  if (dateM[m] !== e[m]) {
                    have = false
                  }
                })
                if (have) {
                  oldData = e
                  return false
                }
              })
            } else {
              if (dec instanceof Array) {
                if (dec && dec.length) {
                  oldData = this.state.colData.filter(row => row.productSpec === dec.join(','))[0]
                }
              } else {
                oldData = this.state.colData.filter(row => row.productSpec === dec.name)[0]
              }
            }
            Object.assign(dateM, {
              ii: k,
              specMapping: datac.join(':'),
              productSpec: dec.length === undefined ? dec.name : dec.join(','),
              retailPrice: oldData ? oldData.retailPrice : getFieldValue('tagPrice'),
              costPrice: oldData ? oldData.costPrice : '',
              referWeight: oldData ? oldData.referWeight : '',
              skuNo: oldData ? oldData.skuNo : '',
              barcode: oldData ? oldData.barcode : '',
              autoNo: oldData ? oldData.autoNo : '',
            })
          } else {
            Object.assign(dateM, {
              ii: k,
              specMapping: datac.join(':'),
              productSpec: dec.length === undefined ? dec.name : dec.join(','),
              retailPrice: getFieldValue('tagPrice'),
              costPrice: '',
              referWeight: '',
              skuNo: '',
              barcode: '',
              autoNo: null,
            })
          }
          colData.push(dateM)
        })
        // 规格合并行，暂时只支持首行合并，多规格模式下还未遇到，顾暂为考虑（优化性能时建议取消，鸡肋）
        Object.assign(specCol[0], {
          render: (value, row, index) => {
            const obj = {
              children: value,
              props: {},
            }
            const rowSpan = descartesList.length / choosedSpecs[0].length
            if (index % rowSpan === 0) {
              obj.props.rowSpan = rowSpan
            } else {
              obj.props.rowSpan = 0
            }
            return obj
          },
        })
      }
      return {
        custormCol,
        colData,
      }
      // return (
      //   <Card hoverable style={{ marginTop: 10 }}>
      //     <Table columns={custormCol} dataSource={colData} rowKey={record => record.ii} pagination={false} />
      //   </Card>)
    } else {
      return {
        custormCol: [],
        colData: [],
      }
    }
  }
  createSkuByNum = () => {
    const { colData } = this.state
    const iId = this.props.form.getFieldValue('productNo')
    if (iId) {
      if (colData.length) {
        const skuNos = colData.map(e => e.skuNo)
        colData.forEach((ele, i) => {
          if (checkEmpty(ele.skuNo)) {
            if (skuNos.indexOf(`${iId}-${i}`) === -1) {
              Object.assign(ele, { skuNo: `${iId}-${i}` })
            } else {
              Object.assign(ele, { skuNo: `${iId}-${i}-${i}` })
            }
          }
        })
        this.setState({ colData: [] }, () => { this.setState({ colData }) })
      } else {
        message.error('请先生成商品列表')
      }
    } else {
      message.error('请先输入款式编码')
    }
  }
  createSkuBySpec = () => {
    const { colData } = this.state
    const cols = Object.keys(colData[0]).length - 9
    const iId = this.props.form.getFieldValue('productNo')
    if (iId) {
      if (colData.length) {
        colData.forEach((ele, i) => {
          let colConnect = ''
          const skuNos = colData.map(e => e.skuNo)
          for (let j = 0; j < cols; j++) {
            colConnect = `${colConnect}-${ele[`col${j}`]}`
          }
          if (checkEmpty(ele.skuNo)) {
            if (skuNos.indexOf(`${iId}${colConnect}`) === -1) {
              Object.assign(ele, { skuNo: `${iId}${colConnect}` })
            } else {
              Object.assign(ele, { skuNo: `${iId}${colConnect}-${i}` })
            }
          }
          // Object.assign(ele, { skuNo: `${iId}${colConnect}` })
        })
        this.setState({ colData: [] }, () => { this.setState({ colData }) })
      } else {
        message.error('请先生成商品列表')
      }
    } else {
      message.error('请先输入款式编码')
    }
  }
  cleanSku = () => {
    const { colData } = this.state
    colData.forEach(e => e.skuNo = '')
    this.setState({ colData: [] }, () => { this.setState({ colData }) })
  }
  tagPriceCheck = (rule, value, callback) => {
    if (value !== undefined && !moneyCheck(value.replace(/,/g, ''))) {
      callback('金额格式错误')
    } else {
      callback()
    }
  }
  tagPriceChange = (e) => {
    const { colData } = this.state
    if (moneyCheck(e.target.value.replace(/,/g, ''))){
      const { setFieldsValue } = this.props.form
      setFieldsValue({tagPrice: numeral(e.target.value.replace(/,/g, '')).format('0,00.00')})
      colData.length && colData.forEach((v,i) => {
        Object.assign(v, { retailPrice: `${numeral(e.target.value.replace(/,/g, '')).format('0,00.00')}`})
      })
      this.setState({ colData: [] }, () => { this.setState({ colData }) })
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { bdSkuDTO, skuAttributeList } = this.props.lists
    const { productNo, brandNo, productName, productAttribute, supplierName, supplierProductNo, tagPrice, imageUrl } = bdSkuDTO ? bdSkuDTO : {}
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 8 },
      },
    }
    const formItemLargerLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
        md: { span: 20 },
      },
    }
    return (
      <div>
        <Modal
          maskClosable={false}
          title={bdSkuDTO ? '编辑商品信息' : '创建新的商品信息'}
          visible={this.props.itemModalVisiable}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={1000}
          bodyStyle={{ height: 500, overflowX: 'hidden' }}
        >
          <Form
            onSubmit={this.handleSubmit}
            style={{ marginTop: 8 }}
          >
            <FormItem
              {...formItemLayout}
              label="款式编码(货号)"
            >
              {getFieldDecorator('productNo', {
                initialValue: productNo,
                rules: [{
                  required: true, message: '请输入款式编码(货号)',
                }],
              })(
                <Input size={config.InputSize} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="品牌"
            >
              {getFieldDecorator('brandNo', {
                initialValue: brandNo === 0 ? '' : brandNo,
              })(
                // <Row>
                //   <Col span={12}>
                <Select size={config.InputSize} style={{ marginTop: 4 }}>
                  {this.props.brands.map(brand => <Option key={brand.brandNo} value={brand.brandNo}>{brand.brandName}</Option>)}
                </Select>
                //   </Col>
                // </Row>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="商品名称"
            >
              {getFieldDecorator('productName', {
                initialValue: productName,
                rules: [{
                  required: true, message: '请输入商品名称',
                }],
              })(
                <Input size={config.InputSize} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="商品分类"
            >
              {getFieldDecorator('categoryNo', {
                initialValue: this.state.getCategoryNo,
                rules: [{
                  required: true, message: '请选择商品分类',
                }],
              })(
                <Cascader showSearch size={config.InputSize} style={{ marginTop: 4 }} placeholder="" options={this.state.cnames} onChange={this.handleCnameChange.bind(this)} />
                //   <Input onClick={this.itemKindShow.bind(this)} size={config.InputSize} addonAfter={<Icon type="ellipsis" />} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="商品属性"
            // value={this.state.value1}
            >
              {getFieldDecorator('productAttribute', {
                initialValue: productAttribute ? productAttribute : 0,
              })(
                <RadioGroup>
                  <Radio value={0}>成品</Radio>
                  <Radio value={1}>半成品</Radio>
                  <Radio value={2}>原物料</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="供应商"
            >
              {getFieldDecorator('supplierName', {
                initialValue: supplierName,
                rules: [{
                }],
              })(
                <Select size={config.InputSize}>
                  {this.state.supplierList.map(e => <Option key={e.supplierName}>{e.supplierName}</Option>)}
                  {/* <OptGroup label="Manager">
                    <Option value="jack">Jack</Option>
                    <Option value="lucy">Lucy</Option>
                  </OptGroup>
                  <OptGroup label="Engineer">
                    <Option value="Yiminghe">yiminghe</Option>
                  </OptGroup> */}
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="供应商商品款号"
            >
              {getFieldDecorator('supplierProductNo', {
                initialValue: supplierProductNo,
                rules: [{
                }],
              })(
                <Input size={config.InputSize} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="市场|吊牌价"
            >
              {getFieldDecorator('tagPrice', {
                initialValue: numeral(tagPrice).format('0,00.00'),
                rules: [{
                  validator: this.tagPriceCheck.bind(this),
                }],
              })(
                <Input size={config.InputSize} onBlur={this.tagPriceChange.bind(this)} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="商品属性"
            >
              <Card hoverable >
              {this.state.attributeName && this.state.attributeName.length ?
                this.state.attributeName.length && this.state.attributeName.map((ele, i) => {
                  const skuAttr = skuAttributeList && skuAttributeList.length ? skuAttributeList.filter(e => e.attributeName === ele.attributeName)[0] : null
                  // {this.state.attributeName.length && this.state.attributeName.map((ele, i) => {
                  return (
                    getFieldDecorator(`attributeNo[${i}]`, {
                      initialValue: skuAttr ? skuAttr.optionalValue : undefined,
                      rules: [{
                        required: true, message: '请填写商品属性',
                      }],
                    })(
                      <Select size={config.InputSize} placeholder={ele.attributeName} style={{ marginTop: 4 }} mode={ele.inputFlag === 1 ? 'combobox' : null}>
                        {ele.optionalValue.map((eles) => {
                          return (
                            <Option key={eles} value={eles}>{eles}</Option>
                          )
                        })
                        }
                      </Select>
                    ))
                }
                )
              : null}
              </Card>
            </FormItem>
            <Spin spinning={this.state.loading} delay={500} >
              <FormItem
                {...formItemLargerLayout}
                label="商品规格"
              >
                {this.state.specs.length ?
                  (
                    <div>
                      <Card hoverable >
                        {this.state.specs.map((ele, i) => {
                          return (
                            <ItemSpec key={`productSpec${i}`} i={i} spec={ele} specsCountChange={this.specsCountChange} handleSpecChange={this.handleSpecChange} />
                          )
                        }
                        )}
                      </Card>
                      {this.state.colData.length ? (
                        <Card hoverable style={{ marginTop: 10 }}>
                          <Table columns={this.state.custormCol} dataSource={this.state.colData} rowKey={record => record.productSpec} pagination={false} />
                        </Card>) : null}
                    </div>)
                  : null}
              </FormItem>
            </Spin>
            <FormItem
              {...formItemLayout}
              label="商品图片"
            >
              {getFieldDecorator('imageUrl', {
                initialValue: imageUrl,
                rules: [{
                }],
              })(
                <Input size={config.InputSize} placeholder="商品主图路径" />
              )}
            </FormItem>
            <Divider />
            <Button size={config.InputSize} style={{ marginRight: 10 }} onClick={this.createSkuByNum.bind(this)}>生成商品编码(流水号)</Button>
            <Button size={config.InputSize} style={{ marginRight: 10 }} onClick={this.createSkuBySpec.bind(this)}>生成商品编码(规格)</Button>
            <Button size={config.InputSize} icon="delete" onClick={this.cleanSku.bind(this)}>清空商品编码</Button>
          </Form>
        </Modal>
      </div>
    )
  }
}
