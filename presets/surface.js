camera()

viewer()
.transform({ rotation: orientation })
.matrix({
  id: "first", history: max,
  expr: stream(0, function(t) { return Math.sin(t * 2) * 0.125; }),
  width: 24, height: 24,
})
.matrix({
  id: "second", history: max,
  expr: stream(1, function(t) {return Math.sin(t); }),
  width: 24, height: 24,
})
.matrix({
  id: "third", history: max,
  expr: stream(2, function(t) { return Math.cos(t); }),
  width: 24, height: 24,
})
.grow({ id:"sizes", scale: 25, width: 50 }).end()
.shader({
  sources: ["#third"],
  code: "#resample-shader",
  id: "resample"
})
.resample({ source:"#resample", indices: 3, channels: 2 })
.surface({
  points: "#first",
  closed: true, shaded: true, fill: true, stroke: "dashed", lineX: true, lineY: true,
  colors: "#second", color: '#ffffff'
})


mathbox.select('transform')
.bind('rotation', function(time, delta) {
 return orientation;
})     
