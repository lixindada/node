var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root_pwd',
  database : 'test'
});

connection.connect();

var  sql = 'SELECT * FROM csdn_list';
//查
connection.query(sql,function (err, result) {
  if(err){
    console.log('[SELECT ERROR] - ',err.message);
    return;
  }
  console.log('--------------------------SELECT----------------------------');
  console.log(result);
  console.log('------------------------------------------------------------\n\n');
});

connection.end();
