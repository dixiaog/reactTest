/*
 * @Author: jiangteng
 * @Date: 2018-01-22 09:49:38
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-03-28 09:50:29
 * 带时间的搜索组件
 */

import React from 'react'
import { Row, Col, Form, Button, Icon } from 'antd'
import styles from './index.less'

const itemRow = {
    md: { span: 8, offset: 0 },
    lg: { span: 24, offset: 0 },
    xl: { span: 48, offset: 0 },
  }
  const itemCol = {
    xs: { span: 24, offset: 0 },
    sm: { span: 24, offset: 0 },
    md: { span: 5, offset: 1 },
    lg: { span: 3, offset: 1 },
    xl: { span: 3, offset: 1 },
  }
  const itemFirstCol = {
    xs: { span: 24, offset: 0 },
    sm: { span: 24, offset: 0 },
    md: { span: 5, offset: 0 },
    lg: { span: 3, offset: 0 },
    xl: { span: 3, offset: 0 },
  }
const FormItem = Form.Item
@Form.create({ onValuesChange: (props, values) => {
  const { dispatch, searchParam, nameSpace } = props
  // console.log(Object.assign(searchParam, values))
  dispatch({
    type: `${nameSpace}/changeState`,
    payload: {
      searchParam: Object.assign(searchParam, values),
    },
  })
} })
export default class SearchBarJ extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          collapsed: false,
        }
    }
    // componentWillMount() {
    //   const { colItems } = this.props
    //   if (colItems.length > 5) {
    //     this.setState({
    //       collapsed: true,
    //     })
    //   }
    // }
    handleSearch(e) {
      e.preventDefault()
      const { nameSpace, dispatch, requestParam } = this.props
      this.props.form.validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: `${nameSpace}/search`,
            payload: {
              searchParam: requestParam ? Object.assign({ ...values }, requestParam) : { ...values },
              page: { current: 1 },
            },
          })
        }
      })
    }
    handleFormReset() {
      this.props.form.resetFields()
      const { nameSpace, dispatch, requestParam } = this.props
      dispatch({
        type: `${nameSpace}/search`,
        payload: {
          searchParam: requestParam ? requestParam : {},
          page: { current: 1 },
        },
      })
    }
    render() {
      const { colItems, searchParam } = this.props
      const { getFieldDecorator } = this.props.form
      const toggleForm = (flag) => {
        if (flag === 1) {
         this.setState({
          collapsed: true,
         })
        } else {
          this.setState({
            collapsed: false,
           })
        }
      }
      return (
        <Form layout="inline">
          <Row {...itemRow} className={styles.searchRow}>
            { this.state.collapsed ? colItems.map((ele, i) => {
              const formItem = (
                <FormItem >
                  {getFieldDecorator(ele.decorator, {
                    initialValue: searchParam && searchParam[ele.decorator] ? searchParam[ele.decorator] : undefined,
                  })(
                    ele.components
                  )}
                </FormItem>)
                if (i % 6 === 0) {
                  return <Col key={i} {...itemFirstCol}>{formItem}</Col>
                } else {
                  return <Col key={i} {...itemCol}>{formItem}</Col>
                }
            }) :
            colItems.map((ele, i) => {
              const formItem = (
                <FormItem >
                  {getFieldDecorator(ele.decorator, {
                    initialValue: searchParam && searchParam[ele.decorator] ? searchParam[ele.decorator] : undefined,
                  })(
                    ele.components
                  )}
                </FormItem>)
                if (i < 5) {
                  if (i % 6 === 0) {
                    return <Col key={i} {...itemFirstCol}>{formItem}</Col>
                  } else {
                    return <Col key={i} {...itemCol}>{formItem}</Col>
                  }
                } else {
                  return null
                }
            })
            }
            {this.state.collapsed ?
              <Col span={4} style={{ marginTop: '4px' }}>
                <span className={styles.submitButtons} style={{ float: 'right' }}>
                  <Button type="primary" size="small" onClick={this.handleSearch.bind(this)}>搜索</Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset.bind(this)} size="small">清空</Button>
                  <a style={{ marginLeft: 8 }} onClick={toggleForm.bind(this, 2)}>
                    收起 <Icon type="up" />
                  </a>
                </span>
              </Col> :
              <Col span={4} style={{ marginTop: '4px' }}>
                <span className={styles.submitButtons} style={{ float: 'right' }}>
                  <Button type="primary" size="small" onClick={this.handleSearch.bind(this)}>搜索</Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset.bind(this)} size="small">清空</Button>
                  {colItems.length > 5 ?
                    <a style={{ marginLeft: 8 }} onClick={toggleForm.bind(this, 1)}>
                      展开 <Icon type="down" />
                    </a> : null }
                </span>
              </Col>
            }
          </Row>
        </Form>
      )
    }
}
