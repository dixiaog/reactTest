
import request from '../../utils/request'
import config from '../../utils/config'
import fileExport from '../../utils/fileExport'

/*
 * 供销-供销商
 */

// 供销-供销商列表页
export async function getSupPriceData(params) {
  return request(`${config.APIV1}/dm/priceDiscount/getSkuData`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 供销-获取默认折扣率数据
export async function getDefaultData(params) {
  return request(`${config.APIV1}/dm/priceDiscount/getPriceDiscountData`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 供销-设定默认供销折扣率
export async function addDefaultRate(params) {
  return request(`${config.APIV1}/dm/priceDiscount/save`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 供销-批量调整分销价格
export async function batchEdit(params) {
  return request(`${config.APIV1}/dm/priceDiscount/batchEdit`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 供销-下载模板
export async function downloadTemplate() {
  const params = { fileName: '商品供销价格模板.xls' }
  return fileExport(`${config.APIV1}/dm/priceDiscount/downloadTemplate`, {
    method: 'POST',
    body: params,
  })
}

// 供销-导出所有符合条件的单据
export async function exportDB(params) {
  Object.assign(params, { fileName: '商品供销价格资料.xls' })
  return fileExport(`${config.APIV1}/dm/priceDiscount/exportDB`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 供销-编辑保存
export async function listEdit(params) {
  return request(`${config.APIV1}/dm/priceDiscount/listEdit`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
