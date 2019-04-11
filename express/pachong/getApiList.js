var getApi = require('./getApi'); // 获取代理API
var fs = require("fs");

function housrFun(){
  let i = 1;
  fs.writeFileSync("proxys.json","");
  console.log("clear");
  function fun(){
    getApi(i).then(xhr=>{
      if(i < 30){
        console.log(i);
        i++;
        console.log("第" + i + "次");
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
    housrFun();
  },3600000); // 5 min
}
housrFun();
