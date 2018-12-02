function update_circle_image(image)
{
  let img = ""
  if (image == "circlem") {
    img = "circlem_s"
  }
  else if (image == "circles") {
    img = "circles_s"
  } else if (image == "circlel") {
    img = "circlel_s"
  } else if (image == "circles_s") {
    img = "circlem_s"
  } else if (image == "circlem_s") {
    img = "circlel_s"
  } else if (image == "circlel_s") {
    img = "circles_s"
  }
  return img
}

function unselect_circle_image(image) {
  let img = image
  if (image == "circles_s") {
    img = "circles"
  } else if (image == "circlem_s") {
    img = "circlem"
  } else if (image == "circlel_s") {
    img = "circlel"
  }
  return img
}

module.exports = {
  update_circle_image: update_circle_image,
  unselect_circle_image: unselect_circle_image
}