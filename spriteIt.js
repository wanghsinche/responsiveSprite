'use strict';

var fs = require('fs');
var mySprite = require('./libs/mySprite.js');
var Rules = require('./libs/css/myrules.js');
var _arr_css = []
    , _content;
var path = './example/index.css';
var prefix = path.split('/');
prefix.pop();
prefix = prefix.join('/').concat('/');

var content = fs.readFileSync(path, 'utf8');


var reg = /(?:\/\*[\s\S]*?(?:\*\/|$))|([^\{\}\/]*)\{([^\{\}]*)\}/gi;

var regSelector = /(?:\/\*[\s\S]*?(?:\*\/|$))|([^\{\}\/]*)/gi;
var regCss = /\{([^\{\}]*)\}/gi;

var matchls = content.match(reg);

var spriteMap = null;

matchls.forEach(function (v) {
    let css = v.match(regCss)[0]||null;
    let selector = v.match(regSelector)[0]||'';
    if (css) {
        let rules = Rules.wrap(selector.trim(), css.trim());
        if (rules.isSprites()) {
            mySprite.setImg(prefix + rules.image);
        }
    }
});


mySprite.setPrefix(prefix);

spriteMap = mySprite.getCss();



_content = content.replace(reg, function(m, selector, css) {
    if (css) {
        var rules = Rules.wrap(selector.trim(), css.trim());
        if (rules.isSprites()) {
            css = rules.getCss();
            css += spriteMap[prefix + rules.image];
        }
        return selector + '{' + css + '}';
    }
    return m;
});
mySprite.outputImg();

fs.writeFile(path+'_new', _content, (err) => {
  if (err) throw err;
  console.log('The file: '+path+'_new'+' has been saved!');
});