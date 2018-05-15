import request from '../../utils/request'
import config from '../../utils/config'

// 订单-订单查询
export async function getSearchInit() {
    return request(`${config.APIV1}/om/orderSplit/toOrderPage`, {
        method: 'POST',
    })
}

// 合并订单- 订单列表获取
export async function getMegerList(params) {
    return request(`${config.APIV1}/om/orderSplit/getMergeList`, {
        method: 'POST',
        body: params,
    })
}
// 订单-订单查询列表信息
export async function getOrderSearchData(params) {
    Object.keys(params).forEach(ele => {
        if (typeof params[ele] === 'string') {
            Object.assign(params, { [ele]: params[ele].trim() })
        }
    })
    let lastParams = {}
    let current = params.current ? params.current : undefined
    let pageSize = params.pageSize ? params.pageSize : undefined
    let flag = false
    delete params.postfix1
    delete params.prefix1
    delete params.postfix2
    delete params.prefix2
    delete params.postfix3
    delete params.prefix3
    delete params.timeField
    // console.log('1次处理后的', params)
    if(params.buyerMsg === 1 && params.sellerMsg === 1 && params.orderFlag === 0 && params.orderLabel === 0) {
        delete params.buyerMsg
        delete params.sellerMsg
        delete params.orderFlag
        delete params.orderLabel
    }
    // console.log('2次处理后的', params)

    Object.keys(params).forEach(ele => {
        if (typeof params[ele] === 'string' && params[ele] !== '') {
            flag = true
        } else if (typeof params[ele] === 'object' && params[ele].length !== 0) {
            flag = true
        } else if (typeof params[ele] === 'number' && ele !== 'current' && ele !== 'pageSize') {
            flag = true
        }
    })
    if (flag) {
        lastParams = params
    } else {
        Object.assign(lastParams, { current, pageSize, orderStatuses: ['0', '1', '2', '3', '4', '10', '20'] })
    }
    if (lastParams.startTime) {
        Object.assign(lastParams, lastParams.startTime.format('YYYY-MM-DD'))
    }
    if (lastParams.endTime) {
        Object.assign(lastParams, lastParams.endTime.format('YYYY-MM-DD'))
    }
    return request(`${config.APIV1}/om/orderSplit/getOmOrderList`, {
        method: 'POST',
        body: lastParams,
    })
}

// 合并订单- 合并
export async function mergeOr(params) {
    return request(`${config.APIV1}/om/orderSplit/mergeOrder`, {
        method: 'POST',
        body: params,
    })
}

// 合并订单- 还原成合并前
export async function returnBeforeMarge(params) {
    return request(`${config.APIV1}/om/orderSplit/returnBeforeMarge `, {
        method: 'POST',
        body: params,
    })
}

// 订单-获取单笔商品明细
export async function getOrderDetail(params) {
    return request(`${config.APIV1}/om/omOrder/selectOrderDInfo`, {
        method: 'POST',
        body: params,
    })
}

// 拆分订单- 订单列表获取
export async function getSplitList(params) {
    return request(`${config.APIV1}/om/orderSplit/getSplitlist`, {
        method: 'POST',
        body: params,
    })
}

// 拆分订单- 拆分
export async function splitOr(params) {
    return request(`${config.APIV1}/om/orderSplit/splitOrder`, {
        method: 'POST',
        body: params,
    })
}
// 订单-设定订单审核时自动计算快递公司
export async function getAutCalculate() {
    return request('/om/order/getAutCalculate', {
        method: 'POST',
    })
}

// 订单更新统计
export async function updateOrderStatistics() {
    return request(`${config.APIV1}/om/orderSplit/updateOrderStatistics`, {
        method: 'POST',
    })
}
// 获取查询池list
export async function getOmQueryPoolList(params) {
    return request(`${config.APIV1}/om/orderSplit/getOmQueryPoolList`, {
        method: 'POST',
        body: params,
    })
}
// 查询池增加参数
export async function addOmQueryPool(params) {
    return request(`${config.APIV1}/om/orderSplit/addOmQueryPool`, {
        method: 'POST',
        body: params,
    })
}

export async function delOmQueryPool(params) {
    return request(`${config.APIV1}/om/orderSplit/delOmQueryPool`, {
        method: 'POST',
        body: params,
    })
}

// 订单查询-修改/标记
export async function editOrderMark(params) {
  return request(`${config.APIV1}/om/omOrder/editOrder`, {
    method: 'POST',
    body: params,
  })
}

// 以下江腾
//  订单查询-获取店铺
export async function getShop(params) {
    return request(`${config.APIV1}/om/omOrder/getShop`, {
        method: 'POST',
        body: params,
    })
}

export async function getShopOrder(params) {
    return request(`${config.APIV1}/om/orderSplit/getShops`, {
        method: 'POST',
        body: params,
    })
}

//  订单查询-新增订单-手动下单
export async function insertOrderInfo(params) {
    return request(`${config.APIV1}/om/omOrder/insertOrderInfo`, {
        method: 'POST',
        body: {
          ...params,
        },
    })
}

// 订单查询-新增订单-线上订单号唯一性查询
export async function checkSiteOrderNo(params) {
    return request(`${config.APIV1}/om/omOrder/checkOrder`, {
        method: 'POST',
        body: params,
    })
}

