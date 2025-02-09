# 个人博客前端项目

基于 React + TypeScript + Vite 开发的个人博客前端项目。

## 技术栈

- React 18
- TypeScript
- Vite
- Ant Design
- Emotion (CSS-in-JS)
- Framer Motion

## 功能特性

- 📱 响应式布局，完美适配移动端
- ✨ 自定义光标动画
- 🎮 游戏彩蛋（2048小游戏）
- 🎨 自定义加载动画
- 📝 Markdown 文章渲染
- 🖱️ 自定义右键菜单
- 🕒 构建时间显示
- 🔗 友情链接支持
- 🌓 页面主题定制

## 开始使用

1. 克隆项目
```bash
git clone git@github.com:ZQDesigned/blog-fe.git
cd blog-fe
```

2. 安装依赖
```bash
npm install
```

3. 创建环境变量文件
```bash
cp .env.example .env
```

4. 配置环境变量
```env
# ICP备案信息
VITE_ICP_NUMBER=你的ICP备案号
VITE_ICP_LINK=备案链接

# API接口地址
VITE_API_BASE_URL=你的API地址

# 其他配置
VITE_APP_TITLE=网站标题
```

5. 启动开发服务器
```bash
npm run dev
```

## 构建部署

```bash
npm run build
```

构建产物将生成在 `dist` 目录下。

## 项目结构

```
src/
  ├── components/        # 公共组件
  │   ├── AnimatedCursor/   # 自定义光标动画
  │   ├── ContextMenu/      # 自定义右键菜单
  │   ├── GameModal/        # 游戏彩蛋模态框
  │   ├── Game2048/         # 2048游戏组件
  │   ├── Layout/           # 布局组件
  │   ├── MarkdownRenderer/ # Markdown渲染器
  │   └── PageLoading/      # 页面加载动画
  ├── pages/           # 页面组件
  │   ├── Home/           # 首页
  │   ├── Blog/           # 博客列表
  │   ├── BlogDetail/     # 博客详情
  │   ├── Projects/       # 项目展示
  │   └── About/          # 关于页面
  ├── hooks/           # 自定义Hooks
  ├── styles/          # 全局样式
  ├── constants/       # 常量定义
  ├── types/           # TypeScript类型定义
  └── utils/           # 工具函数
```

## 开发规范

- 使用 ESLint 进行代码规范检查
- 使用 TypeScript 进行类型检查
- 遵循组件化开发原则
- 使用 CSS-in-JS (Emotion) 进行样式管理
- 使用 Framer Motion 处理动画效果

## 环境变量说明

项目使用 `.env` 文件管理环境变量，支持以下配置：

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| VITE_APP_TITLE | 网站标题 | 个人博客 |
| VITE_ICP_NUMBER | ICP备案号 | 辽ICP备XXXXXXXX号-1 |
| VITE_ICP_LINK | 备案链接 | https://beian.miit.gov.cn/ |
| VITE_API_BASE_URL | API接口地址 | http://localhost:8080 |
| VITE_BUILD_TIME | 构建时间戳 | 自动生成 |

## 特色功能说明

### 自定义右键菜单
- 支持快捷导航
- 页面操作（刷新、返回顶部）
- 分享功能
- 链接复制

### 游戏彩蛋
- 支持键盘和触摸操作
- 自动保存游戏状态
- 响应式设计

### 构建时间显示
- 自动记录每次构建时间
- 优雅降级处理
- 移动端自适应

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'feat: 添加某个特性'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建一个 Pull Request

## 许可证

[MIT License](LICENSE)

## 联系方式

- GitHub：[ZQDesigned](https://github.com/ZQDesigned)
- Email：zqdesigned@mail.lnyynet.com
