---
name: 接口封装生成
description: 根据 Swagger/OpenAPI 文档生成带完整类型的 TypeScript/JavaScript API 封装文件。当用户提供 Swagger JSON、YAML、URL 或接口描述并希望生成 API 封装代码时使用此 skill。触发词包括："根据接口文档生成"、"帮我封装接口"、"generate API from swagger"、"wrap these endpoints"，或用户粘贴后端接口文档要求生成前端代码。当用户提供现有请求工具（axios 封装、fetch 封装等）作为风格参考时，必须使用此 skill —— 生成代码须与其项目规范完全一致。
---

# 接口封装生成 Skill

根据 Swagger/OpenAPI 文档，生成可直接投入生产的带完整类型的 API 封装文件。目标是让开发者 `import { getUser }` 后，在 IDE 中立刻看到入参类型、响应结构和 JSDoc 提示 —— 无需猜测，无需翻文档。

---

## 信息收集

生成前，需要收集以下四项信息。缺少任何一项时，主动向用户询问。

### 1. 接口来源（四选一）

**A. 上传文件**（`.json` / `.yaml` / `.yml`）
- 文件路径：`/mnt/user-data/uploads/<文件名>`
- 用 `bash_tool` 读取：`cat /mnt/user-data/uploads/swagger.json`
- YAML 格式转换：`pip install pyyaml --break-system-packages -q && python3 -c "import yaml,json,sys; print(json.dumps(yaml.safe_load(open('/mnt/user-data/uploads/api.yaml'))))"`

**B. Swagger 页面 URL**
- 用 `web_fetch` 获取 spec，按以下顺序依次尝试：
  1. 用户提供的 URL 原样请求（可能已是 JSON 接口地址）
  2. `<baseUrl>/v3/api-docs`（OpenAPI 3.x，Spring Boot 默认）
  3. `<baseUrl>/v2/api-docs`（Swagger 2.0，Spring Boot 默认）
  4. `<baseUrl>/swagger.json`
  5. `<baseUrl>/api-docs`
- 若 URL 返回 HTML 页面（Swagger UI），从页面源码中提取 `url:` 配置值，那才是实际的 JSON 接口地址。

**C. 直接粘贴 JSON/YAML** —— 从对话内容中直接解析。

**D. 文字描述接口** —— 自然语言或伪代码。生成前先整理为接口列表请用户确认：展示表格，确认后再开始生成。

---

### 2. 项目语言检测（JS vs TS）

**从任何可用信号自动判断 —— 不默认假设为 TS：**

| 信号 | 判断结果 |
|---|---|
| 用户粘贴了 `request.ts` / `*.ts` 文件 | → TypeScript |
| 用户粘贴了 `request.js` / `*.js` 文件 | → JavaScript |
| 用户提到项目有 `tsconfig.json` | → TypeScript |
| 用户提到 Vue 3 + Vite，但没看到 `.ts` 文件 | → 主动询问 |
| 用户项目中文件扩展名为 `.js` | → JavaScript |
| 没有任何信号 | → **询问**："你的项目用的是 TypeScript 还是 JavaScript？" |

**JS 模式与 TS 模式的区别：**
- 不使用 TypeScript 泛型：写 `request.get('/user')` 而非 `request.get<User>('/user')`
- 不生成 `interface` 或 `type` —— 跳过 `types.ts`
- 改用 JSDoc `@typedef` 和 `@param {Type}` 标注类型（JS 项目 IDE 同样有智能提示！）
- 文件扩展名用 `.js` 而非 `.ts`
- 不使用 `import type`，改用普通 `import`

**JS 模式输出示例：**
```js
/**
 * 获取用户详情
 * @param {number} id 用户ID
 * @returns {Promise<UserInfo>} 用户信息
 */
export const getUserById = (id) =>
  request.get(`/user/${id}`)

/**
 * 获取用户列表
 * @param {{ page: number, pageSize: number, keyword?: string }} params
 * @returns {Promise<PageResult<UserInfo>>}
 */
export const getUserList = (params) =>
  request.get('/user/list', { params })
```

