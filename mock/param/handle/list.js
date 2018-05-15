/*
查询企业配置列表
*@param
{
    companyNo; //直接从request接受   
}
*@return
{
    "data": {
        "list": [
            {
                companyNo;//公司编号
                autoNo; //自增编号
                paramNo; //参数编号
                paramName; //参数名称
                paramType; //参数类型
                paramValue; //参数设定值
                presetFlag; //预至标志位Y表示参数不得修改
                remark; //备注信息
                enableStatus; //启用状态(0:不启用;1:启用)
                ts; //时间戳
            },    
        ],
    }
}
*/