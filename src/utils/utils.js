import moment from 'moment'
import cloneDeep from 'lodash/cloneDeep'
import config from './config'
// import navData from '../common/nav'
import numeral from 'numeral'
import { getOtherStore } from './otherStore'


export function effectFetch(key,dispatch) {
  const otherStore = getOtherStore()
  console.log(getOtherStore())
  const tabKeys = getLocalStorageItem('tabKeys')
  const isInTab = tabKeys ? tabKeys.split(',').indexOf(key) > -1 : false // 判断是否在tablist中存在
  console.log('otherStore', otherStore[key])
  if (!otherStore[key] || (otherStore[key].list.length === 0 && !isInTab)||getLocalStorageItem('forceRefresh') === key) {
    dispatch({ type: `${key}/fetch` })
  }
}

export function checkEmpty(data) {
  if (!data || data.trim() === '') {
    return true
  } else {
    return false
  }
}

export function getUrlParam(name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`)
  const r = window.location.href.split('?')[1].match(reg)
  if (r != null) {
    return unescape(r[2])
  } else {
    return null
  }
}

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val
}

export function getTimeDistance(type) {
  const now = new Date()
  const oneDay = 1000 * 60 * 60 * 24

  if (type === 'today') {
    now.setHours(0)
    now.setMinutes(0)
    now.setSeconds(0)
    return [moment(now), moment(now.getTime() + (oneDay - 1000))]
  }

  if (type === 'week') {
    let day = now.getDay()
    now.setHours(0)
    now.setMinutes(0)
    now.setSeconds(0)

    if (day === 0) {
      day = 6
    } else {
      day -= 1
    }

    const beginTime = now.getTime() - (day * oneDay)

    return [moment(beginTime), moment(beginTime + ((7 * oneDay) - 1000))]
  }

  if (type === 'month') {
    const year = now.getFullYear()
    const month = now.getMonth()
    const nextDate = moment(now).add(1, 'months')
    const nextYear = nextDate.year()
    const nextMonth = nextDate.month()

    return [moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`), moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000)]
  }

  if (type === 'year') {
    const year = now.getFullYear()

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)]
  }
}

function getPlainNode(nodeList, parentPath = '') {
  const arr = []
  nodeList.forEach((node) => {
    const item = node
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/')
    item.exact = true
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path))
    } else {
      if (item.children && item.component) {
        item.exact = false
      }
      arr.push(item)
    }
  })
  return arr
}

export function getRouteData(navData, path) {
  if (!navData.some(item => item.layout === path) ||
    !(navData.filter(item => item.layout === path)[0].children)) {
    return null
  }
  const route = cloneDeep(navData.filter(item => item.layout === path)[0])
  const nodeList = getPlainNode(route.children)
  return nodeList
}

export function digitUppercase(n) {
  const fraction = ['角', '分']
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟'],
  ]
  let num = Math.abs(n)
  let s = ''
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(num * 10 * (10 ** index)) % 10] + item).replace(/零./, '')
  })
  s = s || '整'
  num = Math.floor(num)
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = ''
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p
      num = Math.floor(num / 10)
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
  }

  return s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整')
}

export function utf16to8(str) {
  let out = ''
  let c
  if (typeof str !== 'undefined') {
    const len = str.length
    for (let i = 0; i < len; i++) {
      c = str.charCodeAt(i)
      if ((c >= 0x0001) && (c <= 0x007F)) {
        out += str.charAt(i)
      } else if (c > 0x07FF) {
        out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F))
        out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F))
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
      } else {
        out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F))
        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
      }
    }
  }
  return out
}

export function toFormBody(body, k, isChild = false) {
  let formBody = []
  Object.keys(body).forEach((key, index) => {
    if ((typeof body[key] !== 'boolean' && body[key]) || (typeof body[key] === 'boolean')) {
      if (typeof body[key] !== 'object') {
        if (isChild) {
          formBody.push(`${encodeURIComponent(k)}[${index}]=${encodeURIComponent(body[key])}`)
        } else {
          formBody.push(`${encodeURIComponent(key)}=${encodeURIComponent(body[key])}`)
        }
      } else {
        formBody = formBody.concat(toFormBody(body[key], key, true))
      }
    }
  })
  return formBody
}

