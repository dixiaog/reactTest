/*
 * @Author: tanmengjia
 * @Date: 2018-02-07 15:37:01
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-02-13 14:14:07
 * 特殊单策略获取数据
 */
import moment from 'moment'
import { getUrlParams } from '../../utils'

export function specialPrice(count) {
    const data = []
      data.push({
        strategyNo: 1,
        buyerKeyword: '买家',
        sellerKeyword: '卖家',
        specifyFlag: [3, 4],
        specifyShop: [20, 25],
        beginTime: moment().format('YYYY-MM-DD'),
        endTime: moment().format('YYYY-MM-DD'),
        addressKeyword: '地址1,地址2',
      })
    // if (searchParam && searchParam.enableStatus) {
    //   list = list.filter(ele => ele.enableStatus.indexOf(searchParam.enableStatus) > -1)
    // }
    return { data }
  }
  export function getSpecialStrategy(req, res, u, b) {
    let url = u
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url // eslint-disable-line
    }
    // const result = itemList(count)
    const result = specialPrice()
    if (res && res.json) {
      res.json(result)
    } else {
      return result
    }
  }

  export default {
    getSpecialStrategy,
}


/**
 * 特殊单策略新增|编辑
 * param:
 * {
 *    companyNo://公司编号
 * }
 * return:
 * {
 *  strategyName; //策略名称
    specifyShop; //适用店铺(逗号分隔多店铺,不设定默认为全部店铺)
    beginTime; //开始有效期
    endTime; //结束有效期
    buyerKeyword; //买家留言包含(逗号分隔多关键字)
    sellerKeyword; //卖家留言包含(逗号分隔多关键字)
    addressKeyword; //收货地址包含(逗号分隔多关键字)
    specifyFlag; //备注包含小旗(逗号分隔多色小旗,小旗类型[1:红色 2:黄色 3:绿色 4:蓝色 5:紫色])
    companyNo; //公司编号
 * }
 */