import React from 'react'
import PropTypes from 'prop-types'
import { Table, Popconfirm, Button } from 'antd'

const List = ({ onDelete, products }) => {
  const columns = [{
    title: '名称',
    dataIndex: 'name',
  }, {
    title: '操作',
    render: (text, record) => {
      return (
        <Popconfirm title="请确认是否删除?" onConfirm={() => onDelete(record.id)}>
          <Button>Delete</Button>
        </Popconfirm>
      )
    },
  }]
  return (
    <Table
      dataSource={products}
      columns={columns}
    />
  )
}

List.propTypes = {
  onDelete: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired,
}

export default List