// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const openid = cloud.getWXContext().OPENID
  var {name, school, phone, gender, grade} = event

  return await db.collection("userInfo").add({
    data:{
      openid,
      name,
      school,
      phone,
      gender,
      grade,
      RegisterTime:Date.now(),
    }
  })
}