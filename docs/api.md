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
| page | integer | 否 | 页码，默认 1，最小值：1 |
| size | integer | 否 | 每页条数，默认 10，取值范围：1-100 |
| sort | string | 否 | 排序字段，可选值：createTime（创建时间）,viewCount（访问量），默认：createTime |
| order | string | 否 | 排序方式，可选值：asc（升序）,desc（降序），默认：desc |
| tag | string | 否 | 标签筛选 |
| category | string | 否 | 分类筛选 |

#### 错误响应

除了通用错误码外，本接口还可能返回以下错误：

| 错误码 | 说明 |
|--------|------|
| 400 | 参数验证失败，如：页码小于1、每页条数超出范围、排序字段不正确等 |

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
        "categoryId": 1,
        "categoryName": "技术",
        "tagIds": [1, 2],
        "tagNames": ["React", "TypeScript"],
        "viewCount": 100,
        "createTime": "2024-03-15T12:00:00",
        "updateTime": "2024-03-15T12:00:00"
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
    "summary": "文章摘要",
    "categoryId": 1,
    "categoryName": "技术",
    "tagIds": [1, 2],
    "tagNames": ["React", "TypeScript"],
    "viewCount": 100,
    "createTime": "2024-03-15T12:00:00",
    "updateTime": "2024-03-15T12:00:00"
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
  "title": "文章标题",          // 必填
  "content": "文章内容",        // 选填，Markdown格式
  "summary": "文章摘要",        // 选填
  "categoryId": 1,             // 必填，分类ID
  "tagIds": [1, 2]            // 必填，标签ID列表
}
```

#### 错误响应

除了通用错误码外，本接口还可能返回以下错误：

| 错误码 | 说明 |
|--------|------|
| 400 | 参数验证失败，如：标题为空、分类ID为空、标签列表为空等 |
| 404 | 分类或标签不存在 |

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
  "title": "文章标题",          // 必填
  "content": "文章内容",        // 选填，Markdown格式
  "summary": "文章摘要",        // 选填
  "categoryId": 1,             // 必填，分类ID
  "tagIds": [1, 2]            // 必填，标签ID列表
}
```

#### 错误响应

除了通用错误码外，本接口还可能返回以下错误：

| 错误码 | 说明 |
|--------|------|
| 400 | 参数验证失败，如：标题为空、分类ID为空、标签列表为空等 |
| 404 | 文章不存在，或分类/标签不存在 |

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
  "data": 101
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
        "imageUrl": "/uploads/xxx.jpg",
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

#### 响应字段说明

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | integer | 项目ID |
| title | string | 项目标题 |
| description | string | 项目描述 |
| content | string | 项目详细介绍 |
| imageUrl | string | 项目图片URL |
| tags | array | 项目标签 |
| github | object | GitHub 仓库信息 |
| github.url | string | GitHub 仓库地址 |
| github.disabled | boolean | 是否禁用源码按钮 |
| github.disabledReason | string | 源码按钮禁用原因 |
| demo | object | 在线演示信息 |
| demo.url | string | 在线演示地址 |
| demo.disabled | boolean | 是否禁用演示按钮 |
| demo.disabledReason | string | 演示按钮禁用原因 |
| status | string | 项目状态，可选值：developing(开发中), maintaining(维护中), paused(暂停维护) |
| features | array | 项目特性列表 |
| techStack | array | 使用的技术栈列表 |
| createTime | string | 创建时间 |
| updateTime | string | 更新时间 |

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
    "imageUrl": "/uploads/xxx.jpg",
    "tags": ["React", "TypeScript"],
    "github": {
      "url": "https://github.com/...",
      "disabled": false,
      "disabledReason": null
    },
    "demo": {
      "url": "https://demo.com",
      "disabled": true,
      "disabledReason": "演示环境部署中"
    },
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
- Content-Type: multipart/form-data

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| title | string | 是 | 项目标题 |
| description | string | 是 | 项目描述 |
| image | file | 是 | 项目图片（仅支持图片文件：jpg、jpeg、png、gif） |
| github | object | 否 | GitHub 仓库信息 |
| github.url | string | 否 | GitHub 仓库地址 |
| github.disabled | boolean | 否 | 是否禁用源码按钮 |
| github.disabledReason | string | 否 | 源码按钮禁用原因 |
| demo | object | 否 | 演示信息 |
| demo.url | string | 否 | 演示地址 |
| demo.disabled | boolean | 否 | 是否禁用演示按钮 |
| demo.disabledReason | string | 否 | 演示按钮禁用原因 |
| status | string | 是 | 项目状态（developing-开发中, maintaining-维护中, paused-暂停维护） |
| features | array | 否 | 项目特性列表，格式：["特性1", "特性2"] |
| techStack | array | 否 | 技术栈列表，格式：["技术1", "技术2"] |

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
- Content-Type: multipart/form-data

