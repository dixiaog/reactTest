/*
 * @Author: chenjie
 * @Date: 2018-01-23 10:07:35
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-03-10 17:04:29
 * 打印快递单
 {
   
}
 * @return （此处data中返回）
{
    "data": 返回快递信息
}

 */
export function packingDeliveryPrintExpress(req, res, u, b) {
    let url = u
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url // eslint-disable-line
    }
    return res.json(JSON.parse('{"success":true,"resultCode":"0000","errorMessage":"操作成功！","data":true}'))
}

export default {
    packingDeliveryPrintExpress,
}
