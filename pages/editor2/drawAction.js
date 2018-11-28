/*function rectIntersect(rc1, rc2) {
  console.log("rect inter")
  console.log(rc1)
  console.log(rc2)
  if (rc1.x + rc1.w > rc2.x &&
    rc2.x + rc2.w > rc1.x &&
    rc1.y + rc1.h > rc2.y &&
    rc2.y + rc2.h > rc1.y
  )
    return true;
  else
    return false;
}
function circleIntersect(c1, c2)
{
  let calX = c1.x - c2.x
  let calY = c1.y - c2.y
  let d = Math.pow((calX * calX + calY * calY), 0.5)
  return (d < c1.radius)
}
function circleRectIntersects(c, r) {
  let rect = {
    x: r.x + r.w / 2,
    y: r.y + r.h / 2,
    width: r.w,
    height: r.h
  }

  let circle = {
    x: c.x,
    y: c.y,
    r: c.radius
  }
  let circleDistance = {
    x: Math.abs(circle.x - rect.x),
    y: Math.abs(circle.y - rect.y)
  }


  if (circleDistance.x > (rect.width / 2 + circle.r)) { return false; }
  if (circleDistance.y > (rect.height / 2 + circle.r)) { return false; }

  if (circleDistance.x <= (rect.width / 2)) { return true; }
  if (circleDistance.y <= (rect.height / 2)) { return true; }

  
  var cornerDistance_sq = Math.pow(circleDistance.x - rect.width / 2, 2) +
    Math.pow(circleDistance.y - rect.height / 2, 2);

  return (cornerDistance_sq <= Math.pow(circle.r, 2));
}



DrawAction.prototype.restoreActions = function (tmpDataList)
{
  this.ctx.globalCompositeOperation = "source-over"
  this.ctx.setFillStyle('white')
  console.log("restore actions")

  for (let i = this.actions.length - 1; i > -1; i--) {
    let act = this.actions[i]
    console.log(act)
    let redo = false
    for (let j = tmpDataList.length - 1; j > -1; j--) {
      let pop = tmpDataList[j]
      console.log(pop)
      if (act.type == 0 && pop.type == 0 && circleIntersect(act, pop)) {
        redo = true
        break
      }
      else if (act.type == 1 && pop.type == 1 && rectIntersect(act, pop)) {
        redo = true
        break
      }
      else if (act.type == 0 && pop.type == 1 && circleRectIntersects(act, pop)) {
        redo = true
        break
      }
      else if (act.type == 1 && pop.type == 0 && circleRectIntersects(pop, act)) {
        redo = true
        break
      }

    }
    console.log("redo=" + redo)
    if(redo)
    {
      if(act.type == 0)
      {
        this.ctx.arc(act.x, act.y, act.radius / 2, 0, 2 * Math.PI)
        this.ctx.fill()
      }
      else if(act.type == 1)
      {
        this.ctx.rect(act.x, act.y, act.w, act.h)
        this.ctx.fill()
      }
      this.ctx.draw(true)
    }
    
  }
  
}
*/

function DrawAction() {
  this.actions = new Array()
  //0圆圈,1直线,2  矩形
  this.ctx = null
}

DrawAction.prototype.clear = function (ctx) {
  this.actions = new Array()
}

DrawAction.prototype.pop = function () {
  var top = this.actions.pop()
  if (!top)return false;
  console.log(top)

  while(top.type == 1)
  {
    top = this.actions.pop()
  }
  console.log("pop function finish")
  return true
}

DrawAction.prototype.setCtx = function(ctx) {
  this.ctx = ctx
  this.ctx.setStrokeStyle('white')
  this.ctx.setFillStyle('#F0F0F0')
  this.ctx.setLineCap('round')
  this.ctx.setLineJoin('round')
  this.ctx.save()
}


DrawAction.prototype.addActionData = function(p) {
  this.actions.push(p)
}


DrawAction.prototype.drawaArc = function (circle) {
  console.log("drawArc:")
  console.log(circle)
  this.ctx.beginPath()
  this.ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
  this.ctx.fill()
  this.ctx.closePath()
  //this.ctx.draw(true)
}

DrawAction.prototype.drawaLine = function(line) {
  console.log("drawaLine...")
  console.log("line w:"+line.lineWidth)
  this.ctx.setLineWidth(line.lineWidth)
  this.ctx.beginPath()
  this.ctx.moveTo(line.x, line.y)
  this.ctx.lineTo(line.x2, line.y2)
  this.ctx.stroke()
  this.ctx.closePath()
  //this.ctx.draw(true)
}

DrawAction.prototype.drawRectangle = function(rect) {
  this.ctx.fillRect(rect.x, rect.y, rect.w, rect.h)
  //this.ctx.draw(true)
}


DrawAction.prototype.draw = function() {
  console.log("draw ....")
  console.log(this.actions)
  
  for (let i = 0; i < this.actions.length; i++) {
    let act = this.actions[i]

    if (act.type == 0) {
      this.drawaArc(act)
    } else if (act.type == 1) {
      this.drawaLine(act)
    } else if (act.type == 2) {
      this.drawRectangle(act)
    }
  }
  this.ctx.draw()
}

module.exports.DrawAction = DrawAction