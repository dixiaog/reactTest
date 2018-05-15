/*
 * @Author: chenjie
 * @Date: 2018-01-23 10:07:35
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-03-14 15:30:24
 * 扫描条码
 {
    barCode：
    expressCorpNo   // 空值表示自动匹配，如果不为空，则后台需判断该条码是否匹配快递发货
}
 * @return （此处data中返回）
{
    "data": {
        orderNo  //出库单对应的内部订单号
        expressNo   //快递单号
        expressCorpName   //快递公司名
        inspecedNum // 已验数
        orderNum    // 商品总数
        sowNo       // 播种柜号
        gifts:[{
            skuNo
            productNo
            productSpec
            productImage
            billNum     // 数量
        }]
    }
}

 */
export function inspcationMultipleScanBarCode(req, res, u, b) {
    let url = u
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url // eslint-disable-line
    }
    return res.json(JSON.parse('{"success":true,"resultCode":"0000","errorMessage":"操作成功！","data":{"orderNo":"OTZ1322","expressCropName":"圆通","expressNo":"EX1230001","inspecedNum":"1","orderNum":"4","sowNo":"109"}}'))
}

export default {
    inspcationMultipleScanBarCode,
}
