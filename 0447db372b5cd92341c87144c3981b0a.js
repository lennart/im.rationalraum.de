camera()

v.mathbox.select("camera").bind("position", function(t) { 
  return [
    Math.sin(m[0][Math.floor(t) % max]),
    Math.cos(m[0][(Math.floor(t) + 1) % max]),
    1];
})

viewer()
  .transform({ rotation: orientation })
  .matrix({
    id: "first", history: max,
    expr: stream(0, function(t) { return Math.sin(t * 2) * 0.125; }),
    width: 24, height: 24,
  })
  .rtt({
    history: 2,
    type: 'unsignedByte',
  })
  .shader({
    code: '#rtt-water',
  })
  .resample({
    indices:    3,
    channels: 4,
  })
  .compose({
    color: '#ffffff',
    zWrite: false,
  })
  .cartesian({
    range: [[-2, 2], [-1, 1], [-1, 1]],
    scale: [2, 1, 1],
  })
  .grid({
    divideX: 2,
    divideY: 2,
    zBias: 10,
    opacity: .25,
    color: 0xc0e0ff,
    width: 5,
  })
  .end()
  .end()
  .compose({
    color: '#fff',
    zWrite: false,
  })
