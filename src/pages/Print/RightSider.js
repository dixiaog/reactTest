import React, { Component } from 'react'
import { Row, Col, Input, InputNumber, Icon, Select, Modal, message } from 'antd'
import styles from './Print.less'
import config from '../../utils/config'


// const InputGroup = Input.Group
const confirm = Modal.confirm
const Option = Select.Option
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
class Side extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orientation: 'PORTRAIT',
      presetFields: [{
        type: 5,
        name: '字段信息',
        rows: [{ title: '商品名称', id: 'itemName' }, { title: '商品编码', id: 'sku' }],
      }, {
        type: 3,
        name: '表格',
        rows: [{ title: '数量', id: 'num' }, { title: '重量', id: 'weight' }],
      }],
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
  }
  componentDidMount() {
    wpInt = setInterval(this.wpInfoInit, 5000)
    // wp.on('DISCONNECTED', () => {
    //   console.log('已断开')
    // })
    // wp.listPrinters((printerNames) => {
    //   console.log('printerNames', printerNames)
    // })
    // wp.listSupportedPapers('Microsoft Print To PDF', (papers) => {
    //   console.log('papers', papers)
    // })
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      presetFields: nextProps.presetFields,
      ...nextProps.printConfig,
    })
  }

  settingPageW = (e) => {
    this.setState({
      pageW: e,
    }, () => {
      this.pageConfigChange({ pageW: e })
    })
    // this.props.dispatch({ type: 'PM_SETTING_PAGEW_SET', val: e })
  }
  settingPageH = (e) => {
    this.setState({
      pageH: e,
    }, () => {
      this.pageConfigChange({ pageH: e })
    })
    // this.props.dispatch({ type: 'PM_SETTING_PAGEH_SET', val: e })
  }
  settingPrintRangeTop = (e) => {
    this.setState({
      pageTop: e,
    }, () => {
      this.pageConfigChange({ pageTop: e })
    })
    // this.props.dispatch(settingPrintRangeTop(e))
  }
  settingPrintRangeLeft = (e) => {
    this.setState({
      pageLeft: e,
    }, () => {
      this.pageConfigChange({ pageLeft: e })
    })
    // this.props.dispatch(settingPrintRangeLeft(e))
  }
  selectPrintMachine = (e) => {
    this.setState({
      machine: e,
    }, () => {
    //  wp.listSupportedPapers(e, (papers) => {
    //     console.log('papers', papers)
    //   })
      this.pageConfigChange({ machine: e })
    })
  }

  selectPrintPaper = (e) => {
    if (e === 'A4') {
      this.setState({
        paper: e,
        pageW: 210,
        pageH: 297,
      }, () => {
        this.pageConfigChange()
      })
    } else {
      this.setState({
        paper: e,
        pageW: 100,
        pageH: 100,
      }, () => {
        this.pageConfigChange()
      })
    }
    // this.props.dispatch({ type: 'PM_PRINTSETTING_MERGE', merge: {
    //   paper: e
    // } })
  }
  selectPrintDirection = (e) => {
    this.setState({
      orientation: e,
    }, () => {
      this.pageConfigChange({ orientation: e })
    })
    // this.props.dispatch({ type: 'PM_PRINTSETTING_MERGE', merge: {
    //   direction: e
    // } })
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
  // renderDataLabel(item, key) {
  //   return (
  //     <div>1</div>
  //   )
  // }
  addTableCols(item) {
    this.props.dispatch({
      type: 'printModifyView/addTableCols',
      payload: {
        col: item,
      },
    })
  }

  addLineBox = (item) => {
    const { dispatch } = this.props
    dispatch({
      type: 'printModifyView/addBox',
      payload: {
        item,
      },
    })
  }
  insertField = (e) => {
    const { dispatch } = this.props
    const item = {
      type: 4,
      title: e.target.value,
    }
    dispatch({
      type: 'printModifyView/addBox',
      payload: {
        item,
      },
    })
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
            content: <div>点击<a href="https://pan.baidu.com/s/1TE_rdJgZf7zTqfLng2gj9w">下载</a>，获取打印客户端</div>,
            onOk() {
            },
            onCancel() {},
          })
          return false
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
    // const cn = classNames(styles.custbox, styles.dataArea)
    // return (
    //   <div key={key}>
    //     <h4 className={styles.set_h4}><Icon type='file' />{item.name}</h4>
    //     <div className={cn}>
    //       {item.rows && item.rows.map((row, k) => this.renderDataLabel(row, k))}
    //     </div>
    //   </div>
    // )
  }

  render() {
    const { printConfig } = this.props
    const { orientation, presetFields, machines } = this.state
    return (
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
                defaultValue={printConfig && printConfig.pageW ? printConfig.pageW :this.state.pageW}
                disabled={this.state.paper === 'A4'}
                size={config.InputSize}
                className={styles.setting_input}
                step={0.1}
                min={0}
                onChange={this.settingPageW.bind(this)}
                value={this.state.pageW} />
            </Col>
            <Col span="12">
              <label className={styles.setting_label}>高(mm)</label>
              <InputNumber
                defaultValue={this.state.pageH}
                disabled={this.state.paper === 'A4'}
                size={config.InputSize}
                className={styles.setting_input}
                step={0.1} min={0}
                onChange={this.settingPageH.bind(this)}
                value={printConfig && printConfig.pageH ? printConfig.pageH :this.state.pageH} />
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
        {presetFields && presetFields.length ? presetFields.map((item, key) => this.renderPreset(item, key)) : null}
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
    )
  }
}

export default Side
