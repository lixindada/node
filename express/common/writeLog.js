module.exports = function(text){
  var fs = require("fs");
  console.log("准备写入文件");
  var sd = require('silly-datetime');
  var time=sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
  fs.appendFile('./log/err.log', time+'\n'+text+'\n\n',  function(err) {
     if (err) {
         return console.error(err);
     }
     console.log("数据写入成功！");
  });
}
