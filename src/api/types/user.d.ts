export {}

declare global {
  /** 用户状态：1 启用，0 禁用 */
  type UserStatus = 1 | 0

  /** 用户信息（列表项与表单模型共用） */
  interface UserItem {
    /** 主键 */
    id: number
    /** 用户名 */
    username: string
    /** 昵称 */
    nickname: string
    /** 邮箱 */
    email: string
    /** 手机号 */
    phone: string
    /** 所属角色 */
    role: string
    /** 状态：1 启用，0 禁用 */
    status: UserStatus
    /** 创建时间 */
    createTime: string
  }

  /** 用户新增 / 编辑入参 */
  interface UserSaveForm {
    /** 主键；新增时为空，编辑时必填 */
    id?: number
    /** 用户名 */
    username: string
    /** 昵称 */
    nickname: string
    /** 邮箱 */
    email: string
    /** 手机号 */
    phone: string
    /** 所属角色 */
    role: string
    /** 状态：1 启用，0 禁用 */
    status: UserStatus
  }
}
