#!/bin/zsh

# 远程服务器信息
REMOTE_USER="your_username"
REMOTE_HOST="your_server_ip"
REMOTE_PORT="22"
REMOTE_PATH="/path/to/your/website"

# SSH 连接方式：password 或 key
SSH_METHOD="key"

# 如果使用密码认证，设置密码（不推荐）
# REMOTE_PASSWORD="your_password"

# 如果使用密钥认证，设置密钥文件路径（推荐）
SSH_KEY="path/to/your/private_key"

# 本地项目路径（当前脚本所在目录）
LOCAL_PATH=$(pwd)

# 打包文件名
ARCHIVE_NAME="dist_files.zip"

# 导出变量
export REMOTE_USER
export REMOTE_HOST
export REMOTE_PORT
export REMOTE_PATH
export SSH_METHOD
# export REMOTE_PASSWORD  # 取消注释如果使用密码认证
export SSH_KEY
export LOCAL_PATH
export ARCHIVE_NAME 