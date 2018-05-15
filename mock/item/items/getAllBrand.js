/*
 * @Author: chenjie
 * @Date: 2018-01-20 10:16:45
 * @param (无特别注释均表示可选)
 {
}
 * @return （此处data中返回）
{
    "data": [
        {
            "brandNo": 1,
            "brandName": "BOSIDENG",
            "shortName": "b",
            "brandIcon": "",
            "distributeAuthorize": 0,
            "enableStatus": 0,
            "companyNo": 0,
            "createTime": 1515662125000,
            "createUser": "6rv341h4fb",
            "ts": 1516421063000
        },
        {
            "brandNo": 16,
            "brandName": "aaaaaa",
            "shortName": "sadsa",
            "brandIcon": "817967419751152428",
            "distributeAuthorize": 1,
            "enableStatus": 0,
            "companyNo": 0,
            "createTime": 1516413854000,
            "createUser": "%E6%88%B4%E5%BB%BA%E5%9B%BD",
            "ts": 1516421063000
        }
    ]
}

 */

export function getAllBrand(req, res, u, b) {
    let url = u
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url // eslint-disable-line
    }
    return res.json('{"success":true,"resultCode":"0000","errorMessage":"操作成功！","data":[{"brandNo":1,"brandName":"BOSIDENG","shortName":"b","brandIcon":"","distributeAuthorize":0,"enableStatus":0,"companyNo":0,"createTime":1515662125000,"createUser":"6rv341h4fb","ts":1516421063000},{"brandNo":2,"brandName":"SNOW FLYING","shortName":"SFSS","brandIcon":"","distributeAuthorize":1,"enableStatus":0,"companyNo":0,"createTime":1515662189000,"createUser":"6rv341h4fb","ts":1516421063000},{"brandNo":11,"brandName":"jiangteng","shortName":"江腾7777771","brandIcon":"817967419751097477","distributeAuthorize":0,"enableStatus":0,"companyNo":0,"createTime":1516155019000,"createUser":"%E5%BE%90%E9%87%91%E4%B8%B9","ts":1516421063000},{"brandNo":12,"brandName":"TEST","shortName":"TEST","brandIcon":"","distributeAuthorize":1,"enableStatus":0,"companyNo":0,"createTime":1516157369000,"createUser":"%E9%99%88%E9%91%AB%E6%9D%B0","ts":1516421063000},{"brandNo":13,"brandName":"TEST-UPD","shortName":"TEST-UPD","brandIcon":"817967419751097335","distributeAuthorize":1,"enableStatus":0,"companyNo":0,"createTime":1516157386000,"createUser":"%E9%99%88%E9%91%AB%E6%9D%B0","ts":1516421063000},{"brandNo":14,"brandName":"CHEN XINJIE","shortName":"CXJ","brandIcon":"817967419751150581","distributeAuthorize":1,"enableStatus":0,"companyNo":0,"createTime":1516351698000,"createUser":"%E9%99%88%E9%91%AB%E6%9D%B0","ts":1516421063000},{"brandNo":15,"brandName":"TEST-UPD1","shortName":"test","brandIcon":"817967419751150642","distributeAuthorize":1,"enableStatus":0,"companyNo":0,"createTime":1516353763000,"createUser":"%E9%99%88%E9%91%AB%E6%9D%B0","ts":1516421110000},{"brandNo":16,"brandName":"aaaaaa","shortName":"sadsa","brandIcon":"817967419751152428","distributeAuthorize":1,"enableStatus":0,"companyNo":0,"createTime":1516413854000,"createUser":"%E6%88%B4%E5%BB%BA%E5%9B%BD","ts":1516421063000}]}')
}

export default {
    getAllBrand,
}
