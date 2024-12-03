// page_log.js

// 创建日志容器并插入到页面中
const logContainer = document.createElement('div');
logContainer.id = 'log-container';
document.body.appendChild(logContainer);

// 自定义 log 函数，重定向到页面的日志容器
function logToPage(message) {
    const logEntry = document.createElement('div');
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
    logEntry.textContent = message;
    logContainer.appendChild(logEntry);
}

// 使用 MutationObserver 来监听日志容器的变化并自动滚动
const observer = new MutationObserver(() => {
    logContainer.scrollTop = logContainer.scrollHeight;
});
observer.observe(logContainer, { childList: true });

// 使 logToPage 函数可以全局访问
window.logToPage = logToPage;
