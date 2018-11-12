//logs.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    logs: [],
    canvasW: 300,
    canvasH: 227,
    canvasTop: 10,
    cutViewW: 200,
    cutViewH: 200,
    cutViewTop: 0,
    cutViewLeft: 0,
  },


  onLoad: function (option) {
    wx.getSystemInfo({
      success: res => {
        this.setData({
          canvasW: res.windowWidth,
          canvasH: res.windowHeight,
          cutViewW: res.windowWidth * 2 / 3,
          cutViewH: res.windowHeight * 2 / 3,
          cutViewLeft: res.windowWidth / 6,
          cutViewTop: res.windowHeight / 6,
          canvasTop: res.windowHeight / 2 - res.windowWidth/2,
          background: option.path,
        })
        console.log(res)
        console.log("window size: " + res.windowWidth + " " + res.windowHeight)
        console.log("screen size: " + res.screenWidth + " " + res.screenHeight)
      }
    })
    this.imagePath = option.path
  },

  drawImage: function (t) {
    const ctx = wx.createCanvasContext("mycanvas")
    ctx.setFillStyle('red')
    ctx.fillRect(0,0,50,300)
    ctx.draw()
  },

  onReady: function () {
    console.log("image path=" + this.imagePath)
    wx.getImageInfo({
      src: this.imagePath,
      success: res => {
        this.imageW = res.width
        this.imageH = res.height
        this.drawImage()
      }
    })
  },

  touchStart: function (e) {
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

  touchMove: function (e) {
    if (e.timeStamp - this.time < 2000) return

    var startX1 = e.changedTouches[0].x
    var startY1 = e.changedTouches[0].y

    console.log("bind touch move")
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

  touchEnd: function (e) {
    this.ctx.save();
    console.log("touch end...")
  },

  dragDown: function (e) {
    console.log("touchmove......................")
    console.log(e)
    console.log(e.target.id)
    console.log(e.changedTouches[0].clientX)
    console.log(e.changedTouches[0].clientY)
  },

  cutViewDragStart: function (e) {
    this.time = 0;
    console.log("cutdown cutViewDragStart.....................")
  },

  cutViewDrag: function (e) {
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
          cutViewW: this.data.cutViewW - dis,
          cutViewLeft: this.data.cutViewLeft + dis
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
  confirm: function(e){
    
  },
})