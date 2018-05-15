import request from '../../utils/request'
import config from '../../utils/config'

// 分销商品限定
export async function getProductLimit(params) {
    return request(`${config.APIV1}/dm/productLimit/getDmProductLimitData`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
}

// 删除分销商品限定
export async function deleteProductLimit(params) {
    return request(`${config.APIV1}/dm/productLimit/delete`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
}

// 添加/编辑分销商品限定
export async function saveProductLimit(params) {
    return request(`${config.APIV1}/dm/productLimit/save`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
}

export async function getChooseData(params) {
  return request(`${config.APIV1}/dm/productLimit/getByAutoNo`, {
      method: 'POST',
      body: params,
  })
}
