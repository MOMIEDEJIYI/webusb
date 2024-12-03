// page_log.js

// 创建日志容器并插入到页面中
const logContainer = document.createElement('div');
logContainer.id = 'log-container';
document.body.appendChild(logContainer);

// 获取当前时间的函数
function getCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份从0开始，补充两位
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 自定义 log 函数，重定向到页面的日志容器
function logToPage(message) {
    const logEntry = document.createElement('div');
    // 获取当前时间并添加到日志消息中
    const timestamp = getCurrentTime();

    if (message.startsWith('ERROR:')) {
        logEntry.style.color = 'red';
    } else if (message.startsWith('INFO:')) {
        logEntry.style.color = 'green';
    } else if (message.startsWith('WARNING:')) {
        logEntry.style.color = 'orange';
    } else if (message.startsWith('DEBUG:')) {
        logEntry.style.color = 'blue';
    } else if (message.startsWith('TRACE:')) {
        logEntry.style.color = 'purple';
    } else {
        logEntry.style.color = 'white';
    }
    logEntry.textContent = `[${timestamp}] ${message}`;
    logContainer.appendChild(logEntry);
}

// 使用 MutationObserver 来监听日志容器的变化并自动滚动
const observer = new MutationObserver(() => {
    logContainer.scrollTop = logContainer.scrollHeight;
});
observer.observe(logContainer, { childList: true });

// 使 logToPage 函数可以全局访问
window.logToPage = logToPage;

(function() {
    // 保存原有的 console 方法
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalInfo = console.info;
    const originalDebug = console.debug;
    const originalTrace = console.trace;
  
    // 重写 console.log
    console.log = function(...args) {
      // originalLog.apply(console, args); // 调用原来的 console.log
      window.logToPage(args.join(' '));  // 将日志传递给页面的日志容器
    };
  
    // 重写 console.warn
    console.warn = function(...args) {
      // originalWarn.apply(console, args); // 调用原来的 console.warn
      window.logToPage('WARN: ' + args.join(' '));  // 将警告日志传递给页面
    };
  
    // 重写 console.error
    console.error = function(...args) {
      // originalError.apply(console, args); // 调用原来的 console.error
      window.logToPage('ERROR: ' + args.join(' '));  // 将错误日志传递给页面
    };
  
    // 重写 console.info
    console.info = function(...args) {
      // originalInfo.apply(console, args); // 调用原来的 console.info
      window.logToPage('INFO: ' + args.join(' '));  // 将信息日志传递给页面
    };
  
    // 重写 console.debug
    console.debug = function(...args) {
      // originalDebug.apply(console, args); // 调用原来的 console.debug
      window.logToPage('DEBUG: ' + args.join(' '));  // 将调试日志传递给页面
    };
  
    // 重写 console.trace
    console.trace = function(...args) {
      // originalTrace.apply(console, args); // 调用原来的 console.trace
      window.logToPage('TRACE: ' + args.join(' '));  // 将追踪日志传递给页面
    };
  })();
  