/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';
/*
 * Object.derive，产生一个Class的工厂方法
 * @param  {Function} constructor 构造函数
 * @param  {Object} proto     对象共有变量
 * @return {Function}      构造方法
 * @example
 *   var class1 = Object.derive(function(){ console.log(this.name) }, {name: 'class1'});
 *   var class2 = Object.derive({
 *     constructor: function() {
 *       console.log(this.name)
 *     }
 *   }, {name: 'class2'})
 */
Function.prototype.derive = function(constructor, proto) {
  if (typeof constructor === 'object') {
    proto = constructor;
    constructor = proto.constructor || function() {};
    delete proto.constructor;
  }
  var parent = this;
  var fn = function() {
    parent.apply(this, arguments);
    constructor.apply(this, arguments);
  };
  var tmp = function() {};
  tmp.prototype = parent.prototype;
  var fp = new tmp(),
    cp = constructor.prototype,
    key;
  for (key in cp) {
    if (cp.hasOwnProperty(key)) {
      fp[key] = cp[key];
    }
  }
  proto = proto || {};
  for (key in proto) {
    if (proto.hasOwnProperty(key)) {
      fp[key] = proto[key];
    }
  }
  fp.constructor = constructor.prototype.constructor;
  fn.prototype = fp;
  return fn;
};

//factory
Function.prototype.factory = function() {
  var clazz = this;
  function F(args) {
    clazz.apply(this, args);
  }
  F.prototype = clazz.prototype;
  return function() {
    return new F(arguments);
  };
};



var _ = {};

/**
 * 提取字符串中的引号和一对引号包围的内容
 * @param  {String} str    待处理字符串
 * @param  {String} quotes 初始引号可选范围，缺省为[',"]
 * @return {Object}        {
 *                           origin: 源字符串
 *                           rest: 引号包围的文字内容
 *                           quote: 引号类型
 *                         }
 * @memberOf fis.util
 * @name stringQuote
 * @function
 */
_.stringQuote = function(str, quotes) {
  var info = {
    origin: str,
    rest: str = str.trim(),
    quote: ''
  };
  if (str) {
    quotes = quotes || '\'"';
    var strLen = str.length - 1;
    for (var i = 0, len = quotes.length; i < len; i++) {
      var c = quotes[i];
      if (str[0] === c && str[strLen] === c) {
        info.quote = c;
        info.rest = str.substring(1, strLen);
        break;
      }
    }
  }
  return info;
};

/**
 * path处理，提取path中rest部分(?之前)、query部分(?#之间)、hash部分(#之后)
 * @param  {String} str 待处理的url
 * @return {Object}     {
 *                         origin: 原始串
 *                         rest: path部分(?之前)
 *                         query: query部分(?#之间)
 *                         hash: hash部分(#之后)
 *                      }
 * @memberOf fis.util
 * @name query
 * @function
 */
_.query = function(str) {
  var rest = str,
    pos = rest.indexOf('#'),
    hash = '',
    query = '';
  if (pos > -1) {
    hash = rest.substring(pos);
    rest = rest.substring(0, pos);
  }
  pos = rest.indexOf('?');
  if (pos > -1) {
    query = rest.substring(pos);
    rest = rest.substring(0, pos);
  }
  rest = rest.replace(/\\/g, '/');
  if (rest !== '/') {
    // 排除由于.造成路径查找时因filename为""而产生bug，以及隐藏文件问题
    rest = rest.replace(/\/\.?$/, '');
  }
  return {
    origin: str,
    rest: rest,
    hash: hash,
    query: query
  };
};


module.exports = _;