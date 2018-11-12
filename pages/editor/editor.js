//logs.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    logs: [],
    canvasW: 300,
    canvasH: 227,
    cutViewW: 200,
    cutViewH: 200,
    cutViewTop: 0,
    cutViewLeft: 0,
    canvas_display: "block",
    canvas2_display: "none",
    cut_display: "block"
  },


  onLoad: function(option) {
    wx.getSystemInfo({
      success: res => {
        this.setData({
          canvasW: res.windowWidth,
          canvasH: res.windowHeight,
          cutViewW: res.windowWidth * 2 / 3,
          cutViewH: res.windowHeight * 2 / 3,
          cutViewLeft: res.windowWidth / 6,
          cutViewTop: res.windowHeight / 6,
        })
        console.log(res)
        console.log("window size: " + res.windowWidth + " " + res.windowHeight)
        console.log("screen size: " + res.screenWidth + " " + res.screenHeight)
      }
    })
    this.imagePath = option.path
  },

  drawCutImage: function(e) {
    console.log(e)
    let ctx = this.ctx
    ctx.save()
    
    console.log("图片的宽度 < 高度")
    ctx.translate(this.data.canvasW / 2, this.data.canvasH / 2)

    var image_ratio = this.imageH / this.imageW
    var canvas_ratio = this.data.canvasH / this.data.canvasW;

    console.log(" image_w=" + this.imageW + " image_h=" + this.imageH)
    console.log(" image_ratio=" + image_ratio + " canvas_ratio=" + canvas_ratio)

    if (image_ratio > canvas_ratio) {
      //按高度调整
      console.log("按高度调整，this.data.canvasH=" + this.data.canvasH)
      var offset = this.data.canvasW - this.data.canvasH / image_ratio

      console.log("offset=" + offset)
      ctx.drawImage(this.imagePath, offset / 2, 0, this.data.canvasH / image_ratio, this.data.canvasH)

    } else {
      console.log("按宽度调整，this.data.canvasH=" + this.data.canvasH)
      var offset = this.data.canvasH - this.data.canvasW * image_ratio

      console.log("offset=" + offset)
      ctx.drawImage(this.imagePath, 0, 0 + offset / 2, this.data.canvasW, this.data.canvasW * image_ratio)
    }

    ctx.draw()
  },

  drawImage: function(e) {
    console.log(e)

    let ctx = this.ctx
    ctx.save()

    if (this.imageW > this.imageH) {
      console.log("图片的宽度 > 高度")
      var image_ratio = this.imageW / this.imageH
      var canvas_ratio = this.data.canvasH / this.data.canvasW;

      console.log(" image_w=" + this.imageW + " image_h=" + this.imageH)
      console.log(" image_ratio=" + image_ratio + " canvas_ratio=" + canvas_ratio)

      ctx.translate(this.data.canvasW / 2, this.data.canvasH / 2)
      ctx.rotate(90 * Math.PI / 180)

      if (image_ratio > canvas_ratio) {
        //按高度调整
        console.log("按高度调整，this.data.canvasH=" + this.data.canvasH)
        var offset = this.data.canvasW - this.data.canvasH / image_ratio
        console.log("offset=" + offset)

        ctx.drawImage(this.imagePath, -this.data.canvasH / 2, -this.data.canvasW / 2 + offset / 2, this.data.canvasH, this.data.canvasH / image_ratio)
      } else {
        //
        console.log("按宽度调整，this.data.canvasH=" + this.data.canvasH)
        var offset = this.data.canvasH - this.data.canvasW * image_ratio

        console.log("offset=" + offset)
        ctx.drawImage(this.imagePath, -this.data.canvasH / 2 + offset / 2, -this.data.canvasW / 2, this.data.canvasW * image_ratio, this.data.canvasW)

      }
      ctx.draw()

    } else //竖向 - 剪裁后的图片
    {
      wx.showToast("只支持横向拍摄和剪裁！")
    }

    ctx.restore()
  },

  onReady: function() {
    console.log("image path=" + this.imagePath)
    wx.getImageInfo({
      src: this.imagePath,
      success: res => {
        this.imageW = res.width
        this.imageH = res.height
        const ctx = wx.createCanvasContext("mycanvas")
        this.ctx = ctx
        this.drawImage("canvas1")
      }
    })
  },

  touchStart: function(e) {
    //this.ctx.clearRect(0,0,this.data.canvasW, this.data.canvasH)
    console.log("bind touch start")
    console.log(e)

    this.startX = e.changedTouches[0].x
    this.startY = e.changedTouches[0].y

    //const ctx = wx.createCanvasContext("mycanvas")
    this.ctx.setStrokeStyle('white')
    this.ctx.setFillStyle('white')
    this.ctx.setLineCap('round')
    this.ctx.setLineJoin('round')
    this.ctx.setLineWidth(20)

    this.ctx.beginPath()
    this.ctx.arc(this.startX, this.startY, 10, 0, 2 * Math.PI);

    this.ctx.fill()
    this.ctx.draw(true)

    this.ctx.save()
    this.time = 0;
  },

  touchMove: function(e) {

    var startX1 = e.changedTouches[0].x
    var startY1 = e.changedTouches[0].y
    if (Math.abs(startX1 - this.startX) < 15 && Math.abs(startY1 - this.startY) < 15) {
      console.log("bind touch move  return")
      return;
    }

    console.log(e)
    console.log("this.startX1:" + this.startX)
    console.log("this.startY1:" + this.startY)

    console.log("startX1:" + startX1)
    console.log("startY1:" + startY1)

    this.ctx.moveTo(this.startX, this.startY)
    this.ctx.lineTo(startX1, startY1)
    this.ctx.stroke()
    this.ctx.draw(true)

    this.startX = startX1;
    this.startY = startY1;
  },

  touchEnd: function(e) {
    this.ctx.save();
    console.log("touch end...")
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

  cutViewDrag: function(e) {
    console.log("cutdown view cutViewDrag......................")
    if (e.timeStamp - this.time < 1000) {
      console.log("cutViewDrage return")
      //return
    }
    this.time = e.timeStamp

    console.log(e.target.id)
    console.log(e.changedTouches[0].clientX)
    console.log(e.changedTouches[0].clientY)
    let clientX = e.changedTouches[0].clientX
    let clientY = e.changedTouches[0].clientY
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

    let that = this
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      x: this.data.cutViewLeft,
      y: this.data.cutViewTop,
      width: this.data.cutViewW,
      height: this.data.cutViewH,
      destWidth: this.data.cutViewW,
      destHeight: this.data.cutViewH,
      success(res) {
        console.log(res.tempFilePath)
        that.setData({
          canvas_display: "none",
          canvas2_display: "block",
          cut_display: "none"
        })
        that.ctx.clearRect(0, 0, that.data.canvasW, that.data.canvasH)
        that.ctx.draw()
        const ctx2 = wx.createCanvasContext("mycanvas2")
        that.ctx = ctx2
        that.imagePath = res.tempFilePath
        that.imageW = that.data.cutViewW
        that.imageH = that.data.cutViewH
        that.drawImage("canvas2")
        //ctx2.drawImage(res.tempFilePath, 0, 0, that.data.canvasW, that.data.canvasH)
        //ctx2.draw();
      }
    })
  }
})