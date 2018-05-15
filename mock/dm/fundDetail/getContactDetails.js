/*
资金往来明细  
 {
		supplierNo:供销商编号
		distributorNo:分销商编号
		fundType  (资金)类型    0:订单支付;1:售后退款;2:保证金;3:预付款;4:奖励金;5:罚款;6:提现;20:其他
		modeNo     支付方式    来自数据字典；类别为1-支付方式；
		innerNo    内部订单号
		onlineNo   线上订单号
		startTime   开始时间
		endTime    结束时间
		status    单据状态    0:待审核;1:已审核;2:审核未通过;3:作废
		current   						 	
		pageSize   							
}
 * @return （此处data中返回）
{
    "data": {
				list[
					DmFundDetail{
						autoNo   	内部订单号
						billDate  支付时间
						fundType  (资金)类型
						amount    金额
						billNo    支付单号
						status    状态
						modeNo    支付方式
						innerNo    内部订单号
						onlineNo   线上订单号
					  auditor			审核人
						approveDate	审核时间
						createUser  创建人
						createTime   创建时间
						remark     备注
					}	
				]
    }
}