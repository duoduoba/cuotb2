var top = 0;
var length = 3;
var data = Array(length)

function pop(){
 
  if (top < 0) {
    return null
  }

  top--
  console.log("pop finish, pop:" + top)
  return  data[top]
}

function push(res){
 
  console.log("push:" + res)
  if (top == length) {
    console.log("top:"+ top)
    let fm = wx.getFileSystemManager()
    fm.removeSavedFile({
      filePath: data[0],
      success(res){
        console.log("remove file success:" + data[0])
      }
    })
    for (let i = 0; i < length - 1; i++) {
      data[i] = data[i + 1];
    }
    top--
  }

  data[top] = res
  top++
  console.log("top:" + top)
}　　

function clear(){
  for (let i = 0; i < length ; i++) {
    if (data[i])
    {
      let fm = wx.getFileSystemManager()
      fm.removeSavedFile({
        filePath: data[i],
      })
    }
  }
}

module.exports = {
  push:push,
  pop:pop,
  clear: clear
}