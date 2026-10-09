import { type MockMethod } from 'vite-plugin-mock'

/**
 * 用户管理 Mock 接口
 *
 * 提供「分页查询 / 保存 / 删除」三个接口，数据保存在模块内存中，
 * 支持完整的新增、编辑、删除、分页与条件查询链路演示。
 */

/** 可分配的角色编码（与前端角色字典保持一致） */
const ROLE_OPTIONS = ['admin', 'operator', 'user', 'guest'] as const

/** 自增主键种子 */
let idSeed = 0

/** 生成创建时间文案 */
const createTimeText = (index: number): string => {
  const month = String((index % 9) + 1).padStart(2, '0')
  const day = String((index % 27) + 1).padStart(2, '0')
  return `2026-${month}-${day} 10:00:00`
}

/**
 * 构造单条用户数据
 *
 * @param index 序号（从 0 开始）
 */
const buildUser = (index: number): UserItem => {
  const serial = index + 1
  return {
    id: serial,
    username: `user${String(serial).padStart(2, '0')}`,
    nickname: `用户${serial}`,
    email: `user${serial}@bp-admin.com`,
    phone: `138${String(10000000 + serial)}`,
    role: ROLE_OPTIONS[index % ROLE_OPTIONS.length] ?? 'guest',
    status: index % 5 === 0 ? 0 : 1,
    createTime: createTimeText(index),
  }
}

/** 用户数据源（模拟数据库表） */
const userList: UserItem[] = Array.from({ length: 26 }).map((_, index) => buildUser(index))
idSeed = userList.length

/** 查询条件中的单值类型 */
type QueryValue = string | number

/** 查询条件取值：单值或重复参数构成的数组 */
type QueryField = QueryValue | QueryValue[]

/** 查询参数结构 */
interface UserQuery {
  pageNum?: string | number
  pageSize?: string | number
  keyword?: string
  /** 状态：搜索区单选时为单值，表头筛选时为数组 */
  status?: QueryField
  /** 角色：表头筛选（支持多选） */
  role?: QueryField
  /** 创建时间区间：[开始日期, 结束日期] */
  createTimeRange?: QueryField
  /** 手机号：模糊匹配 */
  phone?: string
  /** 排序字段 */
  sortField?: string
  /** 排序方向：ascend / descend */
  sortOrder?: string
}

/** 分页结果 */
interface UserPageResult {
  pageNum: number
  pageSize: number
  total: number
  list: UserItem[]
}

/**
 * 归一化查询条件
 *
 * 同一字段在「搜索区单选」时是单值，在「表头筛选多选」时是重复参数构成的数组，
 * 这里统一收敛为字符串数组，比较时无需再区分形态。
 *
 * @param value 原始查询值
 */
const toList = (value?: QueryField): string[] => {
  if (value === undefined || value === null || value === '') {
    return []
  }
  const list = Array.isArray(value) ? value : [value]
  return list.filter((item) => item !== '' && item !== undefined && item !== null).map((item) => String(item))
}

/**
 * 排序字段映射
 *
 * 仅开放「序号 / 用户名 / 创建时间」三个字段的后端排序，
 * 使用映射函数取得比较值，避免对记录做索引签名断言。
 */
const SORTERS: Record<string, (user: UserItem) => string | number> = {
  id: (user) => user.id,
  username: (user) => user.username,
  createTime: (user) => user.createTime ?? '',
}

/**
 * 分页查询
 *
 * 支持关键词模糊匹配、状态 / 角色多值筛选、创建时间区间过滤与字段排序。
 *
 * @param query 查询参数
 */
const queryUserPage = (query: UserQuery): UserPageResult => {
  const pageNum = Number(query.pageNum ?? 1)
  const pageSize = Number(query.pageSize ?? 10)
  const keyword = String(query.keyword ?? '').trim()
  const phone = String(query.phone ?? '').trim()
  const statusList = toList(query.status)
  const roleList = toList(query.role)
  const [startDate, endDate] = toList(query.createTimeRange)

  const filtered = userList.filter((user) => {
    // 关键词：用户名 / 昵称 / 邮箱 模糊匹配
    const matchKeyword =
      !keyword || user.username.includes(keyword) || user.nickname.includes(keyword) || user.email.includes(keyword)
    // 状态：空集合表示不限，命中任一值即可
    const matchStatus = !statusList.length || statusList.includes(String(user.status))
    // 手机号：模糊匹配
    const matchPhone = !phone || String(user.phone ?? '').includes(phone)
    // 角色：空集合表示不限，命中任一值即可
    const matchRole = !roleList.length || roleList.includes(user.role)
    // 创建时间区间：按日期维度比较，保证包含结束当天
    const createDate = String(user.createTime ?? '').slice(0, 10)
    const matchStart = !startDate || createDate >= startDate
    const matchEnd = !endDate || createDate <= endDate
    return matchKeyword && matchPhone && matchStatus && matchRole && matchStart && matchEnd
  })

  // 排序：仅在声明了受支持的字段时生效
  const resolveSortValue = SORTERS[query.sortField ?? '']
  if (resolveSortValue) {
    const factor = query.sortOrder === 'descend' ? -1 : 1
    filtered.sort((prev, next) => {
      const left = resolveSortValue(prev)
      const right = resolveSortValue(next)
      if (left === right) {
        return 0
      }
      return left > right ? factor : -factor
    })
  }

  const start = (pageNum - 1) * pageSize
  return {
    pageNum,
    pageSize,
    total: filtered.length,
    list: filtered.slice(start, start + pageSize),
  }
}

/**
 * 保存用户（新增 / 编辑）
 *
 * @param body 表单数据
 */
const saveUserRecord = (body: UserSaveForm): void => {
  if (body.id) {
    const index = userList.findIndex((user) => user.id === body.id)
    const current = userList[index]
    if (current) {
      userList.splice(index, 1, { ...current, ...body, id: current.id })
    }
    return
  }
  idSeed += 1
  userList.unshift({
    ...body,
    id: idSeed,
    createTime: createTimeText(userList.length),
  })
}

/**
 * 删除用户
 *
 * @param id 用户主键
 */
const removeUserRecord = (id: number): void => {
  const index = userList.findIndex((user) => user.id === id)
  if (index > -1) {
    userList.splice(index, 1)
  }
}

/** 导出 mock 接口数组 */
export default [
  {
    url: '/api/user/page',
    method: 'get',
    response: ({ query }: { query: UserQuery }) => {
      return {
        code: 200,
        data: queryUserPage(query),
      }
    },
  },
  {
    url: '/api/user/save',
    method: 'post',
    response: ({ body }: { body: UserSaveForm }) => {
      saveUserRecord(body)
      return {
        code: 200,
        data: null,
      }
    },
  },
  {
    url: '/api/user/delete',
    method: 'delete',
    response: ({ query }: { query: { id?: string | number } }) => {
      removeUserRecord(Number(query.id))
      return {
        code: 200,
        data: null,
      }
    },
  },
  {
    url: '/api/user/batchDelete',
    method: 'post',
    response: ({ body }: { body: { ids?: QueryField } }) => {
      // 逐个删除，保持与单条删除一致的「不存在则跳过」语义
      toList(body.ids).forEach((id) => removeUserRecord(Number(id)))
      return {
        code: 200,
        data: null,
      }
    },
  },
] as MockMethod[]
