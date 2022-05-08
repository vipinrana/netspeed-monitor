const path = require('path');

let imagePath = path.join(__dirname, './../images/nm.png');

let preloadFile = path.join(__dirname, './preload.js');

module.exports = { imagePath, preloadFile };