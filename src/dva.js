import { saveOtherStore, getOtherStore } from './utils/otherStore'
import { setLocalStorageItem } from './utils/utils'
// let initialState = {}
let initTime = 0
let objParam = window.location.href.split('/')[window.location.href.split('/').length - 1]

// if (localStorage.getItem('store')) {
//   initialState = initTime === 0 ? {} : getOtherStore()
// }
export function config() {
  return {
      initialstate: getOtherStore(),
      onStateChange: (state) => {
        if (initTime === 0) {
          // saveOtherStore(state)
          // 保存原始数据，方便清空时还原
          localStorage.setItem('originalStore', JSON.stringify(state))
          setLocalStorageItem('forceRefresh',objParam)
        }
        initTime++
        const initialS = getOtherStore()
        if (!Object.is(JSON.stringify(initialS), JSON.stringify(state))) {
          objParam = window.location.href.split('/')[window.location.href.split('/').length - 1]
          saveOtherStore(Object.assign(initialS, { [objParam]: state[objParam] }))
        }
      },
  }
}
window.onbeforeunload = function () {
  saveOtherStore({})
}