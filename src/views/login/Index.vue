<template>
  <div class="login-page">
    <n-card class="login-card" bordered>
      <div class="header">
        <h1>系统登录</h1>
        <p>Enterprise Management System</p>
      </div>

      <n-form ref="formRef" :model="form" :rules="rules" size="large">
        <n-form-item path="username">
          <n-input v-model:value="form.username" placeholder="用户名" clearable />
        </n-form-item>

        <n-form-item path="password">
          <n-input
            v-model:value="form.password"
            type="password"
            placeholder="密码"
            show-password-on="click"
          />
        </n-form-item>

        <n-button type="primary" size="large" block :loading="loading" @click="handleLogin">
          登录
        </n-button>
      </n-form>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { toLogin } from '@/api/login'
import { type FormInst, type FormRules } from 'naive-ui'

interface LoginForm {
  username: string
  password: string
}

const formRef = ref<FormInst | null>(null)
const loading = ref(false)

// 菜单数据
const form = ref<LoginForm>({
  username: '',
  password: ''
})

// 菜单校验
const rules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: ['blur', 'input'] }],
  password: [{ required: true, message: '请输入密码', trigger: ['blur', 'input'] }]
}

const authStore = useAuthStore()

const router = useRouter()

const route = useRoute()

const handleLogin = throttle(async () => {
  await formRef.value?.validate()

  loading.value = true
  try {
    // TODO 替换成真实登录接口
    const { code, data } = await toLogin({ ...form.value })
    if (code === 200) {
      authStore.token = data.token
      $message.success('登录成功')
      const redirect = (route.query.redirect as string) || '/'
      router.replace(redirect)
    }
  } catch {
  } finally {
    loading.value = false
  }
}, 2000)

onMounted(() => {
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  })
})
</script>

<style scoped>
/* 🔒 锁死滚动的关键 */
.login-page {
  height: 100vh;
  width: 100vw;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #f5f6f7;
}

/* 企业风卡片 */
.login-card {
  width: 100%;
  max-width: 400px;
  padding: 8px;

  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

/* 标题区 */
.header {
  text-align: center;
  margin-bottom: 24px;
}

.header h1 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #1f1f1f;
}

.header p {
  margin-top: 6px;
  font-size: 13px;
  color: #8c8c8c;
}
</style>
