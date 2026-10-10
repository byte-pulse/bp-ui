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
const layoutStore = useLayoutStore()

// 登录提交函数
const toLogin = async () => {
  if (formRef.value) {
    formRef.value.validate((errors) => {
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
  <!-- 页面底色跟随 Arco 主题：亮色用 --color-bg-4，暗色用 --color-bg-1 -->
  <div
    class="relative flex h-full w-full overflow-x-hidden overflow-y-auto"
    :class="layoutStore.themeName === 'dark' ? 'bg-(--color-bg-1)' : 'bg-(--color-bg-4)'"
  >
    <div
      class="m-auto flex w-full max-w-260 px-6 py-10 max-[900px]:px-4 max-[900px]:pt-6 max-[900px]:pb-[max(24px,env(safe-area-inset-bottom))]"
    >
      <div
        class="grid min-h-160 w-full grid-cols-[minmax(0,5fr)_minmax(0,6fr)] overflow-hidden rounded-[20px] border border-(--color-border-2) bg-(--color-bg-2) shadow-xl max-[900px]:min-h-0 max-[900px]:grid-cols-[minmax(0,1fr)]"
      >
        <!-- 品牌展示区（桌面端） -->
        <aside
          class="relative flex flex-col overflow-hidden border-r border-white/6 bg-[linear-gradient(160deg,#1e2431_0%,#171c28_48%,#10141d_100%)] px-11 py-11 text-white max-[1080px]:px-9 max-[1080px]:py-10 max-[900px]:hidden"
        >
          <div
            class="pointer-events-none absolute -top-24 -right-16 h-85 w-130 rounded-full bg-[radial-gradient(closest-side,rgba(22,93,255,0.28),transparent)]"
            aria-hidden="true"
          ></div>
          <div
            class="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-size-[40px_40px] [-webkit-mask-image:radial-gradient(420px_420px_at_80%_10%,#000_0%,transparent_72%)] mask-[radial-gradient(420px_420px_at_80%_10%,#000_0%,transparent_72%)]"
            aria-hidden="true"
          ></div>
          <div class="relative flex flex-1 flex-col">
            <div class="flex items-center gap-3">
              <span
                class="inline-flex size-9.5 flex-none items-center justify-center rounded-[10px] bg-[linear-gradient(140deg,#4080ff_0%,#165dff_52%,#0e42d2_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_8px_18px_-8px_rgba(22,93,255,0.9)]"
              >
                <IIcon :width="20" icon="mdi:view-dashboard-outline" />
              </span>
              <span class="text-[15px] font-semibold tracking-[0.2px] text-white/92">BP Admin UI</span>
            </div>
            <div class="my-auto grid gap-8">
              <div>
                <div class="text-[28px] leading-normal font-semibold">现代化的企业中后台<br />从这里开始</div>
                <p class="mt-3 mb-0 text-sm leading-[1.7] text-white/[0.56]">
                  开箱即用的管理系统启动模板，为年轻企业而生。
                </p>
              </div>
              <ul class="m-0 grid list-none gap-3.5 rounded-xl border border-white/8 bg-white/4 px-5 py-4.5">
                <li class="flex items-center gap-3 text-[13px] text-white/72">
                  <span
                    class="inline-flex size-7 flex-none items-center justify-center rounded-lg border border-white/10 bg-white/6 text-[#94bfff]"
                  >
                    <IIcon :width="16" icon="mdi:routes" />
                  </span>
                  <span>动态路由 · 菜单驱动</span>
                </li>
                <li class="flex items-center gap-3 text-[13px] text-white/72">
                  <span
                    class="inline-flex size-7 flex-none items-center justify-center rounded-lg border border-white/10 bg-white/6 text-[#94bfff]"
                  >
                    <IIcon :width="16" icon="mdi:table-large" />
                  </span>
                  <span>表格与表单 · 配置化</span>
                </li>
                <li class="flex items-center gap-3 text-[13px] text-white/72">
                  <span
                    class="inline-flex size-7 flex-none items-center justify-center rounded-lg border border-white/10 bg-white/6 text-[#94bfff]"
                  >
                    <IIcon :width="16" icon="mdi:theme-light-dark" />
                  </span>
                  <span>亮暗主题 · 一键切换</span>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        <!-- 登录表单区 -->
        <section
          class="flex flex-col bg-(--color-bg-2) px-14 pt-11 pb-7.5 max-[1080px]:px-10 max-[1080px]:pt-10 max-[1080px]:pb-6.5 max-[900px]:px-7 max-[900px]:pt-8 max-[900px]:pb-6 max-[380px]:px-5"
        >
          <div class="flex flex-1 flex-col justify-center">
            <!-- 品牌信息（移动端展示） -->
            <div class="mb-7 hidden items-center gap-2.5 max-[900px]:flex">
              <span
                class="inline-flex size-8.5 flex-none items-center justify-center rounded-[10px] bg-[linear-gradient(140deg,#4080ff_0%,#165dff_52%,#0e42d2_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_6px_16px_-6px_rgba(22,93,255,0.9)]"
              >
                <IIcon :width="18" icon="mdi:view-dashboard-outline" />
              </span>
              <span class="text-[15px] font-semibold text-(--color-text-1)">BP Admin UI</span>
            </div>

            <div class="mb-7.5 max-[900px]:mb-6.5">
              <h2 class="m-0 text-[26px] leading-[1.35] font-semibold text-(--color-text-1) max-[900px]:text-[23px]">
                欢迎回来
              </h2>
              <p class="mt-2 mb-0 text-sm leading-[1.6] text-(--color-text-3)">
                使用您的账号登录{{ companyName }}管理系统
              </p>
            </div>

            <a-form ref="formRef" :model="formValue" :rules="rules" layout="vertical" size="large">
              <a-form-item field="username">
                <template #label>
                  <span class="text-[13px] font-medium text-(--color-text-2)">用户名 / 邮箱</span>
                </template>
                <a-input
                  v-model="formValue.username"
                  class="h-11"
                  placeholder="请输入用户名或邮箱"
                  allow-clear
                  autocomplete="username"
                />
              </a-form-item>
              <a-form-item field="password">
                <template #label>
                  <span class="text-[13px] font-medium text-(--color-text-2)">密码</span>
                </template>
                <a-input-password
                  v-model="formValue.password"
                  class="h-11"
                  placeholder="请输入密码"
                  allow-clear
                  autocomplete="current-password"
                />
              </a-form-item>
            </a-form>

            <div class="mt-1 mb-5.5 flex items-center justify-between">
              <a-checkbox>
                <span class="text-[13px] text-(--color-text-2)">保持登录状态</span>
              </a-checkbox>
              <a-link href="#">
                <span class="text-[13px]">忘记密码？</span>
              </a-link>
            </div>

            <a-button class="h-11! font-medium!" type="primary" size="large" long @click="toLogin">登录系统</a-button>

            <a-divider :margin="24">
              <span class="text-xs text-(--color-text-3)">或通过其他方式登录</span>
            </a-divider>

            <div class="flex gap-3 max-[380px]:flex-col">
              <a-button class="h-11! flex-1" type="outline" size="large">
                <template #icon>
                  <IIcon :width="18" icon="ant-design:wechat-filled" />
                </template>
                微信登录
              </a-button>
              <a-button class="h-11! flex-1" type="outline" size="large">
                <template #icon>
                  <IIcon :width="18" icon="ant-design:dingding-outlined" />
                </template>
                钉钉登录
              </a-button>
            </div>

            <p class="mt-6.5 mb-0 text-center text-[13px] text-(--color-text-3)">
              还没有账号？
              <a
                class="ml-1 font-medium text-[rgb(var(--primary-6))] no-underline transition-colors hover:underline hover:underline-offset-[3px]"
                href="javascript:void(0)"
                >立即申请体验</a
              >
            </p>
          </div>

          <p class="mt-5 mb-0 text-center text-xs text-(--color-text-3)">
            © {{ currentYear }} {{ companyName }} 版权所有 · 为年轻企业而生
          </p>
        </section>
      </div>
    </div>
  </div>
</template>
