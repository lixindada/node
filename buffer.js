const buf = Buffer.from('runoob', 'utf8');

console.log(buf);
console.log(buf.toString('hex'));
console.log(buf.toString('base64'));
console.log(buf.toString('utf8'));
console.log(buf.toString('utf16le'));
console.log(buf.toString('latin1'));

bufs = Buffer.alloc(256);
// 写入缓存
len = bufs.write("www.runoob.com");

console.log("写入字节数 : "+  len);

// 读出缓存
bufs = Buffer.alloc(26);
for (var i = 0 ; i < 26 ; i++) {
  bufs[i] = i + 97;
}
for (var i = 0 ; i < 26 ; i++) {
  bufs[i] = i + 97;
}

console.log( bufs.toString('ascii'));       // 输出: abcdefghijklmnopqrstuvwxyz
console.log( bufs.toString('ascii',0,5));   // 输出: abcde
console.log( bufs.toString('utf8',0,5));    // 输出: abcde
console.log( bufs.toString(undefined,0,5)); // 使用 'utf8' 编码, 并输出: abcde


const buf2 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5]);
const json = JSON.stringify(buf2);
console.log(json);

const copy = JSON.parse(json, (key, value) => {
  return value && value.type === 'Buffer' ?
    Buffer.from(value.data) :
    value;
});

// 输出: <Buffer 01 02 03 04 05>
console.log(copy);

// 缓存区 合并
var buffer1 = Buffer.from(('菜鸟教程'));
var buffer2 = Buffer.from(('www.runoob.com'));
var buffer3 = Buffer.concat([buffer1,buffer2]);
console.log("buffer3 内容: " + buffer3.toString());

// 缓存区 比较
var buffer1 = Buffer.from('ABC');
var buffer2 = Buffer.from('ABCD');
var result = buffer1.compare(buffer2);

if(result < 0) {
   console.log(buffer1 + " 在 " + buffer2 + "之前");
}else if(result == 0){
   console.log(buffer1 + " 与 " + buffer2 + "相同");
}else {
   console.log(buffer1 + " 在 " + buffer2 + "之后");
}

// 缓存区 拷贝
var buf1s = Buffer.from('abcdefghijkl');
var buf2s = Buffer.from('RUNOOB');

//将 buf2 插入到 buf1 指定位置上
buf2s.copy(buf1s, 2[1]);

console.log(buf1s.toString());

// 缓存区 裁剪
var buf3s = buf2s.slice(0,2);
console.log(buf3s.toString());
console.log(buf2s.toString());
console.log("buffer length: " + buf3s.length);
