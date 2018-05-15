/*
 * @Author: chenjie
 * @Date: 2018-01-23 10:07:35
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-03-12 17:01:01
 * 二次装箱扫描
 {
    barCode  商品条码
    pickedList
}
 * @return （此处data中返回）
{
    "data": {    // sku 商品明细
          skuNo
          productNo
          productSpec
    }
}

 */
export function packingDeliverySecondScanbarCode(req, res, u, b) {
    let url = u
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url // eslint-disable-line
    }
    return res.json(JSON.parse('{"success":true,"resultCode":"0000","errorMessage":"操作成功！","data":{"skuNo":567,"productNo":"mockTestS","productSpec":"黑色；170S","productImage":"http://www.bosideng.com/Public/image/header/logo.png"}}'))
}

export default {
    packingDeliverySecondScanbarCode,
}
