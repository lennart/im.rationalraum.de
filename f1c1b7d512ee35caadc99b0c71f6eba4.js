camera()

viewer()
.transform({ rotation: orientation })
.matrix({
  id: "first", history: max,
  expr: stream(0, function(t) { return [sin(t),cos(t),sin(t)*0.1]; }),
  width: 24, height: 24,
})
.matrix({
  id: "second", history: max,
  expr: stream(1, function(t) {return [sin(t),cos(t),sin(t)*0.1]; }),
  width: 24, height: 24,
})
.matrix({
  id: "third", history: max,
  expr: stream(2, function(t) { return [sin(t),cos(t),sin(t)*0.1]; }),
  width: 24, height: 24,
})
.grow({ id:"sizes", scale: 25, width: 50 }).end()
.point({
  points: "#first",
  colors: "#second", color: '#ffffff'
})

mathbox.select('transform')
.bind('rotation', function(time, delta) {
 return orientation;
})     
