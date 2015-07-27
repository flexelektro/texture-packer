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

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Algo = __webpack_require__(2);


	var RP =  function(elements,confobj){
	    var RP = function(els,conf){
	        var elements = ( (els.length > 0) &&  (els instanceof Array) ) ?  els : console.error("No Elements my friend");
	        var conf = conf || {};
	        var config = {
	            "padding":conf.padding || 2,
	            //"atlasPadding": conf.atlaspadding || 1
	            //"cutfiles": conf.cutfiles || false,
	            //"forceRect":conf.forceRect || false
	        }

	        var cleanElements = function(els){
	            var clean = function(s){
	                if((typeof s == 'string') || (s instanceof String)){
	                    var c = parseFloat(s.replace("px",""));
	                    return c;
	                }
	                return s;
	            };
	            els.forEach(function(el){
	                el.height = clean(el.height);
	                el.width = clean(el.width);
	            });
	            return els;
	        }

	        var sortedByHeightElements = function(elements){
	            return elements.slice(0).sort(function(a,b){
	                if(a.height > b.height)return -1;
	                return 1;
	            });

	        }

	        var init = function(elements,config){
	            var sortedElements = sortedByHeightElements(cleanElements(elements));
	            if(config.padding){
	                sortedElements.forEach(function(el){
	                    el.width += 2*config.padding;
	                    el.height += 2*config.padding;
	                });
	            }
	            var area = 0;
	            sortedElements.forEach(function(el,idx){
	                var elarea = el.width*el.height;
	                area += elarea;
	            });
	            area *= 1.1;
	            var sidelength = Math.sqrt(area);

	            var theData = new Algo(sortedElements,sidelength,sidelength);

	            var els = theData.elements;
	            els.forEach(function(el){

	                delete(el.fit);
	                if(config.padding){
	                    el.x += config.padding;
	                    el.y += config.padding;
	                    el.width -= config.padding;
	                    el.height -= config.padding;
	                }

	            });
	            return {
	                elements:els,
	                atlasSize:{
	                    width:theData.size.width,
	                    height:theData.size.height
	                }
	            };
	        }

	        return init(elements,confobj);
	    }
	    return new RP(elements,confobj);
	}

	module.exports = RP;

/***/ },
/* 2 */
/***/ function(module, exports) {

	var BinPackingAlgorithm = function(blocks,w,h){
	    this.root = {x:0,y:0,w:w,h:h}

	    this.fit = function(blocks){
	        var n,node,block;
	        for(n = 0; n < blocks.length;n++){
	            block = blocks[n];
	            if(node = this.findNode(this.root,block.width,block.height)){
	                block.fit = this.splitNode(node, block.width,block.height);
	                block.x = block.fit.x;
	                block.y = block.fit.y;
	            }else{
	                this.root = this.growForNode(this.root,block.width,block.height);
	                if(node = this.findNode(this.root,block.width,block.height)){
	                    block.fit = this.splitNode(node, block.width,block.height);
	                    block.x = block.fit.x;
	                    block.y = block.fit.y;
	                }
	            }
	        }
	        return blocks;
	    }

	    this.findNode = function(root,w,h){
	        console.log(root);
	        if (root.used)
	            return this.findNode(root.right, w, h) || this.findNode(root.down, w, h);
	        else if ((w <= root.w) && (h <= root.h))
	            return root;
	        else
	            return null;
	    }

	    this.splitNode = function(node,w,h){
	        node.used = true;
	        node.down  = { x: node.x,     y: node.y + h, w: node.w,     h: node.h - h };
	        node.right = { x: node.x + w, y: node.y,     w: node.w - w, h: h          };
	        return node;
	    }

	    this.growForNode = function(root,w,h){

	        var canGrowRight = (h <= root.h);
	        var canGrowDown = (w <= root.w);

	        var shouldGrowRight = canGrowRight && ( ( root.w + w ) <= root.h);
	        var shouldGrowDown = canGrowDown && ((root.h + h ) <= root.w);
	        var node = root;
	        if(shouldGrowRight){
	            return this.growRight(node,w,h);
	        }else if(shouldGrowDown){
	            return this.growDown(node,w,h);
	        }else if(canGrowRight){
	            return this.growRight(node,w,h);
	        }else if(canGrowDown){
	            return this.growDown(node,w,h);
	        }else{
	            return null;
	        }
	    }

	    this.growRight = function(node,w,h){
	        var newNode = {
	            "used":true,
	            "x":0,
	            "y":0,
	            "w": (node.w + w),
	            "h": node.h,
	            "down" : node,
	            "right" : {
	                "x":node.w+node.x,
	                "y":node.y,
	                "w":w,
	                "h":node.h
	            }
	        };
	        return newNode
	    }

	    this.growDown = function(node,w,h){
	        var newNode =  {
	            "used":true,
	            "x":0,
	            "y":0,
	            "w": (node.w),
	            "h": (node.h+h),
	            "down" : {
	                "x":node.x,
	                "y":node.y + node.h,
	                "w":node.w,
	                "h": h
	            },
	            "right" : node
	        };
	        return newNode;
	    }

	    var theBlocks = this.fit(blocks);
	    return {
	        "elements":theBlocks,
	        "size":{
	            width:this.root.w,
	            height:this.root.h
	        }
	    }
	}

	module.exports = BinPackingAlgorithm;

/***/ }
/******/ ]);