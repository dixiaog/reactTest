/*
 * @Author: Wupeng
 * @Date: 2018-1-8 15:57:28
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-03-06 16:13:50
 * 仓位资料维护
 */
import request from '../../utils/request'
import config from '../../utils/config'

// 树状图行列层格  selStoragelocationGroupByhlcg
export async function selStoragelocationGroupByhlcg(params) {
  return request(`${config.APIV1}/prodem/storagelocation/selStoragelocationGroupByhlcg`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
// updStoragelocationPickingPriority 这个是点击仓位拣货优先级保存的接口
export async function updStoragelocationPickingPriority(params) {
  return request(`${config.APIV1}/prodem/storagelocation/updStoragelocationPickingPriority`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
// selStoragelocationBylocationNos 这个是点击仓位条码打印
export async function selStoragelocationBylocationNos(params) {
  return request(`${config.APIV1}/prodem/storagelocation/selStoragelocationBylocationNos`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}


// selStoragelocationPickingPriority 这个是点击仓位拣货优先级查询的接口
export async function selStoragelocationPickingPriority(params) {
  return request(`${config.APIV1}/prodem/storagelocation/selStoragelocationPickingPriority`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
// previewStoragelocationPickingPriority 仓位拣货优先级预览
export async function previewStoragelocationPickingPriority(params) {
  return request(`${config.APIV1}/prodem/storagelocation/previewStoragelocationPickingPriority`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 左侧树状图 selStoragelocationGroupByAreaNo
export async function selStoragelocationGroupByAreaNo(params) {
  return request(`${config.APIV1}/prodem/storagelocation/selStoragelocationGroupByAreaNo`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
// selStoragelocationBylocationNo
export async function selStoragelocationBylocationNo(params) {
  return request(`${config.APIV1}/prodem/storagelocation/selStoragelocationBylocationNo`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
 /* /prodem/storagelocation/unbindGoods
 仓库资料维护 主页面-解绑商品
 */
export async function unbindGoods(params) {
  return request(`${config.APIV1}/prodem/storagelocation/unbindGoods`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 仓库资料维护 主页面-启用/禁用
export async function updateEnableStatus(params) {
  return request(`${config.APIV1}/prodem/storagelocation/updateEnableStatus`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 仓库资料维护 主页面-删除仓库
export async function deleteStorageLocationByNos(params) {
  return request(`${config.APIV1}/prodem/storagelocation/deleteStorageLocationByNos`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
// 仓位资料维护 新增  insertStoragelocation
export async function insertStoragelocation(params) {
return request(`${config.APIV1}/prodem/storagelocation/insertStoragelocation`, {
  method: 'POST',
  body: {
    ...params,
  },
})
}

// 仓库资料维护 主页面-搜索

export async function selStoragelocation(params) {
  return request(`${config.APIV1}/prodem/storagelocation/selStoragelocation`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

