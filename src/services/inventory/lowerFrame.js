/*
 * @Author: Wupeng
 * @Date: 2018-04-25 14:28:04 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-25 14:28:29
 * 生成移货下架 整部任务
 */
import request from '../../utils/request'
import fileExport from '../../utils/fileExport'
import config from '../../utils/config'

//生成移货下架 列表页查询
export async function getBatchSummary(params) {
    return request(`${config.WMS}/wm/bd/location/yhGetBdStorageLocation`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
  }

//生成移货下架 导出
export async function yhExportDB(params) {
    return fileExport(`${config.WMS}/wm/bd/location/yhExportDB`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
  }

//生成整补任务 查询
export async function zbGetBdStorageLocation(params) {
    return request(`${config.WMS}/wm/bd/location/zbGetBdStorageLocation`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
  }
//生成整补任务 导出
  export async function zbExportDB(params) {
    return fileExport(`${config.WMS}/wm/bd/location/zbExportDB`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
  }