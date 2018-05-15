/*
 * @Author: wangjun
 * @Date: 2018-01-20 10:16:45
 * 新增审核策略
{
    {
        strategyNo; //策略编号(自增编号)
        strategyName; //策略名称
        beginTime; //开始时间
        endTime;//结束时间
        beginOrderTime; //开始下单时间
        endOrderTime; //截止下单时间
        specifyShop; //指定店铺编号
        limitOrderType; //限定订单类型(0:普通订单; 1:补发订单; 2:换货订单; 3:天猫分销; 4:天猫供销; 5:协同订单)
        specifyFlag; //指定小旗(逗号分隔多色旗)
        delayApprove; //支付后延时审核
        enableStatus; //启用标志(0:禁用; 1:启用)
        companyNo; //公司编号
        createTime; //创建时间
        createUser; //创建人员
        updateTime; //修改时间
        updateUser; //修改人员
        ts; //时间戳
    }
}
 * @return （此处data中返回）
{
    data: {
            Boolean
        }
}

 */