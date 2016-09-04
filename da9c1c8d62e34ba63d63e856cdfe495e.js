camera()

viewer()
  .matrix({
    width: limits[0],
    height: limits[1],
    channels: 3,
    expr: ast(function(t) { return [1,1,0] })
  })
  .point({
    color: 0x3090FF,
    size: 20,
  })
  .text({
    font: 'monospace',
    style: 'bold',
    width:  points.length,
    height: 1,
    depth:  1,
    data: labels
  })
  .label({
    color: '#000000',
    snap: false,
    outline: 2,
    size: 14,
    offset: [0, -2],
    depth: .5,
    zIndex: 1,
  })
