import request from '../../utils/request'
import config from '../../utils/config'
import fileExport from '../../utils/fileExport'

/*
 * 库存--采购入库
 */

// 采购入库列表页
export async function getStoDataList(params) {
  if (params && params.startTime) {
    Object.assign(params, { startTime: params.startTime })
  }
  if (params && params.endTime) {
    Object.assign(params, { endTime: params.endTime })
  }
  return request(`${config.APIV1}/wm/WmPurchaseIn/getInStorageList`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 获取仓库列表
export async function toUnPurchaseStorage() {
  return request(`${config.APIV1}/wm/WmPurchaseIn/toUnPurchaseStorage`, {
    method: 'POST',
  })
}

// 采购入库--获取单笔采购入库明细
export async function getStorageDetails(params) {
  return request(`${config.APIV1}/wm/WmPurchaseIn/getInStorageDetailList`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 采购入库--获取采购单列表信息
export async function getBillList(params) {
  return request(`${config.APIV1}/wm/purchase/getPurchaseList`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 采购入库--修改入库单信息
export async function updateInStorage(params) {
  return request(`${config.APIV1}/wm/WmPurchaseIn/updateInStorage`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 采购入库--无采购入库
export async function addUnPurchaseInStorage(params) {
  return request(`${config.APIV1}/wm/WmPurchaseIn/addUnPurchaseInStorage`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 采购入库--采购入库单号和商品唯一编码绑定
export async function addInStorageDetail(params) {
  return request(`${config.APIV1}/wm/WmPurchaseIn/addInStorageDetail`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 采购入库--改变采购单状态
export async function updateInStorageStaus(params) {
  return request(`${config.APIV1}/wm/WmPurchaseIn/updateInStorageStaus`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 采购入库--修改入库单明细
export async function updateInStorageD(params) {
  return request(`${config.APIV1}/wm/WmPurchaseIn/updateInStorageD`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 采购入库--删除入库单
export async function delInStorage(params) {
  return request(`${config.APIV1}/wm/WmPurchaseIn/delInStorage`, {
    method: 'POST',
    body: params,
  })
}

// 采购入库--有采购入库根据billNo生成入库单号
export async function addInStorage(params) {
  return request(`${config.APIV1}/wm/WmPurchaseIn/addInStorage`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 采购入库--导出选中的单据
export async function exportInStorage(params) {
  Object.assign(params, { fileName: '采购入库信息.xls' })
  return fileExport(`${config.APIV1}/wm/WmPurchaseIn/exportInStorage`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 采购入库--检查是否开启精细化管理
export async function getDetail(params) {
  return request(`${config.APIV1}/sym/param/getDetail`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
