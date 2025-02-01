# 个人博客 API 文档

## 基础信息

- 基础路径：`/api`
- 服务器：`http://localhost:8080`
- 认证方式：JWT Token（仅用于后台管理接口）
- 响应格式：统一采用 JSON 格式

### 通用响应格式

```json
{
  "code": 200,
  "msg": "success",
  "data": {}
}
```

### 认证方式

对于需要认证的接口，请在请求头中添加：
```
Authorization: Bearer <token>
```

### 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权或 Token 已过期 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 博客文章接口

### 获取文章列表

#### 请求信息

- 路径：`GET /api/blog/list`
- 认证：不需要

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| page | integer | 否 | 页码，默认 1 |
| size | integer | 否 | 每页条数，默认 10 |
| sort | string | 否 | 排序字段，可选值：createTime,viewCount |
| order | string | 否 | 排序方式，可选值：asc,desc |
| tag | string | 否 | 标签筛选 |
| category | string | 否 | 分类筛选 |

#### 响应示例

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "total": 100,
    "pages": 10,
    "list": [
      {
        "id": 1,
        "title": "文章标题",
        "summary": "文章摘要",
        "category": "技术",
        "tags": ["React", "TypeScript"],
        "createTime": "2024-03-15T12:00:00",
        "updateTime": "2024-03-15T12:00:00",
        "viewCount": 100
      }
    ]
  }
}
```

### 获取文章详情

#### 请求信息

- 路径：`GET /api/blog/{id}`
- 认证：不需要

#### 路径参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | integer | 是 | 文章ID |

#### 响应示例

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "id": 1,
    "title": "文章标题",
    "content": "文章内容（Markdown格式）",
    "category": "技术",
    "tags": ["React", "TypeScript"],
    "createTime": "2024-03-15T12:00:00",
    "updateTime": "2024-03-15T12:00:00",
    "viewCount": 100
  }
}
```

### 发布文章

#### 请求信息

- 路径：`POST /api/blog`
- 认证：需要 JWT

#### 请求体

```json
{
  "title": "文章标题",
  "content": "文章内容（Markdown格式）",
  "summary": "文章摘要",
  "category": "技术",
  "tags": ["React", "TypeScript"]
}
```

#### 响应示例

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "id": 1
  }
}
```

### 修改文章

#### 请求信息

- 路径：`PUT /api/blog/{id}`
- 认证：需要 JWT

#### 路径参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | integer | 是 | 文章ID |

#### 请求体

```json
{
  "title": "文章标题",
  "content": "文章内容（Markdown格式）",
  "summary": "文章摘要",
  "category": "技术",
  "tags": ["React", "TypeScript"]
}
```

#### 响应示例

```json
{
  "code": 200,
  "msg": "success",
  "data": null
}
```

### 删除文章

#### 请求信息

- 路径：`DELETE /api/blog/{id}`
- 认证：需要 JWT
- 说明：软删除，仅标记 is_deleted = true

#### 路径参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | integer | 是 | 文章ID |

#### 响应示例

```json
{
  "code": 200,
  "msg": "success",
  "data": null
}
```

### 增加文章访问量

#### 请求信息

- 路径：`POST /api/blog/{id}/view`
- 认证：不需要

#### 路径参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | integer | 是 | 文章ID |

#### 响应示例

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "viewCount": 101
  }
}
```

## 项目接口

### 获取项目列表

#### 请求信息

- 路径：`GET /api/project/list`
- 认证：不需要

#### 响应示例

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "list": [
      {
        "id": 1,
        "title": "项目标题",
        "description": "项目描述",
        "tags": ["React", "TypeScript"],
        "github": "https://github.com/...",
        "demo": "https://demo.com",
        "status": "maintaining",
        "createTime": "2024-03-15T12:00:00"
      }
    ]
  }
}
```

### 获取项目详情

#### 请求信息

- 路径：`GET /api/project/{id}`
- 认证：不需要

#### 路径参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | integer | 是 | 项目ID |

#### 响应示例

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "id": 1,
    "title": "项目标题",
    "description": "项目描述",
    "content": "项目详细介绍",
    "tags": ["React", "TypeScript"],
    "github": "https://github.com/...",
    "demo": "https://demo.com",
    "status": "maintaining",
    "features": [
      "特性1",
      "特性2"
    ],
    "techStack": [
      "技术栈1",
      "技术栈2"
    ],
    "createTime": "2024-03-15T12:00:00",
    "updateTime": "2024-03-15T12:00:00"
  }
}
```

### 发布项目

#### 请求信息

- 路径：`POST /api/project`
- 认证：需要 JWT

#### 请求体

```json
{
  "title": "项目标题",
  "description": "项目描述",
  "content": "项目详细介绍",
  "tags": ["React", "TypeScript"],
  "github": "https://github.com/...",
  "demo": "https://demo.com",
  "status": "maintaining",
  "features": [
    "特性1",
    "特性2"
  ],
  "techStack": [
    "技术栈1",
    "技术栈2"
  ]
}
```

#### 响应示例

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "id": 1
  }
}
```

### 修改项目

#### 请求信息

- 路径：`PUT /api/project/{id}`
- 认证：需要 JWT

#### 路径参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | integer | 是 | 项目ID |

#### 请求体

```json
{
  "title": "项目标题",
  "description": "项目描述",
  "content": "项目详细介绍",
  "tags": ["React", "TypeScript"],
  "github": "https://github.com/...",
  "demo": "https://demo.com",
  "status": "maintaining",
  "features": [
    "特性1",
    "特性2"
  ],
  "techStack": [
    "技术栈1",
    "技术栈2"
  ]
}
```

#### 响应示例

```json
{
  "code": 200,
  "msg": "success",
  "data": null
}
```

### 删除项目

#### 请求信息

- 路径：`DELETE /api/project/{id}`
- 认证：需要 JWT
- 说明：软删除，仅标记 is_deleted = true

#### 路径参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | integer | 是 | 项目ID |

#### 响应示例

```json
{
  "code": 200,
  "msg": "success",
  "data": null
}
```

## 数据库表结构

### 博客文章表 (t_blog)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | bigint | 主键 |
| title | varchar(255) | 标题 |
| content | text | 内容（Markdown） |
| summary | varchar(500) | 摘要 |
| category | varchar(50) | 分类 |
| tags | varchar(255) | 标签（JSON数组） |
| view_count | int | 访问量 |
| is_deleted | tinyint | 是否删除 |
| create_time | datetime | 创建时间 |
| update_time | datetime | 更新时间 |

### 项目表 (t_project)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | bigint | 主键 |
| title | varchar(255) | 标题 |
| description | varchar(500) | 描述 |
| content | text | 详细介绍 |
| tags | varchar(255) | 标签（JSON数组） |
| github | varchar(255) | GitHub地址 |
| demo | varchar(255) | 演示地址 |
| status | varchar(20) | 状态 |
| features | text | 特性（JSON数组） |
| tech_stack | text | 技术栈（JSON数组） |
| is_deleted | tinyint | 是否删除 |
| create_time | datetime | 创建时间 |
| update_time | datetime | 更新时间 |

### 访问日志表 (t_view_log)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | bigint | 主键 |
| blog_id | bigint | 文章ID |
| ip | varchar(50) | 访问IP |
| user_agent | varchar(500) | 用户代理 |
| create_time | datetime | 访问时间 | 