//logs.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    editViewW: 100,
    editViewH: 200,

    cutViewH: 0,
    cutViewW:0,
    cutViewLeft:0,
    cutViewTop:0,

    imageViewH: 0,
    imageViewW: 0,
    imageW:0,
    imageH:0,
    imagePath:"",
  },

  onReady: function() {
    console.log("onReady  image path=" + this.imagePath)
  },

  onLoad: function(option) {
    wx.showLoading({
      title: '加载图片中',
      mask: true
    })
    wx.getSystemInfo({
      success: res => {
        console.log(res)
        console.log("window size: " + res.windowWidth + " " + res.windowHeight)
        console.log("screen size: " + res.screenWidth + " " + res.screenHeight)
        this.setData({
          editViewW: res.windowHeight,
          editViewH: res.windowWidth,

          editViewLeft: -(res.windowHeight - res.windowWidth) / 2,
          editViewTop: (res.windowHeight - res.windowWidth) / 2,

          imagePath: app.globalData.imagePath,

          cutViewW: res.windowWidth * 2 / 3,
          cutViewH: res.windowHeight * 2 / 3,
          cutViewLeft: res.windowWidth / 6,
          cutViewTop: res.windowHeight / 6,
        })

      }
    })
    this.imagePath = app.globalData.imagePath
  },

  imageLoad: function(e) {
    console.log(e)
    this.setData({
      imageH: e.detail.height,
      imageW: e.detail.width
    })
    this.imageH = e.detail.height
    this.imageW = e.detail.width

    console.log("图片的宽度" + this.imageW)
    console.log("图片的高度" + this.imageH)
    if (this.imageW <= this.imageH) { 
      wx.showToast("只支持横向拍摄！")
      return
    }


    console.log("图片的宽度 > 高度")
    var image_ratio = this.imageW / this.imageH
    var editview_ratio = this.data.editViewW / this.data.editViewH;
    console.log(" image_ratio=" + image_ratio + " editview_ratio=" + editview_ratio)

    if (image_ratio > editview_ratio) {
      //按高度调整
      this.setData({
        imageViewW: this.data.editViewW,
        imageViewH: this.data.editViewW / image_ratio
      })
      console.log("按高度调整，this.data.imageViewH=" + this.data.imageViewH)
      console.log("按高度调整，this.data.imageViewW=" + this.data.imageViewW)
    } else {
      this.setData({
        imageViewH: this.data.editViewH,
        imageViewW: this.data.editViewH * image_ratio
      })
      console.log("按宽度调整，this.data.imageViewH=" + this.data.imageViewH)
      console.log("按宽度调整，this.data.imageViewW=" + this.data.imageViewW)
    }
    wx.hideLoading()
    this.setData({cut_display:"block"})
  },


  dragDown: function(e) {
    console.log("touchmove......................")
    console.log(e)
    console.log(e.target.id)
    console.log(e.changedTouches[0].clientX)
    console.log(e.changedTouches[0].clientY)
  },

  cutViewDragStart: function(e) {
    this.time = 0;
    console.log("cutdown cutViewDragStart.....................")
  },

  cutViewDragEnd: function(e) {
    console.log("cutdown view cutViewDragEnd......................")
    if (e.timeStamp - this.time < 1000) {
      console.log("cutViewDragEnd return")
      //return
    }
    this.time = e.timeStamp

    console.log(e.target.id)
    console.log(e.changedTouches[0].clientX)
    console.log(e.changedTouches[0].clientY)
    let clientX = e.changedTouches[0].clientX
    let clientY = e.changedTouches[0].clientY
    console.log("x="+clientX + " y="+clientY )

    let id = e.target.id
    switch (id) {
      case "upBtn":
        let dis = clientY - this.data.cutViewTop
        console.log("upbtn  move:" + dis)
        this.setData({
          cutViewTop: this.data.cutViewTop + dis,
          cutViewH: this.data.cutViewH - dis
        })
        break;
      case "downBtn":
        dis = clientY - (this.data.cutViewTop + this.data.cutViewH)
        console.log("downbtn move:" + dis)
        this.setData({
          cutViewH: this.data.cutViewH + dis
        })
        break;
      case "centerLeftBtn":
        dis = clientX - this.data.cutViewLeft
        console.log("leftbtn move:" + dis)
        this.setData({
          cutViewLeft: this.data.cutViewLeft + dis,
          cutViewW: this.data.cutViewW - dis,
          //cutViewLeft: this.data.cutViewLeft + dis
        })
        break;

      case "centerRightBtn":
        dis = clientX - this.data.cutViewLeft - this.data.cutViewW
        console.log("right btn move:" + dis)
        this.setData({
          cutViewW: this.data.cutViewW + dis
        })
        break;
    }
  },

  confirm: function(e) {
    //clear canvas1 , crop image into canvas2
    console.log("confirm..")
    app.globalData.editdata = this.data;
    wx.navigateTo({
      url: '../editor2/editor2',
    })
  },


})