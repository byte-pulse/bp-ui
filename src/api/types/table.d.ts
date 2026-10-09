export {}

declare global {
  // 使用 type 而非 interface：type 的对象字面量类型具备隐式索引签名，可赋值给 Record<string, unknown>
  type TableRow = {
    id: number // 主键
    name: string // 姓名
    gender: 'male' | 'female' // 性别
    age: number // 年龄
    dept: string // 部门
    status: 1 | 0 // 状态：1 启用、0 禁用
    email: string // 邮箱
    phone: string // 手机号
    joinDate: string // 入职日期
    score: number // 评分
  }
}
