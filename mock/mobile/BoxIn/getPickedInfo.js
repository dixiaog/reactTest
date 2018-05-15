/*
 * @Author: chenjie
 * @Date: 2018-01-23 10:07:35
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-03-12 15:03:13
 * 查看已装箱信息
 {
    billNo  出库单
}
 * @return （此处data中返回）
{
    "data": [{
       casCode      //箱码
       count        //数量
    }]
}

 */
export function packingDeliveryGetPickedInfo(req, res, u, b) {
    let url = u
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url // eslint-disable-line
    }
    return res.json(JSON.parse('{"success":true,"resultCode":"0000","errorMessage":"操作成功！","data":[{"casCode":"BOX7788","count":"10"},{"casCode":"BOX8822","count":"9"}]}'))
}

export default {
    packingDeliveryGetPickedInfo,
}
