export function getLocalStorageItem() {
  return window.localStorage.getItem('token')
}

export function shouldUpdate() {
  const url = window.location.href.split('/')[ window.location.href.split('/').length - 1]
  const panes = window.localStorage.getItem('panes')
  const exist = JSON.parse(panes).filter(ele => ele.key.split('/').join('') === url)
  if (exist.length) {
    return false
  } else {
    return true
  }
}