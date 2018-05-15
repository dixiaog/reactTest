import request from '../../utils/request'
import config from '../../utils/config'

// 获取唯品会出仓单列表
export async function getVipOutWh(params) {
  console.log('获取唯品会出仓单列表', params)
  return request(`${config.APIV1}/wm/WmVipDelivery/list`, {
      method: 'POST',
      body: {
      ...params,
      },
  })
}

// 获取唯品会出仓单明细列表
export async function getVipOutWhDetail(params) {
  return request(`${config.APIV1}/wm/WmVipDeliveryD/list`, {
      method: 'POST',
      body: {
      ...params,
      },
  })
}

// 获取编辑数据
export async function getChooseData(params) {
  // return request(`${config.APIV1}/prodm/sku/getSkuData`, {
  //     method: 'POST',
  //     body: params,
  // })
}

// 获取唯品会店铺
export async function getShopName(params) {
  // return request(`${config.APIV1}/wm/WmVipDelivery/shopList`, {
  return request(`${config.APIV1}/prodm/vipShop/sku/getAllVipShop`, {
    method: 'POST',
    body: {
    ...params,
    },
  })
}

// 获取承运商
export async function getExpressCorp(params) {
  return request(`${config.APIV1}/wm/WmVipDelivery/carrierList`, {
    method: 'POST',
    body: params,
  })
}

// VIP发货单新增/编辑保存
export async function addVipOut(params) {
  console.log('VIP发货单新增', params)
  return request(`${config.APIV1}/wm/WmVipDelivery/addSave`, {
    method: 'POST',
    body: {
    ...params,
    },
  })
}

export async function edit(params) {
  console.log('VIP发货单编辑', params)
  return request(`${config.APIV1}/wm/WmVipDelivery/edit`, {
      method: 'POST',
      body: {
      ...params,
      },
  })
}

// 子页面批量删除
export async function deleteAll(params) {
  return request(`${config.APIV1}/wm/WmVipDelivery/delete`, {
      method: 'POST',
      body: params,
  })
}

// 子页面单独上传
export async function chooseUpload(params) {
  return request(`${config.APIV1}/wm/WmVipDelivery/importDetail`, {
      method: 'POST',
      body: params,
  })
}

// 获取仓库
export async function getWarehouse(params) {
  // return request(`${config.APIV1}/basem/warehouse/getWarehouse`, {
  return request(`${config.APIV1}/wm/WmVipDelivery/shopWarehouseList`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 获取PO
export async function getPO(params) {
  return request(`${config.APIV1}/wm/WmVipDeliveryD/selectOmVipPick`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 获取出库单
export async function getOut(params) {
  return request(`${config.APIV1}/wm/WmVipDeliveryD/selectWmDelivery`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 获取装箱明细
export async function getDetails(params) {
  return request(`${config.APIV1}/wm/WmVipDeliveryD/deliveryBarcodeInfo`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 主页面上传明细
export async function upload(params) {
  console.log('主页面上传明细', params)
  return request(`${config.APIV1}/wm/WmVipDelivery/importDetail`, {
    method: 'POST',
    body: params,
  })
}

// 确认发货
export async function okDelivery(params) {
  console.log('确认发货', params)
  return request(`${config.APIV1}/wm/WmVipDelivery/confirm`, {
    method: 'POST',
    body: params,
  })
}

// 取消
export async function cancel(params) {
  console.log('取消', params)
  return request(`${config.APIV1}/wm/WmVipDelivery/cancel`, {
    method: 'POST',
    body: params,
  })
}

// 作废并下次不选
export async function deleteNoSelect(params) {
  // return request(`${config.APIV1}/basem/warehouse/getWarehouse`, {
  //   method: 'POST',
  //   body: {
  //     ...params,
  //   },
  // })
}

// 确认选择出库单
export async function yesChoose(params) {
  return request(`${config.APIV1}/wm/WmVipDeliveryD/createVipDeliveryD`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
