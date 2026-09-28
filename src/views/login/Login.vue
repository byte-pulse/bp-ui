<script lang="ts" setup>
import type { FormInstance, FieldRule } from '@arco-design/web-vue'
import { login } from '@/api/auth'

// 公司名
const companyName = ref('')
// 当前年份
const currentYear = ref(new Date().getFullYear())
// 登录表单实例
const formRef = ref<FormInstance | null>(null)
// 登录表单数据
const formValue = ref({
  username: 'SDFASF',
  password: 'AMSRGIJ3J0FM()jWSDF',
})
// 登录表单验证规则
const rules: Record<string, FieldRule<unknown> | FieldRule<unknown>[]> = {
  username: [{ required: true, message: '请输入用户名或邮箱' }],
  password: [{ required: true, message: '请输入密码' }],
}

const router = useRouter()
const authStore = useAuthStore()

// 登录提交函数
const toLogin = async () => {
  console.log('点击了')

  if (formRef.value) {
    console.log('进来了')
    formRef.value.validate((errors) => {
      console.log(errors)
      if (!errors) {
        // 登录成功
        login(formValue.value).then((res) => {
          $message.success('登录成功')
          authStore.token = res.token
          router.replace('/')
        })
      }
    })
  }
}

onMounted(() => {
  // 初始化登录页面
  companyName.value = import.meta.env.VITE_APP_COMPANY_NAME
  // 监听回车事件，提交表单
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      toLogin()
    }
  })
})
</script>

<template>
  <!-- 登录背景装饰 -->
  <div class="bg-(--color-bg-1) absolute w-screen h-screen overflow-hidden z-[-1]">
    <div class="absolute opacity-20 rounded-full -top-25 -right-25 size-75 bg-blue-500"></div>
    <div class="absolute opacity-20 rounded-full -bottom-12.5 -left-12.5 size-50 bg-teal-500"></div>
    <div class="absolute opacity-20 rounded-full bottom-55 right-65 size-37.5 bg-amber-500"></div>
  </div>
  <!-- 登录容器 -->
  <div class="login-container w-screen h-screen flex items-center justify-center bg-transparent">
    <!-- 登录内容容器 -->
    <div class="size-full md:max-w-250 md:max-h-[95%] shadow-lg flex flex-col md:flex-row md:rounded-xl">
      <div class="w-full h-[50%] md:flex-1 md:h-full bg-blue-400 hidden md:block md:rounded-l-xl"></div>
      <div class="w-full h-full md:w-[55%] md:h-full px-13 py-16 flex flex-col bg-(--color-bg-1) md:rounded-r-xl">
        <span class="font-bold text-4xl mb-3 text-(--color-text-1)">欢迎回来 👋</span>
        <span class="text-(--color-text-3) text-base mb-8"
          >使用您的账号登录{{ companyName }}管理系统，开启高效工作的一天！</span
        >
        <!-- 登录表单容器 -->
        <a-space direction="vertical" fill>
          <a-form :model="formValue" ref="formRef" :rules="rules" layout="vertical" size="large">
            <a-form-item field="username">
              <template #label>
                <span class="font-bold text-(--color-text-2) text-base">用户名 / 邮箱</span>
              </template>
              <a-input v-model="formValue.username" placeholder="请输入用户名或邮箱" allow-clear />
            </a-form-item>
            <a-form-item field="password">
              <template #label>
                <span class="font-bold text-(--color-text-2) text-base">密 码</span>
              </template>
              <a-input-password v-model="formValue.password" placeholder="请输入密码" allow-clear />
            </a-form-item>
          </a-form>
          <!-- 登录按钮容器 -->
          <a-space class="w-full flex items-center justify-between mb-10">
            <a-checkbox>
              <span class="text-slate-600 text-sm">保持登录状态</span>
            </a-checkbox>
            <a-link href="#">
              <span class="text-slate-600 text-sm">忘记密码？</span>
            </a-link>
          </a-space> </a-space
        ><!-- 登录按钮 -->
        <a-button type="primary" size="large" long @click="toLogin">
          <template #icon>
            <IIcon :width="25" icon="mdi:account" />
          </template>
          登录系统
        </a-button>
        <a-divider :margin="30">
          <span class="text-slate-500 text-sm">或通过其他方式登录</span>
        </a-divider>
        <!-- 登录方式按钮容器 -->
        <div class="w-full flex justify-between align-center gap-5">
          <!-- 微信登陆按钮 -->
          <a-button type="outline" size="large" style="flex: 1" status="success">
            <template #icon>
              <IIcon :width="25" icon="ant-design:wechat-filled" />
            </template>
            <span class="font-bold flex items-center gap-2"> 微信登陆 </span>
          </a-button>
          <!-- 钉钉登陆按钮 -->
          <a-button type="outline" size="large" style="flex: 1">
            <template #icon>
              <IIcon :width="25" icon="ant-design:dingding-outlined" />
            </template>
            <span class="font-bold flex items-center gap-2"> 钉钉登陆 </span>
          </a-button>
        </div>
        <!-- 注册账号 -->
        <div class="w-full flex justify-center align-center mt-12">
          <span class="text-slate-500"
            >还没有账号？
            <a href="javascript:void(0)" class="underline text-indigo-500">立即申请体验</a>
          </span>
        </div>
        <!-- 版权信息容器 -->
        <div class="w-full flex justify-center align-center mt-3">
          <span class="text-slate-500 text-xs"
            >&copy; {{ currentYear }} {{ companyName }} 版权所有 | 为年轻企业而生</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
