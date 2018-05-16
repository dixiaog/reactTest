import React, { Component } from 'react'
import { connect } from 'dva'
import DocumentTitle from 'react-document-title'
import PageHeader from './PageHeader'

@connect(state => ({
  global: state.global,
}))
export default class Title extends Component {
  render() {
    return (
      <DocumentTitle title={`全家-${this.props.global.title}`}>
        <PageHeader />
      </DocumentTitle>
    )
  }
}
