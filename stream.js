// 从流中读取数据
var fs = require("fs");
var data = '';

// 创建可读流
var readerStream = fs.createReadStream('demo.txt');

// 设置编码为 utf8。
readerStream.setEncoding('UTF8');

// 处理流事件 --> data, end, and error
readerStream.on('data', function(chunk) {
   data += chunk;
});

readerStream.on('end',function(){
   console.log(data);
});

readerStream.on('error', function(err){
   console.log(err.stack);
});

console.log("程序执行完毕");

// 写入流
var data = 'aaaa -- demo';

// 创建一个可以写入的流，写入到文件 writerdemo.txt 中
var writerStream = fs.createWriteStream('writerdemo.txt');

// 使用 utf8 编码写入数据
writerStream.write(data,'UTF8');

// 标记文件末尾
writerStream.end();

// 处理流事件 --> data, end, and error
writerStream.on('finish', function() {
    console.log("写入完成。");
});

writerStream.on('error', function(err){
   console.log(err.stack);
});

console.log("程序执行完毕");

// 管道流
// 管道读写操作
// 读取 input.txt 文件内容，并将内容写入到 output.txt 文件中
var writerStream2 = fs.createWriteStream('output.txt');
readerStream.pipe(writerStream2);

console.log("管道读写操作完毕");
