import common from "../../js/common.js";
var one_audio_question={};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    one_audio_question:{},
  },

  Try(){
    wx.navigateTo({
      url: '../daka_question_audio/daka_question_audio',
    })
  },

  backToHome(){
    setTimeout(()=>{
      wx.setStorageSync('PageCur', 'FrontPage')
      wx.reLaunch({
        url: '../student_page/student_page',
      })
    }, 100)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options){
    one_audio_question = wx.getStorageSync('one_audio_question')
    if(one_audio_question.length==0){
      this.setData({
        blankShow: true,
        one_audio_question:one_audio_question
      })
    }else{
      this.setData({
        blankShow: false,
        one_audio_question:one_audio_question
      })
    }
    this.setData({
      
    })
    // this.getAudioQuestion(QuestionName)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady(){
  
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow(){

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide(){

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload(){

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh(){
    
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom(){
    
  }
})
