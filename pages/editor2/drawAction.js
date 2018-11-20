function DrawAction() {
  this.actions = new Array()
  this.type = 1 //0圆圈, 1 涂鸦,2 矩形
  this.points = new Array()
  this.brushW = 20
  this.ctx = null
}
 

DrawAction.prototype.initCtx = function(ctx) {
  this.ctx = ctx
  this.ctx.setStrokeStyle('red')
  this.ctx.setFillStyle('red')
  this.ctx.setLineCap('round')
  this.ctx.setLineJoin('round')
  this.ctx.setLineWidth(this.brushW)
}

DrawAction.prototype.initActionType = function(actionType, brush) {
  this.type = actionType
  this.points = new Array()
  this.brushW = brush
}

DrawAction.prototype.addActionData = function(p) {
  this.points.push(p)
}

DrawAction.prototype.endAction = function() {
  this.actions.push({
    type: this.type,
    data: this.points
  })

  console.log(this.actions)
}

DrawAction.prototype.drawaArc = function(x, y) {
  console.log("arc:" + x + " " +y)
  
  this.ctx.arc(x, y, this.brushW / 2, 0, 2 * Math.PI)
  this.ctx.fill()
  this.ctx.draw()
}

DrawAction.prototype.drawaLine = function(pointArray) {
  if (pointArray.length < 2)return;

  this.ctx.beginPath()
  this.ctx.moveTo(pointArray[0].x, pointArray[0].y)
  for (let i = 1; i < pointArray.length; i++) {
    this.ctx.lineTo(pointArray[i].x, pointArray[i].y)
  }
  this.ctx.stroke()
  this.ctx.draw()
}

DrawAction.prototype.drawRectangle = function(rect) {
  this.ctx.fillRect(rect.x, rect.y, rect.w, rect.h)
  this.ctx.draw()
}

DrawAction.prototype.popData = function() {
  this.actions.pop()
}

DrawAction.prototype.draw = function() {
  console.log("draw ....")
  console.log(this.actions)
  for (let i = 0; i < this.actions.length; i++) {
    let act = this.actions[i]
    console.log(act.data)
    if (act.type == 0) {
      this.drawaArc(act.data[0].x, act.data[0].y)
    } else if (act.type == 1) {
      this.drawaLine(act.data)
    } else if (act.type == 2) {
      this.drawRectangle(act.data)
    }
  }
}

module.exports.DrawAction = DrawAction