camera()

viewer()
  .axis({
    zBias: -10,
    end: true,
    width: 10,
  })
  .axis({
    axis: 2,
    zBias: -10,
    end: true,
    width: 10,
  })
  .grid({
    divideX: 30,
    width: 10,
    opacity: 0.5,
    zBias: -10,
    axes: [1, 3],
  })
  .array({
    width: points.length,
    channels: 2,
    data: points
  })
  .point({
    color: 0x3090FF,
    size: 40,
  })
  // .text({
  //   font: 'Helvetica',
  //   style: 'bold',
  //   width:  16,
  //   height: 5,
  //   depth:  2,
  //   data: labels
  // })
  // .label({
  //   color: '#000000',
  //   snap: false,
  //   outline: 2,
  //   size: 24,
  //   offset: [0, -32],
  //   depth: .5,
  //   zIndex: 1,
  // })
