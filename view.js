module.exports = {
  init: function init() {
    // Load mathbox with controls
    var mathbox = mathBox({
      plugins: ['core', 'cursor', 'stats'],
      controls: {
        klass: THREE.OrbitControls,
      },
    });
    window.mb = mathbox;
    if (mathbox.fallback) throw "WebGL error";

    // Set renderer background
    var three = mathbox.three;
    three.renderer.setClearColor(new THREE.Color(0xffffff), 1.0);
    
    // Set mathbox units and place camera
//    mathbox.set({ scale: 720, focus: 1 });
    mathbox.camera({ proxy: true, position: [0, 0, 3] });

    var view = this.viewed(mathbox, window.innerWidth, window.innerhHeight);
    
    this.fielded(view);

    view
      .axis({
        axis: 1,
        width: 3
      })
      .axis({
        axis: 2,
        width: 3
      })
      .grid({
        width: 2,
        divideX: 20,
        divideY: 20
      });
    
    window.view = view;
    view.inspect();
    return {
      view: view,
      field: view.select('#field'),
      $: mathbox
    };
  },
  viewed: function viewed(mb, w, h) {
    // Create cartesian view
    return mb.cartesian({
      range: [[0, w], [0, h]],
      scale: [1, 1],
    });
  },
  fielded: function fielded(view) {
    view
      .array({
        id: 'field',
        data: [],
        width: 512,
        channels: 2
      })
      // .swizzle({
      //   source: '#field',
      //   order: 'xy'
      // })
      // .line({
      //   width: 500,
      //   color: 0xFF00ff,
      //   opacity: 1
      // })
      // .area({
      //   width: window.innerHeight,
      //   height: window.innerWidth,
      //   axes: [1, 2],
      //   channels: 3,
      //   // expr: function (emit, x, y, i, j, t) {
      //   //   var z = 2 * (Math.sin(x * 500 + Math.cos(x * y * 100) + t) * Math.sin(y * 503 + Math.sin(x * 40 + y * 60) + t));
      //   //   emit(x, -y, z);
      //   // }
      // })
      .point({
        color: [68/255, 174/255, 218/255],
        size: 4,
//        blending: 'add',
        opacity: .5,
        zWrite: false,
        zTest: false,
      });
  },
  animations: {
    helix: function(id, view, start, params) {
      var width = parseInt(params.coarse, 10);

      width = width == 0 ? 1 : width;
      view
        .group({
          id: id
        })
        .transform({
          position: [params.offset, 0, 0]
        })    
        .interval({
          width: parseInt(params.crush, 10),
          channels: 3,
          items: 2,
          expr: function (emit, x, i, time) {
            var theta = x + time;
            if (time > start) {
              emit(x, Math.sin(theta), Math.cos(theta));
            }
          },
        })
        .subdivide({ width: params.shape })
        .line({
          width: params.size,
          color: "green"
        })    
        .play({
          delay: 0,
          pace: params.sustain,
          script: [
            {props: { opacity: 1} },
            {props: { opacity: 0 } }
          ]
        })      
    }
  },
  makeAnimation: function(id, view, start, params) {
    var funcs = Object.keys(this.animations);

    if (funcs.indexOf(params.s) !== -1) {
      this.animations[params.s](id, view, start, params);
    }
    else {
      console.log("animation", params.s, "not found");
    }    
  }
};
