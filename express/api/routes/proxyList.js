var express = require('express');
var request = require("request");
var mysqlDB = require('../../mysql'); // 封装sql请求
var userAgents = require("../../common/userAgent");
var router = express.Router();
var fs = require("fs");

var useful = [];
var [proxys,proxysMinNum,proxysMaxNum] = [[],0,0];

/* GET proxysList page. */
router.get('/', function(req, routerRes, next) {
  var  sql = `select href from proxy_list where status = 1 limit 1`;
  mysqlDB(sql,true).then(resDB=>{
    routerRes.json({code:200,data:resDB});
  });
});



module.exports = router;
