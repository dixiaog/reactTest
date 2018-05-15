/*
 * @Author: chenjie
 * @Date: 2018-01-23 10:07:35
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-03-14 09:05:36
 * 扫描条码
 {
    list: [barCode] 已验货条码
}
 * @return （此处data中返回）
{
    "data": [
    {
        skuNo
        unInspecNum     // 未验数
    },
    {...},
    {...},]
}

 */
export function inspcationGetSkuInfos(req, res, u, b) {
    let url = u
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url // eslint-disable-line
    }
    return res.json(JSON.parse('{"success":true,"resultCode":"0000","errorMessage":"操作成功！","data":{"orderNo":"OTZ1322","expressCropName":"圆通","expressNo":"EX1230001","skuInfos":[{"skuNo":"898999","productNo":"87771212","productSpec":"少女粉;190/A","productImage":"https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1225584795,3987647957&fm=27&gp=0.jpg"}],"gifts":[{"skuNo":"2129","productNo":"091212","productSpec":"土豪金;190/A","productImage":"https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1225584795,3987647957&fm=27&gp=0.jpg"}]}}'))
}

export default {
    inspcationGetSkuInfos,
}
