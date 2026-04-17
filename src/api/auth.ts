export function login(data: LoginForm) {
  return fetchAxios.post<LoginData, LoginForm>('/api/login', data)
}
