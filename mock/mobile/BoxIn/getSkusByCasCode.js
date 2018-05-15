/*
 * @Author: chenjie
 * @Date: 2018-01-23 10:07:35
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-03-12 15:03:22
 * 根据箱码查看装箱信息
 {
    casCode  箱码
}
 * @return （此处data中返回）
{
    "data": [{
       skuNo
        productNo
        productSpec
        billNum           // 此商品在本次出库单中的总件数
        pickedNum       // 计算所得，此商品在本次出库单中已装箱的数量
    }]
}

 */
export function packingDeliveryGetSkusByCasCode(req, res, u, b) {
    let url = u
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url // eslint-disable-line
    }
    return res.json(JSON.parse('{"success":true,"resultCode":"0000","errorMessage":"操作成功！","data":[{"skuNo":"9833M","productNo":"mockTestS","productSpec":"黑色；170S","billNum":"2","pickedNum":"1"},{"skuNo":"90898","productNo":"1232222","productSpec":"黑色；180/XL","billNum":"2","pickedNum":"1"}]}'))
}

export default {
    packingDeliveryGetSkusByCasCode,
}
