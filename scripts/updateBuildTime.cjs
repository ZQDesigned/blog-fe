const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env');

try {
  // 读取当前的 .env 文件内容
  let envContent = fs.readFileSync(envPath, 'utf8');

  // 更新或添加构建时间
  const buildTime = Date.now();
  if (envContent.includes('VITE_BUILD_TIME=')) {
    // 如果已存在，则更新
    envContent = envContent.replace(
      /VITE_BUILD_TIME=.*/,
      `VITE_BUILD_TIME=${buildTime}`
    );
  } else {
    // 如果不存在，则添加
    envContent += `\nVITE_BUILD_TIME=${buildTime}\n`;
  }

  // 写回文件
  fs.writeFileSync(envPath, envContent);
  console.log('Build time updated successfully:', new Date(buildTime).toLocaleString());
} catch (error) {
  console.error('Error updating build time:', error);
  process.exit(1);
}
