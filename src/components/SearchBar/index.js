/*
 * @Author: jchen
 * @Date: 2017-10-11 13:31:41
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-04-21 09:51:48
 * 顶部搜索
 * @param
 *  @colItems:[{
 *    @decorator 查询字段名
 *    @components 对应组件
 *  }]
 *  @nameSpace 指向对应 model
 *  @searchParam 查询参数，state持久化后切换页面保存查询查询条件
 *  @requestParam 部分搜索中需要用到的必要参数
 */

import React from 'react'
import { Row, Col, Form, Button, Icon } from 'antd'
import moment from 'moment'
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
  // const { dispatch, searchParam, nameSpace } = props
  // dispatch({
  //   type: `${nameSpace}/changeState`,
  //   payload: {
  //     searchParam: Object.assign(searchParam, values),
  //   },
  // })
} })
export default class SearchBar extends React.Component {
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
      this.props.clear ? this.props.clearState() : null
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
      const itemOffset = colItems.length >= 5 ? 0 : (20 - ((colItems.length % 6) * 4))
      return (
        <Form layout="inline">
          <Row {...itemRow} className={styles.searchRow}>
            { this.state.collapsed ? colItems.map((ele, i) => {
              if (ele.type === 'button') {
                if (i % 6 === 0) {
                  return <Col key={i} {...itemFirstCol}>{ele.components}</Col>
                } else {
                  return <Col key={i} {...itemCol}>{ele.components}</Col>
                }
              } else {
                let initVal = searchParam && searchParam[ele.decorator] !== undefined ? searchParam[ele.decorator] : undefined
                if (ele.components.props.prefixCls === 'ant-calendar') { // 此处需要推敲，时间默认值为monet类型
                  initVal = searchParam && searchParam[ele.decorator] ? moment(searchParam[ele.decorator]) : undefined
                }
                const formItem = (
                  <FormItem >
                    {getFieldDecorator(ele.decorator, {
                      initialValue: initVal,
                    })(
                      ele.components
                    )}
                  </FormItem>)
                  if (i % 6 === 0) {
                    return <Col key={i} {...itemFirstCol}>{formItem}</Col>
                  } else {
                    return <Col key={i} {...itemCol}>{formItem}</Col>
                  }
              }
            }) :
            colItems.map((ele, i) => {
              if (ele.type === 'button') {
                if (i < 5) {
                  if (i % 6 === 0) {
                    return <Col key={i} {...itemFirstCol}>{ele.components}</Col>
                  } else {
                    return <Col key={i} {...itemCol}>{ele.components}</Col>
                  }
                } else {
                  return null
                }
              } else {
              let initVal = searchParam && searchParam[ele.decorator] !== undefined ? searchParam[ele.decorator] : undefined
              if (ele.components.props.prefixCls === 'ant-calendar') { // 此处需要推敲，时间默认值为monet类型
                initVal = searchParam && searchParam[ele.decorator] ? moment(searchParam[ele.decorator]) : undefined
              }
              const formItem = (
                <FormItem >
                  {getFieldDecorator(ele.decorator, {
                    initialValue: initVal,
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
              }
            })
            }
            {colItems.length ? this.state.collapsed ?
              <Col span={4} style={{ paddingTop: '6px' }} offset={20 - ((colItems.length % 6) * 4)}>
                <span className={styles.submitButtons} style={{ float: 'right' }}>
                  <Button type="primary" size="small" onClick={this.handleSearch.bind(this)}>搜索</Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset.bind(this)} size="small">清空</Button>
                  <a style={{ marginLeft: 8 }} onClick={toggleForm.bind(this, 2)}>
                    收起 <Icon type="up" />
                  </a>
                </span>
              </Col> :
              <Col span={4} style={{ paddingTop: '6px' }} offset={itemOffset}>
                <span className={styles.submitButtons} style={{ float: 'right' }}>
                  <Button type="primary" size="small" onClick={this.handleSearch.bind(this)}>搜索</Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset.bind(this)} size="small">清空</Button>
                  {colItems.length > 5 ?
                    <a style={{ marginLeft: 8 }} onClick={toggleForm.bind(this, 1)}>
                      展开 <Icon type="down" />
                    </a> : null }
                </span>
              </Col>
             : ''}
          </Row>
        </Form>
      )
    }
}
