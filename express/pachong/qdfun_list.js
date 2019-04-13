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

var page = 2;
// 读取文件内容
// var ipList = JSON.parse(fs.readFileSync('proxys.json', 'utf-8'));
// var ipRandom = Math.floor(Math.random() * ((ipList.length-1) - 1 + 0) + 0);

// 检测当前ip是否可用
// inspectIp(ipList).then(xhr=>{
//   console.log(xhr);
// });

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
var proxy = "";
// var proxy = (ipList[ipRandom]['type'].toLowerCase()+"://"+ipList[ipRandom]['ip']+":"+ipList[ipRandom]['port']);
console.log(proxy);
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
  let url = 'https://www.qdfuns.com/article/list/newest/page/' + page + '.html';
  getList().then(data=>{
    // console.log(data);
    superagent  // 发起请求
      .get(url)
      .set('header', header)
      .proxy(proxy)
      .end(onresponse);
    // 对返回的response进行处理
    function onresponse(err, res) {
      if (err) {
        console.log(err);
        writeLog(JSON.stringify(err),'../log/err.log');
      } else {
        if(res.status == 200){
          let $ = cheerio.load(res.text);
          // console.log($("#content .article-block").html());
          $("#content .article-block").each(function(){
            let detailurl = "https://www.qdfuns.com/" + $(this).children(".title_content").children("h3").children("a").prop("href"),
              title = $(this).children(".title_content").children("h3").children("a").text(),
              readings = $(this).children(".readnum").children("b").text(),
              createTime = new Date($(this).children(".info_content").children("span").children(".datetime").prop("data-original-title")).getTime()/1000;
            // console.log(createTime);
            let isRepeat = true;
            for (var i = 0; i < data.length; i++) {
              if(data[i].title.indexOf(title) != -1){
                // console.log("重复");
                // console.log(title);
                // console.log(data[i].title);
                writeLog("重复" + title + data[i].title,'../log/qdfun.log');
                isRepeat = false;
              }
            }
            if(isRepeat){
              // 请求详情页数据
              superagent  // 发起请求
                .get(detailurl)
                .set('header', header)
                .proxy(proxy)
                .end(onresponse);
              // 对返回的response进行处理
              function onresponse(err, res) {
                if (err) {
                  console.log(err);
                  writeLog(JSON.stringify(err),'../log/err.log');
                } else {
                  let $ = cheerio.load(res.text);
                  let li = $("#works_function_sidebar>ul").eq(1).children("li");
                  let comments = li.eq(0).children("a").children("number").prop("data-comment-count"),
                    fabulous = li.eq(0).children("a").children("number").text();
                  // console.log(fabulous,comments);
                  var  sql = `INSERT INTO csdn_list (id, title,detailUrl,createTime,fabulous,readings,comments,channel)` +
                    ` VALUES ('',${JSON.stringify(title)},'${detailurl}',${createTime},${fabulous},${readings},${comments},"qdfun")`;
                  mysqlDB(sql,true).then(resDB=>{
                    // console.log(resDB);
                  });
                }
              };
            }
          })
        }
      }
    };
  });
}
collection();
