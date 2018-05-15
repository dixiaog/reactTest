/*
 * @Author: chenjie
 * @Date: 2018-01-23 10:07:35
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-01-30 10:02:41
 * 解锁单笔商品
 {
    auto_no   // 锁定明细(wm_lock_inventory_d)中自增No
}
 * @return （此处data中返回）
{
    "data": true | false
}

 */

export function unLockSku(req, res, u, b) {
    let url = u
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url // eslint-disable-line
    }
    return res.json(JSON.parse('{"success":true,"resultCode":"0000","errorMessage":"操作成功！","data":true}'))
}

export default {
    unLockSku,
}
