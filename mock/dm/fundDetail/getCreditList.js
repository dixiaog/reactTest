/*
供销-账户余额查询
 {
    current: 1,
    pageSize: 20,
    disSupTypeNo:1, //供销商0/分销商1   必传
}
 * @return （此处data中返回）
{
    "data": {
        "list": [               
            {
            distributorStatus;//分销状态   0:等待审核;1:确认生效;2:作废;3:冻结;4:被拒绝；
            supplierNo;//供应商编号
            supplierName;//供应商名字
            distributorNo;//分销商编号
            distributorName;//分销商名称
            deposit;//保证金
            prepay;//预付款
            reward;//奖励
            amerce;//罚款,,
            commision;//佣金
            withdrawals;//提现,,
            occupation;//订单占用,,
            refund;//售后退款
            availableBalance;//可用余额
            availableAllBalance;//可用总金额
            reditSum;//授信金额
            },
        ],
        
    }
}

 */