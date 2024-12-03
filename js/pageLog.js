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
