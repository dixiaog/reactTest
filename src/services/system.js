import request from '../utils/request'
// import config from '../utils/config'

// 角色列表页
export async function getRoleList(params) {
  return request('/system/roleList/getRoleList', {
    method: 'POST',
    body: params,
  })
}

// 获取角色已选资源
export async function getChoosePowers(params) {
  // return request('/system/roleList/getRoleList', {
  //   method: 'POST',
  //   body: params,
  // })
}

// 获取编辑角色信息
export async function getChooseData(params) {
  // return request('/system/roleList/getRoleList', {
  //   method: 'POST',
  //   body: params,
  // })
}
