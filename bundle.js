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

	var view = __webpack_require__(1),
	    cache = __webpack_require__(2),
	    css = __webpack_require__(3),
	    v = view.init(),
	    el = document.body,
	    lookback = 3 * 128,
	    points = new Float32Array(lookback),
	    tick = 0,
	    events = ['mousemove', 'touchmove'],
	    editor = document.querySelector("#editor"),
	    err = document.querySelector("#error"),     
	    log = document.querySelector("#log"),
	    orientation = [0,0,0];

	function orientate(win) {
	  if (window.DeviceOrientationEvent) {
	    win.addEventListener('deviceorientation', orient, false);
	  }
	  else {
	    err.innerText += "Device Orientation not supported, meh";
	  }
	}

	function fullscreen(el) {
	  el.webkitRequestFullscreen();
	}

	function gofullscreen(el) {
	  return function() {
	    el.removeEventListener('click', gofullscreen);
	    fullscreen(document.documentElement);
	  };
	}

	function setup(el, win) {
	  var editor = el.querySelector("#editor"),
	      button = el.querySelector("#eval");
	  editor.addEventListener('keydown', shiftReturn(replaceF));
	  button.addEventListener('click', replaceF);
	  orientate(win);
	  events.forEach(function(e) {
	    el.addEventListener(e, track);
	  });
	}


	function shiftReturn(f) {
	  return function(e) {
	    var self = this
	    if (e.keyCode === 13
	        && e.shiftKey) {
	      return f.apply(self, [e]);
	    }
	  };
	}

	function replaceF(e) {
	  var res, text = editor.innerHTML;
	  try {
	    shuffle(v.$);
	    res = eval(text);
	    err.innerText += res;
	  }
	  catch (e) {
	    err.innerText += e.toString();
	  }    
	  e.preventDefault(true);
	}


	function next() {
	  tick = (tick + 1) % lookback;
	  return tick;
	}

	function orient(e) {
	  if (typeof e.gamma === "number"
	      && typeof e.beta === "number"
	      && typeof e.alpha === "number") {
	    orientprime(e);
	  }
	  else {
	    err.innerText += ('invalid orientation event');
	  }
	}

	function orientprime(e) {
	  log.innerText = "gamma: " + e.gamma + "\n"
	    + "beta: "
	    + e.beta + "\n"
	    + "alpha: " + e.alpha;  
	  orientation = [e.beta, e.alpha, e.gamma]
	    .map(function(x) { return THREE.Math.degToRad(x); });  
	}

	function track(e) {
	  var i = 0, touches = e.touches, t, x, y, p, a;
	  e.preventDefault(true);
	  if (!touches) {
	    touches = [e];
	  }
	  for (i = 0; i < touches.length; i++) {
	    t = touches[i];
	    x = t.clientX / window.innerWidth;
	    x *= 2;
	    x -= 1;
	    y = t.clientY / window.innerHeight;
	    y *= -2;
	    y += 1;
	    p = new THREE.Vector3(x, y, 0);
	    a = new THREE.Euler(orientation[0],
	                        orientation[1],
	                        orientation[2]);
	    p.applyEuler(a);
	    points[next()] = p.x
	    points[next()] = p.y
	    points[next()] = p.z
	  }
	}

	// erase current root
	function shuffle($) {
	  debugger;
	  $.remove("root")
	  debugger;
	}

	cache.init(window);

	setup(el, window);
	window.points = points;
	//console.log("[mb]", mb);

	window.lookback = lookback;
	window.viewer = v.viewer;
	window.camera = v.camera;



/***/ },
/* 1 */
/***/ function(module, exports) {

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


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = {
	  init: function(win) {
	    win.addEventListener('load', function(e) {
	      console.log("[cache:init]");
	      this.cache(win, win.applicationCache);
	    }.bind(this), false);
	  },
	  cache: function(win, cache) {
	    cache.addEventListener('updateready', function(e) {
	      console.log("[cache:update]");
	      if (cache.status == cache.UPDATEREADY) {
	        cache.swapCache();
	        win.location.reload();
	      }
	    }, false);
	  }
	}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(4);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./node_modules/css-loader/index.js!./node_modules/postcss-loader/index.js!./style.css", function() {
				var newContent = require("!!./node_modules/css-loader/index.js!./node_modules/postcss-loader/index.js!./style.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, "body {\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  overflow: hidden;\n}\n\n#log {\n  position: fixed;\n  top: 0;\n  right: 0;\n  background-color: black;\n  color: white;\n  font-weight: bold;\n  font-family: monospace;\n  font-size: 0.8em;\n  width: 10em;\n  overflow-x: hidden;\n}\n\n#editor {\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  top: 0;\n  right: 0;\n  font-size: 2em;\n  width: 100%;\n  overflow: hidden;\n  padding-top: 40px;\n  background-color: rgba(0,0,0,0.3);\n  font-family: monospace;\n  color: white;\n  text-shadow: 1px 1px rgba(0,0,0,0.8);\n}\n\n#error {\n  position: fixed;\n  z-index: 100;\n  right: 0;\n  bottom: 0;\n  top: 0;\n  width: 50%;\n  overflow: hidden;\n  background-color: rgba(255,0,0,0.3);\n  color: white;\n  font-family: monospace;\n  font-size: 1.2em;\n}\n\n#eval {\n  position: fixed;\n  z-index: 1000;\n  right: 0;\n  bottom: 0;\n  \n}", ""]);

	// exports


/***/ },
/* 5 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);