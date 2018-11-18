//logs.js
const util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    editViewW: 0,
    editViewH: 0,

    canvasW2: 0,
    canvasH2: 0,
    canvas2_display: "block",
    canvasList: new Array(),

    cutDisplay:"none"
  },

  onReady: function() {

  },

  onLoad: function(option) {
    wx.showLoading({
      title: '剪裁中，请稍后',
    })
    this.editdata = app.globalData.editdata
    console.log(this.editdata)
    //...
    this.setData({
      editViewW: this.editdata.editViewH, //第一步中view旋转了90度
      editViewH: this.editdata.editViewW,
    })
    console.log("canvasW:" + this.data.canvasW)
    console.log("canvasH:" + this.data.canvasH)

    var cut_ratio = this.editdata.cutViewH / this.editdata.cutViewW
    var editview_ratio = this.editdata.editViewW / this.editdata.editViewH
    if (cut_ratio > editview_ratio) {
      this.setData({
        canvasH2: this.editdata.editViewW,
        canvasW2: this.editdata.editViewW / cut_ratio
      })
    } else {
      this.setData({
        canvasW2: this.editdata.editViewH,
        canvasH2: this.editdata.editViewH * cut_ratio
      })
    }
    console.log("canvasW2:" + this.data.canvasW2)
    console.log("canvasH2:" + this.data.canvasH2)
    this.data.canvasList[0] = wx.createCanvasContext("mycanvas")
    this.data.canvasList[1] = wx.createCanvasContext("mycanvas2")
    this.currentCanvas = 1
    //this.drawImage(0)
    this.drawImage(1)
    this.setData({
      cutTop: (this.data.editViewH - this.data.canvasH2) / 2,
      cutLeft: (this.data.editViewW - this.data.canvasW2) / 2,
    })
  },

  getCanvasSize(canvasIndex) {
      return {
        "H": this.data.canvasH2,
        "W": this.data.canvasW2
      }
  },

  drawImage: function(canvasIndex) {
    console.log("drawImage:" + canvasIndex)

    var size = this.getCanvasSize(canvasIndex)
    console.info("size:")
    console.log(size)

    let ctx = this.data.canvasList[canvasIndex]
    this.ctx = ctx
    ctx.save()

    ctx.translate(size.W / 2, size.H / 2)
    ctx.rotate(90 * Math.PI / 180)

    var column_offset = (this.editdata.editViewW - this.editdata.imageViewW) / 2
    var horizon_offset = (this.editdata.editViewH - this.editdata.imageViewH) / 2
    console.log("column_offset:" + column_offset)
    console.log("horizon_offset:" + horizon_offset)

    var sx = this.editdata.imageW * (this.editdata.cutViewTop - column_offset) / this.editdata.imageViewW

    var sy = this.editdata.imageH * (this.editdata.editViewH - this.editdata.cutViewW - this.editdata.cutViewLeft - horizon_offset) / this.editdata.imageViewH

    var swidth = this.editdata.imageW * this.editdata.cutViewH / this.editdata.imageViewW
    var sheight = this.editdata.imageH * this.editdata.cutViewW / this.editdata.imageViewH

    console.log(sx)
    console.log(sy)
    console.log(swidth)
    console.log(sheight)

    ctx.drawImage(this.editdata.imagePath, sx - 2, sy - 2, swidth + 4, sheight + 4, -size.H / 2 - 1, -size.W / 2 - 1, size.H + 2, size.W + 2)

    ctx.draw()
    ctx.restore()

    wx.hideLoading(4)
  },

  touchStart: function(e) {
    //this.ctx.clearRect(0,0,this.data.canvasW, this.data.canvasH)
    console.log("bind touch start: " + this.currentCanvas)
    console.log(e)

    this.startX = e.changedTouches[0].x
    this.startY = e.changedTouches[0].y
    let ctx = this.ctx

    ctx.setStrokeStyle('white')
    ctx.setFillStyle('white')
    ctx.setLineCap('round')
    ctx.setLineJoin('round')

    ctx.setLineWidth(20)
    ctx.beginPath()
    ctx.arc(this.startX, this.startY, 10, 0, 2 * Math.PI);

    ctx.fill()
    ctx.draw(true)

    this.time = 0;

  },



  touchMove: function(e) {
    let ctx = this.ctx

    var startX1 = e.changedTouches[0].x
    var startY1 = e.changedTouches[0].y
    if (Math.abs(startX1 - this.startX) < 15 && Math.abs(startY1 - this.startY) < 15) {
      console.log("bind touch move  return")
      return;
    }

    ctx.moveTo(this.startX, this.startY)
    ctx.lineTo(startX1, startY1)
    ctx.stroke()
    ctx.draw(true)

    this.startX = startX1;
    this.startY = startY1;


  },

  touchEnd: function(e) {
    console.log("touch end...")
  },


  eraserSet: function(e) {
    this.eraserType = "ractangle"
    this.setData({
      cutDisplay: "block",
    })
  },

  cutStart: function(e) {
    console.log("cut  start...")
    this.cutX = e.changedTouches[0].x
    this.cutY = e.changedTouches[0].y
    console.log(this.cutX)
    console.log(this.cutY)
    
    var ctx = wx.createCanvasContext("cutcanvas")
    this.cutCtx = ctx
    this.cutCtx.save()
  },

  cutMove: function(e) {
    this.cutX1 = e.changedTouches[0].x
    this.cutY1 = e.changedTouches[0].y

    console.log("move to: x=" + this.cutX1 + " y=" + this.cutY1)
    var ctx = this.cutCtx

    ctx.setStrokeStyle('red')
    ctx.strokeRect(this.cutX, this.cutY, this.cutX1 - this.cutX, this.cutY1 - this.cutY)
    ctx.draw()
  },

  cutEnd: function(e){
    this.setData({
      cutDisplay: "none",
      canvas2_display: "block"
    })

    console.log("cut from("+this.cutX + " " + this.cutY+")")
    console.log("cut to(" + this.cutX1 + " " + this.cutY1 + ")")
    let ctx = this.ctx
    //ctx.fillRect(this.cutX, this.cutY, this.cutX1 - this.cutX, this.cutY1 - this.cutY)
    //ctx.clearRect(this.cutX, this.cutY, this.cutX1 - this.cutX, this.cutY1 - this.cutY)
    ctx.setFillStyle('white')
    ctx.fillRect(this.cutX, this.cutY, this.cutX1 - this.cutX, this.cutY1 - this.cutY)
    ctx.draw(true)
  }
})