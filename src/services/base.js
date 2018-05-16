import request from '../utils/request'
// import config from '../utils/config'

// 用户列表页
export async function getUserList(params) {
  return request('/base/user/getUserList', {
    method: 'POST',
    body: params,
  })
}

// 数据字典列表页
export async function getDictionary(params) {
  return request('/base/dictionary/getDictionaryList', {
    method: 'POST',
    body: params,
  })
}

// 获取微信用户列表页
export async function getWechatList(params) {
  return request('/base/wechat/getWechatList', {
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

// 获取商品类目列表页
export async function getCategorytList(params) {
  return request('/base/category/getCategorytList', {
    method: 'POST',
    body: params,
  })
}

// 获取软件列表页
export async function getSoftwareList(params) {
  return request('/base/software/getSoftwareList', {
    method: 'POST',
    body: params,
  })
}