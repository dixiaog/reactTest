/*
 * @Author: chenjie
 * @Date: 2018-01-23 10:07:35
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-03-12 09:14:43
 * 装箱
 {
    barCode  商品条码
    billNo   出库单（第一次为空）
    thisPicked 0
}
 * @return （此处data中返回）
{
    "data": {
       billNo               // 出库单
       orderNo              // 订单号
       orderNum             // 发货总数 (订单主表中的orderNo)
       pickedNum            // 已装总数 （该出库单下已装的sku总数）
       thisPicked           // 本箱已装
       skuInfos： [{        // 商品明细
          skuNo
          productNo
          productSpec
          billNum           // 此商品在本次出库单中的总件数
          pickedNum         // 计算所得，此商品在本次出库单中已装箱的数量
       }]
    }
}

 */
export function packingDeliveryScanCasCode(req, res, u, b) {
    let url = u
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url // eslint-disable-line
    }
    return res.json(JSON.parse('{"success":true,"resultCode":"0000","errorMessage":"操作成功！","data":{"billNo":"123","orderNo":"orderNo8971","orderNum":"10","pickedNum":"0","thisPicked":"1","skuInfo：":{"skuNo":567,"productNo":"mockTestS","productSpec":"黑色；170S","billNum":"2","pickedNum":"1",}}}'))
}

export default {
    packingDeliveryScanCasCode,
}
