/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(2);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var view = __webpack_require__(2);

	view.init();


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = {
	  init: function init() {
	    // Load mathbox with controls
	    var mathbox = mathBox({
	      plugins: ['core', 'cursor', 'controls', 'stats'],
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
	    mathbox.set({ scale: 720, focus: 1 });
	    mathbox.camera({ proxy: true, position: [0, 0, 3] });
	    
	    // Create cartesian view
	    var view = mathbox.cartesian({
	      range: [[0, 4], [0, 1], [0, 1]],
	      scale: [1, 1, 1],
	    });
	    window.view = view;

	    return {
	      view: view,
	      $: mathbox
	    };
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


/***/ }
/******/ ]);