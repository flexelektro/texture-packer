(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.RP = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var BinPackingAlgorithm = function BinPackingAlgorithm(blocks, w, h) {
    this.root = { x: 0, y: 0, w: w, h: h };

    this.fit = function (blocks) {
        var n, node, block;
        for (n = 0; n < blocks.length; n++) {
            block = blocks[n];
            if (node = this.findNode(this.root, block.width, block.height)) {
                block.fit = this.splitNode(node, block.width, block.height);
                block.x = block.fit.x;
                block.y = block.fit.y;
            } else {
                this.root = this.growForNode(this.root, block.width, block.height);
                if (node = this.findNode(this.root, block.width, block.height)) {
                    block.fit = this.splitNode(node, block.width, block.height);
                    block.x = block.fit.x;
                    block.y = block.fit.y;
                }
            }
        }
        return blocks;
    };

    this.findNode = function (root, w, h) {
        if (root.used) return this.findNode(root.right, w, h) || this.findNode(root.down, w, h);else if (w <= root.w && h <= root.h) return root;else return null;
    };

    this.splitNode = function (node, w, h) {
        node.used = true;
        node.down = { x: node.x, y: node.y + h, w: node.w, h: node.h - h };
        node.right = { x: node.x + w, y: node.y, w: node.w - w, h: h };
        return node;
    };

    this.growForNode = function (root, w, h) {

        var canGrowRight = h <= root.h;
        var canGrowDown = w <= root.w;

        var shouldGrowRight = canGrowRight && root.w + w <= root.h;
        var shouldGrowDown = canGrowDown && root.h + h <= root.w;
        var node = root;
        if (shouldGrowRight) {
            return this.growRight(node, w, h);
        } else if (shouldGrowDown) {
            return this.growDown(node, w, h);
        } else if (canGrowRight) {
            return this.growRight(node, w, h);
        } else if (canGrowDown) {
            return this.growDown(node, w, h);
        } else {
            return null;
        }
    };

    this.growRight = function (node, w, h) {
        var newNode = {
            "used": true,
            "x": 0,
            "y": 0,
            "w": node.w + w,
            "h": node.h,
            "down": node,
            "right": {
                "x": node.w + node.x,
                "y": node.y,
                "w": w,
                "h": node.h
            }
        };
        return newNode;
    };

    this.growDown = function (node, w, h) {
        var newNode = {
            "used": true,
            "x": 0,
            "y": 0,
            "w": node.w,
            "h": node.h + h,
            "down": {
                "x": node.x,
                "y": node.y + node.h,
                "w": node.w,
                "h": h
            },
            "right": node
        };
        return newNode;
    };

    var theBlocks = this.fit(blocks);
    return {
        "elements": theBlocks,
        "size": {
            width: this.root.w,
            height: this.root.h
        }
    };
};

module.exports = BinPackingAlgorithm;

},{}],2:[function(require,module,exports){
"use strict";

var Algo = require("./BinPackingAlgorithm");

var RP = function RP(elements, confobj) {
    var RP = function RP(els, conf) {
        var elements = els.length > 0 && els instanceof Array ? els : console.error("No Elements my friend");
        var conf = conf || {};
        var config = {
            "padding": conf.padding || 2
        };

        //"atlasPadding": conf.atlaspadding || 1
        //"cutfiles": conf.cutfiles || false,
        //"forceRect":conf.forceRect || false
        var cleanElements = function cleanElements(els) {
            var clean = function clean(s) {
                if (typeof s == 'string' || s instanceof String) {
                    var c = parseFloat(s.replace("px", ""));
                    return c;
                }
                return s;
            };
            els.forEach(function (el) {
                el.height = clean(el.height);
                el.width = clean(el.width);
            });
            return els;
        };

        var sortedByHeightElements = function sortedByHeightElements(elements) {
            return elements.slice(0).sort(function (a, b) {
                if (a.height > b.height) return -1;
                return 1;
            });
        };

        var init = function init(elements, config) {
            var sortedElements = sortedByHeightElements(cleanElements(elements));
            if (config.padding) {
                sortedElements.forEach(function (el) {
                    el.width += 2 * config.padding;
                    el.height += 2 * config.padding;
                });
            }
            var area = 0;
            sortedElements.forEach(function (el, idx) {
                var elarea = el.width * el.height;
                area += elarea;
            });
            area *= 1.1;
            var sidelength = Math.sqrt(area);

            var theData = new Algo(sortedElements, sidelength, sidelength);

            var els = theData.elements;
            els.forEach(function (el) {

                delete el.fit;
                if (config.padding) {
                    el.x += config.padding;
                    el.y += config.padding;
                    el.width -= config.padding;
                    el.height -= config.padding;
                }
            });
            return {
                elements: els,
                atlasSize: {
                    width: theData.size.width,
                    height: theData.size.height
                }
            };
        };

        return init(elements, confobj);
    };
    return new RP(elements, confobj);
};

module.exports = RP;

},{"./BinPackingAlgorithm":1}]},{},[2])(2)
});