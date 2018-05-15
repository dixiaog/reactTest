import request from '../../utils/request'
import config from '../../utils/config'
import fileExport from '../../utils/fileExport'

/*
 * 库存--采购管理
 */

// 采购管理列表页--获取数据
export async function getPurData(params) {
  if (params.timeStatus === undefined || params.timeStatus === '0') {
    if (params.createTime) {
      Object.assign(params, { billDateFrom: params.createTime.format('YYYY-MM-DD') })
    }
    if (params.endTime) {
      Object.assign(params, { billDateTo: params.endTime.format('YYYY-MM-DD') })
    }
  } else {
    if (params.createTime) {
      Object.assign(params, { approveTimeFrom: params.createTime.format('YYYY-MM-DD') })
    }
    if (params.endTime) {
      Object.assign(params, { approveTimeTo: params.endTime.format('YYYY-MM-DD') })
    }
  }
  delete params.createTime
  delete params.endTime
  delete params.timeStatus
  return request(`${config.APIV1}/wm/purchase/getPurchaseList`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 采购管理列表页--查询数据
export async function getPurDataSearch(params) {
  if (params.timeStatus === undefined || params.timeStatus === '0') {
    if (params.createTime) {
      Object.assign(params, { billDateFrom: params.createTime.format('YYYY-MM-DD') })
    }
    if (params.endTime) {
      Object.assign(params, { billDateTo: params.endTime.format('YYYY-MM-DD') })
    }
  } else {
    if (params.createTime) {
      Object.assign(params, { approveTimeFrom: params.createTime.format('YYYY-MM-DD') })
    }
    if (params.endTime) {
      Object.assign(params, { approveTimeTo: params.endTime.format('YYYY-MM-DD') })
    }
  }
  delete params.createTime
  delete params.endTime
  delete params.timeStatus
  return request(`${config.APIV1}/wm/purchase/getPurchaseList`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}


// 获取待选择的商品列表
export async function getGoodList(params) {
  return request('/inventory/pur/getGoodList', {
    method: 'POST',
    body: params,
  })
}

// 获取新增后的商品信息 goodModal
export async function getGoodModal(params) {
  return request(`${config.APIV1}/wm/purchase/getPurchaseDList`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 点击获取气泡框数据
export async function getProductPop(params) {
  return request(`${config.APIV1}/wm/purchase/getPurchaseDList`, {
    method: 'POST',
    body: params,
  })
}

// 采购管理--新增/编辑采购
export async function savePurchase(params) {
  return request(`${config.APIV1}/wm/purchase/savePurchase`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}


// 采购管理--采购员
export async function getPurchaseUser() {
  return request(`${config.APIV1}/wm/purchase/getPurchaseUser`, {
    method: 'POST',
  })
}

// 采购管理--编辑保存
export async function editPurchase(params) {
  return request(`${config.APIV1}/wm/purchase/editPurchase`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 采购管理--单条明细新增商品
export async function savePurchaseD(params) {
  return request(`${config.APIV1}/wm/purchase/savePurchaseD`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 采购管理--更新状态
export async function updateStatus(params) {
  return request(`${config.APIV1}/wm/purchase/updateStatus`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 采购管理--删除采购单明细
export async function delPurchaseD(params) {
  return request(`${config.APIV1}/wm/purchase/delPurchaseD`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 采购管理--采购单明细编辑保存
export async function editPurchaseD(params) {
  return request(`${config.APIV1}/wm/purchase/editPurchaseD`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 采购入库--导出选中的单据
export async function purchaseExport(params) {
  Object.assign(params, { fileName: '采购管理信息.xls' })
  return fileExport(`${config.APIV1}/wm/purchase/exportSku`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 采购入库--导出选中的单据
export async function exportAllSku(params) {
  Object.assign(params, { fileName: '采购管理信息.xls' })
  return fileExport(`${config.APIV1}/wm/purchase/exportAllSku`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 采购管理--上传
export async function upload(params) {
  console.log('params', params)
  return request(`${config.APIV1}/wm/purchase/uploadToAfsAndScm`, {
    method: 'POST',
    body: params,
  })
}