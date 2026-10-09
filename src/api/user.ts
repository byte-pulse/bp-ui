import type { ProTableRequestParams } from '@/components/pro'

/**
 * 用户管理接口
 *
 * 说明：查询参数使用 `ProTableRequestParams`，与 `ProTable` 的 `request` 约定保持一致；
 * 由于 http 层仅接受可序列化的基础类型，此处对宽松索引签名做一次显式收敛。
 */

/**
 * 分页查询用户
 *
 * @param params 查询参数（分页 / 关键词 / 状态 / 排序）
 */
export function getUserPage(params: ProTableRequestParams) {
  return fetchAxios.get<PageInfo<UserItem>>('/api/user/page', params as Record<string, ParamsType>)
}

/**
 * 新增 / 编辑用户
 *
 * @param data 用户表单数据；含 id 为编辑，否则为新增
 */
export function saveUser(data: UserSaveForm) {
  return fetchAxios.post<null, UserSaveForm>('/api/user/save', data)
}

/**
 * 删除用户
 *
 * @param id 用户主键
 */
export function deleteUser(id: number) {
  return fetchAxios.delete<null>('/api/user/delete', { id })
}

/**
 * 批量删除用户
 *
 * @param ids 用户主键集合
 */
export function batchDeleteUsers(ids: number[]) {
  return fetchAxios.post<null, { ids: number[] }>('/api/user/batchDelete', { ids })
}
