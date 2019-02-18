var http = require("http");
var url = require("url");
var util = require('util');
var mysql = require('mysql');


http.createServer(function(request,response){
  // 发送 HTTP 头部
  // HTTP 状态值: 200 : OK
  // 内容类型: text/plain
  response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8'});

  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '123456',
    database : 'sp'
  });
  // 解析 url 参数
  // response.write(util.inspect(request.url,true));
  if(request.url.indexOf("/getList")){

    var promise = new Promise(function (resolve, reject) {
      connection.connect();

      var  sql = 'SELECT * FROM spb';
      //查
      var data = connection.query(sql,function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
          return;
        }
        console.log('--------------------------SELECT----------------------------');
        console.log(result);
        resolve(result);
        // response.write();
        console.log('------------------------------------------------------------\n\n');
      });
      connection.end();
    });
    promise.then(function (value) {
        console.log(value);
        return value;
        // success
    }, function (value) {
        // failure
    });
  }


  // response.write(util.inspect(response));
  // var params = url.parse(request.url, true).query;
  // response.write(params.apiUrlName);
  // response.write("\n");

  // 发送响应数据 "Hello World"
  console.log(promise);
  response.end(JSON.stringify(promise));
}).listen(8888);


// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8888/');
