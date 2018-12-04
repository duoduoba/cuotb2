//logs.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    editViewW: 100,
    editViewH: 200,
    rotate_degree: 90,

    cutViewH: 0,
    cutViewW: 0,
    cutViewLeft: 0,
    cutViewTop: 0,

    imageViewH: 0,
    imageViewW: 0,
    imageW: 0,
    imageH: 0,
    imagePath: "",

    windowHeight: 0,
    windowWidth:0,
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
        app.globalData.platform = res.platform
        console.log("window size: " + res.windowWidth + " " + res.windowHeight)
        console.log("screen size: " + res.screenWidth + " " + res.screenHeight)
        this.setData({
          
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth,

          //默认设置横向图片的view
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

  cutMove:function(e)
  {
    console.log("touch...",e)
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
    console.log("EditView的宽度" + this.data.editViewW)
    console.log("EditView的高度" + this.data.editViewH)

    if (this.imageW <= this.imageH) {
      //如果是竖向，调整宽和高
      let h = this.data.editViewW
      let w = this.data.editViewH
      this.setData({
        //竖向图片的view，交换横宽数值
        editViewW: w,
        editViewH: h,
        editViewLeft: 0,
        editViewTop: 0,
        rotate_degree: 0
    })
    }


    var image_ratio = this.imageW / this.imageH
    //横向比例
    var editview_ratio = this.data.editViewW / this.data.editViewH;
    //如果是竖向拍摄，计算竖向比例
    if (this.imageW <= this.imageH) {
      image_ratio = this.imageH / this.imageW
      editview_ratio = this.data.editViewH / this.data.editViewW
    }
    console.log(" image_ratio=" + image_ratio + " editview_ratio=" + editview_ratio)

    if (image_ratio > editview_ratio) {
      //按高度调整
      if (this.imageW > this.imageH) {
        //横向
      this.setData({
        imageViewW: this.data.editViewW,
        imageViewH: this.data.editViewW / image_ratio
      })
      }
      else 
      {
        //竖向
        this.setData({
          imageViewW: this.data.editViewH /image_ratio,
          imageViewH: this.data.editViewH
        })
      }
      console.log("按高度调整，this.data.imageViewH=" + this.data.imageViewH)
      console.log("按高度调整，this.data.imageViewW=" + this.data.imageViewW)
    } else {
      //按宽度调整
      if (this.imageW > this.imageH)
      {
        //横向
        this.setData({
          imageViewH: this.data.editViewH,
          imageViewW: this.data.editViewH * image_ratio
        })
      }
      else
      {
        //竖向
        this.setData({
          imageViewH: this.data.editViewW * image_ratio,
          imageViewW: this.data.editViewW,
        })
      }
      
      console.log("按宽度调整，this.data.imageViewH=" + this.data.imageViewH)
      console.log("按宽度调整，this.data.imageViewW=" + this.data.imageViewW)
    }

    
    //图片加载后，显示切割图层
    let ctx = wx.createCanvasContext("cutcanvas")
    this.ctx = ctx
    this.drawCut()
    this.edgeRects = Array(this.topRect, this.btmRect, this.leftRect, this.rightRect) // 上下左右
    wx.hideLoading()
  },

  cutStart: function(e) {
    this.dir = -1
    this.startX = e.changedTouches[0].x
    this.startY = e.changedTouches[0].y
    console.log("start X:" + this.startX + " start Y:" + this.startY)
    for(let i = 0; i < 4; i ++){
      let v = this.edgeRects[i]
      if (this.startX > v.x && this.startX < v.x + v.w && this.startY > v.y && this.startY < v.y + v.h){
        this.dir = i;
        console.log("touch dir rect:"+i)
        break
      }
    }
  },

  cutMove: function(e)
  {
    if (this.dir < 0) return
    
    var startX1 = e.changedTouches[0].x
    var startY1 = e.changedTouches[0].y

    let calX = startX1 - this.startX
    let calY = startY1 - this.startY
    
    let i = this.dir //不是方向本身，是指哪个方向的矩形
    if (i == 0) {
      //console.log("top rect move")
      if (this.data.cutViewH - calY < this.data.cutViewW) {
        return
      }
      this.data.cutViewTop += calY     
      this.data.cutViewH -= calY
      
    } else if (i == 1) {
      if (this.data.cutViewH + calY < this.data.cutViewW) return;
      this.data.cutViewH += calY
      //down
    } else if (i == 2) {
      if (this.data.cutViewW - calX > this.data.cutViewH) return;
      this.data.cutViewLeft += calX
      this.data.cutViewW -= calX
      //left
    } else {
      //right
      if (this.data.cutViewW + calX > this.data.cutViewH) return;
      this.data.cutViewW += calX
    }

    
    this.drawCut()
    this.startX = startX1
    this.startY = startY1
  },

  drawCut: function () {
    let ctx = this.ctx
    let w = this.data.rotate_degree == 90 ? this.data.editViewH : this.data.editViewW
    var touchH = w / 15

    ctx.setFillStyle('green')
    let cutRect = {
      x: this.data.cutViewLeft,
      y: this.data.cutViewTop,
      w: this.data.cutViewW,
      h: this.data.cutViewH
    }


    ctx.globalAlpha = 0.2
    ctx.fillRect(cutRect.x, cutRect.y, cutRect.w, cutRect.h)

    ctx.setFillStyle('blue')
    let topRect = {
      x: this.data.cutViewLeft + this.data.cutViewW / 4,
      y: this.data.cutViewTop,
      w: this.data.cutViewW / 2,
      h: touchH
    }
    ctx.fillRect(topRect.x, topRect.y, topRect.w, topRect.h)

    let btmRect = {
      x: this.data.cutViewLeft + this.data.cutViewW / 4,
      y: this.data.cutViewTop + this.data.cutViewH - touchH,
      w: this.data.cutViewW / 2,
      h: touchH
    }
    ctx.fillRect(btmRect.x, btmRect.y, btmRect.w, btmRect.h)

    let leftRect = {
      x: this.data.cutViewLeft,
      y: this.data.cutViewTop + this.data.cutViewH / 4,
      w: touchH,
      h: this.data.cutViewH / 2
    }
    ctx.fillRect(leftRect.x, leftRect.y, leftRect.w, leftRect.h)


    let rightRect = {
      x: this.data.cutViewLeft + this.data.cutViewW - touchH,
      y: this.data.cutViewTop + this.data.cutViewH / 4,
      w: touchH,
      h: this.data.cutViewH / 2
    }
    ctx.fillRect(rightRect.x, rightRect.y, rightRect.w, rightRect.h)

    ctx.draw()
    this.leftRect = leftRect
    this.rightRect = rightRect
    this.topRect = topRect
    this.btmRect = btmRect
  },

  cutEnd: function(e){
    if (this.dir < 0) return
    this.edgeRects = Array(this.topRect, this.btmRect, this.leftRect, this.rightRect)
  },



  confirm: function(e) {
    //clear canvas1 , crop image into canvas2
    wx.showLoading({
      title: '剪裁中...',
    })
    console.log("confirm..")
    app.globalData.editdata = this.data;
    //wx.redirectTo({
    wx.navigateTo({
      url: '../editor2/editor2',
    })
  },


})