#### 路径参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | integer | 是 | 项目ID |

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| title | string | 是 | 项目标题 |
| description | string | 是 | 项目描述 |
| content | string | 否 | 项目详细介绍 |
| image | file | 否 | 项目图片（不传则保持原图片不变） |
| tags | array | 否 | 项目标签列表 |
| github.url | string | 否 | GitHub 仓库地址 |
| github.disabled | boolean | 否 | 是否禁用源码按钮 |
| github.disabledReason | string | 否 | 源码按钮禁用原因 |
| demo.url | string | 否 | 演示地址 |
| demo.disabled | boolean | 否 | 是否禁用演示按钮 |
| demo.disabledReason | string | 否 | 演示按钮禁用原因 |
| status | string | 是 | 项目状态 |
| features | array | 否 | 项目特性列表 |
| techStack | array | 否 | 技术栈列表 |

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

# 个人博客 API 文档

[原有内容保持不变...]

## 分类接口

### 获取分类列表

#### 请求信息

- 路径：`GET /api/category/list`
- 认证：不需要

#### 响应示例

```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "id": 1,
      "name": "技术",
      "description": "技术相关文章",
      "articleCount": 10,
      "createTime": "2024-03-15T12:00:00",
      "updateTime": "2024-03-15T12:00:00"
    }
  ]
}
```

### 获取分类详情

#### 请求信息

- 路径：`GET /api/category/{id}`
- 认证：不需要

#### 路径参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | integer | 是 | 分类ID |

#### 响应示例

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "id": 1,
    "name": "技术",
    "description": "技术相关文章",
    "articleCount": 10,
    "createTime": "2024-03-15T12:00:00",
    "updateTime": "2024-03-15T12:00:00"
  }
}
```

### 创建分类

#### 请求信息

- 路径：`POST /api/category`
- 认证：需要 JWT

#### 请求体

```json
{
  "name": "技术",
  "description": "技术相关文章"
}
```

#### 响应示例

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "id": 1,
    "name": "技术",
    "description": "技术相关文章",
    "articleCount": 0,
    "createTime": "2024-03-15T12:00:00",
    "updateTime": "2024-03-15T12:00:00"
  }
}
```

### 修改分类

#### 请求信息

- 路径：`PUT /api/category/{id}`
- 认证：需要 JWT

#### 路径参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | integer | 是 | 分类ID |

#### 请求体

```json
{
  "name": "技术",
  "description": "技术相关文章"
}
```

#### 响应示例

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "id": 1,
    "name": "技术",
    "description": "技术相关文章",
    "articleCount": 10,
    "createTime": "2024-03-15T12:00:00",
    "updateTime": "2024-03-15T12:00:00"
  }
}
```

### 删除分类

#### 请求信息

- 路径：`DELETE /api/category/{id}`
- 认证：需要 JWT

#### 路径参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | integer | 是 | 分类ID |

#### 响应示例

```json
{
  "code": 200,
  "msg": "success",
  "data": null
}
```

## 标签接口

### 获取标签列表

#### 请求信息

- 路径：`GET /api/tag/list`
- 认证：不需要

#### 响应示例

```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "id": 1,
      "name": "Spring Boot",
      "description": "Spring Boot相关",
      "articleCount": 5,
      "createTime": "2024-03-15T12:00:00",
      "updateTime": "2024-03-15T12:00:00"
    }
  ]
}
```

### 获取标签详情

#### 请求信息

- 路径：`GET /api/tag/{id}`
- 认证：不需要

#### 路径参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | integer | 是 | 标签ID |

#### 响应示例

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "id": 1,
    "name": "Spring Boot",
    "description": "Spring Boot相关",
    "articleCount": 5,
    "createTime": "2024-03-15T12:00:00",
    "updateTime": "2024-03-15T12:00:00"
  }
}
```

### 创建标签

#### 请求信息

- 路径：`POST /api/tag`
- 认证：需要 JWT

#### 请求体

```json
{
  "name": "Spring Boot",
  "description": "Spring Boot相关"
}
```

#### 响应示例

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "id": 1,
    "name": "Spring Boot",
    "description": "Spring Boot相关",
    "articleCount": 0,
    "createTime": "2024-03-15T12:00:00",
    "updateTime": "2024-03-15T12:00:00"
  }
}
```

### 修改标签

#### 请求信息

- 路径：`PUT /api/tag/{id}`
- 认证：需要 JWT

#### 路径参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | integer | 是 | 标签ID |

#### 请求体

```json
{
  "name": "Spring Boot",
  "description": "Spring Boot相关"
}
```

#### 响应示例

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "id": 1,
    "name": "Spring Boot",
    "description": "Spring Boot相关",
    "articleCount": 5,
    "createTime": "2024-03-15T12:00:00",
    "updateTime": "2024-03-15T12:00:00"
  }
}
```

### 删除标签

#### 请求信息

- 路径：`DELETE /api/tag/{id}`
- 认证：需要 JWT

#### 路径参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | integer | 是 | 标签ID |

#### 响应示例

```json
{
  "code": 200,
  "msg": "success",
  "data": null
}
```

## 数据库表结构

