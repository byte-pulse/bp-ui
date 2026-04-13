<script lang="ts" setup>
import type { FormInst, FormRules } from 'naive-ui'

// 公司名
const companyName = ref('')
// 当前年份
const currentYear = ref(new Date().getFullYear())
// 登录表单实例
const formRef = ref<FormInst | null>(null)
// 登录表单数据
const formValue = ref({
  username: '',
  password: ''
})
// 登录表单验证规则
const rules: FormRules = ({
  username: [{ required: true, message: '请输入用户名或邮箱' }],
  password: [{ required: true, message: '请输入密码' }]
})

const router = useRouter()
const authStore = useAuthStore()

// 登录提交函数
const toLogin = async () => {
  if (formRef.value) {
    formRef.value.validate((errors) => {
      if (!errors) {
        // 登录成功
        $message.success('登录成功')
        authStore.token = 'test token'
        router.replace('/')
      }
    })
  }
}

onMounted(() => {  // 初始化登录页面
  companyName.value = import.meta.env.VITE_COMPANY_NAME
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
  <div class="bg-gray-100 absolute w-screen h-screen overflow-hidden z-[-1]">
    <div class="absolute opacity-20 rounded-full -top-25 -right-25 size-75 bg-blue-500"></div>
    <div class="absolute opacity-20 rounded-full -bottom-12.5 -left-12.5 size-50 bg-teal-500"></div>
    <div class="absolute opacity-20 rounded-full bottom-55 right-65 size-37.5 bg-amber-500"></div>
  </div>
  <!-- 登录容器 -->
  <div class="login-container w-screen h-screen flex items-center justify-center bg-transparent">
    <!-- 登录内容容器 -->
    <div class="size-full md:max-w-250 md:max-h-[95%] shadow-lg flex flex-col md:flex-row md:rounded-xl">
      <div class="w-full h-[50%] md:flex-1 md:h-full bg-blue-400 hidden md:block md:rounded-l-xl">
      </div>
      <div class="w-full h-full md:w-[55%] md:h-full px-13 py-16 flex flex-col bg-white md:rounded-r-xl ">
        <span class="font-bold text-4xl mb-3">欢迎回来 👋</span>
        <span class="text-gray-500 text-base mb-8">使用您的账号登录{{ companyName }}管理系统，开启高效工作的一天！</span>
        <!-- 登录表单容器 -->
        <n-space vertical>
          <n-form :model="formValue" size="large" ref="formRef" :rules="rules" autocomplete="off">
            <n-form-item path="username">
              <template #label>
                <span class="font-bold text-slate-600 text-base">用户名 / 邮箱</span>
              </template>
              <n-input v-model:value="formValue.username" placeholder="请输入用户名或邮箱" autocomplete="new-password"
                name="user_account_text" />
            </n-form-item>
            <n-form-item path="password">
              <template #label>
                <span class="font-bold text-slate-600 text-base">密 码</span>
              </template>
              <n-input type="password" show-password-on="click" v-model:value="formValue.password" name="pwd-text"
                autocomplete="new-password" placeholder="请输入密码" />
            </n-form-item>
          </n-form>
          <!-- 登录按钮容器 -->
          <n-space justify="space-between" class="w-full flex items-center justify-between mb-10">
            <n-checkbox>
              <span class="text-slate-600 text-sm">保持登录状态</span>
            </n-checkbox>
            <n-button quaternary type="info">
              <span class="text-slate-600 text-sm">忘记密码？</span>
            </n-button>
          </n-space>
        </n-space>
        <n-button type="primary" size="large" @click="toLogin">
          <!-- 登录图标 -->
          <span class="font-bold flex items-center gap-2 ">
            <svg t="1776083188269" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4776"
              class="w-6 h-6">
              <path
                d="M835.584 63.488q26.624 0 49.664 10.24t40.448 27.648 27.648 40.448 10.24 49.664l0 641.024q0 26.624-10.24 49.664t-27.648 40.448-40.448 27.648-49.664 10.24l-448.512 0q-26.624 0-49.664-10.24t-40.448-27.648-27.648-40.448-10.24-49.664l0-192.512 128 0 0 192.512 448.512 0 0-641.024-448.512 0 0 192.512-128 0 0-192.512q0-26.624 10.24-49.664t27.648-40.448 40.448-27.648 49.664-10.24l448.512 0zM513.024 614.4q0-19.456-9.728-28.672t-24.064-9.216l-378.88 0q-14.336 0-25.088-7.68t-10.752-26.112l0-52.224q0-29.696 9.216-37.376t35.84-7.68l31.744 0q24.576 0 58.368 0.512t73.728 1.024 77.312 1.024 69.12 0.512l51.2 0q22.528 0 32.256-16.384t9.728-35.84l0-49.152q0-20.48 8.704-25.6t26.112 9.216 47.104 32.768 61.952 37.888 62.976 38.4 49.152 34.304q14.336 11.264 14.336 30.72t-11.264 28.672q-16.384 14.336-44.544 32.256t-59.392 36.864-60.928 37.376-48.128 33.792q-23.552 19.456-34.816 19.968t-11.264-30.208l0-49.152z"
                p-id="4777" fill="currentColor"></path>
            </svg>
            登录系统
          </span>
        </n-button>
        <n-divider>
          <span class="text-slate-500 text-sm">或通过其他方式登录</span>
        </n-divider>
        <!-- 登录方式按钮容器 -->
        <div class="w-full flex justify-between align-center gap-5">
          <!-- 微信登陆按钮 -->
          <n-button type="success" ghost size="large" block style="flex: 1">
            <span class=" font-bold flex items-center gap-2">
              <svg t=" 1776084525989" viewBox="0 0 1024 1024" version="1.1" p-id="6830" class="w-6 h-6">
                <path
                  d="M337.387283 341.82659c-17.757225 0-35.514451 11.83815-35.514451 29.595375s17.757225 29.595376 35.514451 29.595376 29.595376-11.83815 29.595376-29.595376c0-18.49711-11.83815-29.595376-29.595376-29.595375zM577.849711 513.479769c-11.83815 0-22.936416 12.578035-22.936416 23.6763 0 12.578035 11.83815 23.676301 22.936416 23.676301 17.757225 0 29.595376-11.83815 29.595376-23.676301s-11.83815-23.676301-29.595376-23.6763zM501.641618 401.017341c17.757225 0 29.595376-12.578035 29.595376-29.595376 0-17.757225-11.83815-29.595376-29.595376-29.595375s-35.514451 11.83815-35.51445 29.595375 17.757225 29.595376 35.51445 29.595376zM706.589595 513.479769c-11.83815 0-22.936416 12.578035-22.936416 23.6763 0 12.578035 11.83815 23.676301 22.936416 23.676301 17.757225 0 29.595376-11.83815 29.595376-23.676301s-11.83815-23.676301-29.595376-23.6763z"
                  fill="currentColor" p-id="6831"></path>
                <path
                  d="M510.520231 2.959538C228.624277 2.959538 0 231.583815 0 513.479769s228.624277 510.520231 510.520231 510.520231 510.520231-228.624277 510.520231-510.520231-228.624277-510.520231-510.520231-510.520231zM413.595376 644.439306c-29.595376 0-53.271676-5.919075-81.387284-12.578034l-81.387283 41.433526 22.936416-71.768786c-58.450867-41.433526-93.965318-95.445087-93.965317-159.815029 0-113.202312 105.803468-201.988439 233.803468-201.98844 114.682081 0 216.046243 71.028902 236.023121 166.473989-7.398844-0.739884-14.797688-1.479769-22.196532-1.479769-110.982659 1.479769-198.289017 85.086705-198.289017 188.67052 0 17.017341 2.959538 33.294798 7.398844 49.572255-7.398844 0.739884-15.537572 1.479769-22.936416 1.479768z m346.265896 82.867052l17.757225 59.190752-63.630058-35.514451c-22.936416 5.919075-46.612717 11.83815-70.289017 11.83815-111.722543 0-199.768786-76.947977-199.768786-172.393063-0.739884-94.705202 87.306358-171.653179 198.289017-171.65318 105.803468 0 199.028902 77.687861 199.028902 172.393064 0 53.271676-34.774566 100.624277-81.387283 136.138728z"
                  fill="currentColor" p-id="6832"></path>
              </svg>
              微信登陆
            </span>
          </n-button>
          <!-- 钉钉登陆按钮 -->
          <n-button type="info" ghost size="large" block style="flex: 1">
            <span class="font-bold flex items-center gap-2">
              <svg t="1776084473309" viewBox="0 0 1024 1024" version="1.1" p-id="5775" class="w-6 h-6">
                <path
                  d="M512.003 79C272.855 79 79 272.855 79 512.003 79 751.145 272.855 945 512.003 945 751.145 945 945 751.145 945 512.003 945 272.855 751.145 79 512.003 79z m200.075 375.014c-0.867 3.764-3.117 9.347-6.234 16.012h0.087l-0.347 0.648c-18.183 38.86-65.631 115.108-65.631 115.108l-0.215-0.52-13.856 24.147h66.8L565.063 779l29.002-115.368h-52.598l18.27-76.29c-14.76 3.55-32.253 8.436-52.945 15.1 0 0-27.967 16.36-80.607-31.5 0 0-35.501-31.29-14.891-39.078 8.744-3.33 42.466-7.573 69.004-11.122 35.93-4.845 57.965-7.441 57.965-7.441s-110.607 1.643-136.841-2.468c-26.237-4.11-59.525-47.905-66.626-86.377 0 0-10.953-21.117 23.595-11.122 34.547 10 177.535 38.95 177.535 38.95s-185.933-56.992-198.36-70.929c-12.381-13.846-36.406-75.902-33.289-113.981 0 0 1.343-9.521 11.127-6.926 0 0 137.49 62.75 231.475 97.152 94.028 34.403 175.76 51.885 165.2 96.414z"
                  fill="currentColor" p-id="5776"></path>
              </svg>
              钉钉登陆
            </span>
          </n-button>
        </div>
        <!-- 注册账号 -->
        <div class="w-full flex justify-center align-center mt-12">
          <span class="text-slate-500 ">还没有账号？
            <a href="javascript:void(0)" class="underline text-indigo-500">立即申请体验</a>
          </span>
        </div>
        <!-- 版权信息容器 -->
        <div class="w-full flex justify-center align-center mt-3">
          <span class="text-slate-500 text-xs">&copy; {{ currentYear }} {{ companyName }} 版权所有 | 为年轻企业而生</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
