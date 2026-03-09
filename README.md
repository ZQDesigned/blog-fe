# LumiCMS Blog Frontend

一个基于 React + TypeScript + Vite 的个人博客前端项目。  
项目覆盖内容展示、互动组件、可视化样式系统和多款内置小游戏，适合用于个人站点、作品集和前端工程实践。

## 项目定位

- 面向个人博客与作品展示的前端应用
- 支持动态内容页面与统一 UI 体验
- 内置可扩展主题系统，支持后续暗色模式接入
- 同时包含娱乐模块（小游戏）与工程化质量门禁（视觉回归、样式规则检查）

## 功能模块

### 站点页面

- 首页：Banner、功能区、技能区、时间线、联系方式
- 博客列表：分类/标签筛选、关键词检索、分页
- 博客详情：Markdown 渲染、目录与内容展示
- 项目页：项目卡片、技术栈、状态与外链
- 关于页：个人信息、技能、经历、扩展模块
- 游戏页：统一游戏入口与弹窗容器

### 通用交互能力

- 响应式布局（桌面 + 移动）
- 自定义右键菜单
- 浮动侧边栏（个人信息、公告、天气等）
- 全局 Toast 通知
- 自定义光标动画
- 全局异常兜底与请求错误兜底

### 游戏模块亮点

- 2048
- 贪吃蛇
- 俄罗斯方块
- 扫雷
- 数独
- 汉诺塔
- 黑白棋（Reversi）
- 围棋（9x9 / 19x19）
- 恶魔轮盘
- Web 游戏入口（Minecraft 1.8）

## 技术栈

- React 18
- TypeScript
- Vite
- React Router
- Ant Design
- Emotion（CSS-in-JS）
- Framer Motion
- Playwright（视觉回归）
- ESLint（静态检查）

## 开发指导文档

### 1. 开发环境要求

- Node.js 20+（建议 LTS）
- Bun 1.3+
- 推荐使用现代浏览器（Chrome / Edge / Safari 最新版）

### 2. 本地启动

```bash
# 1) 安装依赖
bun install

# 2) 创建环境变量
cp .env.example .env

# 3) 启动开发服务器
bun run dev
```

默认启动后可通过本地地址访问（Vite 控制台会输出具体 URL）。

### 3. 环境变量配置

项目使用 `.env` 管理环境变量，常用配置如下：

| 变量名 | 说明 |
| --- | --- |
| `VITE_APP_TITLE` | 站点标题 |
| `VITE_ICP_NUMBER` | ICP 备案号 |
| `VITE_ICP_LINK` | ICP 备案跳转地址 |
| `VITE_API_BASE_URL` | 后端 API 基础地址 |
| `VITE_BUILD_TIME` | 构建时间（构建脚本自动写入） |
| `VITE_GIT_HASH` | 构建 Git Hash（构建脚本自动写入） |
| `VITE_QWEATHER_API_KEY` | 和风天气 API Key |
| `VITE_API_HEALTH_PATH` | 健康检查路径列表（逗号分隔） |

### 4. 常用命令

```bash
# 启动开发环境
bun run dev

# 构建生产包
bun run build

# 本地预览构建产物
bun run preview

# 代码检查
bun run lint

# 样式 token 字面量检查
bun run lint:style-tokens

# 更新样式检查基线
bun run lint:style-tokens:update-baseline

# 运行视觉回归
bun run test:visual

# 更新视觉快照
bun run test:visual:update
```

首次执行视觉测试前建议安装浏览器依赖：

```bash
bunx playwright install chromium
```

### 5. 代码结构建议阅读顺序

```text
src/
  components/     # 通用组件与游戏组件
  pages/          # 页面级模块
  services/       # API 访问层
  hooks/          # 自定义 Hooks
  theme/          # 主题配置中心与运行时
  styles/         # 全局样式入口
  utils/          # 工具函数
```

### 6. 样式开发建议

- 优先使用 `src/theme` 提供的主题变量和语义 token
- 避免在业务组件中直接写硬编码颜色
- 变更样式后建议同时执行视觉回归与样式 token 检查

### 7. 提交规范建议

- 建议使用 Conventional Commits，例如：
  - `feat: add xxx`
  - `fix: resolve xxx`
  - `refactor: improve xxx`
  - `docs: update readme`

## 文档导航

- API 说明：`docs/api.md`
- 主题系统：`docs/theme-system.md`
- 主题迁移地图：`docs/theme-migration-map.md`
- 暗色模式接入手册：`docs/dark-mode-playbook.md`
- 视觉基线说明：`docs/theme-refactor-baseline.md`

## 部署说明

- 生产构建输出目录：`dist/`
- 可部署到任意静态托管平台（Nginx / Apache / CDN / Vercel / Netlify）
- 使用前端路由时，请确保服务器配置了 SPA 回退（将未知路径回退到 `index.html`）

## License

MIT
