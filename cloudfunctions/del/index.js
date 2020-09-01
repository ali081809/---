// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db=cloud.database();   //拿到数据库引用

// 云函数入口函数
exports.main = async (event, context) => {
  const {_collection,_data}=event;
  return await db.collection(_collection).where(_data).remove()
  const wxContext = cloud.getWXContext()

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}