camera()

viewer()
  .transform({ rotation: orientation })
  .array({
    id: "first",
    data: s.m[0],
    width: s.past,
    channels: 2
  })
  .point({
    points: "#first",
    color: "green",
    size: 20,
    blending: THREE.SubtractiveBlending
  })
  .text({
    font: 'monospace',
    style: 'bold',
    width:  s.past,
    height: 1,
    items: 1,
    depth:  1,
    expr: function(emit,i,j,time) {
      var th = s.m[0],
          x = th[i*2 % s.past].toFixed(2),
          y = th[((i*2)+1) % s.past].toFixed(2);
      emit(x + "," + y);
    }
  })
  .label({
    color: '#000000',
    snap: false,
    outline: 2,
    size: 14,
    offset: [0, -2],
    depth: .5,
    zIndex: 1,
    zBias: 1
  })

mathbox.select("transform").bind("rotation", function(time, delta) {
  return orientation
})
