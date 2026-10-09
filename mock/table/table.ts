import { type MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

const DEPTS = ['研发部', '产品部', '设计部', '市场部', '运营部', '财务部']
const SURNAMES = [
  '张',
  '李',
  '王',
  '赵',
  '刘',
  '陈',
  '杨',
  '黄',
  '周',
  '吴',
  '徐',
  '孙',
  '马',
  '朱',
  '胡',
  '林',
  '郭',
  '何',
]

// 生成固定数据集，保证分页 / 排序结果稳定
const buildRow = (id: number): TableRow => ({
  id,
  name: `${SURNAMES[id % SURNAMES.length]}${Mock.mock('@character("一二三四五六七八九十")')}${Mock.mock('@character("文武杰明华强磊洋涛")')}`,
  gender: id % 2 === 0 ? 'female' : 'male',
  age: Mock.mock('@integer(22, 45)') as number,
  dept: DEPTS[id % DEPTS.length] ?? DEPTS[0] ?? '',
  status: id % 5 === 0 ? 0 : 1,
  email: Mock.mock('@email'),
  phone: Mock.mock(/^1[3-9]\d{9}$/),
  joinDate: Mock.mock('@date("yyyy-MM-dd")'),
  score: Mock.mock('@integer(60, 100)') as number,
})

const ALL_ROWS: TableRow[] = Array.from({ length: 86 }, (_, index) => buildRow(index + 1))

// 按查询条件过滤 + 排序，供列表与导出接口复用
const queryRows = (query: Record<string, string>) => {
  const keyword = (query.keyword ?? '').trim()
  const dept = query.dept ?? ''
  const status = query.status ?? ''
  const minScore = Number(query.minScore) || 0
  // joinDate 查询为区间：joinDateStart / joinDateEnd
  const joinDateStart = query.joinDateStart ?? ''
  const joinDateEnd = query.joinDateEnd ?? ''

  // 过滤
  let list = ALL_ROWS.filter((row) => {
    if (keyword && !row.name.includes(keyword) && !row.email.includes(keyword)) return false
    if (dept && row.dept !== dept) return false
    if (status !== '' && String(row.status) !== String(status)) return false
    if (minScore && row.score < minScore) return false
    if (joinDateStart && row.joinDate < joinDateStart) return false
    if (joinDateEnd && row.joinDate > joinDateEnd) return false
    return true
  })

  // 排序
  const { sortField, sortOrder } = query
  if (sortField && sortOrder) {
    const direction = sortOrder === 'ascend' ? 1 : -1
    list = [...list].sort((a, b) => {
      const prev = a[sortField as keyof TableRow]
      const next = b[sortField as keyof TableRow]
      if (typeof prev === 'number' && typeof next === 'number') return (prev - next) * direction
      return String(prev).localeCompare(String(next)) * direction
    })
  }

  return list
}

// 导出 mock 接口数组
export default [
  {
    url: '/api/table/list', // 请求地址
    method: 'get', // 请求方式
    response: ({ query }: { query: Record<string, string> }) => {
      const pageNum = Number(query.pageNum) || 1
      const pageSize = Number(query.pageSize) || 10
      const list = queryRows(query)

      // 分页
      const total = list.length
      const start = (pageNum - 1) * pageSize
      const pageList = list.slice(start, start + pageSize)

      return {
        code: 200,
        data: { pageNum, pageSize, total, list: pageList },
      }
    },
  },
  {
    url: '/api/table/export', // 请求地址
    method: 'get', // 请求方式
    // 后端导出：传了主键则导出选中数据，否则按当前查询条件生成 CSV 文件流返回，前端只负责触发下载
    rawResponse: (req, res) => {
      const { searchParams } = new URL(req.url ?? '', 'http://localhost')
      // keys 为重复参数（keys=1&keys=2），需用 getAll 读取
      const keys = searchParams.getAll('keys')
      const list = keys.length
        ? ALL_ROWS.filter((row) => keys.includes(String(row.id)))
        : queryRows(Object.fromEntries(searchParams.entries()) as Record<string, string>)
      const header = ['ID', '姓名', '性别', '年龄', '部门', '状态', '邮箱', '手机号', '入职日期', '评分']
      const rows = list.map((row) => [
        row.id,
        row.name,
        row.gender === 'male' ? '男' : '女',
        row.age,
        row.dept,
        row.status === 1 ? '启用' : '禁用',
        row.email,
        row.phone,
        row.joinDate,
        row.score,
      ])
      const csv = [header, ...rows].map((row) => row.join(',')).join('\r\n')

      res.statusCode = 200
      res.setHeader('Content-Type', 'text/csv;charset=utf-8')
      res.setHeader('Content-Disposition', 'attachment; filename="users.csv"')
      // 前置 BOM，保证 Excel 打开中文不乱码
      res.end(`\uFEFF${csv}`)
    },
  },
] as MockMethod[]
