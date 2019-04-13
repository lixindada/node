var request = require("request");
var cheerio = require("cheerio");
var userAgents = require("./userAgent");
var baseMethod = require('../common/base'); // 公共方法
var mysqlDB = require('../mysql');
var fs = require("fs");
var sd = require('silly-datetime');// 时间对象

var proxys =[];
var useful =[];

function getProxys(pageNum){
  const promise = new Promise((resolve) => {
    let userAgent = userAgents[parseInt(Math.random()*userAgents.length)];
    url = "https://www.xicidaili.com/nn/"+pageNum;
    // console.log(userAgent);
    console.log(url);
    request({
        url:url,
        method:"GET",
        headers:{
            'User-Agent':userAgent
        }
    },function(err,res,body){
      // console.log(22);
      // console.log(!err);
      if(!err){
        // console.log("body=" + body);
          var $ = cheerio.load(body);
          var trs = $("#ip_list tr");
          // console.log(trs);
          // console.log(trs.length);
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
            // console.log(proxy);
          }
      }
      check().then(xhr=>{
        // console.log(xhr);
        resolve(xhr);
      })
    });
  });
  return promise;
}
/**
 * 检查代理是否有效
 */
function check(){
  const promise = new Promise((resolve) => {
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
        // console.log(res);
        if(!err){
          if(res.statusCode==200){
            // console.log(res.request.proxy.hostname);
            // console.log(res.request.proxy.protocol);
            // console.log(res.request.proxy.protocol);
            useful.push({ip:res.request.proxy.hostname,port:res.request.proxy.port,type:res.request.proxy.protocol,href:res.request['proxy']['href']});
            console.log(res.request['proxy']['href'],"useful");
          }else{
            console.log(res.request['proxy']['href'],"failed");
          }
        }else{
        }
        flag--;
        if(flag==0){
          resolve({code:200});
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
  if(useful.length>0){
    let list = [];
    useful.map(item=>{
      var time=sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
      var  sql = `INSERT INTO proxy_list (id, ip, port,type,href,createTime,time,status)` +
      ` VALUES ('',${JSON.stringify(item.ip)},${JSON.stringify(item.port)},${JSON.stringify(item.type)},${JSON.stringify(item.href)},${JSON.stringify(new Date().getTime())},${JSON.stringify(time)},1)`;
      mysqlDB(sql,false).then(resDB=>{
        // console.log(resDB);
      });
    })
  }
  console.log("Save finished!");
}
module.exports = getProxys;
