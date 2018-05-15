import React from 'react'
import { Row, Col, Form, Icon, Input, Button, notification } from 'antd'
import styles from './Print.less'
import Editor from './EditPane'
import { setLocalStorageItem, getUrlParam } from '../../utils/utils'
import { printEditSave } from '../../services/api'
const FormItem = Form.Item
@Form.create()
export default class BasicForms extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  componentDidMount() {
    // 初始disable sumbit
    // this.props.form.validateFields()
  }
  componentWillReceiveProps(nextProps) {
    // console.log('Header', nextProps.tempName)
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
          printConfig: JSON.stringify(this.props.pageConfigNew),
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
    window.open(window.location.href.replace(/printModifyView/, 'printPreview'))
  }
  render() {
    const { getFieldDecorator, getFieldError, isFieldTouched } = this.props.form
    const modelNameError = isFieldTouched('modelName') && getFieldError('modelName')
  return (
    <div className={this.props.isPreview ? styles.headPreview : styles.head}>
      <Row className={styles.headRow}>
        <Col span={14} style={{ textAlign: 'right', float: 'right' }}>
          <Form layout="inline" onSubmit={this.handleSubmit}>
            { this.props.isPreview ? null :
            <Button
              type="primary"
              style={{ marginRight: 10, marginTop: 8 }}
              size="small"
              icon="eye-o"
              onClick={this.handlePreviewPrint.bind(this)}
            >
                预览
            </Button>}
            <FormItem
              validateStatus={modelNameError ? 'error' : ''}
              help={modelNameError || ''}
            >
              {console.log(this.props.tempName)}
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
          </Form>
        </Col>
      </Row>
      {this.props.isPreview ? null :
      <div className={styles.editRow}>
        <Editor dispatch={this.props.dispatch} item={this.props.item} activeKey={this.props.activeKey} />
      </div>
      }
    </div>)
    }
}
