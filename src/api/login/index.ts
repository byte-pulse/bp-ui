export function toLogin(data: { password: string; username: string; arr?: Array<number> }) {
  data = {
    ...data,
    arr: [1, 2, 3, 4, 5]
  }
  return fetchAxios.post<ApiResponse<loginVO>, unknown>(
    'http://127.0.0.1:19420/auth/getToken?' + qs.stringify(data),
    data
  )
}

export function checkLogin() {
  return fetchAxios.get<ApiResponse>('http://127.0.0.1:19420/auth/check')
}
