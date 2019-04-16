var getApi = require('./getApi'); // 获取代理API
var writeLog = require('../common/writeLog'); // 写日志
var fs = require("fs");
var i = 1;
var num = 1;
function housrFun(){
  writeLog("第" + num + "轮\n","../log/pachong.log");
  function fun(){
    getApi(i).then(xhr=>{
      // console.log(xhr);
      writeLog("共" + xhr.num + "条\n","../log/pachong.log");
      if(i < Math.floor(2644/24) * num){
        console.log("第" + i + "次");
        writeLog("第" + i + "次\n","../log/pachong.log");
        i++;
        var randoms = Math.floor(Math.random() * (10000 - 5000 + 1) + 5000);
        console.log(randoms + "s后开始下一次");
        setTimeout(()=>{
          fun();
        },randoms);
      }
    });
  }
  fun();
  setTimeout(()=>{
    num++;
    if(num == 12){
      num = 1;
    }
    housrFun();
  },3600000); // 24小时
}
housrFun();
