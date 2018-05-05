import React, { Component } from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import { Page } from 'components'
import queryString from 'query-string'
import List from '../../components/Users/List'
import Filter from '../../components/Users/Filter'
import Modal from './Modal'


@connect(state => ({
  user1: state.user1,
}))
export default class User extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }
  render () {
    const { location, dispatch, user1 } = this.props
    // , loading
    location.query = queryString.parse(location.search)
    const { query, pathname } = location
    const { list, pagination, currentItem, modalVisible, modalType, isMotion, selectedRowKeys, loading } = user1
    const handleRefresh = (newQuery) => {
      dispatch(routerRedux.push({
        pathname,
        search: queryString.stringify({
          ...query,
          ...newQuery,
        }),
      }))
    }
  
    const modalProps = {
      item: modalType === 'create' ? {} : currentItem,
      visible: modalVisible,
      maskClosable: false,
      confirmLoading: loading,
      // loading.effects['user1/update']
      title: `${modalType === 'create' ? 'Create User' : 'Update User'}`,
      wrapClassName: 'vertical-center-modal',
      onOk (data) {
        dispatch({
          type: `user1/${modalType}`,
          payload: data,
        })
          .then(() => {
            handleRefresh()
          })
      },
      onCancel () {
        dispatch({
          type: 'user1/hideModal',
        })
      },
    }
  
    const listProps = {
      dataSource: list,
      loading: loading,
      // loading.effects['user1/query']
      pagination,
      location,
      isMotion,
      onChange (page) {
        handleRefresh({
          page: page.current,
          pageSize: page.pageSize,
        })
      },
      onDeleteItem (id) {
        dispatch({
          type: 'user1/delete',
          payload: id,
        })
          .then(() => {
            handleRefresh({
              page: (list.length === 1 && pagination.current > 1) ? pagination.current - 1 : pagination.current,
            })
          })
      },
      onEditItem (item) {
        dispatch({
          type: 'user1/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        })
      },
      rowSelection: {
        selectedRowKeys,
        onChange: (keys) => {
          dispatch({
            type: 'user1/updateState',
            payload: {
              selectedRowKeys: keys,
            },
          })
        },
      },
    }
  
    const filterProps = {
      isMotion,
      filter: {
        ...query,
      },
      onFilterChange (value) {
        handleRefresh({
          ...value,
          page: 1,
        })
      },
      onAdd () {
        dispatch({
          type: 'user1/showModal',
          payload: {
            modalType: 'create',
          },
        })
      },
      switchIsMotion () {
        dispatch({ type: 'user1/switchIsMotion' })
      },
    }
  
    const handleDeleteItems = () => {
      dispatch({
        type: 'user1/multiDelete',
        payload: {
          ids: selectedRowKeys,
        },
      })
        .then(() => {
          handleRefresh({
            page: (list.length === selectedRowKeys.length && pagination.current > 1) ? pagination.current - 1 : pagination.current,
          })
        })
    }
    return (
      <Page inner>
        <Filter {...filterProps} />
        {
          selectedRowKeys.length > 0 &&
          <Row style={{ marginBottom: 24, textAlign: 'right', fontSize: 13 }}>
            <Col>
              {`Selected ${selectedRowKeys.length} items `}
              <Popconfirm title="Are you sure delete these items?" placement="left" onConfirm={handleDeleteItems}>
                <Button type="primary" style={{ marginLeft: 8 }}>Remove</Button>
              </Popconfirm>
            </Col>
          </Row>
        }
        <List {...listProps} />
        {modalVisible && <Modal {...modalProps} />}
      </Page>
    )
  }
}
