var fs = require("fs");
var Hello = require('./common/hello');
hello = new Hello();
hello.setName('BYVoid');
hello.sayHello();
// 阻塞代码 同步
//var data = fs.readFileSync('demo.txt');

//console.log(data.toString());

// 非阻塞代码  异步
fs.readFile('demo.txt', function (err, data) {
    if (err) return console.error(err);
    console.log(data.toString());
});

console.log("程序执行结束!");

// 全局变量
// 输出全局变量 __filename 的值
setTimeout(()=>{
  console.log( __filename );
  console.log( __dirname );
},1000);
