import React from 'react'
import { connect } from 'dva'
import Redirect from 'umi/redirect'
// import Analysis from './Dashboard/Analysis'

function IndexPage() {
  return (
    <Redirect to="/dashboard/analysis" />
  )
}

IndexPage.propTypes = {
}

export default connect()(IndexPage)
