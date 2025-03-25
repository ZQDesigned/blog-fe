const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 获取当前 Git Commit Hash
function getGitHash(isDev = false) {
  if (isDev) {
    return 'development';
  }
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch (error) {
    console.warn('Warning: Unable to get git hash.', error);
    return 'unknown';
  }
}

// 读取并更新环境变量文件
function updateEnvFile() {
  const envPath = path.resolve(process.cwd(), '.env');
  const envExamplePath = path.resolve(process.cwd(), '.env.example');
  const isDev = process.argv.includes('--dev');
  
  try {
    // 读取现有的 .env 文件
    let envContent = '';
    try {
      envContent = fs.readFileSync(envPath, 'utf8');
    } catch (error) {
      // 如果 .env 不存在，尝试从 .env.example 复制
      if (fs.existsSync(envExamplePath)) {
        envContent = fs.readFileSync(envExamplePath, 'utf8');
      }
    }

    // 更新或添加构建时间和 Git Hash
    const buildTime = isDev ? '' : Date.now().toString();
    const gitHash = getGitHash(isDev);
    const apiBaseUrl = isDev ? 'http://localhost:8080' : 'https://api.blog.zqdesigned.city';
    
    const lines = envContent.split('\n');
    const newLines = lines.map(line => {
      if (line.startsWith('VITE_BUILD_TIME=')) {
        return `VITE_BUILD_TIME=${buildTime}`;
      }
      if (line.startsWith('VITE_GIT_HASH=')) {
        return `VITE_GIT_HASH=${gitHash}`;
      }
      if (line.startsWith('VITE_API_BASE_URL=')) {
        return `VITE_API_BASE_URL=${apiBaseUrl}`;
      }
      return line;
    });

    // 如果没有找到这些变量，添加它们
    if (!lines.some(line => line.startsWith('VITE_BUILD_TIME='))) {
      newLines.push(`VITE_BUILD_TIME=${buildTime}`);
    }
    if (!lines.some(line => line.startsWith('VITE_GIT_HASH='))) {
      newLines.push(`VITE_GIT_HASH=${gitHash}`);
    }
    if (!lines.some(line => line.startsWith('VITE_API_BASE_URL='))) {
      newLines.push(`VITE_API_BASE_URL=${apiBaseUrl}`);
    }

    // 写入更新后的内容
    fs.writeFileSync(envPath, newLines.join('\n'));
    console.log('Build info updated successfully:', {
      buildTime: isDev ? 'development' : new Date(Number(buildTime)).toISOString(),
      gitHash,
      apiBaseUrl,
      environment: isDev ? 'development' : 'production'
    });
  } catch (error) {
    console.error('Error updating build info:', error);
    process.exit(1);
  }
}

updateEnvFile(); 