export {}

declare global {
  interface LoginForm {
    username: string
    password: string
  }
  interface LoginData {
    token: string
  }
}
