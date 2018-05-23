import request from '../utils/request'
// import config from '../utils/config'

// 用户列表页
export async function getUserList(params) {
  return request('/base/user/getUserList', {
    method: 'POST',
    body: params,
  })
}

// 获取店铺管理列表页
export async function getShoptList(params) {
  return request('/base/shop/getShopList', {
    method: 'POST',
    body: params,
  })
}