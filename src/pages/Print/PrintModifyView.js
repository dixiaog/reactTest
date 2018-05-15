import React from 'react'
import { connect } from 'dva'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Container from './Container'
import CustomDragLayer from './CustomDragLayer'
import { getUrlParam } from '../../utils/utils'

@DragDropContext(HTML5Backend)
@connect(state => ({
  printModifyView: state.printModifyView,
}))
class PrintModifyView extends React.Component {
  // constructor(props) {
  //   super(props)
  //   this.state = {
  //     pageConfig: {},
  //   }
  // }
  componentDidMount() {
    this.props.dispatch({
      type: 'printModifyView/getPrintTemp',
      payload: { autoNo: getUrlParam('autoNo') },
    })
  }
  // pageConfigChange = (value) => {
  //   pageConfig = value
  //   // this.props.dispatch({
  //   //   type: 'printModifyView/updateState',
  //   //   payload: { pageConfig: value },
  //   // })
  // }
  // constructor(props) {
  //   super(props)
  //   this.handleSnapToGridAfterDropChange = this.handleSnapToGridAfterDropChange.bind(
  //     this,
  //   )
  //   this.handleSnapToGridWhileDraggingChange = this.handleSnapToGridWhileDraggingChange.bind(
  //     this,
  //   )

  //   this.state = {
  //     snapToGridAfterDrop: false,
  //     snapToGridWhileDragging: false,
  //   }
  // }
  // handleSnapToGridAfterDropChange() {
  //   this.setState({
  //     snapToGridAfterDrop: !this.state.snapToGridAfterDrop,
  //   })
  // }

  // handleSnapToGridWhileDraggingChange() {
  //   this.setState({
  //     snapToGridWhileDragging: !this.state.snapToGridWhileDragging,
  //   })
  // }

  render() {
    const { snapToGridAfterDrop, snapToGridWhileDragging } = this.props.printModifyView
    return (
      <div>
        {/* <PrintHeader isPreview={false} {...this.props.printModifyView} item={item} dispatch={this.props.dispatch} tempName={tempName} /> */}
        <Container
          isPreview={false}
          snapToGrid={snapToGridAfterDrop}
          dispatch={this.props.dispatch}
          {...this.props.printModifyView}
          pageConfigChange={this.pageConfigChange}
        />
        <CustomDragLayer snapToGrid={snapToGridWhileDragging} />
        {/* <RightSider dispatch={this.props.dispatch} presetFields={presetFields} pageConfigChange={this.pageConfigChange} {...this.props.printModifyView} /> */}
      </div>
    )
  }
}

export default connect(({ printModifyView, loading }) => ({ printModifyView, loading }))(PrintModifyView)
