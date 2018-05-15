import request from '../utils/request'
import config from '../utils/config'
import fileExport from '../utils/fileExport'


// 获取组合商品子商品
export async function getData(params) {
  return request(`${config.APIV1}/prodm/combo/getComboSkuNo`, {
    method: 'POST',
    body: params,
  })
}

// 普通商品资料，获取普通商品列表
export async function getCommonItem(params) {
  return request(`${config.APIV1}/prodm/ceneralsku/list`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 组合商品资料，导出商品
export async function exportSkuItem(params) {
  return fileExport(`${config.APIV1}/prodm/combo/listExport`, {
      method: 'POST',
      body: {
      ...params,
      },
  })
}

// 普通商品资料，导出符合条件的商品
export async function exportCommonItem(params) {
  return fileExport(`${config.APIV1}/prodm/ceneralsku/export`, {
      method: 'POST',
      body: {
      ...params,
      },
  })
}

// 普通商品资料，导出选中的商品
export async function exportCommonItem1(params) {
  return fileExport(`${config.APIV1}/prodm/ceneralsku/selectedExportSku`, {
      method: 'POST',
      body: {
      ...params,
      },
  })
}

// 普通商品资料，新增普通商品
export async function commonSave(params) {
  return request(`${config.APIV1}/prodm/ceneralsku/save`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 普通商品资料，新增普通商品时的商品分类第一层
export async function getItemClass(params) {
  return request(`${config.APIV1}/prodm/sku/getAllRoot`, {
      method: 'POST',
      body: {
      ...params,
      },
  })
}

// 普通商品资料，新增普通商品时的商品分类子层
export async function getClassChildren(params) {
  return request(`${config.APIV1}/prodm/sku/getDeepChildrenCategory`, {
      method: 'POST',
      body: {
      ...params,
      },
  })
}

// 组合商品资料，将组合商品转化为普通商品
export async function turnToOrdinary(params) {
  return request(`${config.APIV1}/prodm/combo/turnToOrdinary`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 组合商品资料，获取组合商品列表
export async function getCombinationItem(params) {
  return request(`${config.APIV1}/prodm/combo/getBdSku`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 组合商品资料，保存组合商品基本信息
export async function Save(params) {
 return request(`${config.APIV1}/prodm/combo/save`, {
   method: 'POST',
   body: {
     ...params,
   },
 })
}

// 普通商品资料，仓位与商品关系，获得商品列表
export async function getLocationItem(params) {
  return request(`${config.APIV1}/prodm/ceneralsku/countGetStorageLocation`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
 }

export async function binding(params) {
  return request(`${config.APIV1}/prodm/ceneralsku/binding`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 组合商品资料，获得需要选择的普通商品
export async function getChooseItem(params) {
  return request(`${config.APIV1}/prodm/combo/selectByManyCondition`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 组合商品资料，删除组合商品的子商品
export async function getCombinationDelete(params) {
  return request(`${config.APIV1}/prodm/combo/delete`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 组合商品资料，保存组合商品
export async function saveSkus(params) {
  return request(`${config.APIV1}/prodm/combo/editSave`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 普通商品资料，启用/备用/禁用
export async function getCommonEnable(params) {
  return request(`${config.APIV1}/prodm/ceneralsku/enableStatus`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

export async function relievebinding(params) {
  return request(`${config.APIV1}/prodm/ceneralsku/relievebinding`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

export async function deleteBdStorageLocation(params) {
  return request(`${config.APIV1}/prodm/ceneralsku/deleteBdStorageLocation`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

export async function deleteBDBySku(params) {
  return request(`${config.APIV1}/prodm/ceneralsku/deleteBDBySku`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 普通商品转化为组合商品
export async function turnToMerge(params) {
  return request(`${config.APIV1}/prodm/combo/turnToMerge`, {
    method: 'POST',
    body: params,
  })
}
