// 加载某个文件夹下所有的css
function loadCSSFromFolder(folderUrl, cssFiles) {
  cssFiles.forEach(file => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `${folderUrl}/${file}`; // 拼接完整的文件路径
    link.type = 'text/css';
    document.head.appendChild(link);
  });

  console.log('所有 CSS 文件已成功加载');
}

// 手动维护的 CSS 文件名列表
const cssFiles = ['main.css'];

// 调用函数
loadCSSFromFolder('./css/style', cssFiles);