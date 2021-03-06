import common from "../../js/common.js";
var id = "";
var app = getApp();
Page({

  data: {
    innerAudioContext:'',
    audio_record: [],
    isplay: false, //是否默认播放
    myAudioDuration: '', // 时间
    myAudioCurrent: '',  // 当前播放进度
    error: '',
    InputBottom: 0,
    iptVal: "",
    btnShow: false,
    pingData: []
  },

  backToHome(){
    setTimeout(()=>{
      wx.setStorageSync('PageCur', 'FrontPage')
      wx.reLaunch({
        url: '../student_page/student_page',
      })
    }, 100)
  },

  IptChanged(res){
    console.log(res)
    if(res.detail.value.length){
      this.setData({
        btnShow: true
      })
    }else{
      this.setData({
        btnShow: false
      })
    }
  },

  InputFocus(e) {
    this.setData({
      InputBottom: e.detail.height
    })
  },

  InputBlur(e) {
    this.setData({
      InputBottom: 0
    })
  },

   //获取评论
  getPing(id) {
    wx.cloud.callFunction({
      name: "get_ping",
      data: {
        id
      }
    }).then(res => {
      // console.log(res)
      this.setData({
        pingData: res.result.data
      })
    })
  },

  onSubmit(res){
    wx.showLoading({
      title: '数据加载中...',
    })
    var content = res.detail.value.content;
    var userInfo = app.globalData.userInfo;
    console.log(userInfo)
    var question_name = this.data.audio_record.question_name;
    wx.cloud.callFunction({
      name: "add_ping",
      data: {
        id,
        content,
        question_name,
        userInfo
      }
      }).then(res => {
        wx.hideLoading()
        this.setData({
          iptVal: "",
          btnShow: false
        })
        this.getPing(id);
      })
  },

  //播放开始
  Play(){
    this.data.innerAudioContext.src = this.data.audio_record.audioUrl;
    this.data.innerAudioContext.startTime = this.data.myAudioCurrent; //考虑到进度条被拖动，不一定从00:00:00开始
    this.setData({
      isplay: true
    });
    this.data.innerAudioContext.play();
    //进度条变化   
    this.data.innerAudioContext.onTimeUpdate(() => {
      this.setData({
        myAudioPos: this.data.innerAudioContext.currentTime / this.data.innerAudioContext.duration * 100,
        myAudioCurrent: common.format(this.data.innerAudioContext.currentTime),
        myAudioDuration: common.format(this.data.innerAudioContext.duration)
      });
    })
  },

  //播放暂停
  Pause(){
    this.data.innerAudioContext.pause();
    this.setData({
      isplay: false
    });
  },
  
  //拖动进度条，到指定位置
  hanle_slider_change(e) {
    const position = e.detail.value;
    var currentTime = position / 100 * this.data.innerAudioContext.duration;
    this.data.innerAudioContext.seek(currentTime);
    console.log(currentTime)
    this.setData({
      myAudioPos: position,
      myAudioCurrent: common.format(currentTime)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var audio_record = wx.getStorageSync('current_audio_record')
    console.log(audio_record)
    this.setData({
      innerAudioContext: wx.createInnerAudioContext(),
      audio_record
    })
    id = audio_record._id
    this.getPing(id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //播放录音
    //获取当前录音信息
    this.data.innerAudioContext.onCanplay(() => {
      this.data.innerAudioContext.duration; //必须写，不然获取不到。。。
      setTimeout(() => {
        console.log(this.data.innerAudioContext.duration);
        this.setData({
          myAudioDuration: common.format(this.data.innerAudioContext.duration),
          myAudioCurrent: common.format(this.data.innerAudioContext.currentTime)
        });
      }, 1000);
    });
      // 播放完成处理，按钮变一下
      this.data.innerAudioContext.onEnded((res) => {
        this.setData({
          isplay: false
        })
      });
      //错误处理
      this.data.innerAudioContext.onError((res) => {
        console.log(res)
        this.setData({
          error: res.errMsg
        })
      });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
    this.data.innerAudioContext.destroy();
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

  }
})