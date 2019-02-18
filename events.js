// 引入 events 模块
var events = require('events');
// 创建 eventEmitter 对象
var eventEmitter = new events.EventEmitter();

// 创建事件处理程序
var connectHandler = function connected() {
   console.log('连接成功。');

   // 触发 data_received 事件
   eventEmitter.emit('data_received');
}

// 绑定 connection 事件处理程序
eventEmitter.on('connection', connectHandler);

// 使用匿名函数绑定 data_received 事件
eventEmitter.on('data_received', function(){
   console.log('数据接收成功。');
});

// 触发 connection 事件
eventEmitter.emit('connection');

console.log("程序执行完毕。");

// 事件监听器
eventEmitter.on('someEvent', function(arg1, arg2) {
    console.log('some_event 事件触发');
});
eventEmitter.on('someEvent', function(arg1, arg2) {
    console.log('listener2', arg1, arg2);
});
setTimeout(function() {
    eventEmitter.emit('someEvent', 'arg1 参数', 'arg2 参数');
}, 1000);
