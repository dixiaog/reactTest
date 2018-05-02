import React, { Component } from 'react'
import { connect } from 'dva'
import List from '../components/list'


@connect(state => ({
  products: state.products,
}))
export default class Products extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  // ({ dispatch, products })
  handleDelete= (id) => {
    this.props.dispatch({
      type: 'products/delete',
      payload: id,
    })
  }
  render() {
    console.log('this.props', this.props)
    return (
      <div>
        <h2>List of Products</h2>
        <List onDelete={this.handleDelete} products={this.props.products} />
      </div>
    )
  }
}
 
// export default Products
// export default connect(({ products }) => ({
//   products,
// }))(Products)