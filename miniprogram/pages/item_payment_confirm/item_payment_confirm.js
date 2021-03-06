import common from "../../js/common.js";
const app = getApp();
var payorder = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: [],
    itemOne: [],
    payorder: {},
    itemType: '',
    id: ""
  },

  backToHome(){
    setTimeout(()=>{
      wx.setStorageSync('PageCur', 'FrontPage')
      wx.reLaunch({
        url: '../student_page/student_page',
      })
    }, 100)
  },

  getUser(){
    wx.cloud.callFunction({
      name: "get_userInfo",
    }).then(res => {
      console.log(res)
      this.setData({
        userInfo: res.result.data[0]
      })
    })    
  },

  OrderCode(){
    var d = new Date();
    var year = d.getFullYear()+"";
    var month = d.getMonth()+1;
    var day = d.getDate();
    month = month < 10 ? "0" + month : month+"";
    day = day < 10 ? "0" + day : day+"";
    var date = year+month+day;
    var randomNum = Math.floor(Math.random()*10000000000);
    //构造32位商户订单号
    var ordercode = "INHANA"+date+"Y"+randomNum;
    return ordercode
  },

  generatePayorder(){
    payorder.item_name = this.data.itemOne.title
    payorder.item_price = this.data.itemOne.price
    payorder.item_class = this.data.itemOne.class
    payorder.OrderCode = this.OrderCode()
    this.setData({
      payorder
    })
  },

  handleOrderPay(){
    wx.cloud.callFunction({
      name: 'getPay',
      data: {
          total_fee: parseFloat(payorder.item_price).toFixed(2) * 100,
          attach: 'anything',
          body: payorder.item_name,
          ShopOrder: payorder.OrderCode
        }
      }).then(res=>{
        console.log(res)
        wx.requestPayment({
          appId: res.result.appid,
          timeStamp: res.result.timeStamp,
          nonceStr: res.result.nonce_str,
          package: 'prepay_id=' + res.result.prepay_id,
          signType: 'MD5',
          paySign: res.result.paySign,
          success: res => {
            wx.showToast({
              icon:'success',
              title:'购买成功'
            })
            wx.cloud.callFunction({
              name: 'add_payment_record',
              data: {
                buyer_name: this.data.userInfo.name,
                buyer_gender: this.data.userInfo.gender,
                buyer_phone: this.data.userInfo.phone,
                buyer_school: this.data.userInfo.school,
                buyer_grade: this.data.userInfo.grade,
                item_name: payorder.item_name,
                item_class: payorder.item_class,
                item_price: payorder.item_price,
                id: this.data.id,
                payOrder: payorder.OrderCode,
                payTime: common.myDate(Math.round(new Date()),1),
                itemType: this.data.itemType
              }
            }).then(res=>{
                console.log(res)
                if(this.data.itemType=="grading_training"){
                  setTimeout(()=>{
                    wx.reLaunch({
                      url: '../grading_train_home/grading_train_home',
                    })
                  }, 500)
                }else{
                  setTimeout(()=>{
                    wx.setStorageSync('PageCur', 'FrontPage')
                    wx.reLaunch({
                      url: '../student_page/student_page',
                    })
                  }, 500)
                }
              })
          }
        }) 
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var itemOne = wx.getStorageSync('itemOne')
    var itemType = wx.getStorageSync('itemType')
    var id = wx.getStorageSync('grading_register_id')
    this.getUser()
    this.setData({
      id,
      itemOne,
      itemType
    })
    this.generatePayorder()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      content: app.globalData.content
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})