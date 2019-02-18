var util = require('util');
function Base() {
    this.name = 'base';
    this.base = 1991;
    this.sayHello = function() {
    console.log('Hello ' + this.name);
    };
}
Base.prototype.showName = function() {
    console.log(this.name);
};
function Sub() {
    this.name = 'sub';
}
util.inherits(Sub, Base);
var objBase = new Base();
objBase.showName();
objBase.sayHello();
console.log(objBase);
var objSub = new Sub();
objSub.showName();
//objSub.sayHello();
console.log(objSub);

// 任意对象转换 为字符串的方法
function Person() {
    this.name = 'byvoid';
    this.toString = function() {
      return this.name;
    };
}
var obj = new Person();
console.log(util.inspect(obj));
console.log(util.inspect(obj, true));

// 如果给定的参数 "object" 是一个数组返回true，否则返回false。
util.isArray([])
  // true
util.isArray(new Array)
  // true
util.isArray({})
  // false