const STORE_PREFIX = 'ecommerce'
export function getLocalStorageItem(key) {
  if (window.localStorage.getItem(`${STORE_PREFIX}-version`) !== config.version) {
    window.localStorage.clear()
    window.localStorage.setItem(`${STORE_PREFIX}-version`, config.version)
  }
  return window.localStorage.getItem(`${STORE_PREFIX}-${key}`)
}
export function setLocalStorageItem(key, value) {
  window.localStorage.setItem(`${STORE_PREFIX}-${key}`, value)
}
export function removeLocalStorageItem(key) {
  window.localStorage.removeItem(`${STORE_PREFIX}-${key}`)
}

export function getObjectFromJson(key, value, jsonString) {
  const JsonArr = JSON.parse(jsonString)
  let returnEle = {}
  JsonArr.forEach((ele) => {
    if (ele[key].includes(value)) {
      returnEle = ele
    }
  })
  return returnEle
}

// 权限判断
export function requireAuth() {
  if (checkEmpty(getLocalStorageItem('token'))) {
    return false
  } else {
    return true
  }
}

// 开发模式下建议关闭获取state,避免新增、删除 key值状态不能及时变更
export function getStoreState(name) {
  removeLocalStorageItem(`${name}-store`)
  return false
  // const store = getLocalStorageItem(`${name}-store`)
  // if (store) {
  //   return JSON.parse(store)
  // } else {
  //   return false
  // }
}

export function setStoreState(name, state) {
  removeLocalStorageItem(`${name}-store`)
  setLocalStorageItem(`${name}-store`, JSON.stringify(state))
}

