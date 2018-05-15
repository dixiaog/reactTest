import request from '../../utils/request'
import fileExport from '../../utils/fileExport'
import requestExtension from '../../utils/requestExtension'
import config from '../../utils/config'

// 拣货批次管理--获取数据
export async function getBatchSummary(params) {
    return request(`${config.WMS}/wms/wm/pickBatch/getBatchSummary`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
  }

  // 拣货批次管理--获取操作人员
export async function getOperateUser(params) {
    return request(`${config.WMS}/wms/wm/pickBatch/getOperateUser`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
  }

    // 拣货批次管理--获取拣货批次任务
export async function getarrangePickTaskInfo(params) {
  return request(`${config.WMS}/wms/wm/pickBatch/getarrangePickTaskInfo`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 拣货批次管理--安排|重新安排拣货批次任务
export async function distributionPickTask(params) {
  return request(`${config.WMS}/wms/wm/pickBatch/distributionPickTask`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 拣货批次管理--获取单品种类数
export async function getSingleProductInfo(params) {
  return request(`${config.WMS}/wms/wm/pickBatch/getSingleProductInfo`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 拣货批次管理--获取单品种类数
export async function getBatchDetailInfo(params) {
  return request(`${config.WMS}/wms/wm/pickBatch/getBatchDetailInfo`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 拣货批次管理--获取单品种类数
export async function toRelay(params) {
  return request(`${config.WMS}/wms/wm/relay/toRelay`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}



// 拣货批次管理--导出单品种类数
export async function exportSingleProduct(params) {
  return fileExport(`${config.WMS}/wms/wm/pickBatch/exportSingleProduct`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
// 导出商品总数
export async function exportBatchDetail(params) {
  return fileExport(`${config.WMS}/wms/wm/pickBatch/exportBatchDetail`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}



// 拣货批次管理--结束任务
export async function endTask(params) {
  return request(`${config.WMS}/wms/wm/pickBatch/endTask`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 拣货批次管理--修改标志
export async function updateBatchMark(params) {
  return request(`${config.WMS}/wms/wm/pickBatch/updateBatchMark`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 生成拣货批次
export async function pickUpBatch(params) {
  return request(`${config.WMS}/wm/wmDelivery/pickUpBatch`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 导出批次拣货订单
export async function exportOrderInfo(params) {
  return fileExport(`${config.WMS}/wms/wm/pickBatch/exportOrderInfo`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
// 导出批次拣货信息
export async function exportPickInfo(params) {
  return fileExport(`${config.WMS}/wms/wm/pickBatch/exportPickInfo`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}


// 拣货批次管理--一单一件整存生成批次
export async function zcGenerateBatch(params) {
  return requestExtension(`${config.WMS}/wm/wmDelivery/zcGenerateBatch`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 拣货批次管理--一单一件零检生成批次
export async function ljGenerateBatch(params) {
  return requestExtension(`${config.WMS}/wm/wmDelivery/zeroPickGeneratingBatch`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 拣货批次管理--一单一件整存导出
export async function zcExport(params) {
  return fileExport(`${config.WMS}/wm/wmDelivery/zcExport`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 拣货批次管理--唯品会批次导出
export async function vipExport(params) {
  return fileExport(`${config.WMS}/wms/wm/vip/vipExport`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
// 拣货批次管理--一单一件零检导出
export async function ljExport(params) {
  return fileExport(`${config.WMS}/wm/wmDelivery/zeroPickExport`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 生成补货批次
export async function getCreateRestocking(params) {
  return request(`${config.WMS}/wms/wm/pickBatch/getCreateRestocking`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}


// 获取缺货批次批次
export async function getBillNoByInfo(params) {
  return request(`${config.WMS}/wms/wm/pickBatch/getBillNoByInfo`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 生成补货
export async function createRestocking(params) {
  return request(`${config.WMS}/wms/wm/pickBatch/createRestocking`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 生成多件导出
export async function djExport(params) {
  return fileExport(`${config.WMS}/wm/wmDelivery/djExport`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 生成多件
export async function createMoreThanBatch(params) {
  return requestExtension(`${config.WMS}/wms/wm/createMoreThan/createMoreThanBatch`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 导出现场大单 
export async function ddExport(params) {
  return fileExport(`${config.WMS}/wms/wm/createSceneBigSheet/ddExport`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 生成现场大单
export async function createSceneBigSheet(params) {
  return requestExtension(`${config.WMS}/wms/wm/createSceneBigSheet/createSceneBigSheet`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
