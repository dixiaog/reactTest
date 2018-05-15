/*
 * @Author: chenjie
 * @Date: 2018-01-23 10:07:35
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-03-13 14:36:40
 * 装箱
 {
    expressCorpNo  快递编号
}
 * @return （此处data中返回）
{
    "data": true
}

 */
export function packingDeliveryScanExpressNo(req, res, u, b) {
    let url = u
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url // eslint-disable-line
    }
    return res.json(JSON.parse('{"success":true,"resultCode":"0000","errorMessage":"操作成功！","data":true}'))
}

export default {
    packingDeliveryScanExpressNo,
}
