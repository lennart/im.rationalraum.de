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
      position: [0, 0, 1.5]
    };
    this.mathbox.camera(options);
  },
  viewer: function viewer(w, h) {
    // Create cartesian view
    var ratio = w / h;
    return this.mathbox
      .cartesian({
        range: [[-1, 1], [-1, 1], [-1,1]],
        scale: [w/h, 1, 1],
      })    
  }
};
