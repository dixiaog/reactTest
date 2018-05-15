/*
对应资金审核   
 {
	
	supplierNo:供销商
		distributorNo:分销商
		fundType   资金类型  
		current 
		pageSize 
}
 * @return （此处data中返回）
{
    "data": {
			list:[
				 DmFundDetail:{
					 		autoNo					内部支付号
							distributorName 分销商名称
							distributorRemark		我方备注
							fundType   资金类型
							billDate   支付时间
							billNo     支付单号
							amount     金额
							status     状态
							modeNo     支付方式
							remark     备注
							receiveAccount   分销商银行账号
							createUser	登记人
							createTime	登记时间
				 }
				]	 
    }
}

 */