const app = getApp()
// pages/done.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    editted_image: "",
    cutted_image: "",
    rotate_value: 90,
    kemu_selected: ["语文","数学",],
    kemu_unselected:["外语"],
    kemu_sel:[],
    source: [{
        name: "单元测试",
        show: "inline",
        times: 1
      },
      {
        name: "学而思",
        show: "inline",
        times: 1
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideLoading()
    console.log(options)
    let ratio = app.globalData.editdata.cutViewH / app.globalData.editdata.cutViewW
    let cH = app.globalData.editdata.windowWidth / ratio

    this.data.canvasH = cH
    this.data.canvasW = app.globalData.editdata.windowWidth

    console.log("done.....onload", this.data.canvasW, this.data.canvasH)
    console.log("done.....onload", app.globalData.createdImageW, app.globalData.createdImageH)

    //wx.saveImageToPhotosAlbum({
    //  filePath: options.edit,
    //  success(res) {
    //    console.log("文件:" + res.savedFilePath)
    //  }
    //})

    this.setData({
      canvasH: cH,
      canvasW: app.globalData.editdata.windowWidth,
      cutted_image: options.cut,
      editted_image: options.edit
    })

    this.tuyaImgPath = options.edit
    this.cutImgPath = options.cut

    let _this = this
    var promise = new Promise(function(resolve, fail) {
      wx.getImageInfo({
        src: options.edit,

        success(res) {
          console.log(res.width)
          console.log(res.height)
          resolve(res.width, res.height)
        },
        fail(res) {
          console.log("error", res)
        }
      })
    })

    promise.then(function(w, h) {
      _this.drawImage(w, h)
    })


  },

  drawImage(w, h) {
    let tiganCtx = wx.createCanvasContext("tigan_canvas")
    tiganCtx.save()
    tiganCtx.translate(this.data.canvasW / 2, this.data.canvasH / 2)
    tiganCtx.rotate(-90 * Math.PI / 180)
    tiganCtx.arc(0, 0, this.data.canvasW / 2, 0, 2 * Math.PI);
    tiganCtx.fill()
    tiganCtx.drawImage(this.tuyaImgPath, 0, 0, w, h, -this.data.canvasH / 2, -this.data.canvasW / 2, this.data.canvasH, this.data.canvasW)
    tiganCtx.draw()
    tiganCtx.restore()

    let cutCtx = wx.createCanvasContext("yuantu_canvas")
    cutCtx.save()
    cutCtx.translate(this.data.canvasW / 2, this.data.canvasH / 2)
    cutCtx.rotate(-90 * Math.PI / 180)
    cutCtx.drawImage(this.cutImgPath, 0, 0, w, h, -this.data.canvasH / 2, -this.data.canvasW / 2, this.data.canvasH, this.data.canvasW)
    cutCtx.draw()
    cutCtx.restore()

  },

  remove: function(e) {
    console.log(e)
    let id = e.currentTarget.id
    let this_ = this
    wx.showModal({
      content: '删除当前选择的条目',
      success(res) {
        if (res.confirm) {
          console.log('确定')
          this_.data.kemu.forEach(function(e) {
            console.log(e)
            console.log(id)
            if (e.name == id) {
              e.show = "none"
              console.log(e, "set none")
              this_.setData({
                kemu: this_.data.kemu
              })
            }
          })
        } else if (res.cancel) {
          console.log('取消')
        }
      }
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