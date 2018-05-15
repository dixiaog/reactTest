import { getUrlParams } from '../../utils'

export function shopName(count, searchParam) {
    let list = []
    for (let i = 0; i < count; i += 1) {
      list.push({
        autoNo: `${i}`,
        shopName: `fake-list-${i}`,
        shopNo: `${i}`,
      })
    }
    if (searchParam && searchParam.autoNo) {
      list = list.filter(ele => ele.autoNo.indexOf(searchParam.autoNo) > -1)
    }
    if (searchParam && searchParam.shopName) {
      list = list.filter(ele => ele.shopName.indexOf(searchParam.shopName) > -1)
    }
    // if (searchParam && searchParam.enableStatus) {
    //   list = list.filter(ele => ele.enableStatus.indexOf(searchParam.enableStatus) > -1)
    // }
    return { list, total: count }
  }

  export function getShopName(req, res, u, b) {
    let url = u
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url // eslint-disable-line
    }
    const body = (b && b.body) || req.body
    const { searchParam } = body
    const params = getUrlParams(url)
    const count = (params.count * 1) || 20
    // const result = itemList(count)
    const result = shopName(count, searchParam)
    if (res && res.json) {
      res.json(result)
    } else {
      return result
    }
  }

  export default {
    getShopName,
}
