import request from '../../utils/request'
import config from '../../utils/config'

// 售后查询列表页
export async function getAfterList(params) {
    Object.keys(params).forEach(ele => {
      if (typeof params[ele] === 'string') {
        Object.assign(params, { [ele]: params[ele].trim() })
      }
    })
    return request(`${config.APIV1}/aftersale/omaftersale/search`, {
      method: 'POST',
      body: params,
  })
}

// 售后查询---绑定售后单--列表页
export async function selectAfterList(params) {
  if (params && params.startTime) {
    Object.assign(params, { startTime: params.startTime.format('YYYY-MM-DD') })
  }
  if (params && params.endTime) {
    Object.assign(params, { endTime: params.endTime.format('YYYY-MM-DD') })
  }
    return request(`${config.APIV1}/as/afterSaleBinding/selectAfterList`, {
      method: 'POST',
      body: params,
  })
}


// 绑定订单---查询商品信息
export async function getChildList(params) {
    return request(`${config.APIV1}/as/afterSaleBinding/selectByOrderNo`, {
      method: 'POST',
      body: params,
  })
}

// 售后查询---获取单笔售后单的信息
export async function viewData(params) {
    return request(`${config.APIV1}/aftersale/omaftersale/viewData`, {
      method: 'POST',
      body: params,
  })
}

// 获取退款原因
export async function getRefundReason(params) {
    return request(`${config.APIV1}/sym/dictionary/gitByDictType`, {
      method: 'POST',
      body: params,
  })
}

// 编辑保存售后单
export async function detailPageEdit(params) {
    return request(`${config.APIV1}/aftersale/omaftersale/detailPageEdit`, {
      method: 'POST',
      body: params,
  })
}

// 主页面编辑保存
export async function homePageEdit(params) {
    return request(`${config.APIV1}/aftersale/omaftersale/homePageEdit`, {
      method: 'POST',
      body: params,
  })
}

// 创建新的售后单列表页
export async function selectOrderList(params) {
  return request(`${config.APIV1}/as/createneworder/selectOrderList`, {
    method: 'POST',
    body: params,
  })
}


// 售后查询-售后单下载-按时间和按订单编号
export async function autoDownSave(params) {
  return request(`${config.APIV1}/as/createneworder/mannalDownloadOrderByNo`, {
      method: 'POST',
      body: params,
  })
}

// 售后查询-新增售后单
export async function insertNewOrderList(params) {
  return request(`${config.APIV1}/as/createneworder/insertNewOrderList`, {
      method: 'POST',
      body: params,
  })
}

// 售后查询-绑定订单
export async function updateAsAfterSaleOrderNo(params) {
  return request(`${config.APIV1}/as/afterSaleBinding/updateAsAfterSaleOrderNo`, {
      method: 'POST',
      body: params,
  })
}


// 售后查询-同意退货/拒绝退货
export async function agreeReturnGoods(params) {
  return request(`${config.APIV1}/as/afterSaleBinding/agreeReturnGoods`, {
      method: 'POST',
      body: params,
  })
}

// 售后查询-生成换货订单
export async function insertOrderSwapInfo(params) {
  return request(`${config.APIV1}/as/asOrderSwap/insertOrderSwapInfo`, {
      method: 'POST',
      body: params,
  })
}

// 售后查询-生成换货订单获取商品信息
export async function selectBdSkuByAsOrderNo(params) {
  return request(`${config.APIV1}/as/asOrderSwap/selectBdSkuByAsOrderNo`, {
      method: 'POST',
      body: params,
  })
}

// 售后查询-售后确认
export async function confirmOrderAfterInfo(params) {
  return request(`${config.APIV1}/as/asOrderSwap/confirmOrderAfterInfo`, {
      method: 'POST',
      body: params,
  })
}

// 售后查询-售后作废
export async function cancelOrderAfterInfo(params) {
  return request(`${config.APIV1}/as/asOrderSwap/cancelOrderAfterInfo`, {
      method: 'POST',
      body: params,
  })
}
