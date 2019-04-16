var request = require("request");
var cheerio = require("cheerio");
var userAgents = require("./userAgent");
var fs = require("fs");
var express = require('express');
var mysqlDB = require('../mysql'); // 封装sql请求
const schedule = require('node-schedule'); // 定时函数

var useful = [];
var [proxys,proxysMinNum,proxysMaxNum] = [[],0,0];

/**
 * [getList 获取所有IP]
 * @return data [IP列表]
 */
const getList = ()=>{
  var  sql = `select href from proxy_list`;
  mysqlDB(sql,true).then(resDB=>{
    // console.log(Math.ceil(resDB.length/100));
    let resDBLen = Math.ceil(resDB.length/100);
    for(let i = 1; i <= resDBLen; i++){
      console.log(i);
      if(i == resDBLen){
        check(resDB,(i-1) * 100,resDB.length);
      } else {
        // check(resDB,(i-1) * 100,i * 100);
      }
    }
    // check(resDB);
  });
}

/**
 * 检查代理是否有效
 */
function check(list,minNum,maxNum){
  var flag = maxNum-minNum;//检查异步函数是否执行完成的标志量
  for(var i = minNum; i < maxNum;i++){
    // console.log(i,maxNum,minNum);
    var proxy = list[i];
    // console.log(proxy['href'],i);
    inspectIp(proxy,i);
  }
}
let x = 0;
function inspectIp(proxy,i){
  console.log(proxy,i);
  var url = "http://www.csdn.net/api/articles?type=more&category=web&shown_offset=0";
  request({
    url:url,
    proxy: proxy["href"],
    method:'GET',
    timeout:10000
  },function(err,res,body){
    if(!err){
      if(res.statusCode==200){
        // useful.push(res.request['proxy']['href']);
        saveProxys(res.request['proxy']['href'],"useful");
        x++;
        console.log(res.request['proxy']['href'],"useful",i);
      }else{
        saveProxys(res.request['proxy']['href'],"failed");
        x++;
        console.log(res.request['proxy']['href'],"failed",i);
      }
    }else{
    };
  })
}
/**
 * 保存有效代理
 */
function saveProxys(href){
  console.log(href);
  console.log(x);
}

const  scheduleCronstyle = ()=>{
  //每分钟的第30秒定时执行一次:
  schedule.scheduleJob('30 * * * * *',()=>{
    console.log('scheduleCronstyle:' + new Date());
  });
  // *  *  *  *  *  *
  // ┬  ┬  ┬  ┬  ┬  ┬
  // │  │  │  │  │  │
  // │  │  │  │  │  └ day of week (0 - 7) (0 or 7 is Sun)
  // │  │  │  │  └───── month (1 - 12)
  // │  │  │  └────────── day of month (1 - 31)
  // │  │  └─────────────── hour (0 - 23)
  // │  └──────────────────── minute (0 - 59)
  // └───────────────────────── second (0 - 59, OPTIONAL)
  // 定时器取消
  // j.cancel();
}
getList();
// scheduleCronstyle();
