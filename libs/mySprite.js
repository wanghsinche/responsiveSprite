var Images = require('images');
var fs = require('fs');
var widthTotal = 0;
var heightTotal = 0;
var padding = 10;
var canvas = Images(1024, 10240);
var destPath = '_dest.png';

var infoLs = [];


var setImg = function (url) {
    let img = Images(url);
    let v = {
        id: url,
        width: img.width(),
        height: img.height(),
        currentY: heightTotal
    };
    canvas.draw(img, 0, heightTotal);
    if (v.width > widthTotal) {
        widthTotal = v.width;
    }
    heightTotal += v.height;
    heightTotal += padding;

    infoLs.push(v);

    // garbage collect
    img = null;
    Images.gc();

};

var setPrefix = function (prefix) {
    /* body... */
    destPath = prefix + destPath;
};

var getCss = function () {
    let spriteMap = {};
    infoLs.forEach((v)=>{
        spriteMap[v.id] = '\nbackground-size: auto ' + (heightTotal / v.height * 100).toFixed(2) + '%;\n' +
            'background-position: 0 ' + (v.currentY / (heightTotal - v.height) * 100).toFixed(2) + '%;\n';
    });
    return spriteMap;
};



var outputImg = function () {
    Images(canvas, 0, 0, widthTotal, heightTotal).save(destPath, {
        quality: 50
    });
    console.log('save sprite to '+destPath);
};

module.exports = {
    getCss : getCss,
    outputImg : outputImg,
    setImg : setImg,
    setPrefix: setPrefix
};