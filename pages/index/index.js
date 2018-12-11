//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    data: [1,2,4,5],
    imgUrls: [
      '../../res/index/1.jpg',
      '../../res/index/2.jpg',
      '../../res/index/3.jpg',
    ],
  },
  //事件处理函数
  bindViewTap: function() {
    //wx.navigateTo({
    //  url: '../logs/logs'
    //})
    console.log("999999999"); 
    wx.navigateTo({
      url: '../takephoto/takephoto',
    })
    /*
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera', 'album'],
      //sourceType: ['camera'],
      success(res) {
        console.log(res)
        console.log("path:  " + res.tempFilePaths[0])
        app.globalData.imagePath = res.tempFilePaths[0];
        app.globalData.imageOrientation = res.orientation
        console.log("imageOrientation:", app.globalData.imageOrientation)
        wx.navigateTo({
          url: '../editor/editor'
        })
      },
      fail(res) {
        console.log("failed to camera...")
        console.log(res)
      }
    })*/

  },

  bindViewTap2:function(e){

    wx.navigateTo({
      url: '../done/done'
    })
  },

  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  
  onReady: function() {
    
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})