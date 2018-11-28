const app = getApp()
//var stack = require("stack.js")
var ActionUtil = require("drawAction.js");
Page({
  data: {
    editViewW: 0,
    editViewH: 0,

    canvasW2: 0,
    canvasH2: 0,

    canvasList: new Array(),

    arc_radius: 10,

    rect_display: "block",
    
    cutcanvas_display: "block",
    cutcanvas2_display: "none"
  },

  onReady: function() {
    console.log("----------------------")
    wx.hideLoading(4)

    var ctx = wx.createCanvasContext("cutcanvas")
    this.cutCtx = ctx
    var ctx = wx.createCanvasContext("cutcanvas2")
    this.cutCtx2 = ctx
    this.drawAction.clear()
  },

  onLoad: function(option) {
    this.drawAction = new ActionUtil.DrawAction()
    this.editdata = app.globalData.editdata
    console.log(this.editdata)
    //edit view
    this.setData({
      editViewW: this.editdata.editViewH, //第一步中view旋转了90度
      editViewH: this.editdata.editViewW,
    })

    this.data.arc_radius = this.data.editViewW / 25

    //ratio
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
  },

  eraserSet: function(e) {
    let id = e.target.id
    console.log("eraserSet id:" + id)
    switch (id) {
      case "rectangle":
        this.setData({
          rect_display: "block"
        })
        break;
      case "circle":
        if (this.data.rect_display == "block") {
          this.setData({
            rect_display: "none"
          })
        }

        break;
      case "recover":
        this.recover()
        break;
      case "ok":

        break;
    }
  },

  recover: function() {
    
    if(this.drawAction.pop())
    {
      wx.showLoading({
        title: '清除涂鸦痕迹',
      })
    }
    else
    {
      wx.showToast({
        title: '已清除完毕',
      })
    }
    let hide = 0
    if (this.data.cutcanvas2_display == "none")
    {
      hide = 1
      this.drawAction.setCtx(this.cutCtx2)
      this.drawAction.draw()
      this.setData({
        cutcanvas2_display: "block"
      })
    }
    else
    {
      hide = 2
      this.drawAction.setCtx(this.cutCtx)
      this.drawAction.draw()
      this.setData({
        cutcanvas_display: "block"
      })
    }
    

    let this_ = this
    setTimeout(function () {
      console.log("----Countdown----");
      if(hide == 1)
      {
        this_.setData({
          cutcanvas_display: "none"
        })
        this_.cutCtx.clearRect(0,0, this_.data.canvasW2, this_.data.canvasH2)
        this_.cutCtx.draw()
      }
      else{
        this_.setData({
          cutcanvas2_display: "none"
        })
        this_.cutCtx2.clearRect(0, 0, this_.data.canvasW2, this_.data.canvasH2)
        this_.cutCtx2.draw()
      }
      
      wx.hideLoading()
    },500);
    
  },

  cutStart: function(e) {
    console.log("cut  start...")

    this.startX = e.changedTouches[0].x
    this.startY = e.changedTouches[0].y
    let ctx = this.cutCtx
    if (this.data.cutcanvas2_display == "block") {
      ctx = this.cutCtx2
    }
    ctx.setStrokeStyle('white')
    ctx.setFillStyle('#F0F0F0')
    ctx.setLineCap('round')
    ctx.setLineJoin('round')
    ctx.setLineWidth(this.data.arc_radius * 2)
    ctx.save()

    ctx.beginPath()
    ctx.arc(this.startX, this.startY, this.data.arc_radius, 0, 2 * Math.PI);
    ctx.fill()
    ctx.draw(true)

    this.drawAction.addActionData({
      type: 0,
      radius: this.data.arc_radius,
      x: this.startX,
      y: this.startY
    })

  },

  cutMove: function(e) {
    
    var startX1 = e.changedTouches[0].x
    var startY1 = e.changedTouches[0].y
    let calX = startX1 - this.startX
    let calY = startY1 - this.startY

    if (Math.pow((calX * calX + calY * calY), 0.5) <= this.data.arc_radius + 3) {
      return;
    }

    let ctx = this.cutCtx
    if (this.data.cutcanvas2_display == "block") {
      ctx = this.cutCtx2
    }

    this.drawAction.addActionData({
      type: 1,
      x: this.startX,
      y: this.startY,
      x2: startX1,
      y2: startY1,
      lineWidth: this.data.arc_radius * 2
    })

    console.log("touch move ,lineWidth:", this.data.arc_radius * 2)
    ctx.moveTo(this.startX, this.startY)
    ctx.lineTo(startX1, startY1)
    ctx.stroke()
    ctx.draw(true)

    this.startX = startX1;
    this.startY = startY1;
  },

  cutEnd: function(e) {
    console.log("touch end...")
  },

  rectStart: function(e) {
    console.log("rect  start...")
    this.rectX = e.changedTouches[0].x
    this.rectY = e.changedTouches[0].y
    var ctx = wx.createCanvasContext("rectcanvas")
    this.rectCtx = ctx
    ctx.setLineDash([10, 5]);
    this.rectCtx.save()
    this.rectEraser = false
  },

  rectMove: function(e) {
    this.rectEraser = true
    this.rectX1 = e.changedTouches[0].x
    this.rectY1 = e.changedTouches[0].y
    //if(Math.abs(this.rectX1 - this.rectX) < 10 || Math.abs(this.rectY1 - this.rectY))
    {
      //return
    }
    //console.log("move to: x=" + this.rectX1 + " y=" + this.rectY1)
    var ctx = this.rectCtx
    ctx.setStrokeStyle('white')
    ctx.strokeRect(this.rectX, this.rectY, this.rectX1 - this.rectX, this.rectY1 - this.rectY)
    ctx.draw()
  },

  rectEnd: function(e) {
    if (this.rectEraser == false) return;

    this.rectCtx.clearRect(this.rectX - 4, this.rectY - 4, this.rectX1 - this.rectX + 8, this.rectY1 - this.rectY + 8)
    this.rectCtx.draw()

    let ctx = this.cutCtx
    if(this.data.cutcanvas2_display == "block")
    {
      ctx = this.cutCtx2
    }
    
    
    ctx.setFillStyle('#F0F0F0')
    let w = this.rectX1 - this.rectX
    let h = this.rectY1 - this.rectY
    ctx.fillRect(this.rectX, this.rectY, w, h)
    ctx.draw(true)

    this.drawAction.addActionData({
      type: 2,
      x: this.rectX,
      y: this.rectY,
      w: w,
      h: h
    })
  }
})