export function moneyCheck(money) {
  const ret = /^(([0])|([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
  return ret.test(money)
}
// 个位数最多10位
export function moneyCheck10(money) {
  const ret = /^(([0])|([1-9])|([1-9]\d{0,8}[0-9])|(([0-9]\.\d{1,2}|[1-9]\d{0,8}[0-9]\.\d{1,2})))$/
  return ret.test(money)
}
// 个位数最多8位
export function moneyCheck8(money) {
  const ret = /^(([1-9])|([1-9]\d{0,6}[0-9])|(([0-9]\.\d{1,2}|[1-9]\d{0,6}[0-9]\.\d{1,2})))$/
  return ret.test(money)
}
// 个位数最多5位
export function moneyCheck5(money) {
  const ret = /^(([1-9])|([1-9]\d{0,3}[0-9])|(([0-9]\.\d{1,2}|[1-9]\d{0,3}[0-9]\.\d{1,2})))$/
  return ret.test(money)
}

// 个位数最多6位
// export function weightCheck56(weight) {
//   const ret = /^(([1-9])|([1-9]\d{0,4}[0-9])|(([0-9]\.\d[0-9]*|[1-9]\d{0,4}[0-9]\.\d[0-9]*)))$/
//   return ret.test(weight)
// }

export function floatCheck(val) {
  return /^(([0])|([1-9][0-9]*)|(([0]\.\d[0-9]*|[1-9][0-9]*\.\d[0-9]*)))$/.test(val)
}

export function floatCheck1(val) {
  return /^([1-9]{1}|([1-9][0-9]*))$/.test(val)
}

export function checkNumber(val) {
  return /^(([0])|([1-9][0-9]*))$/.test(val)
}

export function checkPremission(name) {
  return getLocalStorageItem('premissions').indexOf(name) > -1
}

export function menusRestruct(response) {
  const menus = response.filter(ele => ele.parentMenuNo * 1 === 0)
  let res = response.filter(ele => ele.parentMenuNo * 1 !== 0)
  for (const menu of menus) {
    menu.children = res.filter(ele => ele.parentMenuNo * 1 === menu.menuNo * 1)
    res = res.filter(ele => ele.parentMenuNo * 1 !== menu.menuNo * 1)
  }
  return menus
}

export function menusReview(menus) {
  const menusAuth = getLocalStorageItem('menus').split(',')
  const newMenus = []
  menus.forEach((ele) => {
    if (ele.enableFlag === 1) {
      const menu = {
        name: ele.menuName,
        path: ele.menuRoute,
        icon: ele.menuIcon,
      }
      if (ele.children && ele.children.length) {
        menu.children = menusReview(ele.children)
      }
      if (menusAuth.indexOf(menu.name) > -1) {
        newMenus.push(menu)
      }
    }
  })
  return newMenus
}

export function cnamesReview(response) {
  if (response && response.length) {
    response.forEach((ele) => {
      Object.assign(ele, { value: ele.categoryNo })
      Object.assign(ele, { label: ele.categoryName })
    })
    const cnames = response.filter(ele => ele.parentCategoryNo * 1 === 0) // 取出父集
  let res = response.filter(ele => ele.parentCategoryNo * 1 !== 0) // 取出非父集
  for (const cname of cnames) {
    if (res.filter(ele => ele.parentCategoryNo * 1 === cname.categoryNo * 1).length !== 0) {
      cname.children = res.filter(ele => ele.parentCategoryNo * 1 === cname.categoryNo * 1) // 父集第一层子集
      res = res.filter(ele => ele.parentCategoryNo * 1 !== cname.categoryNo * 1) // 剩余的元素
      if (res.length !== 0) {
        cname.children = childrenReview(cname.children, res)
      }
    }
  }
  return cnames
  }
}

export function childrenReview(child, res) {
  let re = []
  for (const ch of child) {
    if (res.filter(ele => ele.parentCategoryNo * 1 === ch.categoryNo * 1).length !== 0) {
      ch.children = res.filter(ele => ele.parentCategoryNo * 1 === ch.categoryNo * 1)
      re = res.filter(ele => ele.parentCategoryNo * 1 !== ch.categoryNo * 1)
      if (re.length !== 0) {
        ch.children = childrenReview(ch.children, re)
      }
    }
  }
  return child
}

export function getAllAttribute(father, lastChild) {
  const childList = father.filter(ele => ele.categoryNo * 1 === lastChild * 1) // 取出传来的最后一层类目的集
  let allList = []
  // allList.push(childList[0].categoryNo)
  if (childList.lenth && childList[0].parentCategoryNo * 1 !== 0) {
    allList = getLastList(father, childList)
  }
  const value = allList.reverse()
  value.push(lastChild)
  return value
}

export function getLastList(father, childList) {
  const allList = []
  if (father.filter(ele => ele.categoryNo * 1 === childList[0].parentCategoryNo).length !== 0) {
    const lastList = father.filter(ele => ele.categoryNo * 1 === childList[0].parentCategoryNo)
    allList.push(lastList[0].categoryNo)
    if (lastList[0].parentCategoryNo * 1 !== 0) {
      allList.push(...getLastList(father, lastList))
    }
  }
  return allList
}

// 检验数字显示的小数位
export function checkNumeral(text) {
  if (text && text.toString().indexOf('.') !== -1 && text.toString().split('.')[1].length === 1) {
    return numeral(text).format('0,0.0')
  } else if (text && text.toString().indexOf('.') !== -1 && text.toString().split('.')[1].length >= 2) {
    if (Number(text).toFixed(2) !== 'NaN') {
      const decimals = (Number(text).toFixed(2)).toString().split('.')[1]
      if (decimals === '00') {
        return numeral(text).format('0,0')
      } else if (decimals.charAt(1) === '0') {
        return numeral(text).format('0,0.0')
      } else {
        return numeral(text).format('0,0.00')
      }
    } else {
      return text
    }
  } else {
    return numeral(text).format('0,0')
  }
}
