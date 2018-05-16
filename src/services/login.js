import request from '../utils/request'
import config from '../utils/config'

// 登录
export async function fakeAccountLogin(params) {
  return request('/umi/login', {
    method: 'POST',
    body: params,
  })
}

// 获取菜单
// export async function getMenus(params) {
//   return request(`${config.APIV1}/MyAuthority/getMenusByUserName`, {
//     method: 'POST',
//     body: params,
//   })
// }
