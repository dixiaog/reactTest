/*
 * @Author: chenjie
 * @Date: 2018-01-23 10:07:35
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-03-13 14:36:52
 * 获取快递列表
 {
    
}
 * @return （此处data中返回）
{
    "data": [{
        expressCorpNo   快递编号
        expressCorpName 快递名称
    }]
}

 */
export function inspcationGetExpressList(req, res, u, b) {
    let url = u
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url // eslint-disable-line
    }
    return res.json(JSON.parse('{"success":true,"resultCode":"0000","errorMessage":"操作成功！","data":[{"expressCorpNo":"123","expressCorpName":"圆通"},{"expressCorpNo":"13","expressCorpName":"顺丰"}]}'))
}

export default {
    inspcationGetExpressList,
}
