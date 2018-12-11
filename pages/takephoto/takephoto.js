// pages/takephoto/takephoto.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photo_display: "none",
    reset_display: "none"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.status = ""
    var _this = this
    _this.setData({
      cameraH: 300
    })
    
  },

  ok: function(e) {

    if (this.status == "takephoto"){
      this.status = ""
      wx.redirectTo({
        url: '../editor/editor'
      })
    }
    else
    {
      let _this = this
      const ctx = wx.createCameraContext()

      ctx.takePhoto({
        quality: 'high',
        success: (res) => {
          console.log(res.tempImagePath)
          app.globalData.imagePath = res.tempImagePath
          _this.status = "takephoto"
          _this.setData({
            photo_src: res.tempImagePath,
            photo_display: "flex",
            reset_display: "inline"
          })
        }
      })
    }
    
  },

  reset: function(e){
    this.setData({
      photo_display: "none",
      reset_display: "none"
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})