const app = getApp()
//var stack = require("stack.js")
var util = require("util.js")
var ActionUtil = require("drawAction.js");
Page({
  data: {
    editViewW: 0,
    editViewH: 0,

    canvasW: 0,
    canvasH: 0,

    canvasList: new Array(),

    arc_radius: 10,

    rect_display: "block",
    tuya_canvas_display: "block",
    tuya_canvas2_display: "none",

    circle_image: "circlem",
    rect_image: "rect_s"
  },

  onReady: function() {
    console.log("----------------------")
    this.tohide = "nothing"
    this.tuyaCtx = wx.createCanvasContext("tuya_canvas")
    this.tuyaCtx2 = wx.createCanvasContext("tuya_canvas2")
    this.drawAction.clear()
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
    console.log("edit2 ... unload")
  },
  onLoad: function(option) {
    this.drawAction = new ActionUtil.DrawAction()
    this.editdata = app.globalData.editdata
    console.log(this.editdata)

    let h = this.editdata.rotate_degree > 0 ? this.editdata.editViewW : this.editdata.editViewH
    let w = this.editdata.rotate_degree > 0 ? this.editdata.editViewH : this.editdata.editViewW

    //ratio 预计算
    var cut_ratio = this.editdata.cutViewH / this.editdata.cutViewW
    var editview_ratio = h / w

    //注意！！！！EditView是和window size看齐的
    this.setData({
      editViewW: w,
      editViewH: h,
    })


    if (cut_ratio > editview_ratio) {
      //按高度适配到window height
      this.setData({
        canvasH: h,
        canvasW: h / cut_ratio
      })
    } else {
      //按宽度适配到window width
      this.setData({
        canvasW: w,
        canvasH: w * cut_ratio
      })
    }

    console.log("canvasW:" + this.data.canvasW)
    console.log("canvasH:" + this.data.canvasH)
    this.data.canvasList[0] = wx.createCanvasContext("mycanvas")
    this.data.canvasList[1] = wx.createCanvasContext("image_canvas")

    this.currentCanvas = 1
    this.data.arc_radius = this.data.editViewW / 25
    //this.drawImage(0)
    this.drawImage(1)
    this.setData({
      cutTop: (this.data.editViewH - this.data.canvasH) / 2,
      cutLeft: (this.data.editViewW - this.data.canvasW) / 2,
    })
  },

  getCanvasSize(canvasIndex) {
    return {
      "H": this.data.canvasH,
      "W": this.data.canvasW
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

    let h = this.editdata.rotate_degree > 0 ? this.editdata.editViewW : this.editdata.editViewH
    let w = this.editdata.rotate_degree > 0 ? this.editdata.editViewH : this.editdata.editViewW


    if (this.editdata.rotate_degree > 0) {
      //横向旋转图片 - 横拍
      console.log("旋转图片")
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

    } else {

      //无旋转图片，或者竖拍
      console.log("无旋转图片")
      var horizon_offset = (this.editdata.editViewW - this.editdata.imageViewW) / 2
      var column_offset = (this.editdata.editViewH - this.editdata.imageViewH) / 2
      console.log("column_offset:" + column_offset)
      console.log("horizon_offset:" + horizon_offset)

      var sx = this.editdata.imageW * (this.editdata.cutViewLeft - horizon_offset) / this.editdata.imageViewW

      var sy = this.editdata.imageH * (this.editdata.cutViewTop - column_offset) / this.editdata.imageViewH

      var swidth = this.editdata.imageW * this.editdata.cutViewW / this.editdata.imageViewW
      var sheight = this.editdata.imageH * this.editdata.cutViewH / this.editdata.imageViewH

      console.log(sx)
      console.log(sy)
      console.log(swidth)
      console.log(sheight)

      ctx.drawImage(this.editdata.imagePath, sx - 2, sy - 2, swidth + 4, sheight + 4, 0, 0, size.W, size.H)
    }
    ctx.draw(false, this.hideLoading)
    ctx.restore()
  },

  hideLoading: function() {
    console.log("hide loading callback....")
    wx.hideLoading()
  },

  eraserSet: function(e) {
    let id = e.target.id
    console.log("eraserSet id:" + id)
    switch (id) {
      case "rectangle":
        if (this.data.rect_display == "none") {
          let img = util.unselect_circle_image(this.data.circle_image)
          this.setData({
            rect_display: "block",
            rect_image: "rect_s",
            circle_image: img
          })
        }

        break;
      case "circle":
        let newcircle = util.update_circle_image(this.data.circle_image)
        console.log("newcircle img", newcircle)

        if (this.data.rect_display == "block") {
          this.setData({
            rect_display: "none",
            rect_image: "rect",
            circle_image: newcircle,
          })
        } else {
          this.setData({
            rect_image: "rect",
            circle_image: newcircle,
          })
          if (newcircle == "circles_s") {
            this.data.arc_radius = this.data.editViewW / 35
          } else if (newcircle == "circlem_s") {
            this.data.arc_radius = this.data.editViewW / 25
          } else if (newcircle == "circlel_s") {
            this.data.arc_radius = this.data.editViewW / 20
          }
        }

        break;
      case "recover":
        this.recover()
        break;
      case "ok":

        wx.showLoading({
          title: '编辑完成',
        })

        //this.drawAction.setCtx(_this.ctx)
        //_this.drawAction.draw(_this.okCB, true) 
        this.saveOriginalImage()
        break;
    }
  },

  saveOriginalImage: function() {
    let _this = this
    var promis = new Promise(function(resolve, reject) {
      
      wx.canvasToTempFilePath({
        canvasId: "image_canvas",
        quality: 1.0,
        success: function(res) {
          _this.data.cutted_image = res.tempFilePath
          console.log("编辑原题目: " + _this.data.cutted_image)
          resolve(res.tempFilePath)
        },
        fail: function(res) {
          console.log("保存原题失败:", res)
        }
      })
    })

    promis.then(function(res) {
      console.log("tuya start ...")
      _this.drawAction.setCtx(_this.ctx)
      _this.drawAction.draw(_this.okCB, true)
    })
  },

  okCB: function() {
    console.log("tuya finish callback")
    let _this = this
    var promis = new Promise(function(resolve, reject) {
      wx.canvasToTempFilePath({
        canvasId: "image_canvas",
        quality: 1.0,
        success: function(res) {
          _this.data.editted_image = res.tempFilePath
          console.log("编辑后题目: " + _this.data.editted_image)
          resolve(res.tempFilePath)
        },
        fail: function(res) {
          console.log("failed:", res)
        }
      })
    })

    promis.then(function(res) {
      app.globalData.createdImageW = _this.data.canvasW
      app.globalData.createdImageH = _this.data.canvasH
      let img1 = _this.data.cutted_image
      let img2 = _this.data.editted_image
      wx.redirectTo({
        url: '../done/done?cut=' + img1 + "&edit=" + img2,
      })
    })
  },

  recover: function() {
    if (this.drawAction.pop()) {
      this.setData({
        tuya_canvas2_display: "block",
        tuya_canvas_display: "block",
      })
      wx.showLoading({
        title: '清除涂鸦痕迹',
      })
    } else {
      wx.showToast({
        title: '已清除完毕',
      })
      return
    }

    if (this.data.tuya_canvas2_display == "none") {
      this.tohide = "tuya_canvas"
      this.drawAction.setCtx(this.tuyaCtx2)
      this.drawAction.draw(this.drawCB)

    } else {
      this.tohide = "tuya_canvas2"
      this.drawAction.setCtx(this.tuyaCtx)
      this.drawAction.draw(this.drawCB)

    }
  },

  drawCB: function() {
    let that = this
    setTimeout(function() {
      console.log("----drawcallback----");
      if (that.tohide == "tuya_canvas") {
        that.setData({
          tuya_canvas_display: "none"
        })

      } else {
        that.setData({
          tuya_canvas2_display: "none"
        })

      }
      wx.hideLoading()
    }, 300)

  },


  ////////////////////////////////////////////////////////////////
  //
  //以下为涂鸦：点 线 矩形
  //
  ////////////////////////////////////////////////////////////////


  tuyaStart: function(e) {
    console.log("cut  start...")

    this.startX = e.changedTouches[0].x
    this.startY = e.changedTouches[0].y
    let ctx = this.tuyaCtx
    if (this.data.tuya_canvas2_display == "block") {
      ctx = this.tuyaCtx2
    }
    ctx.setStrokeStyle('white')
    ctx.setFillStyle('white')
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

  tuyaMove: function(e) {

    var startX1 = e.changedTouches[0].x
    var startY1 = e.changedTouches[0].y
    let calX = startX1 - this.startX
    let calY = startY1 - this.startY

    if (Math.pow((calX * calX + calY * calY), 0.5) <= this.data.arc_radius + 3) {
      return;
    }

    let ctx = this.tuyaCtx
    if (this.data.tuya_canvas2_display == "block") {
      ctx = this.tuyaCtx2
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

  tuyaEnd: function(e) {
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
    if(Math.abs(this.rectX1 - this.rectX) < 15 || Math.abs(this.rectY1 - this.rectY) < 15)
    {
      console.log("rectmove ... return")
      return
    }
    //console.log("move to: x=" + this.rectX1 + " y=" + this.rectY1)
    var ctx = this.rectCtx
    ctx.setStrokeStyle('white')
    ctx.setLineDash([10, 5]);
    
    this.x = this.y = this.w = this.h = 0

    if (this.rectX1 < this.rectX && this.rectY1 < this.rectY){
      this.x = this.rectX1
      this.y = this.rectY1
      this.w = this.rectX - this.rectX1
      this.h = this.rectY - this.rectY1
      console.log("左上")
    }
    else if (this.rectX1 < this.rectX && this.rectY1 > this.rectY){
      this.x = this.rectX1
      this.y = this.rectY
      this.w = this.rectX - this.rectX1
      this.h = this.rectY1 - this.rectY
      console.log("左下")
    }
    else if (this.rectX1 > this.rectX && this.rectY1 < this.rectY)
    {
      this.x = this.rectX
      this.y = this.rectY1
      this.w = this.rectX1 - this.rectX
      this.h = this.rectY - this.rectY1

      console.log("右上")
    }
    else
    {
      this.x = this.rectX
      this.y = this.rectY
      this.w = this.rectX1 - this.rectX
      this.h = this.rectY1 - this.rectY
      console.log("右下")
    }
    
    ctx.strokeRect(this.x, this.y, this.w, this.h)
    ctx.draw()
  },

  rectEnd: function(e) {
    if (this.rectEraser == false) return;

    this.rectCtx.clearRect(this.rectX - 4, this.rectY - 4, this.rectX1 - this.rectX + 8, this.rectY1 - this.rectY + 8)
    this.rectCtx.draw()
    this.rectCtx  = null

    let ctx = this.tuyaCtx
    if (this.data.tuya_canvas2_display == "block") {
      ctx = this.tuyaCtx2
    }


    ctx.setFillStyle('white')
    let w = this.rectX1 - this.rectX
    let h = this.rectY1 - this.rectY
    //ctx.fillRect(this.rectX, this.rectY, w, h)
    ctx.fillRect(this.x, this.y, this.w, this.h)
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