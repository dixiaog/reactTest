import request from '../../utils/request'
import config from '../../utils/config'


// 获取售后商品明细
export async function getAfterSkus(params) {
    return request(`${config.APIV1}/as/scanCheckIn/getCreditLineByAutoNo`, {
        method: 'POST',
        body: {
            ...params,
            },
    })
}

// 确认收货
export async function takeGoods(params) {
    return request(`${config.APIV1}/as/scanCheckIn/okTakeGoods`, {
        method: 'POST',
        body: {
            ...params,
          },
    })
}

// 增加本次退货
export async function getSkuDetail(params) {
  return request(`${config.APIV1}/as/scanCheckIn/scanProductBarcode`, {
    method: 'POST',
    body: {
        ...params,
        },
  })
}