// 订单查询-订单下载-按时间和按订单编号
export async function autoDownSave(params) {
    return request(`${config.APIV1}/om/downloadorder/autoDownSave`, {
        method: 'POST',
        body: params,
    })
}

// 订单详情修改订单主体信息
export async function updateOrder(params) {
    return request(`${config.APIV1}/om/omOrder/updateOrder`, {
        method: 'POST',
        body: params,
    })
}

// 审核确认
export async function updateOrderReview(params) {
    return request(`${config.APIV1}/om/omOrder/updateOrderReview`, {
        method: 'POST',
        body: params,
    })
}

// 取消异常标记
export async function cancelAbnormal(params) {
    return request(`${config.APIV1}/om/omOrder/updateTurnNormal`, {
        method: 'POST',
        body: params,
    })
}
// 新增商品
export async function insertOrderDInfo(params) {
    return request(`${config.APIV1}/om/omOrder/insertOrderDInfo`, {
        method: 'POST',
        body: params,
    })
}
// 设置订单快递
export async function updateSetTheCourier(params) {
    return request(`${config.APIV1}/om/omOrder/updateSetTheCourier`, {
        method: 'POST',
        body: params,
    })
}

// 获取异常信息
export async function getAbnormal() {
    return request(`${config.APIV1}/om/omOrder/getAbnormal`, {
        method: 'POST',
    })
}

// 订单转异常
export async function updateTurnException(params) {
    return request(`${config.APIV1}/om/omOrder/updateTurnException`, {
        method: 'POST',
        body: params,
    })
}

// 订单转正常
export async function updateTurnNormal(params) {
    return request(`${config.APIV1}/om/omOrder/updateTurnNormal`, {
        method: 'POST',
        body: params,
    })
}

// 取消订单
export async function updateOrderNoCancel(params) {
    return request(`${config.APIV1}/om/omOrder/updateOrderNoCancel`, {
        method: 'POST',
        body: params,
    })
}

// 删除订单明细
export async function deleteOrderD(params) {
    return request(`${config.APIV1}/om/omOrder/deleteOrderD`, {
        method: 'POST',
        body: params,
    })
}

// 价格数量编辑和保存
export async function updateOrderDeditor(params) {
    return request(`${config.APIV1}/om/omOrder/updateOrderDeditor`, {
        method: 'POST',
        body: params,
    })
}

// 维护自定义异常
export async function insertCustomException(params) {
    return request(`${config.APIV1}/om/omOrder/insertCustomException`, {
        method: 'POST',
        body: params,
    })
}

// 重新计算并添加赠品
export async function calcOrderGift(params) {
    return request(`${config.APIV1}/om/omGiftStrategy/calcOrderGift`, {
        method: 'POST',
        body: params,
    })
}

// 获取单条明细
export async function selectOrderNo(params) {
    return request(`${config.APIV1}/om/omOrder/selectOrderNo`, {
        method: 'POST',
        body: params,
    })
}

// 添加手工支付
export async function insertManualPaySingle(params) {
    return request(`${config.APIV1}/om/omOrder/insertManualPaySingle`, {
        method: 'POST',
        body: params,
    })
}

// 修改支付状态
export async function updatePaySingleReview(params) {
    return request(`${config.APIV1}/om/omOrder/updatePaySingleReview`, {
        method: 'POST',
        body: params,
    })
}

// 获取禁止的商品列表
export async function getForbidList() {
    return request(`${config.APIV1}/om/omOrder/selectProductLimit`, {
        method: 'POST',
    })
}

// 获取取消描述
export async function cancelDesc(params) {
    return request(`${config.APIV1}/sym/dictionary/gitByDictType`, {
      method: 'POST',
      body: params,
  })
}

// 唯品会接单查询
export async function vipOrderSearch(params) {
    return request(`${config.APIV1}/om/vippoorder/search`, {
      method: 'POST',
      body: params,
  })
}

// 获取店铺
export async function getDistributorList() {
    return request(`${config.APIV1}/dm/dmfundsummary/getDistributorList`, {
      method: 'POST',
  })
}

// 财务审核
export async function orderFinancialReview(params) {
    return request(`${config.APIV1}/om/orderSplit/orderFinancialReview`, {
      method: 'POST',
      body: params,
  })
}

// 财务审核打回并转异常
export async function orderFinException(params) {
    return request(`${config.APIV1}/om/orderSplit/orderFinException`, {
      method: 'POST',
      body: params,
  })
}

// 获取日志
export async function selectOrderNoLog(params) {
    return request(`${config.APIV1}/om/omOrder/selectOrderNoLog`, {
      method: 'POST',
      body: params,
  })
}

// 获取多个订单号
export async function getOrderMergeQuery(params) {
    return request(`${config.APIV1}/om/omOrder/getOrderMergeQuery`, {
      method: 'POST',
      body: params,
  })
}

// 拆开组合装商品
export async function splitOrderCombo(params) {
    return request(`${config.APIV1}/om/omGiftStrategy/splitOrderCombo`, {
      method: 'POST',
      body: params,
  })
}

// 获取订单快递
export async function getExpresscorp() {
    return request(`${config.APIV1}/om/omOrder/getExpress`, {
      method: 'POST',
  })
}