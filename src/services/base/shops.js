import request from '../../utils/request'
import config from '../../utils/config'

// 获取淘宝地址
export async function getAddress(params) {
  return request(`${config.APIV1}/basem/bdshop/searchAddress`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}