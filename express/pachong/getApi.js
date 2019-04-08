var request = require("request");
var cheerio = require("cheerio");
var userAgents = require("./userAgent");
var fs = require("fs");

var proxys =[];
var useful =[];

function getProxys(pageNum){
  console.log("xis");
  var promise = new Promise(function (resolve, reject) {
    let userAgent = userAgents[parseInt(Math.random()*userAgents.length)];
    url = "https://www.xicidaili.com/nn/"+pageNum;

    request({
      url:url,
      method:"GET",
      headers:{
        'User-Agent':userAgent
      }
    },function(err,res,body){
      if(!err){
        var $ = cheerio.load(body);
        var trs = $("#ip_list tr");
        for(var i=1;i<trs.length;i++){
          var proxy = {};
          tr = trs.eq(i);
          tds = tr.children("td");
          proxy['ip'] = tds.eq(1).text();
          proxy['port'] = tds.eq(2).text();
          proxy['type'] = tds.eq(5).text();
          var speed = tds.eq(6).children("div").attr("title");
          speed = speed.substring(0,speed.length-1);
          var connectTime = tds.eq(7).children("div").attr("title");
          connectTime = connectTime.substring(0,connectTime.length-1);
          if(speed<=5&&connectTime<=1){
            proxys.push(proxy);
          }
        }
      }
      console.log(22222222);
      check().then(xhr=>{
        resolve(xhr);
      });
    });
  });
  return promise;
}
/**
 * 检查代理是否有效
 */
function check(){
  var promise = new Promise(function (resolve, reject) {
    var url = "http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js";
    var flag = proxys.length;//检查异步函数是否执行完成的标志量
    for(var i=0;i<proxys.length;i++){
      var proxy = proxys[i];
      request({
          url:url,
          proxy: proxy['type'].toLowerCase()+"://"+proxy['ip']+":"+proxy['port'],
          method:'GET',
          timeout:20000
      },function(err,res,body){
          if(!err){
              if(res.statusCode==200){
                useful.push(res.request['proxy']['href']);
                // console.log(res.request['proxy']['href'],"useful");
                resolve(res.request['proxy']['href']);
              }else{
                // console.log(res.request['proxy']['href'],"failed");
                reject("failed");
              }
          }else{

          }
          flag--;
          if(flag==0){
              saveProxys();
          }
      })
    }
  });
  return promise;
}
/**
 * 保存有效代理
 */
function saveProxys(){
    fs.writeFileSync("proxys.json",JSON.stringify(useful));
    // console.log("Save finished!");
}
module.exports = getProxys;
