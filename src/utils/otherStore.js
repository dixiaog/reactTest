import { createStore } from 'redux'


function todos(state = [], action) {
  switch (action.type) {
    case 'OSAVE':
      return action.dd
    case 'OREPLACE':
      return state
    default:
      return state
  }
}
const otherStore = createStore(todos, {})
// export function initOtherState() {
//   otherStore = createStore(todos, {})
// }

// dev模式下关闭外部存储store
export function getOtherStore() {
  return otherStore.getState()
}

export function saveOtherStore(data) {
  otherStore.dispatch({
    type: 'OSAVE',
    dd: data,
  })
}

