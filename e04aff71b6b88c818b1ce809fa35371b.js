camera()

viewer()
  .array({
    width: state.points.length,
    channels: 2,
    data: state.points
  })
  .point({
    color: 0x3090FF,
    size: 20,
  })
  .text({
    font: 'monospace',
    style: 'bold',
    width:  state.labels.length,
    height: 1,
    items: 1,
    depth:  1,
    data: state.labels
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
