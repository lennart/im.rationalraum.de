module.exports = {
  init: function init() {
    // Load mathbox with controls
    mathbox = mathBox({
      plugins: [
        'core',
        'cursor',
        //'controls',
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
    this.$ = mathbox;
    return this;
  },
  camera: function camera() {
    this.mathbox.camera({ proxy: true, position: [0, 0, 1.5] });
  },
  viewer: function viewer(w, h) {
    // Create cartesian view
    var ratio = w / h;
    return this.mathbox
      .cartesian({
        range: [[-1, 1], [-1, 1], [-1,1]],
        scale: [w/h, 1, 1],
      })
      .axis({
        axis: 1,
        width: 3
      })
      .axis({
        axis: 2,
        width: 3
      })
      .axis({
        axis: 3,
        width: 3
      })
      .grid({
        width: 2,
        divideX: 20,
        divideY: 20      
      });
  }
};