**JS typedef 文件**（替代 `types.ts`，可选但推荐）：
```js
// types.js — JSDoc 类型定义，供 IDE 智能提示使用

/**
 * @typedef {Object} UserInfo
 * @property {number} id 用户ID
 * @property {string} username 用户名
 * @property {string} email 邮箱
 * @property {string} createdAt 创建时间
 */

/**
 * @template T
 * @typedef {Object} PageResult
 * @property {T[]} list
 * @property {number} total
 * @property {number} page
 * @property {number} pageSize
 */
```

询问用户是否需要 `types.js` typedef 文件 —— 可选，但能让 JS 项目在 VS Code 中获得完整的自动补全支持。

---

### 3. 项目请求封装风格

请用户粘贴其 `request.ts` / `request.js` / `http.ts` axios 封装代码，以及一个现有 API 调用示例。两者结合可以判断：
- 泛型位置（仅 TS）：`request.get<T>()` 还是 `request<T>({ method: 'get' })`
- 参数传递方式：query 参数用 `{ params }`，body 参数直接作为第二个参数
- 封装是否已自动解包 `{ code, data }` 响应
- 使用的路径别名（`@/utils/request` 还是 `~/api/http` 等）

若用户未提供封装风格，使用 `references/default-styles.md` 中对应的模板（TS 用风格 A，JS 用风格 A-JS），并在生成文件顶部注释中说明。

---

### 4. 项目目录结构（用于决定输出路径）

请用户提供 `src/` 目录的大致结构（前两层即可），或直接问：
> "你的 API 文件通常放在哪个目录？比如 `src/api/`、`src/services/`、`src/http/`？"

根据回答决定：
- 输出目录名（`api` / `services` / `requests`）
- 是否需要生成 `index.ts` / `index.js` 统一导出
- 类型文件位置（与模块同级，还是单独放 `src/types/api/` 目录）

---

## 解析策略

### Swagger JSON/YAML 解析

对每个接口提取以下字段：
- `path` + `method`（GET/POST/PUT/DELETE/PATCH）
- `operationId` 或从路径推导函数名（见命名规则）
- `summary` / `description` → JSDoc 注释
- `parameters`（path、query、header）→ 类型化参数对象
- `requestBody` → 类型化请求体 interface（仅 TS）
- `responses[200].schema` 或 `responses[200].content` → 类型化返回值
- `tags` → 模块分组（每个 tag 生成一个文件）

### URL 输入

用 `web_fetch` 获取 JSON spec，然后按上述方式解析。常见地址格式：
- `https://api.example.com/v2/api-docs`（Swagger 2.0）
- `https://api.example.com/v3/api-docs`（OpenAPI 3.x）
- `https://api.example.com/swagger.json`

### 文字描述输入

若用户用自然语言或伪代码描述接口，先推断结构，生成前展示给用户确认："我理解了以下 N 个接口，请确认是否正确？"并附上简要表格。

---

## 命名规则

将路径转换为符合习惯的 camelCase 函数名：

| HTTP 方法 | 路径 | 函数名 |
|---|---|---|
| GET | `/user/{id}` | `getUserById` |
| GET | `/user/list` | `getUserList` |
| POST | `/user` | `createUser` |
| PUT | `/user/{id}` | `updateUserById` |
| DELETE | `/user/{id}` | `deleteUserById` |
| GET | `/order/detail` | `getOrderDetail` |

规则：
- 去掉开头斜杠，按 `/` 和 `-` 分割
- 以 HTTP 动词为前缀：`get`、`create`、`update`、`delete`、`upload`、`download`
- 路径参数融入函数名：`{userId}` → `ById`，`{orderId}` → `ByOrderId`
- 如果 `operationId` 有实际含义（非自动生成的噪音），优先使用它

---

## 类型生成（仅 TypeScript 项目）

### Interface 定义

生成 `types.ts`（或内联到各模块文件）：

```ts
/** 用户信息 */
export interface UserInfo {
  /** 用户ID */
  id: number
  /** 用户名 */
  username: string
  /** 邮箱 */
  email: string
  /** 创建时间 */
  createdAt: string
}

/** 分页参数 */
export interface PageParams {
  /** 页码，从1开始 */
  page: number
  /** 每页条数 */
  pageSize: number
}

/** 分页响应 */
export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}
```

