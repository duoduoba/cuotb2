function DrawAction() {
  this.actions = new Array()
  this.type = 1 //0圆圈, 1 涂鸦,2 矩形

  this.brushW = 40
  this.ctx = null
}
 
DrawAction.prototype.clear = function (ctx) {
  this.actions = new Array()
}

DrawAction.prototype.pop = function () {
  var top = this.actions.pop()
  if (!top)return;
  console.log(top)
  this.ctx.setFillStyle('red')
  this.ctx.save()

  this.ctx.globalCompositeOperation = "destination-out"
  this.ctx.arc(top.x, top.y, this.brushW / 2 + 1, 0, 2 * Math.PI)
  this.ctx.fill()
  console.log('start loop')
  for(let i = this.actions.length- 1; i > -1; i --)
  {
    console.log(this.actions[i])
    let calX = this.actions[i].x - top.x
    let calY = this.actions[i].y - top.y
    let d = Math.pow((calX * calX + calY * calY), 0.5)
    if (d <=this.brushW)
    {
      top = this.actions.pop()
      this.ctx.arc(top.x, top.y, this.brushW / 2 + 4, 0, 2 * Math.PI)
      this.ctx.fill()
    }
    else
    {
      break
    }
  }
  this.ctx.draw(true)
  this.ctx.restore()
  console.log("pop function finish")
}

DrawAction.prototype.initCtx = function(ctx) {
  this.ctx = ctx
  this.ctx.setStrokeStyle('white')
  this.ctx.setFillStyle('white')
  this.ctx.setLineCap('round')
  this.ctx.setLineJoin('round')
  this.ctx.setLineWidth(this.brushW)
  this.ctx.save()
}

DrawAction.prototype.initActionType = function(actionType, brush) {
}

DrawAction.prototype.addActionData = function(p) {
  console.log("add action data :")
  this.actions.push(p)
  console.log(this.actions)
}

DrawAction.prototype.endAction = function() {
}

DrawAction.prototype.drawaArc = function (pointArray) {
  console.log("drawArc:")
  console.log(pointArray)
  for (let i = 0; i < pointArray.length; i++) {
    this.ctx.arc(pointArray[i].x, pointArray[i].y, this.brushW / 2, 0, 2 * Math.PI)
    this.ctx.fill()
  }
  this.ctx.draw(true)
}

DrawAction.prototype.drawaLine = function(pointArray) {
  if (pointArray.length < 2)return;

  this.ctx.beginPath()
  this.ctx.moveTo(pointArray[0].x, pointArray[0].y)
  for (let i = 1; i < pointArray.length; i++) {
    this.ctx.lineTo(pointArray[i].x, pointArray[i].y)
  }
  this.ctx.stroke()
  
}

DrawAction.prototype.drawRectangle = function(rect) {
  this.ctx.fillRect(rect.x, rect.y, rect.w, rect.h)
  this.ctx.draw(true)
}


DrawAction.prototype.draw = function() {
  console.log("draw ....")
  console.log(this.actions)
  
  this.ctx.setStrokeStyle('red')
  this.ctx.setFillStyle('red')
  this.ctx.setLineCap('round')
  this.ctx.setLineJoin('round')
  this.ctx.setLineWidth(this.brushW)
  this.ctx.save()

  for (let i = 0; i < this.actions.length; i++) {
    let act = this.actions[i]
    console.log(act.data)
    if (act.type == 0) {
      this.drawaArc(act.data)
    } else if (act.type == 1) {
      this.drawaLine(act.data)
    } else if (act.type == 2) {
      this.drawRectangle(act.data)
    }
  }
  this.ctx.draw()
}

module.exports.DrawAction = DrawAction