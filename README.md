# 个人博客前端项目

基于 React + TypeScript + Vite 开发的个人博客前端项目。

## 技术栈

- React 18
- TypeScript
- Vite
- Ant Design
- Styled Components
- Framer Motion

## 功能特性

- 🌓 明暗主题切换
- 📱 响应式布局
- ✨ 自定义光标动画
- 🎮 游戏彩蛋
- 🎨 自定义加载动画
- 📝 Markdown 文章渲染

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

4. 启动开发服务器
```bash
npm run dev
```

## 构建部署

```bash
npm run build
```

## 开发规范

- 使用 ESLint 进行代码规范检查
- 使用 TypeScript 进行类型检查
- 遵循组件化开发原则
- 使用 CSS-in-JS 进行样式管理

## 目录结构

```
src/
  ├── components/     # 公共组件
  ├── pages/         # 页面组件
  ├── hooks/         # 自定义 Hooks
  ├── styles/        # 全局样式
  ├── constants/     # 常量定义
  ├── types/         # TypeScript 类型定义
  └── utils/         # 工具函数
```