**规则：**
- 所有字段的 JSDoc 注释从 Swagger `description` 字段提取
- 用 `number` 不用 `Number`，用 `string` 不用 `String`
- 可空字段：`field?: string` 或 `field: string | null`（与 Swagger 定义保持一致）
- 数组：`items: UserInfo[]`
- 枚举：从枚举值生成 `export type Status = 'active' | 'inactive' | 'pending'`
- 复用共享类型，不在多个文件中重复定义 `PageParams`
- 结构复杂时，考虑统一使用单个 `types.ts` 导出

### 通用响应包装

大多数项目有统一的响应结构，从用户的封装样例中检测：

```ts
// 常见格式：{ code, message, data }
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}
```

若用户的请求工具已自动解包（直接返回 `data`），函数返回类型不要再套一层。

---

## 文件结构

**始终与用户现有的项目结构保持一致。** 以信息收集第 4 步获得的信息为准。

### 决策逻辑

```
若用户已有 api/ 目录：
  → 完全镜像其结构（相同的嵌套层级和命名规范）
  → 问："要放到 src/api/ 下吗，还是另一个目录？"

若用户尚无 API 文件：
  → 根据接口数量选择以下结构

若用户明确指定了路径：
  → 直接使用
```

### 按规模选择结构

**小型（≤ 10 个接口）** —— 单文件：
```
src/api/
└── index.ts          # 所有接口 + 内联类型
```

**中型（11–50 个接口）** —— 按 tag/模块分文件：
```
src/api/
├── types.ts          # 所有共享 interface
├── user.ts           # user tag 下的接口
├── order.ts          # order tag 下的接口
└── index.ts          # 统一导出：export * from './user'
```

**大型（50+ 个接口）** —— 按领域嵌套：
```
src/api/
├── types/
│   ├── common.ts     # PageParams、ApiResponse、枚举
│   ├── user.ts       # 用户领域类型
│   └── order.ts      # 订单领域类型
├── user/
│   ├── index.ts      # 用户 API 函数
│   └── types.ts      # （可选：就近放置的类型）
├── order/
│   └── index.ts
└── index.ts          # 根目录统一导出
```

### 统一导出文件（`index.ts` / `index.js`）

始终生成 barrel 导出文件，让调用方可以这样写：
```ts
import { getUserById, createOrder } from '@/api'
// 而不是：
import { getUserById } from '@/api/user'
import { createOrder } from '@/api/order'
```

---

## 代码生成模板

严格匹配用户的风格。以下是常见模式的模板：

### 风格 A：Axios 自定义封装（TS）
```ts
import request from '@/utils/request'
import type { UserInfo, CreateUserParams, PageParams, PageResult } from './types'

/**
 * 获取用户详情
 * @param id 用户ID
 * @returns 用户信息
 */
export const getUserById = (id: number) =>
  request.get<UserInfo>(`/user/${id}`)

/**
 * 获取用户列表
 * @param params 分页和筛选参数
 */
export const getUserList = (params: PageParams & { keyword?: string }) =>
  request.get<PageResult<UserInfo>>('/user/list', { params })

/**
 * 创建用户
 * @param data 用户创建参数
 */
export const createUser = (data: CreateUserParams) =>
  request.post<UserInfo>('/user', data)

/**
 * 更新用户信息
 * @param id 用户ID
 * @param data 更新字段
 */
export const updateUserById = (id: number, data: Partial<CreateUserParams>) =>
  request.put<UserInfo>(`/user/${id}`, data)

/**
 * 删除用户
 * @param id 用户ID
 */
export const deleteUserById = (id: number) =>
  request.delete(`/user/${id}`)
```

### 风格 B：React Query hooks（TS）
```ts
import { useQuery, useMutation } from '@tanstack/react-query'
import request from '@/utils/request'
import type { UserInfo, CreateUserParams } from './types'

export const useGetUserById = (id: number) =>
  useQuery({
    queryKey: ['user', id],
    queryFn: () => request.get<UserInfo>(`/user/${id}`),
    enabled: !!id,
  })

export const useCreateUser = () =>
  useMutation({
    mutationFn: (data: CreateUserParams) =>
      request.post<UserInfo>('/user', data),
  })
```

