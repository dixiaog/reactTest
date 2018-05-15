/*
 * @Author: chenjie
 * @Date: 2018-01-23 10:07:35
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-03-10 15:47:25
 * 查看已装箱信息
 {
    [{
        barCode  商品条码
        sku      商品编码
    }]
}
 * @return （此处data中返回）
{
    "data": "BOX12332"  //箱码
}

 */
export function packingDeliveryGetCasCode(req, res, u, b) {
    let url = u
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url // eslint-disable-line
    }
    return res.json(JSON.parse('{"success":true,"resultCode":"0000","errorMessage":"操作成功！","data":"BOX12332"}'))
}

export default {
    packingDeliveryGetCasCode,
}
