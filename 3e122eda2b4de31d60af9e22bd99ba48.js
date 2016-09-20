camera()

viewer()
.transform({ rotation: orientation })
.matrix({
  id: "first", history: max,
  expr: stream(0, function(emit, t, x, y, z) {
    emit(x,y,z*0.1);
  }),
  width: 24, height: 24,
})
.matrix({
  id: "second", history: max,
  expr: stream(1, function(emit, t, x, y, z) {
    emit(t,t,t);
  }),
  width: 24, height: 24,
})
.surface({
  points: "#first",
  closed: true, shaded: true, fill: true, stroke: "dashed", lineX: true, lineY: true,
  colors: "#second", color: '#ffffff'
})

 
mathbox.select("transform").bind("rotation", function(time, delta) {
  return orientation
})
