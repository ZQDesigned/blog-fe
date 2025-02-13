import { BlogData } from '../../types/types.ts';

export const MOCK_BLOGS: BlogData[] = [
  {
    id: 1,
    title: 'React 18 新特性解析',
    category: '前端开发',
    summary: 'React 18 带来了许多激动人心的新特性，包括并发渲染、自动批处理、Suspense 改进等。本文将深入探讨这些特性的使用方法和最佳实践。',
    content: `
# React 18 新特性解析

React 18 是一个重要的版本更新，带来了许多重要的新特性：

## 1. 并发渲染（Concurrent Rendering）

并发渲染是 React 18 最重要的新特性之一，它允许 React 同时准备多个版本的 UI。

## 2. 自动批处理（Automatic Batching）

在 React 18 中，所有的状态更新都会自动批处理，这意味着多个状态更新会被合并为一次重渲染。

## 3. Suspense 改进

Suspense 现在支持服务端渲染，这使得构建更好的加载状态成为可能。

## 4. 新的 Hooks

- useId()
- useTransition()
- useDeferredValue()

## 5. 新的 Root API

新的 createRoot API 替代了 ReactDOM.render。

\`\`\`jsx
// 旧版本
ReactDOM.render(<App />, container);

// 新版本
const root = ReactDOM.createRoot(container);
root.render(<App />);
\`\`\`
    `,
    tags: ['React', 'JavaScript', '前端框架', '性能优化'],
    date: '2024-03-15',
    viewCount: 1234
  },
  {
    id: 2,
    title: 'TypeScript 高级类型技巧',
    category: '前端开发',
    summary: '探索 TypeScript 中的高级类型用法，包括条件类型、映射类型、工具类型等，帮助你编写更安全、更优雅的代码。',
    content: `
# TypeScript 高级类型技巧

## 条件类型（Conditional Types）

\`\`\`typescript
type IsString<T> = T extends string ? true : false;
\`\`\`

## 映射类型（Mapped Types）

\`\`\`typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
\`\`\`

## 工具类型（Utility Types）

- Partial<T>
- Required<T>
- Pick<T, K>
- Record<K, T>
    `,
    tags: ['TypeScript', 'JavaScript', '类型系统'],
    date: '2024-03-14',
    viewCount: 856
  },
  {
    id: 3,
    title: 'Spring Boot 3.0 最佳实践',
    category: '后端开发',
    summary: 'Spring Boot 3.0 版本带来了许多重要更新，本文将介绍其新特性以及在实际项目中的最佳实践。',
    content: `
# Spring Boot 3.0 最佳实践

## 1. 升级到 Java 17

Spring Boot 3.0 要求最低 Java 17 版本。

## 2. 原生支持 GraalVM

现在可以将 Spring Boot 应用编译为原生镜像。

## 3. 新的 HTTP 接口

\`\`\`java
@RestController
public class UserController {
    @GetMapping("/users")
    public List<User> getUsers() {
        return userService.findAll();
    }
}
\`\`\`
    `,
    tags: ['Java', 'Spring Boot', '后端框架'],
    date: '2024-03-13',
    viewCount: 789
  },
  {
    id: 4,
    title: 'Docker 容器化实践指南',
    category: '运维部署',
    summary: '详细介绍 Docker 容器化技术的实践经验，包括镜像构建、容器编排、网络配置等核心概念。',
    content: `
# Docker 容器化实践指南

## 1. Dockerfile 最佳实践

\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
\`\`\`

## 2. Docker Compose

\`\`\`yaml
version: '3'
services:
  web:
    build: .
    ports:
      - "3000:3000"
\`\`\`
    `,
    tags: ['Docker', '容器化', 'DevOps'],
    date: '2024-03-12',
    viewCount: 654
  },
  {
    id: 5,
    title: 'MongoDB 性能优化实战',
    category: '数据库',
    summary: '分享 MongoDB 在高并发场景下的性能优化技巧，包括索引优化、查询优化、分片策略等实用经验。',
    content: `
# MongoDB 性能优化实战

## 1. 索引优化

- 创建合适的索引
- 避免过多索引
- 使用复合索引

## 2. 查询优化

\`\`\`javascript
// 优化前
db.users.find({ status: 'active' }).sort({ createdAt: -1 })

// 优化后
db.users.createIndex({ status: 1, createdAt: -1 })
\`\`\`
    `,
    tags: ['MongoDB', '数据库', '性能优化'],
    date: '2024-03-11',
    viewCount: 543
  },
  {
    id: 6,
    title: '微服务架构设计实践',
    category: '系统架构',
    summary: '探讨微服务架构的设计原则、服务拆分策略、通信模式以及常见的坑点和解决方案。',
    content: `
# 微服务架构设计实践

## 1. 服务拆分原则

- 单一职责
- 高内聚低耦合
- 数据驱动

## 2. 服务通信

- REST API
- gRPC
- 消息队列
    `,
    tags: ['微服务', '系统设计', '架构设计'],
    date: '2024-03-10',
    viewCount: 432
  }
];
