module.exports = function(sql){
  var mysql = require('mysql');
  var writeLog = require('./common/writeLog');
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '123456',
    database : 'sp'
  });
  // 解析 url 参数
  // response.write(util.inspect(request.url,true));
  var promise = new Promise(function (resolve, reject) {
    connection.connect();

    //查
    var data = connection.query(sql,function (err, result) {
      if(err){
        writeLog(err.message+'\n'+sql);
        console.log(writeLog);
        console.log('[SELECT ERROR] - ',err.message);
        reject(err);
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
  return promise;
};
