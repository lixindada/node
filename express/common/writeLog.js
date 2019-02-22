module.exports = function(text,file){
  console.log(file,text);
  var fileName = "";
  switch (file) {
    case 'err.log':
      fileNum = './log/err.log';
      break;
    case 'errs.log':
      fileNum = './express/log/err.log';
      break;
    default:
      fileNum = './express/log/' + file;
  }
  var fs = require("fs");
  console.log("准备写入文件");
  var sd = require('silly-datetime');
  var time=sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
  fs.appendFile(fileNum, time+'\n'+text+'\n\n',  function(err) {
     if (err) {
         return console.error(err);
     }
     console.log("数据写入成功！");
  });
}
