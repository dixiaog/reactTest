/*
图片上传
*@param
{
    file;//文件   
}
*@return
{
    "data": {
        Long id;//自增列主键
        String pictureIds;//图片id
        pictureId;//图片主键
        pictureSource;//图片来源*
        groupId;//图片所在组主键
        pictureName;//图片名称
        pictureSize;//图片大小
        pictureFormat;//图片格式
        pictureWidth;//图片宽度
        pictureHeight;//图片高度
        originPictureName;//图片原始名称
        storagePath;//图片存储物理路径
        referenceFlag;//是否被引用(Y-是 N-否)
        createTime;//创建时间
        createUser;//创建人员
        createUserIp;//创建人IP
        updateTime;//修改时间
        updateUser;//修改人员
        updateUserIp;//修改人IP
        remark;//备注信息
        pictureStatus;//图片删除标记*
        ts;//时间戳
    }
}
*/