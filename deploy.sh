#!/bin/zsh

# 导入配置
if [ ! -f "./deploy.config.sh" ]; then
  echo "错误: 配置文件 deploy.config.sh 不存在"
  echo "请复制 deploy.config.example.sh 为 deploy.config.sh 并修改配置"
  exit 1
fi

source ./deploy.config.sh

# 安全检查，确保 Bun 环境可用
if ! command -v bun &> /dev/null; then
  echo "错误: Bun 未安装，请先安装 Bun。"
  exit 1
fi

# 执行构建命令
echo "正在执行构建命令：bun run build..."
bun run build

if [ $? -ne 0 ]; then
  echo "构建失败，请检查 Bun 配置和代码。"
  exit 1
fi

# 检查 dist 目录是否存在
if [ ! -d "$LOCAL_PATH/dist" ]; then
  echo "错误: 构建输出目录 dist 不存在，请检查构建脚本。"
  exit 1
fi

# 打包 dist 目录中的文件（只打包文件和子目录，不包含 dist 文件夹本身）
echo "正在打包 dist 目录中的文件为 ZIP..."
cd dist
zip -r "$ARCHIVE_NAME" . -x "*.DS_Store" "._*" "__MACOSX/*" > /dev/null
mv "$ARCHIVE_NAME" "$LOCAL_PATH"
cd ..

if [ $? -ne 0 ]; then
  echo "打包失败，请检查文件路径和权限。"
  exit 1
fi

echo "打包完成，文件名为 $ARCHIVE_NAME"

# 根据认证方式构建 SSH 命令
if [ "$SSH_METHOD" = "key" ]; then
  SSH_CMD="ssh -i \"$SSH_KEY\" -p \"$REMOTE_PORT\""
  SCP_CMD="scp -i \"$SSH_KEY\" -P \"$REMOTE_PORT\""
else
  # 使用 sshpass 进行密码认证
  if ! command -v sshpass &> /dev/null; then
    echo "错误: 使用密码认证需要安装 sshpass"
    echo "Mac: brew install sshpass"
    echo "Linux: apt-get install sshpass 或 yum install sshpass"
    exit 1
  fi
  SSH_CMD="sshpass -p \"$REMOTE_PASSWORD\" ssh -p \"$REMOTE_PORT\""
  SCP_CMD="sshpass -p \"$REMOTE_PASSWORD\" scp -P \"$REMOTE_PORT\""
fi

# 清理远程服务器上的旧文件
eval "$SSH_CMD \"$REMOTE_USER@$REMOTE_HOST\" 'cd \"$REMOTE_PATH\" && rm -rf ./*'"

if [ $? -eq 0 ]; then
  echo "远程文件清理完成！"
else
  echo "远程文件清理失败，请检查服务器配置。"
  exit 1
fi

# 上传打包文件到远程服务器
echo "正在上传 $ARCHIVE_NAME 到远程服务器..."
eval "$SCP_CMD \"$ARCHIVE_NAME\" \"$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH\""

if [ $? -ne 0 ]; then
  echo "文件上传失败，请检查网络连接和认证配置。"
  exit 1
fi

echo "文件上传成功，开始在远程服务器上解压..."

# 解压并部署
eval "$SSH_CMD \"$REMOTE_USER@$REMOTE_HOST\" 'cd \"$REMOTE_PATH\" && unzip -o \"$ARCHIVE_NAME\" && rm -f \"$ARCHIVE_NAME\" && echo \"项目部署完成！dist 中的文件已解压到 $REMOTE_PATH\"'"

if [ $? -eq 0 ]; then
  echo "远程解压成功，部署完成！"
else
  echo "远程解压失败，请检查服务器配置。"
  exit 1
fi

# 清理本地临时文件
rm -f "$ARCHIVE_NAME"

echo "本地临时文件已清理，所有操作完成！"
