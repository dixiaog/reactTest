import React from 'react'
import { Link } from 'dva/router'
import Exception from '../../components/Exception/index1'

export default () => (
  <Exception type="401" style={{ minHeight: 500, height: '80%' }} linkElement={Link} />
)
