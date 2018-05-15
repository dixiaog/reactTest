/*
 * @Author: Wupeng
 * @Date: 2018-05-02 21:20:15 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-05-02 21:21:10
 * 库存盘点接口
 */
import request from '../../utils/request'
import config from '../../utils/config'
import fileExport from '../../utils/fileExport'
// import requestExtension from '../../utils/requestExtension'

// 库存盘点列表
export async function list(params) {
    return request(`${config.WMS}/wm/wmlocationcheck/list`, {
        method: 'POST',
        body: { ...params },
    })
  }

  // 库存盘点导出所有符合条件的单据
export async function exportDB(params) {
    return fileExport(`${config.WMS}/wm/wmlocationcheck/exportDB`, {
        method: 'POST',
        body: {
        ...params,
        },
    })
}