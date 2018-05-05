import React, { Component } from 'react'
import { connect } from 'dva'
import { Button } from 'antd'
import ProductList from '../../components/ProductList/index'

@connect(state => ({
  products: state.products,
}))
export default class Products extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  handleDelete(id) {
    this.props.dispatch({
      type: 'products/delete',
      payload: id,
    })
  }
  touch = () => {
    alert('你按了按钮')
  }
  render() {
    return (
      <div>
        <h2>List of Products</h2>
        <ProductList onDelete={this.handleDelete} products={this.props.products} />
        <Button type="primary" size="small" onClick={this.touch}>按钮</Button>
      </div>
    )
  }
}