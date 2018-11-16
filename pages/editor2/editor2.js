//logs.js
const util = require('../../utils/util.js')
const app = getApp()
const editdata = app.globalData.editdata
Page({
  data: {
    editViewW: 300,
    editViewH: 227,

    canvasW: 300,
    canvasH: 227,

    canvas_display: "block"
  },

  onReady: function() {
    //this.drawImage("canvas1")
  },

  onLoad: function(option) {
    this.setData({
      editViewW: editdata.editViewH, //第一步中view旋转了90度
      editViewH: editdata.editViewW,
      canvasW: editdata.cutViewW,
      canvasH: editdata.cutViewH,
    })
  },

  drawCutImage: function(e) {
    console.log(e)
    let ctx = this.ctx
    ctx.save()

    console.log(" 宽度  " + this.data.cutViewW)
    console.log(" 高度  " + this.data.cutViewH)
    console.log(" top  " + this.data.cutViewTop)
    console.log(" left  " + this.data.cutViewLeft)
    app.globalData.cutView = this.data
    //ctx.translate(this.data.canvasW / 2, this.data.canvasH / 2)

    ctx.drawImage(this.imagePath, 0, 0, this.data.cutViewW, this.data.cutViewH)

    ctx.draw()
    ctx.restore()
  },

  drawImage: function(e) {
    console.log(e)

    let ctx = this.ctx
    ctx.save()
    console.log("图片的宽度" + this.imageW)
    console.log("图片的高度" + this.imageH)

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

    } else //竖向 
    {
      wx.showToast("只支持横向拍摄！")
    }

    ctx.restore()
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
        that.drawCutImage("cut view ...")
      }
    })
  },

  cutScale: function(e) {
    console.log("放大..")
    this.setData({
      cutViewW: this.data.cutViewW + 20,
      cutViewH: this.data.cutViewH + 40
    })
    wx.canvasGetImageData({
      canvasId: 'mycanvas2',
      x: 0,
      y: 0,
      width: this.data.cutViewW,
      height: this.data.cutViewH,
      success: res => {
        console.log(res.width) // 100
        console.log(res.height) // 100
        console.log(res.data instanceof Uint8ClampedArray) // true
        console.log(res.data.length) // 100 * 100 * 4
        this.ctx.scale(1.2, 1.2)
        wx.canvasPutImageData({
          canvasId: 'mycanvas2',
          data: res.data,
          x: 0,
          y: 0,
          width: this.data.cutViewW,
          height: this.data.cutViewH
        })
      }
    })



  }
})