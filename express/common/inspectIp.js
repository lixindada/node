var request = require("request");
var cheerio = require("cheerio");
var userAgents = require("./userAgent");
var fs = require("fs");
var express = require('express');

var useful = [];
var [proxys,proxysMinNum,proxysMaxNum] = [[],0,0];
/**
 * 检查代理是否有效
 */
function check(list,minNum,maxNum){
  var url = "http://www.csdn.net/api/articles?type=more&category=web&shown_offset=0";
  var flag = maxNum-minNum;//检查异步函数是否执行完成的标志量
  console.log(minNum,maxNum);
  for(var i=minNum;i<maxNum;i++){
    // console.log(i);
    var proxy = list[i];
    // console.log(proxy['href']);
    request({
      url:url,
      proxy: proxy['href'],
      method:'GET',
      timeout:10000
    },function(err,res,body){
      // console.log(1111);
      if(!err){
        if(res.statusCode==200){
          useful.push(res.request['proxy']['href']);
          console.log(res.request['proxy']['href'],"useful");
        }else{
          console.log(res.request['proxy']['href'],"failed");
        }
      }else{}
      flag--;
      console.log(flag);
      if(flag==0){
        saveProxys(list,minNum,maxNum);
      }
      console.log(222);
    })
  }
  console.log(333);
}
/**
 * 保存有效代理
 */
function saveProxys(list,minNum,maxNum){
  const promise = new Promise((resolve) => {
    if(minNum == 0){ // 置空
      useful = [];
    }
    console.log("可用个数" + useful.length);
    if(useful.length > 0){
      console.log(useful);
      resolve(useful);
      // fs.writeFileSync("proxys.json",JSON.stringify(useful));
      console.log("Save finished!");
    } else {
      check(list,minNum+5,maxNum+5);
    }
  });
  return promise;
}
module.exports = saveProxys;
