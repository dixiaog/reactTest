/*
 * @Author: chenjie 
 * @Date: 2018-01-19 09:25:52 
 * 打印编辑预览模块
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import update from 'immutability-helper'
import { DropTarget } from 'react-dnd'
import { Row, Col, Input, InputNumber, Icon, Select, Modal, message, Form, Button } from 'antd'
import $ from 'jquery'
import shouldPureComponentUpdate from './shouldPureComponentUpdate'
import Editor from './EditPane'
import { setLocalStorageItem, getUrlParam } from '../../utils/utils'
import { printEditSave } from '../../services/api'
import ItemTypes from './ItemTypes'
import DraggableBox from './DraggableBox'
import snapToGrid from './snapToGrid'
import TableGrid from './TableGird'
import styles from './Print.less'
import DomTable from './DomTable'
import config from '../../utils/config'


// const InputGroup = Input.Group
const confirm = Modal.confirm
const Option = Select.Option
const FormItem = Form.Item
const custBoxs = [
  { field: 'LineBlock', border: { borderStyle: 'solid' }, name: '矩形实线框', type: 1, width: 100, height: 36, act: 0 },
  { field: 'DotteLineBlock', border: { borderStyle: 'dashed' }, name: '矩形虚线框', type: 1, width: 100, height: 36, act: 0 },
  { field: 'VLine', border: { borderLeftStyle: 'solid' }, name: '实竖线', type: 1, width: 10, height: 100, act: 0 },
  { field: 'DotteVLine', border: { borderLeftStyle: 'dashed' }, name: '虚竖线', type: 1, width: 10, height: 100, act: 0 },
  { field: 'HLine', border: { borderTopStyle: 'solid' }, name: '实横线', type: 1, width: 100, height: 10, act: 0 },
  { field: 'DotteHLine', border: { borderTopStyle: 'dashed' }, name: '虚横线', type: 1, width: 100, height: 10, act: 0 },
]
const wp = Strato.WebPrinter.getInstance()
let wpInt
const boxTarget = {
  drop(props, monitor, component) {
    const delta = monitor.getDifferenceFromInitialOffset()
    const item = monitor.getItem()

    let left = Math.round(item.left + delta.x)
    let top = Math.round(item.top + delta.y)
    if (props.snapToGrid) {
      [left, top] = snapToGrid(left, top)
    }
    component.moveBox(item.id, left, top)
  },
}

@Form.create()
@DropTarget(ItemTypes.BOX, boxTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))
export default class Container extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    // snapToGrid: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      boxes: {},
      activeBox: {},  // 被选中元素
      activeKey: -1,  // 被选中元素ID
      tables: {},
      tableStyle: {},
      orientation: 'PORTRAIT',
      presetFields: [],
      machines: [],
      papers: ['A4', '自定义'],
      machine: '',
      paper: 'A4',
      pageW: 210,
      pageH: 297,
      pageTop: 0,
      pageLeft: 0,
    }
  }

  componentWillMount() {
    this.setState({
      boxes: this.props.boxes,
      tables: this.props.tables,
      tableStyle: this.props.tableStyle,
    })
  }
  componentDidMount() {
    wpInt = setInterval(this.wpInfoInit, 5000)
  }

  componentWillReceiveProps(nextProps) {
    const {machine, paper, pageW, pageH, pageTop, pageLeft } = nextProps.printConfig ? nextProps.printConfig : {}
    if (!Object.is(this.props.printConfig, nextProps.printConfig)) {
      this.setState({
        boxes: nextProps.boxes,
        tables: nextProps.tables,
        activeBox: this.props.item,
        activeKey: this.props.activeKey,
        tableStyle: nextProps.tableStyle,
        machine:  machine ? machine :'',
        paper: paper ? paper :'A4',
        pageW: pageW ? pageW :210,
        pageH: pageH ? pageH :297,
        pageTop:pageTop ? pageTop : 0,
        pageLeft: pageLeft ? pageLeft :0,
      })
    }
  }
  shouldComponentUpdate = shouldPureComponentUpdate
  settingPageW = (e) => {
    this.setState({
      pageW: e,
    })
  }
  settingPageH = (e) => {
    this.setState({
      pageH: e,
    })
  }
  settingPrintRangeTop = (e) => {
    this.setState({
      pageTop: e,
    })
  }
  settingPrintRangeLeft = (e) => {
    this.setState({
      pageLeft: e,
    })
  }
  selectPrintMachine = (e) => {
    this.setState({
      machine: e,
    })
  }

  selectPrintPaper = (e) => {
    if (e === 'A4') {
      this.setState({
        paper: e,
        pageW: 210,
        pageH: 297,
      })
    } else {
      this.setState({
        paper: e,
        pageW: 100,
        pageH: 100,
      })
    }
  }
  selectPrintDirection = (e) => {
    this.setState({
      orientation: e,
    })
  }
  pageConfigChange = (e) => {
    this.props.pageConfigChange({
      machine: this.state.machine,
      orientation: this.state.orientation,
      paper: this.state.paper,
      pageW: this.state.pageW,
      pageH: this.state.pageH,
      pageTop: this.state.pageTop,
      pageLeft: this.state.pageLeft,
    })
  }
  addTableCols(item) {
    this.props.dispatch({
      type: 'printModifyView/addTableCols',
      payload: {
        col: item,
      },
    })
  }
  // 新增元素
  addBox = (item) => {
    const itemKind = {
      top: 20, left: 20, actived: false, width: 100, height: 30,
    }
    const { boxes } = this.state
    // Object.keys(boxes).forEach((key) => { boxes[key].actived = false })
    let box = {}
    switch (item.type) {
      case 1:// 虚实线
        box = { title: '', type: 1, ...itemKind, cssDefault: { ...item.border, borderWidth: '1px' } }
        break
      case 5:// 内置参数
        box = { title: `{${item.id}}`, value: item.id, type: 5, ...itemKind, cssDefault: {} }
        break
      case 4:// 自定义框
        box = { title: item.title, value: item.title, type: 4, ...itemKind, cssDefault: {} }
        break
      default:
        box = { title: '缺省', ...itemKind, cssDefault: {} }
        break
    }
    this.setState(
      update(this.state, {
        boxes: {
            $merge: { [Object.keys(boxes).length]:  box},
        },
      }),
    )
  }
  addLineBox = (item) => {
    this.addBox(item)
  }
  insertField = (e) => {
    const item = {
      type: 4,
      title: e.target.value,
    }
    this.addBox(item)
  }
  wpInfoInit = () => {
    if (wp.isConnected()) {
        wp.listPrinters((printerNames) => {
          wp.getDefaultPrinter((printerName) => {
            this.setState({
              machines: printerNames,
              machine: printerName,
            })
          })
        }, () => {
          message.error('获取列表失败')
        })
    } else {
           confirm({
            title: '未开启或安装打印客户端',
            content: <div>点击<a href="http://ecom-file.oss-cn-shanghai.aliyuncs.com/oms/webprinter_setup_1.9.exe">下载</a>，获取打印客户端</div>,
            onOk() {
            },
            onCancel() {
            },
          })
    }
    clearInterval(wpInt)
  }
  renderSysLabel = (item, key) => {
    Object.assign(item, { type: 5 })
    return (
      <div key={key} className={styles.boxCss} onClick={this.addLineBox.bind(this, item)}>{item.title} </div>
    )
  }
  renderCustLabel = (item, key) => {
    return (
      <div key={key} className={styles.lineCss} style={{ ...item.border }} onClick={this.addLineBox.bind(this, item)}>{item.name} </div>
    )
  }
  renderTableLabel(item, key) {
    return (
      <div key={key} className={styles.boxCss} onClick={this.addTableCols.bind(this, item)} >{item.title}</div>
    )
  }

  renderPreset(item, key) {
    if (item.type === 3) {
      return (
        <div key={key}>
          <h4 className={styles.set_h4}><Icon type="file-text" />{item.name}</h4>
          <div className={styles.custbox}>
            {item.rows && item.rows.map((row, k) => this.renderTableLabel(row, k))}
          </div>
        </div>
      )
    } else {
      return (
        <div key={key}>
          <h4 className={styles.set_h4}><Icon type="api" />{item.name}</h4>
          <div className={styles.custbox}>
            {item.rows && item.rows.map((row, k) => this.renderSysLabel(row, k))}
          </div>
        </div>
      )
    }
  }
  // shouldComponentUpdate = shouldPureComponentUpdate
  moveBox(id, left, top) {
    const { isPreview } = this.props
    if (!isPreview) {
      if (id === 'table') {
        this.setState({
            tableStyle: { left, top },
          })
      } else {
        this.setState(
          update(this.state, {
            boxes: {
              [id]: {
                $merge: { left, top },
              },
            },
          }),
        )
      }
    }
  }
  // 元素改变长宽
  resizeTrigger = (id, width, height) => {
    this.setState(update(this.state, {
      boxes: {
        [id]: {
          $merge: { width, height },
        },
      },
    }))
  }
  // 元素是否选中
  activeFilter = (id) => {
    const { boxes } = this.state
    Object.keys(boxes).forEach((key) => { boxes[key].actived = false })
    this.setState(update(this.state, {
      boxes: { [id]: { $merge: {
            actived: true,
          }},
        },
      activeBox: { $set: boxes[`${id}`] },
      activeKey: {$set: id},
    }))
  }
  renderBox(item, key, dispatch,printData) {
    if (printData === undefined) {
      return (
        <DraggableBox
          printData={printData ? printData[item.value] : null}
          key={key}
          id={key}
          isPreview={this.props.isPreview}
          item={item}
          {...item}
          activeFilter={this.activeFilter}
          resizeTrigger={this.resizeTrigger}
          dispatch={dispatch}
        />)
    } else if (item.type * 1 === 5) {
      item.value = printData.locationNo
      item.title = printData.locationNo
      return (
        <DraggableBox
          printData={printData ? printData[item.value] : null}
          key={key}
          id={key}
          isPreview={this.props.isPreview}
          item={item}
          {...item}
          activeFilter={this.activeFilter}
          resizeTrigger={this.resizeTrigger}
          dispatch={dispatch}
        />)
    } else {
      item.value = printData.locationNo
      item.title = printData.locationNo
      return <DraggableBox
        key={key}
        id={key}
        isPreview={this.props.isPreview}
        item={item}
        {...item}
        activeFilter={this.activeFilter}
        resizeTrigger={this.resizeTrigger}
        dispatch={dispatch}
      />
    }
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const printData = {
          boxes: this.props.boxes,
          tables: this.props.tables,
          tableStyle: this.props.tableStyle,
        }
        printEditSave({
          printFields: JSON.stringify(printData),
          printConfig: JSON.stringify({
            machine: this.state.machine,
            orientation: this.state.orientation,
            paper: this.state.paper,
            pageW: this.state.pageW,
            pageH: this.state.pageH,
            pageTop: this.state.pageTop,
            pageLeft: this.state.pageLeft,
          }),
          autoNo: getUrlParam('autoNo'),
        }).then((json) => {
          if (json) {
            notification.success({
              message: '保存成功',
            })
          }
        })
        // setLocalStorageItem('printPreview', JSON.stringify(printData))
      }
    })
  }
  handlePreviewPrint = () => {
    setLocalStorageItem('printPreview', JSON.stringify({
      boxes: this.props.boxes,
      tables: this.props.tables,
      tableStyle: this.props.tableStyle,
    }))
    // this.props.dispatch({
    //   type: '',
    // })
    window.open(window.location.href.replace(/printModifyView/, 'printPreview'))
  }
  // 改变元素类型
  changeAct = (id, type) => {
    if (id === 'table') {
      const { tables } = this.state
      const tIndex = tables.findIndex(e => e.actived !== 0)
      this.setState(update(this.state, {
        tables: {
          [tIndex]: {
            $merge: { act: type },
          },
        },
      }))
    } else {
      this.setState(update(this.state, {
        boxes: {
          [id]: {
            $merge: { type },
          },
        },
      }))
    }
  }
  // 编辑元素显示文本
  modifyTitle = (id, title) => {
    this.setState(update(this.state, {
      boxes: {
        [id]: {
          $merge: { title },
        },
      },
    }))
  }
  // 改变元素样式
  changeDomCss = (id, item,field) => {
    if (id === 'table') {
      const { tables } = this.state
      const tIndex = tables.findIndex(e => e.actived !== 0)
      let newItem = {}
      if (item.actived === 1) {
        newItem = update(item, {
          thCss: {
              $merge: { ...field },
          },
        })
      } else {
        newItem = update(item, {
          tdCss: {
              $merge: { ...field },
          },
        })
      }
      this.setState(update(this.state, {
        tables: {
          [tIndex]: {
            $set: newItem,
          },
        },
      }))
    } else {
      this.setState(update(this.state, {
        boxes: {
          [id]: {
            cssDefault: {
              $merge: { ...field },
            },
          },
        },
      }))
    }
  }
  // 删除元素
  removeDom = (activeKey) => {
    if (activeKey === 'table') {
      const { tables } = this.state
      const tIndex = tables.findIndex(e => e.actived !== 0)
      tables.splice(tIndex, 1)
      this.setState(update(this.state, {
        tables: { $splice: [tIndex,1]},
      }))
    } else {
      const { boxes } = this.state
      const newBoxes = {}
      Object.keys(boxes).forEach((key) => {
        if (key !== activeKey) {
          Object.assign(newBoxes, {
            [key]: boxes[key],
          })
        }
      })
      this.setState(update(this.state, {
        boxes: { $set: newBoxes},
      }))
    }
  }
  // 表格删除元素
  removeColumn = (splice) => {
    this.setState(update(this.state,{
      tables: { $splice: splice },
    }))
  }
  renderMutil = (d,i) => {
    const { dispatch, isPreview } = this.props
    const { boxes, tables, tableStyle, pageW, pageH } = this.state
    return <div key={i} ref="container" className={styles.Container} style={{ width: `${pageW}mm`, height: `${pageH}mm`, marginTop: `10mm`, float: 'left' }}>
      {Object.keys(boxes).map(key => this.renderBox(boxes[key], key, dispatch,d))}
      <DomTable
        printData={d}
        isPreview={isPreview}
        tables={tables}
        tableStyle={tableStyle}
        dispatch={this.props.dispatch}
        removeColumn={this.removeColumn.bind(this)}
      />
    </div>
  }
  handlePrint = () => {
    const { pageW, pageH, machine } = this.state
    if (machine === '') {
      Modal.error({
        title: '提示',
        content: '请先选择打印机',
      })
      return false
    }
    // Print__Container___2AK8b
    // $(`.${this.refs.container.className}`).each((e, _this) => {
    $('.Print__Container___2AK8b').each((e, _this) => {
      console.log(_this)
      const bdprint = _this.innerHTML
      wp.newTask({
      name:"任务",
      printer: machine,
      content: bdprint,
      interactive:false,   //交互打印
      config:{
          width:pageW,
          height:pageH,
          marginLeft:0.1,
          marginRight:0.1,
          marginTop:0,
          marginBottom:0
      }
    }, (id,status) =>{
          if(e === 0 && status===200){
            Modal.success({
              title: '提示',
              content: '打印成功',
            })
          }else if(e === 0 && status===404){
            Modal.error({
              title: '提示',
              content: '服务未启动',
            })
          }else{
              //alert("提交失败");
          }
      })
    })
  }

  render() {
    const { connectDropTarget, dispatch, printData, isPreview, printConfig, presetFields } = this.props
    const { boxes, activeBox, activeKey, tables, tableStyle, orientation, machines, pageW, pageH } = this.state
    const { getFieldDecorator, getFieldError, isFieldTouched } = this.props.form
    const modelNameError = isFieldTouched('modelName') && getFieldError('modelName')
    return connectDropTarget(
      <div>
        {/*头部操作栏*/}
         <div className={isPreview ? styles.headPreview : styles.head}>
          <Row className={styles.headRow}>
            <Col span={14} style={{ textAlign: 'right', float: 'right' }}>
              <Form layout="inline" onSubmit={this.handleSubmit}>
                { isPreview ? <Button
                  type="primary"
                  style={{ marginRight: 10, marginTop: 8 }}
                  size="small"
                  icon="printer"
                  onClick={this.handlePrint.bind(this)}
                >
                    打印
                </Button> :
                <div>
                {/* <Button
                  type="primary"
                  style={{ marginRight: 10, marginTop: 8 }}
                  size="small"
                  icon="eye-o"
                  onClick={this.handlePreviewPrint.bind(this)}
                >
                    预览
                </Button> */}
                <FormItem
                  validateStatus={modelNameError ? 'error' : ''}
                  help={modelNameError || ''}
                >
                  {getFieldDecorator('modelName', {
                        initialValue: String(this.props.tempName),
                        rules: [{ required: true, message: '模版名称不能为空' }],
                    })(
                      <Input size="small" prefix={<Icon type="file" style={{ fontSize: 13 }} />} placeholder="模版名称" />
                    )}
                </FormItem>
                <FormItem>
                  <Button
                    type="primary"
                    size="small"
                    icon="save"
                    onClick={this.handleSubmit.bind(this)}
                    // disabled={hasErrors(getFieldsError())}
                  >
                    保存
                  </Button>
                  {/* <Button
                    style={{ marginLeft: 10 }}
                    icon="file-add"
                    size="small"
                    // disabled={hasErrors(getFieldsError())}
                  >
                    另存为
                  </Button> */}
                </FormItem>
                </div>
                }
              </Form>
            </Col>
          </Row>
          {/*元素编辑栏*/}
          {this.props.isPreview ? null :
          <div className={styles.editRow}>
            <Editor 
              dispatch={this.props.dispatch}
              item={activeBox}
              activeKey={activeKey}
              changeAct={this.changeAct.bind(this)}
              modifyTitle={this.modifyTitle.bind(this)}
              changeDomCss={this.changeDomCss.bind(this)}
              removeDom={this.removeDom.bind(this)}
            />
          </div>
          }
        </div>
        {/*渲染显示框*/}
        <div style={{ width: `${pageW}mm` }}>
          {isPreview && printData && printData.length > 0 ? printData.map((d, i) => this.renderMutil(d,i)) : 
          <div className={styles.Container} style={{ width: `${pageW}mm`, height: `${pageH}mm` }}>
            {Object.keys(boxes).map(key => this.renderBox(boxes[key], key, dispatch,printData))}
            <DomTable
              printData={printData}
              isPreview={isPreview}
              tables={tables}
              tableStyle={tableStyle}
              dispatch={this.props.dispatch}
              removeColumn={this.removeColumn.bind(this)}
            />
            {isPreview ? null : <TableGrid />}
          </div>}
        </div>
        {/* <div className={styles.Container} style={{ width: `${pageW}mm`, height: `${pageH}mm` }}>
          {Object.keys(boxes).map(key => this.renderBox(boxes[key], key, dispatch,printData))}
          <DomTable
            printData={printData}
            isPreview={isPreview}
            tables={tables}
            tableStyle={tableStyle}
            dispatch={this.props.dispatch}
            removeColumn={this.removeColumn.bind(this)}
          />
          <TableGrid />
        </div> */}
        {/*右侧参数栏*/}
        <div className={styles.side}>
          <h3 className={styles.set_h3}>打印参数设置</h3>
          <div className={styles.setting}>
            <Row>
              <Col span="6" className={styles.tr}>
                <span>打印机:</span>
              </Col>
              <Col span="17" offset="1">
                <Select
                  size={config.InputSize}
                  defaultValue={printConfig && printConfig.machine ? printConfig.machine : this.state.machine}
                  value={this.state.machine}
                  onChange={this.selectPrintMachine}
                  style={{ display: 'block' }}>
                  {machines.map((item, key) => {
                    return (
                      <Option key={key} value={item}>{item}</Option>
                    )
                  })}
                </Select>
              </Col>
            </Row>
            <Row className={styles.mt8}>
              <Col span="6">
                &nbsp;
              </Col>
              <Col span="17" offset="1">
                <Select
                  size={config.InputSize}
                  defaultValue={printConfig && printConfig.paper ? printConfig.paper : this.state.paper}
                  value={this.state.paper}
                  className={styles.mr8}
                  onChange={this.selectPrintPaper} style={{ display: 'block' }}>
                  {this.state.papers.map((item, key) => {
                    return (
                      <Option key={key} value={item}>- {item}</Option>
                    )
                  })}
                </Select>
              </Col>
            </Row>
            <Row className={styles.mt8}>
              <Col span="6" className={styles.tr}>
                <span>方向:</span>
              </Col>
              <Col span="17" offset="1">
                <Select
                  size={config.InputSize}
                  defaultValue={printConfig && printConfig.orientation ? printConfig.orientation :orientation}
                  value={orientation}
                  className={styles.mr8} onChange={this.selectPrintDirection} style={{ display: 'block', marginTop: -2 }}>
                  <Option key="PORTRAIT">纵向</Option>
                  <Option key="LANDSCAPE">横向</Option>
                  <Option key="REVERSE_PORTRAIT">纵向反转</Option>
                  <Option key="REVERSE_LANDSCAPE">横向反转</Option>
                </Select>
              </Col>
            </Row>
            <Row className={styles.mt8}>
              <Col span="12">
                <label className={styles.setting_label}>宽(mm)</label>
                <InputNumber
                  disabled={this.state.paper === 'A4'}
                  size={config.InputSize}
                  className={styles.setting_input}
                  step={0.1}
                  min={0}
                  onFocus={()=>{}}
                  onChange={this.settingPageW.bind(this)}
                  value={this.state.pageW} />
              </Col>
              <Col span="12">
                <label className={styles.setting_label}>高(mm)</label>
                <InputNumber
                  value={this.state.pageH}
                  disabled={this.state.paper === 'A4'}
                  size={config.InputSize}
                  className={styles.setting_input}
                  step={0.1} min={0}
                  onChange={this.settingPageH.bind(this)} />
              </Col>
            </Row>
            <Row className={styles.mt5}>
              <Col span="12">
                <label className={styles.setting_label}>边距上(mm)</label>
                <InputNumber
                defaultValue={this.state.pageTop}
                size={config.InputSize}
                className={styles.setting_input}
                step={0.1} min={0}
                onChange={this.settingPrintRangeTop.bind(this)}
                value={printConfig && printConfig.pageTop ? printConfig.pageTop :this.state.pageTop} />
              </Col>
              <Col span="12">
                <label className={styles.setting_label}>边距左(mm)</label>
                <InputNumber
                defaultValue={printConfig && printConfig.pageLeft ? printConfig.pageLeft :this.state.pageLeft}
                size={config.InputSize}
                className={styles.setting_input}
                step={0.1} min={0}
                onChange={this.settingPrintRangeLeft.bind(this)}
                value={this.state.pageLeft} />
              </Col>
            </Row>
          </div>
          { !isPreview && presetFields && presetFields.length ? presetFields.map((item, key) => this.renderPreset(item, key)) : null}
          {this.props.isPreview ? null :
          <div>
            <h4 className={styles.set_h4}>自定义项</h4>
            <div className={styles.box}>
              <div className="ant-search-input-wrapper">
                <Input
                  placeholder="输入后,回车"
                  suffix={<Icon type="enter" />}
                  onPressEnter={this.insertField.bind(this)}
                />
                {/* <InputGroup className="ant-search-input">
                    <Input placeholder="输入自定义文本" ref="inputCustText" defaultValue={this.state.insert_filed} onPressEnter={this.insertField.bind(this)} />
                    <div className="ant-input-group-wrap">
                        <Button icon="enter" type="primary" className="ant-search-btn" onClick={this.insertField.bind(this)} />
                    </div>
                </InputGroup> */}
              </div>
            </div>
            <div className={styles.custbox}>
              {typeof custBoxs !== 'undefined' && custBoxs.length && custBoxs.map((item, key) => this.renderCustLabel(item, key))}
            </div>
          </div>
          }
          
        </div>
      </div>)
  }
}
