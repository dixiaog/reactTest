export function getLocalStorageItem() {
  return window.localStorage.getItem('token')
}

export function isRefresh() {
  const url = window.location.href.split('/')[ window.location.href.split('/').length - 1]
  const tabList = window.localStorage.getItem('tabList')
  const exist = JSON.parse(tabList).filter(ele => ele.key.split('/').join('') === url)
  if (exist.length) {
    return false
  } else {
    return true
  }
}