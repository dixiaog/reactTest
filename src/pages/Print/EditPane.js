import React, { Component } from 'react'
import { Select, Button, Tooltip, Radio, Icon, Modal, Popconfirm, Form, Input } from 'antd'
import update from 'immutability-helper'
import IconFA from '../../components/Jicon'
import config from '../../utils/config'

const Option = Select.Option
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const cssDefault = {
  fontFamily: '', // 默认字体,
  fontSize: '12px', // 9~60 拖放吧？
  fontWeight: 400, // 400 or 700
  fontStyle: 'normal', // oblique italic,
  textDecoration: '', // none underline
  overflow: '',
}
class EditPane extends Component {
  constructor(props) {
		super(props)
		this.state = {
            css: cssDefault,
            modalTitleVisible: false,
            modalTitleValue: '',
		}
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.item !== null && nextProps.item === null) {
      this.updateState({
        css: {
          $set: cssDefault,
        },
      })
      return
    }
    if (JSON.stringify(this.props.item) !== JSON.stringify(nextProps.item)) {
      this.updateState({
        css: {
          $set: Object.assign({}, cssDefault, nextProps.item.css),
        },
      })
    }
  }
  updateState(obj, callback) {
    this.setState(update(this.state, obj), callback)
  }
  updateCssState(obj, callback) {
    this.setState(update(this.state, {
      css: obj,
    }), callback)
  }

  changeStyle(field, value) {
    const { activeKey, item } = this.props
    this.updateCssState({
      [field]: {
        $set: value,
      },
    }, () => {
      this.props.changeDomCss(activeKey, item, { [field]: this.state.css[field] })
    })
  }

  toggleStyle(field) {
    const { activeKey, item } = this.props
    let value = {}
    const oldValue = this.state.css[field]
    switch (field) {
      case 'fontWeight': {
        value = {
          $set: oldValue !== 700 ? 700 : '',
        }
        break
      }
      case 'fontStyle': {
        value = {
          $set: oldValue === 'oblique' ? '' : 'oblique',
        }
        break
      }
      case 'textDecoration': {
        value = {
          $set: oldValue === 'underline' ? '' : 'underline',
        }
        break
      }
      default: break
    }
    this.updateCssState({
      [field]: value,
    }, () => {
      this.props.changeDomCss(activeKey, item, { [field]: this.state.css[field] })
    })
  }

  changeTextAlign(e) {
    const { activeKey, item } = this.props
    let merge = null
    const value = e.target.value === this.state.css.textAlign ? '' : e.target.value
    switch (value) {
      case 'left': {
        merge = {
          textAlign: value,
          marginLeft: '',
          marginRight: '',
        }
        break
      }
      case 'center': {
        merge = {
          textAlign: value,
          marginLeft: 'auto',
          marginRight: 'auto',
        }
        break
      }
      case 'right': {
        merge = {
          textAlign: value,
          marginLeft: 'auto',
          marginRight: '',
        }
        break
      }
      default: {
        merge = {
          textAlign: '',
          marginLeft: '',
          marginRight: '',
        }
        break
      }
    }
    if (merge !== null) {
      this.updateCssState({
        $merge: merge,
      }, () => {
        this.props.changeDomCss(activeKey, item, { ...merge })
      })
    }
  }
  removeDom() {
    const { activeKey } = this.props
    this.props.removeDom(activeKey)
  }

  openModalTitle() {
    if (this.state.modalTitleValue === '') {
      this.updateState({
        modalTitleValue: {
          $set: this.props.item.title,
        },
        modalTitleVisible: {
          $set: true,
        },
      })
    } else {
      this.updateState({
        modalTitleVisible: {
          $set: true,
        },
      })
    }
  }

  modalTitleInputChange(e) {
    this.updateState({
      modalTitleValue: {
        $set: e.target.value,
      },
    })
  }
  modifyTitle() {
    const value = this.refs.modalTitleInput.refs.input.value
    this.updateState({
      modalTitleValue: {
        $set: value,
      },
      modalTitleVisible: {
        $set: false,
      },
    }, () => {
      const { activeKey } = this.props
      this.props.modifyTitle(activeKey, value)
    })
  }
  closeModalTitle() {
    this.updateState({
      modalTitleVisible: {
        $set: false,
      },
    })
  }
  changeQRCode() {
    const { activeKey, item } = this.props
    this.props.changeAct(activeKey, item.type === 2 ? 4 : 2)
  }
  changeBarCode() {
    const { activeKey, item } = this.props
    this.props.changeAct(activeKey, item.type === 3 ? 4 : 3)
  }
  changeTextOvh(value) {
    let merge = null
    switch (value) {
      case 'visible': {
        merge = {
          overflow: 'visible',
          wordBreak: 'break-all',
        }
        break
      }
      case 'hidden': {
        merge = {
          overflow: 'hidden',
          wordBreak: 'normal',
        }
        break
      }
      default: {
        merge = {
          overflow: '',
          wordBreak: '',
        }
        break
      }
    }
    if (merge !== null) {
      this.updateCssState({
        $merge: merge,
      }, () => {
        const { activeKey } = this.props
        this.props.changeDomCss(activeKey, null , { ...merge })
      })
    }
  }

  render() {
  const { item } = this.props
  const { fontFamily, fontSize, fontWeight, fontStyle, textDecoration, textAlign, overflow } = this.state.css
  const barcodeWidth = ''// item && item.ext.barcodeWidth ? item.ext.barcodeWidth : ''
  // 是否允许条形码 二维码
  const codeEnabled = (() => {
    if (item) {
      return (item.type === 2) || (item.type === 4) || (item.type === 3 && item.actived)|| (item.type === 5)
    }
    return false
  })()
  const allDisabled = !item.title
  return (
    <div>
      <Select size={config.InputSize} style={{ width: 110 }} value={fontFamily} onChange={this.changeStyle.bind(this, 'fontFamily')} disabled={allDisabled}>
        <Option value="">系统默认字体</Option>
        <Option value="宋体">宋体</Option>
        <Option value="黑体">黑体</Option>
        <Option value="Microsoft YaHei">微软雅黑</Option>
        <Option value="Arial">Arial</Option>
      </Select>
      &nbsp;
      <Select size={config.InputSize} style={{ width: 80 }} value={fontSize} onChange={this.changeStyle.bind(this, 'fontSize')} disabled={allDisabled}>
        <Option value="9px">9px</Option>
        <Option value="10px">10px</Option>
        <Option value="11px">11px</Option>
        <Option value="12px">12px</Option>
        <Option value="14px">14px</Option>
        <Option value="16px">16px</Option>
        <Option value="18px">18px</Option>
        <Option value="22px">22px</Option>
        <Option value="26px">26px</Option>
        <Option value="32px">32px</Option>
        <Option value="40px">40px</Option>
        <Option value="60px">60px</Option>
      </Select>
      &emsp;
      <Button size={config.InputSize} type={fontWeight === 700 ? 'primary' : 'ghost'} onClick={this.toggleStyle.bind(this, 'fontWeight')} disabled={allDisabled}>
        <Tooltip title="粗体" placement="top"><IconFA type="bold" /></Tooltip>
      </Button>
      &nbsp;
      <Button
        type={fontStyle === 'oblique' ? 'primary' : 'ghost'}
        size={config.InputSize}
        onClick={this.toggleStyle.bind(this, 'fontStyle')}
        style={{ fontStyle: 'oblique', fontFamily: 'inhert' }}
        disabled={allDisabled}
      >
        <Tooltip title="斜体" placement="top"><IconFA type="italic" /></Tooltip>
      </Button>
      &nbsp;
      <Button type={textDecoration === 'underline' ? 'primary' : 'ghost'} onClick={this.toggleStyle.bind(this, 'textDecoration')} size={config.InputSize} disabled={allDisabled}>
        <Tooltip title="下划线" placement="top"><IconFA type="underline" /></Tooltip>
      </Button>
      &nbsp;
      <RadioGroup size={config.InputSize} value={textAlign} disabled={allDisabled} onChange={this.changeTextAlign.bind(this)}>
        <RadioButton value="left"><Tooltip title="居左" placement="top"><IconFA type="align-left" /></Tooltip></RadioButton>
        <RadioButton value="center"><Tooltip title="居中" placement="top"><IconFA type="align-center" /></Tooltip></RadioButton>
        <RadioButton value="right"><Tooltip title="居右" placement="top"><IconFA type="align-right" /></Tooltip></RadioButton>
      </RadioGroup>
      &nbsp;
      <Popconfirm title="确定要删除的节点吗" onConfirm={this.removeDom.bind(this)}>
        <Button type="ghost" size={config.InputSize} disabled={allDisabled && !item}>
          <Tooltip title="删除节点" placement="top"><IconFA type="trash-o" /></Tooltip>
        </Button>
      </Popconfirm>
      &nbsp;
      <Button size={config.InputSize} type="ghost" onClick={this.openModalTitle.bind(this)} disabled={!(item.type === 4 || (item.type === 3 && item.actived === 1))}>
        <Tooltip title="编辑文本" placement="top"><strong>T</strong></Tooltip>
      </Button>

      <Modal title="修改节点显示文本" wrapClassName="vertical-center-modal" visible={this.state.modalTitleVisible} footer={false} closable={false}>
        <Form horizontal>
          <Form.Item label="文本" labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            <Input ref="modalTitleInput" type="text" placeholder="请输入显示文本..." value={this.state.modalTitleValue} onChange={this.modalTitleInputChange.bind(this)} />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 12, offset: 7 }}>
            <Button type="ghost" onClick={this.closeModalTitle.bind(this)} >取消</Button>
            &emsp;
            <Button type="primary" onClick={this.modifyTitle.bind(this)} >确定</Button>
          </Form.Item>
        </Form>
      </Modal>
      &nbsp;
      <Button size={config.InputSize} type={item.type === 2 ? 'primary' : 'ghost'} disabled={!codeEnabled} onClick={this.changeQRCode.bind(this)}>
        <Tooltip title="转二维码显示" placement="top"><Icon type="qrcode" /></Tooltip>
      </Button>
      &nbsp;
      <Button type={item.type === 3 ? 'primary' : 'ghost'} size={config.InputSize} disabled={!codeEnabled} onClick={this.changeBarCode.bind(this)}>
        <Tooltip title="转条形码显示" placement="top"><span>||||</span></Tooltip>
      </Button>
      &nbsp;
      <Select size={config.InputSize} style={{ width: 140 }} value={barcodeWidth} disabled={!(item.type === 3)} >
        <Option value="">条码线条粗细默认</Option>
        <Option value="1">条码线条粗细:1像素</Option>
        <Option value="2">条码线条粗细:2像素</Option>
        <Option value="3">条码线条粗细:3像素</Option>
      </Select>
      &emsp;
      <Select size={config.InputSize} style={{ width: 120 }} value={overflow} disabled={allDisabled} onChange={this.changeTextOvh.bind(this)} >
        <Option value="">内容溢出时默认</Option>
        <Option value="visible">内容溢出时换行</Option>
        <Option value="hidden">内容溢出时隐藏</Option>
      </Select>
    </div>
  )
  }
}

export default EditPane
