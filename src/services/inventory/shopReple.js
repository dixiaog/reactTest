/*
 * @Author: Wupeng
 * @Date: 2018-04-21 09:24:26 
 * @Last Modified by:   mikey.zhaopeng 
 * @Last Modified time: 2018-04-21 09:24:26 Wupeng
 * 生成门店补货
 */
import request from '../../utils/request'
import fileExport from '../../utils/fileExport'
// import requestExtension from '../../utils/requestExtension'
import config from '../../utils/config'

// 查询
export async function pickUpBatch(params) {
    return request(`${config.WMS}/wm/wmDelivery/pickUpBatch`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
  }
  //     导出
  export async function storeExport(params) {
    return fileExport(`${config.WMS}/wms/wm/store/storeExport`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
  }