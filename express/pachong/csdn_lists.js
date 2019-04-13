var request = require('request');
const superagent = require('superagent');  // 引入SuperAgent
require('superagent-proxy')(superagent);  // 引入SuperAgent-proxy
var express = require('express');
var cheerio = require('cheerio');
var mysqlDB = require('../mysql');
var writeLog = require('../common/writeLog'); // 写日志
var getApi = require('./getApi'); // 获取代理API
var inspectIp = require('../common/inspectIp'); // 检测是否是有效IP
var fs = require("fs");
var app = express();

var shown_offset = null;
// 读取文件内容
var ipList = JSON.parse(fs.readFileSync('proxys.json', 'utf-8')),
  dqIpList = [];
var ipRandom = 0;
// console.log(ipRandom);
// console.log(ipList[ipRandom]);

var proxy = "";
var page = 1;

const inspectIpFun = ()=>{
  // 检测当前ip是否可用
  inspectIp(ipList,0,5).then(ipXhr=>{
    if(ipXhr.length > 0){
      console.log(ipXhr);
      dqIpList = ipXhr;
      ipRandom = Math.floor(Math.random() * ((ipXhr.length-1) - 0 + 1) + 0); // max - min + 1 + max
      proxy = ipXhr[ipRandom];
      console.log(ipRandom);
      console.log("当前ip为:" + proxy);
    } else {
      proxy = "";
      console.log("没有可使用的ip");
    }
    collection();
  });
}

// 获取所有数据
const getList = ()=>{
  const promise = new Promise((resolve) => {
    var  sql = `select title from csdn_list`;
    mysqlDB(sql,true).then(resDB=>{
      resolve(resDB);
    });
  });
  return promise;
}
// 通过 GET 请求来读取 http://cnodejs.org/ 的内容
var header = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.6',
  'Host': 'www.dianping.com',
  'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Mobile Safari/537.36',
  'Cache-Control': 'max-age=0',
  'Connection': 'keep-alive'
};
// console.log(header);
function collection(){
  console.log("loading start" + proxy);
  getList().then(data=>{
    // console.log(data);
    superagent  // 发起请求
      .get('https://www.csdn.net/api/articles?type=more&category=web&shown_offset=' + shown_offset)
      .set('header', header)
      .proxy(proxy)
      .end(onresponse);
    // 对返回的response进行处理
    function onresponse(err, res) {
      console.log("all info");
      if (err) {
        console.log(err);
        writeLog(JSON.stringify(err),'../log/err.log');
      } else {
        if(res.status == 200){
          // console.log(res.body.articles);
          var list = res.body.articles;
          if(list.length != []){
            list.map(item=>{
              data.map(items=>{ // 去重
                if(item.title.indexOf(items.title)){
                  return false;
                }
              });
              console.log(item.url.toString());
              superagent  // 发起请求 赞的数量
                .get(item.url.toString())
                .set('header', header)
                .proxy(proxy)
                .end(getDetails);
              // 对返回的response进行处理
              function getDetails(err, res) {
                console.log("detail ~~");
                let fabulous = 0;
                if (err) {
                  console.log(err);
                  writeLog(item.url.toString()+'\n'+JSON.stringify(err),'../log/err.log');
                  var  sql = `INSERT INTO csdn_list (id, title, summary,detailUrl,createTime,shown_offset,fabulous,readings,comments)` +
                       ` VALUES ('',${JSON.stringify(item.title)},${JSON.stringify(item.summary)},'${item.url.toString()}',${item.shown_time},${item.shown_offset},${fabulous},${item.views},${item.comments})`;
                  mysqlDB(sql,true).then(resDB=>{
                    console.log("---\n");
                    console.log(resDB);
                    console.log("---\n");
                  },err=>{
                    console.log(err);
                  });
                  dqIpList.splice(ipRandom,1);
                  ipRandom = Math.floor(Math.random() * ((dqIpList.length-1) - 0 + 1) + 0); // max - min + 1 + max
                  proxy = dqIpList[ipRandom];

                } else {
                  if(res.status == 200){
                    let $ = cheerio.load(res.text);
                    fabulous = $('.tool-box>.meau-list .btn-like p').text();//帖子标题
                    // console.log(fabulous);
                    var  sql = `INSERT INTO csdn_list (id, title, summary,detailUrl,createTime,shown_offset,fabulous,readings,comments)` +
                         ` VALUES ('',${JSON.stringify(item.title)},${JSON.stringify(item.summary)},'${item.url.toString()}',${item.shown_time},${item.shown_offset},${fabulous},${item.views},${item.comments})`;
                    mysqlDB(sql,true).then(resDB=>{
                      // console.log("---\n");
                      // console.log(resDB);
                      // console.log("---\n");
                    },err=>{
                      // console.log(err);
                    });
                  }
                }
              }
            });
            shown_offset = res.body.shown_offset;
          }
        }
      }
      var timeRandom = Math.floor(Math.random()*(3000-1000)+1000);
      console.log(timeRandom+"秒后执行下一条");
      setTimeout(()=>{
        page ++;
        console.log("第" + page + "条开始");
        inspectIpFun();
      },timeRandom);
    };
  });
}
inspectIpFun();
// var i = 0;
// function fun(){
//   console.log(Math.floor(Math.random() * (10 - 1 + 1) + 1));
//   i++;
//   if(i<100){
//     fun();
//   }
// }
// fun();
