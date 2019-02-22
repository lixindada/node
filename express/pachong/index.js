var request = require('request');
var express = require('express');
var cheerio = require('cheerio');
var mysqlDB = require('../mysql');
var writeLog = require('../common/writeLog'); // 写日志
var app = express();

var shown_offset = null;
// 通过 GET 请求来读取 http://cnodejs.org/ 的内容
function collection(){
  var options = {
    method: 'GET',
    host: '117.90.252.217',
    port: '9000',
    url: 'https://www.csdn.net/api/articles?type=more&category=web&shown_offset=' + shown_offset,
    gzip: true,
    encoding: null,
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4',
      'User-Agent': 'Mozilla/8.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36',
      'referer': 'http://www.66ip.cn/'
    },
  };
  console.log(options);
  request({
    options
  }, function (error, res, body) {
    console.log(error);
    if (!error && res.statusCode == 200) {
      // writeLog(JSON.stringify(JSON.parse(body).articles),'pachong.log');
      var list = JSON.parse(body).articles;
      // create 表 ===
      // var sql = "CREATE TABLE csdn_list( " +
      //     "id INT UNSIGNED AUTO_INCREMENT, " +
      //     "title VARCHAR(100) NOT NULL, " +
      //     "summary VARCHAR(100) NOT NULL, " +
      //     "detailUrl VARCHAR(100) NOT NULL, " +
      //     "createTime INT NOT NULL, " +
      //     "shown_offset INT NOT NULL, " +
      //     "fabulous INT NOT NULL, " +
      //     "readings INT NOT NULL, " +
      //     "comments INT NOT NULL, " +
      //     "PRIMARY KEY ( id ))ENGINE=InnoDB DEFAULT CHARSET=utf8; ";
      //  =======
      if(list.length != []){
        list.map(item=>{
          var  sql = `INSERT INTO csdn_list (id, title, summary,detailUrl,createTime,shown_offset,fabulous,readings,comments)` +
               ` VALUES ('',${JSON.stringify(item.title)},${JSON.stringify(item.summary)},'${item.url.toString()}',${item.shown_time},${item.shown_offset},0,${item.views},${item.comments})`;
          mysqlDB(sql,true).then(resDB=>{
            console.log("---\n");
            console.log(resDB);
            console.log("---\n");
          },err=>{
            console.log(err);
          });
        });
        shown_offset = JSON.parse(body).shown_offset;
        // setTimeout(()=>{
        //   collection();
        // },5000);
      }
    }
  });
}
collection();

var server = app.listen(8889, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})