### 分类表 (t_category)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | bigint | 主键 |
| name | varchar(50) | 分类名称 |
| description | varchar(200) | 分类描述 |
| article_count | int | 文章数量 |
| create_time | datetime | 创建时间 |
| update_time | datetime | 更新时间 |

### 标签表 (t_tag)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | bigint | 主键 |
| name | varchar(50) | 标签名称 |
| description | varchar(200) | 标签描述 |
| article_count | int | 文章数量 |
| create_time | datetime | 创建时间 |
| update_time | datetime | 更新时间 |

### 文章-标签关联表 (t_blog_tag)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | bigint | 主键 |
| blog_id | bigint | 文章ID |
| tag_id | bigint | 标签ID |
| create_time | datetime | 创建时间 |

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
| image_path | varchar(255) | 图片文件名 |
| image_name | varchar(255) | 原始图片名称 |
| tags | varchar(255) | 标签（JSON数组） |
| github_url | varchar(255) | GitHub仓库地址 |
| github_disabled | tinyint | 是否禁用源码按钮 |
| github_disabled_reason | varchar(255) | 源码按钮禁用原因 |
| demo_url | varchar(255) | 演示地址 |
| demo_disabled | tinyint | 是否禁用演示按钮 |
| demo_disabled_reason | varchar(255) | 演示按钮禁用原因 |
| status | varchar(20) | 状态（可选值：developing-开发中, maintaining-维护中, paused-暂停维护） |
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

### 管理员表 (t_admin)

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | bigint | 主键 |
| username | varchar(50) | 用户名 |
| password | varchar(255) | 密码（加密存储） |
| last_login_time | datetime | 最后登录时间 |
| last_login_ip | varchar(50) | 最后登录IP |
| status | tinyint | 状态（1-正常，0-禁用） |
| create_time | datetime | 创建时间 |
| update_time | datetime | 更新时间 |

## 认证接口

### 管理员登录

#### 请求信息

- 路径：`POST /api/auth/login`
- 认证：不需要

#### 请求体

```json
{
  "username": "admin",
  "password": "your-password"
}
```

#### 响应示例

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400,
    "tokenType": "Bearer"
  }
}
```

### 获取当前登录信息

#### 请求信息

- 路径：`GET /api/auth/info`
- 认证：需要 JWT

#### 响应示例

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "id": 1,
    "username": "admin",
    "lastLoginTime": "2024-03-15T12:00:00",
    "lastLoginIp": "127.0.0.1"
  }
}
```

### 修改密码

#### 请求信息

- 路径：`PUT /api/auth/password`
- 认证：需要 JWT

#### 请求体

```json
{
  "oldPassword": "old-password",
  "newPassword": "new-password"
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

### 退出登录

#### 请求信息

- 路径：`POST /api/auth/logout`
- 认证：需要 JWT

#### 响应示例

```json
{
  "code": 200,
  "msg": "success",
  "data": null
}
```

### 刷新令牌

#### 请求信息

- 路径：`POST /api/auth/refresh`
- 认证：需要 JWT（使用即将过期的令牌）

#### 响应示例

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400,
    "tokenType": "Bearer"
  }
}
```

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未登录或登录已过期 |
| 403 | 无权限访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |
| 1001 | 用户名或密码错误 |
| 1002 | 账号已被禁用 |
| 1003 | 旧密码错误 |
| 1004 | 令牌已失效 |

## 统计接口

### 获取仪表盘统计数据

#### 请求信息

- 路径：`GET /api/stats/dashboard`
- 认证：需要 JWT

#### 响应字段说明

| 字段名 | 类型 | 说明 |
|--------|------|------|
| totalArticles | integer | 文章总数 |
| totalProjects | integer | 项目总数 |
| totalCategories | integer | 分类总数 |
| totalTags | integer | 标签总数 |
| visitTrend | array | 最近7天的访问趋势 |
| visitTrend[].date | string | 日期，格式：YYYY-MM-DD |
| visitTrend[].value | integer | 访问量 |
| categoryStats | array | 分类统计（按文章数量排序，最多5个） |
| categoryStats[].category | string | 分类名称 |
| categoryStats[].value | integer | 文章数量 |
| projectStats | array | 项目状态统计 |
| projectStats[].type | string | 项目状态（developing-开发中, maintaining-维护中, paused-暂停维护） |
| projectStats[].value | integer | 项目数量 |

#### 响应示例

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "totalArticles": 100,
    "totalProjects": 10,
    "totalCategories": 8,
    "totalTags": 20,
    "visitTrend": [
      {
        "date": "2024-03-15",
        "value": 150
      },
      {
        "date": "2024-03-16",
        "value": 180
      }
    ],
    "categoryStats": [
      {
        "category": "技术博客",
        "value": 50
      },
      {
        "category": "学习笔记",
        "value": 30
      }
    ],
    "projectStats": [
      {
        "type": "maintaining",
        "value": 5
      },
      {
        "type": "developing",
        "value": 3
      },
      {
        "type": "paused",
        "value": 2
      }
    ]
  }
}
``` 