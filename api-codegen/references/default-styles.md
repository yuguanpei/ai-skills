# 默认请求封装风格

当用户未提供现有请求工具时，使用以下模板。

---

## TypeScript 项目

### 风格 A（TS）：Axios 自定义封装（最常见，Vue/React 项目）

```ts
// utils/request.ts（已存在）
import axios from 'axios'
const request = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL, timeout: 10000 })
export default request
```

生成风格：
```ts
import request from '@/utils/request'

export const getUser = (id: number) =>
  request.get<UserInfo>(`/user/${id}`)

export const createUser = (data: CreateUserParams) =>
  request.post<UserInfo>('/user', data)
```

### 风格 B（TS）：fetch 封装

```ts
export const getUserById = async (id: number): Promise<UserInfo> => {
  const res = await fetch(`/api/user/${id}`)
  if (!res.ok) throw new Error(res.statusText)
  return res.json()
}
```

### 风格 C（TS）：React Query + Axios hooks

```ts
import { useQuery, useMutation } from '@tanstack/react-query'

export const USER_KEYS = {
  detail: (id: number) => ['users', id] as const,
  list: (params: object) => ['users', 'list', params] as const,
}

export const useGetUserById = (id: number) =>
  useQuery({
    queryKey: USER_KEYS.detail(id),
    queryFn: () => request.get<UserInfo>(`/user/${id}`),
    enabled: !!id,
  })
```

### 风格 D（TS）：Taro / UniApp 小程序

```ts
import Taro from '@tarojs/taro'

export const getUserById = (id: number) =>
  Taro.request<UserInfo>({ url: `/user/${id}`, method: 'GET' })
```

---

## JavaScript 项目

### 风格 A（JS）：Axios 自定义封装

```js
// utils/request.js（已存在）
import axios from 'axios'
const request = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL, timeout: 10000 })
export default request
```

生成风格：
```js
import request from '@/utils/request'

/**
 * 获取用户详情
 * @param {number} id 用户ID
 * @returns {Promise<UserInfo>}
 */
export const getUserById = (id) =>
  request.get(`/user/${id}`)

/**
 * 创建用户
 * @param {CreateUserParams} data
 * @returns {Promise<UserInfo>}
 */
export const createUser = (data) =>
  request.post('/user', data)
```

### 风格 B（JS）：fetch 封装

```js
/**
 * 获取用户详情
 * @param {number} id
 * @returns {Promise<UserInfo>}
 */
export const getUserById = async (id) => {
  const res = await fetch(`/api/user/${id}`)
  if (!res.ok) throw new Error(res.statusText)
  return res.json()
}
```

### 风格 C（JS）：Vue 2 / Options API + axios

```js
import request from '@/utils/request'

/**
 * 获取用户列表
 * @param {{ page: number, pageSize: number, keyword?: string }} params
 * @returns {Promise<{ list: UserInfo[], total: number }>}
 */
export function getUserList(params) {
  return request({ url: '/user/list', method: 'get', params })
}

/**
 * 创建用户
 * @param {CreateUserParams} data
 */
export function createUser(data) {
  return request({ url: '/user', method: 'post', data })
}
```