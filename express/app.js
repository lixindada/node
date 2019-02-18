var express = require('express');
var mysqlDB = require('./mysql');
var app = express();
var bodyParser = require('body-parser');

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(express.static('public'));

app.get('/', function (req, res) {
   res.send('Hello World');
})

// 列表
app.get('/list_user', function (req, res) {
  var  sql = 'SELECT * FROM spb';
  mysqlDB(sql).then(resDB=>{
    console.log(resDB);
    const data = resDB;
    res.json({code:200,msg:"success",data:data});
  },err=>{
    console.log(err);
    res.json({code:500,msg:"fail"});
  });
})

// 添加
app.post('/add_user', urlencodedParser ,function (req, res) {
  // 输出 JSON 格式
  var  sql = `INSERT INTO spb (id,name, jiage) VALUES ('',${req.body.name},${req.body.jiage})`;
  mysqlDB(sql).then(resDB=>{
    console.log(resDB);
    const data = resDB;
    res.json({code:200,msg:"success"});
  },err=>{
    console.log(err);
    res.json({code:500,msg:"fail"});
  });
})

var server = app.listen(8888, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})