其他模式（JS 版本等）详见 `references/default-styles.md`。

---

## JSDoc 要求（IDE 提示的关键）

每个导出函数**必须**包含：

```ts
/**
 * [从 Swagger summary/description 提取的接口描述]
 *
 * @param paramName [从 Swagger 提取的参数描述]
 * @param body.fieldName [字段描述]
 * @returns [响应描述]
 * @example
 * const user = await getUserById(123)
 * console.log(user.username)
 */
```

**为什么重要：** TypeScript / JavaScript 语言服务会在 VS Code、WebStorm 等编辑器中悬停显示 JSDoc。有了它，函数本身就是文档。

规则：
- 描述从 Swagger 的 `summary` / `description` / 字段 `description` 提取
- 中文接口保留中文描述，不翻译
- 非简单接口（列表查询、文件上传等）需加 `@example`
- 废弃接口用 `@deprecated [原因]` 标注

---

## 输出检查清单

输出代码前，逐项核对：

**通用（JS + TS 均适用）**
- [ ] 每个函数都有完整 JSDoc（函数说明 + 每个参数的 @param + @returns）
- [ ] path 参数放在 URL 模板字符串里，不放进 params 对象
- [ ] query 参数用 `{ params }` 传，body 参数直接作为第二个参数
- [ ] 文件上传接口使用 `FormData`，并附上 content-type 注释
- [ ] 生成风格与用户提供的样例完全一致

**TypeScript 项目额外检查**
- [ ] 所有 interface 从 `types.ts` 导出
- [ ] 响应泛型与请求工具的期望一致
- [ ] 不使用 `any` —— 真正未知的类型用 `unknown`
- [ ] 可空/可选字段正确标注（`?` 或 `| null`）
- [ ] 使用 `import type` 导入纯类型

**JavaScript 项目额外检查**
- [ ] 没有 TypeScript 语法（无泛型、无 interface、无类型注解）
- [ ] 所有参数用 JSDoc `@param {Type}` 标注
- [ ] 返回值用 `@returns {Promise<Type>}` 标注
- [ ] 文件扩展名为 `.js` 而非 `.ts`
- [ ] 如用户需要，生成可选的 `types.js` typedef 文件

---

## 边界情况处理

### 文件上传
```ts
/**
 * 上传头像
 * @param file 图片文件
 * @returns 文件URL
 */
export const uploadAvatar = (file: File) => {
  const form = new FormData()
  form.append('file', file)
  return request.post<{ url: string }>('/upload/avatar', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
```

### path 参数 + query 参数混合
```ts
// GET /order/{orderId}/items?status=pending
export const getOrderItems = (orderId: number, params?: { status?: OrderStatus }) =>
  request.get<OrderItem[]>(`/order/${orderId}/items`, { params })
```

### 枚举参数
```ts
export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'done' | 'cancelled'

export const getOrderList = (params: { status?: OrderStatus; page: number; pageSize: number }) =>
  request.get<PageResult<Order>>('/order/list', { params })
```

### 无响应体（204）
```ts
export const deleteOrder = (id: number) =>
  request.delete<void>(`/order/${id}`)
```

---

## 多文件输出格式

输出代码前，先展示文件清单并请用户确认：

```
我将生成以下文件，放在 src/api/ 目录下：

📁 src/api/
  📄 types.ts       — 共享类型定义（UserInfo、OrderVO、PageResult 等）
  📄 user.ts        — 用户模块（8 个接口）
  📄 order.ts       — 订单模块（12 个接口）
  📄 index.ts       — 统一导出

import 方式：
  import { getUserById, getOrderList } from '@/api'

确认这个结构可以吗？
```

每个文件顶部加上说明注释：
```ts
// ============================================================
// src/api/user.ts — 用户模块接口封装
// 生成自: https://api.example.com/v3/api-docs (UserController)
// 如需更新，重新执行生成而非手动修改
// ============================================================
```

---

## 参考文件

- `references/default-styles.md` —— 用户无现有封装风格时使用的默认模板（含 JS/TS 版本）
- `references/swagger-parsing.md` —— Swagger 2.0 与 OpenAPI 3.x 解析差异及边界情况