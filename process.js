process.on('exit', function(code) {

  // 以下代码永远不会执行
  setTimeout(function() {
    console.log("该代码不会执行");
  }, 0);

  console.log('退出码为:', code);
});
console.log("程序执行结束");
console.log(process.pid);
console.log(process.title);
console.log(process.arch);
console.log(process.version);
process.argv.forEach(function(val, index, array) {
   console.log(index + ': ' + val);
});
process.stdout.write("Hello World!" + "\n");
console.log(process.uptime());
