/*
新增登记保证金之类
 {
	 supplierNo;//供销商编号
		distributorNo;//分销商编号
		strBillDate;//1支付时间
		billNo;//1支付单号
		fundType;//1资金类型   0:订单支付;1:售后退款;2:保证金;3:预付款;4:奖励金;5:罚款;6:提现;20:其他
		modeNo;//1支付方式    -->接口在
		payAccount;//1分销商支付账号
		amount;//1支付金额
		addSubtract: 1 //加减识别(1 或者 -1)
		remark;//1备注
}
 * @return （此处data中返回）
{
    "data": {
    true | false
    }
}

 */
