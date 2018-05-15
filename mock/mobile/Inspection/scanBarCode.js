/*
 * @Author: chenjie
 * @Date: 2018-01-23 10:07:35
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-03-14 09:05:36
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
        skuInfos:[{
            skuNo
            productNo
            productSpec
            productImage
            billNum     // 数量
        }]
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
export function inspcationScanBarCode(req, res, u, b) {
    let url = u
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url // eslint-disable-line
    }
    return res.json(JSON.parse('{"success":true,"resultCode":"0000","errorMessage":"操作成功！","data":{"orderNo":"OTZ1322","expressCropName":"圆通","expressNo":"EX1230001","skuInfos":[{"skuNo":"898999","productNo":"87771212","productSpec":"少女粉;190/A","productImage":"https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1225584795,3987647957&fm=27&gp=0.jpg"}],"gifts":[{"skuNo":"2129","productNo":"091212","productSpec":"土豪金;190/A","productImage":"https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1225584795,3987647957&fm=27&gp=0.jpg"}]}}'))
}

export default {
    inspcationScanBarCode,
}
