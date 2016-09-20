require('script!mathbox');
module.exports = {
  init: function init() {
    // Load mathbox with controls
    mathbox = mathBox({
      plugins: [
        'core',
        'cursor',
        'controls',
        'stats'],
      controls: {
        klass: THREE.OrbitControls,
      },
    });
    window.mb = mathbox;
    if (mathbox.fallback) throw "WebGL error";
    // Set renderer background
    var three = mathbox.three;
    three.renderer.setClearColor(new THREE.Color(0xffffff), 1.0);
    this.$ = this.mathbox = mathbox;
    return this;
  },
  camera: function camera(options) {
    options = options || {
      proxy: true,
      fov: 120,
      position: [0, 0, 0.4]
    };
    this.mathbox.camera(options);
  },
  viewer: function viewer(w, h) {
    // Create cartesian view
    var ratio = w / h;
    return this.mathbox
      .cartesian({
        range: [[0, 1], [0, 1], [0, 1]],
        scale: [w/h, 1, 1],
      })
      .axis({
        width: 2
      })
      .axis({
        axis: 2,
        width: 2
      })
      .axis({
        axis: 3,
        width: 2
      })            
      .scale({
        divide: 10,
      })
      .ticks({
        width: 5,
        size: 3,
        classes: ['foo', 'bar'],
        color: 'red',
        zBias: 1

      })
      .format({
        digits: 2
      })
      .label({
        color: "red",
        zIndex: 1
      })
      .scale({
        divide: 10,
        axis:2
      })
      .ticks({
        width: 5,
        size: 3,
        classes: ['foo', 'bar'],
        color: 'red',
        zBias: 1
      })
      .format({
        digits: 2
      })
      .label({
        color: "red",
        zIndex: 1
      })
      .scale({
        divide: 10,
        axis: 3
      })
      .ticks({
        width: 5,
        size: 3,
        classes: ['foo', 'bar'],
        color: 'red',
        zBias: 1
      })
      .format({
        digits: 2
      })
      .label({
        color: "red",
        zIndex: 1
      })
      .grid({
        divideX: 20,
        divideY: 20
      })
  }
};
