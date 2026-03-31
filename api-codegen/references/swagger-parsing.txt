# Swagger / OpenAPI 解析指南

## Swagger 2.0 与 OpenAPI 3.x 关键差异

### 请求体
- **Swagger 2.0**：`parameters` 中 `in: body` 的参数
- **OpenAPI 3.x**：`requestBody.content['application/json'].schema`

### 响应 Schema
- **Swagger 2.0**：`responses.200.schema`
- **OpenAPI 3.x**：`responses.200.content['application/json'].schema`

### $ref 解析
两个版本都用 `$ref` 引用共享 schema，生成类型前必须先解析 `$ref`：
- `$ref: '#/definitions/UserInfo'`（2.0）→ 查找 `spec.definitions`
- `$ref: '#/components/schemas/UserInfo'`（3.x）→ 查找 `spec.components.schemas`

---

## 类型映射：Swagger → TypeScript / JSDoc

| Swagger type | format | TypeScript | JSDoc |
|---|---|---|---|
| `integer` | `int32` / `int64` | `number` | `{number}` |
| `number` | `float` / `double` | `number` | `{number}` |
| `string` | — | `string` | `{string}` |
| `string` | `date` / `date-time` | `string`（加 JSDoc 说明） | `{string}` |
| `string` | `binary` | `File` 或 `Blob` | `{File}` |
| `boolean` | — | `boolean` | `{boolean}` |
| `array` | — | `T[]` | `{T[]}` |
| `object` | — | `interface` 或 `Record<string, unknown>` | `{Object}` |
| （缺失/any） | — | `unknown` | `{*}` |

---

## allOf / oneOf / anyOf 处理（OpenAPI 3.x）

allOf 对应交叉类型：
  UserDetail = UserBase & { address?: string }

oneOf 对应联合类型：
  SearchResult = UserInfo | OrderInfo

---

## 常见响应包装格式

国内后端项目通常统一包装响应：{ "code": 0, "message": "success", "data": { ... } }

若用户的请求工具已自动解包（直接返回 data），函数返回类型使用内层类型，否则使用完整包装类型。不确定时，主动询问用户。

---

## 分页参数规范

从 Swagger spec 中检测项目使用的分页风格，并在所有生成文件中统一：

- 风格 A：page + pageSize（最常见）
- 风格 B：current + size（MyBatis-Plus 风格）
- 风格 C：offset + limit