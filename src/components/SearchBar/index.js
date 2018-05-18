import React from 'react' //, { Component }
// import { connect } from 'dva'
// import update from 'immutability-helper'
import { Row, Col, Form, Button, Icon } from 'antd'
import styles from './index.less'

const FormItem = Form.Item
const itemCol = {
  xs: { span: 24, offset: 0 },
  sm: { span: 24, offset: 0 },
  md: { span: 5, offset: 1 },
  lg: { span: 5, offset: 1 },
  xl: { span: 3, offset: 1 },
}
const itemFirstCol = {
  xs: { span: 24, offset: 0 },
  sm: { span: 24, offset: 0 },
  md: { span: 5, offset: 0 },
  lg: { span: 3, offset: 0 },
  xl: { span: 3, offset: 0 },
}

@Form.create()
export default class SearchBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  handleSubmit = () => {
    this.props.form.validateFields((err, values) => {
      this.props.dispatch({
        type: `${this.props.namespace}/search`,
        payload: { searchParam: values },
      })
      this.props.dispatch({
        type: `${this.props.namespace}/changeState`,
        payload: { searchParam: values, loading: true },
      })
    })
  }
  handleReset = () => {
    this.props.form.resetFields()
      this.props.dispatch({
        type: `${this.props.namespace}/search`,
        payload: { searchParam: {} },
      })
      this.props.dispatch({
        type: `${this.props.namespace}/changeState`,
        payload: { searchParam: {}, loading: true },
      })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { searchBar, searchParam, collapse, changeBars } = this.props
    const formItem = (ele, index, initVal, flag) => {
      return (
        <Col {...flag} key={index}>
          <FormItem key={index}>
            {getFieldDecorator(ele.decorator, {
              initialValue: initVal,
            })(
              ele.components
            )}
            </FormItem>
        </Col>
      )
    }
    return(
      <div>
        <div className={styles.searchBar}>
          <span className={styles.panelLeft}>
            <Form>
              <Row>
                {searchBar && searchBar.length ? searchBar.map((ele, index) => {
                  let initVal = searchParam && searchParam[ele.decorator] !== undefined ? searchParam[ele.decorator] : undefined
                  if (index <= 5) {
                    if (index % 6 === 0) {
                      return (
                        formItem(ele, index, initVal, itemFirstCol)
                      )
                    } else {
                      return (
                        formItem(ele, index, initVal, itemCol)
                      )
                    }
                  } else {
                    if (index % 6 === 0 && collapse) {
                      return (
                        formItem(ele, index, initVal, itemFirstCol)
                      )
                    } else if (collapse) {
                      return (
                        formItem(ele, index, initVal, itemCol)
                      )
                    }
                  }
                }) : null}
                </Row>
            </Form>
          </span>
          <span style={{ float: 'right', marginTop: 14, marginRight: 9 }}>
            { searchBar && searchBar.length ? <span>
              <Button type="primary" onClick={this.handleSubmit} size="small">搜索</Button>
              <Button style={{ marginLeft: 10 }} onClick={this.handleReset} size="small">清空</Button>
            </span> : null}
            {searchBar && searchBar.length > 6 ?
              <a onClick={() => changeBars()} style={{ marginLeft: 10, fontSize: 10 }}>{collapse ?
                '收起' : '展开'}<Icon type={`${collapse ?
                  'up' : 'down'}`} /></a> : ''}
          </span>
        </div>
      </div>
    )
  }
}
