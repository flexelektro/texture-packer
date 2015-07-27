var webpack = require("webpack");

module.exports = {
    entry: ['./src/RectanglePacker.js'],
    output: {
        path: './dist',
        filename: 'rectpack.js'
    },
    watch:true
};