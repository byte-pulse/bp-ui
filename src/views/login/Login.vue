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
  <div class="login-page">
    <div class="login-shell">
      <div class="login-card">
        <!-- 品牌展示区（桌面端） -->
        <aside class="login-brand">
          <div class="brand-grid" aria-hidden="true"></div>
          <div class="brand-inner">
            <div class="brand-head">
              <span class="brand-mark">
                <IIcon :width="20" icon="mdi:view-dashboard-outline" />
              </span>
              <span class="brand-name">BP Admin UI</span>
            </div>
            <div class="brand-main">
              <div class="brand-copy">
                <h1 class="brand-title">现代化的企业中后台<br />从这里开始</h1>
                <p class="brand-desc">开箱即用的管理系统启动模板，为年轻企业而生。</p>
              </div>
              <ul class="brand-points">
                <li class="brand-point">
                  <span class="point-icon"><IIcon :width="16" icon="mdi:routes" /></span>
                  <span>动态路由 · 菜单驱动</span>
                </li>
                <li class="brand-point">
                  <span class="point-icon"><IIcon :width="16" icon="mdi:table-large" /></span>
                  <span>表格与表单 · 配置化</span>
                </li>
                <li class="brand-point">
                  <span class="point-icon"><IIcon :width="16" icon="mdi:theme-light-dark" /></span>
                  <span>亮暗主题 · 一键切换</span>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        <!-- 登录表单区 -->
        <section class="login-panel">
          <div class="panel-body">
            <!-- 品牌信息（移动端展示） -->
            <div class="panel-brand">
              <span class="brand-mark">
                <IIcon :width="18" icon="mdi:view-dashboard-outline" />
              </span>
              <span class="panel-brand-name">BP Admin UI</span>
            </div>

            <div class="panel-head">
              <h2 class="panel-title">欢迎回来</h2>
              <p class="panel-sub">使用您的账号登录{{ companyName }}管理系统</p>
            </div>

            <a-form ref="formRef" class="login-form" :model="formValue" :rules="rules" layout="vertical" size="large">
              <a-form-item field="username" label="用户名 / 邮箱">
                <a-input
                  v-model="formValue.username"
                  placeholder="请输入用户名或邮箱"
                  allow-clear
                  autocomplete="username"
                />
              </a-form-item>
              <a-form-item field="password" label="密码">
                <a-input-password
                  v-model="formValue.password"
                  placeholder="请输入密码"
                  allow-clear
                  autocomplete="current-password"
                />
              </a-form-item>
            </a-form>

            <div class="login-assist">
              <a-checkbox class="login-remember">保持登录状态</a-checkbox>
              <a-link class="login-forgot" href="#">忘记密码？</a-link>
            </div>

            <a-button class="login-submit" type="primary" size="large" long @click="toLogin">登录系统</a-button>

            <a-divider class="login-divider">或通过其他方式登录</a-divider>

            <div class="login-social">
              <a-button class="social-btn" type="outline" size="large">
                <template #icon>
                  <IIcon :width="18" icon="ant-design:wechat-filled" />
                </template>
                微信登录
              </a-button>
              <a-button class="social-btn" type="outline" size="large">
                <template #icon>
                  <IIcon :width="18" icon="ant-design:dingding-outlined" />
                </template>
                钉钉登录
              </a-button>
            </div>

            <p class="login-register">
              还没有账号？
              <a class="register-link" href="javascript:void(0)">立即申请体验</a>
            </p>
          </div>

          <p class="login-copyright">© {{ currentYear }} {{ companyName }} 版权所有 · 为年轻企业而生</p>
        </section>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* ======================================================================
   登录页样式：现代企业风格
   - 以中性色为主，低饱和靛蓝作为品牌辅助色
   - 所有颜色变量在 html[arco-theme='dark'] 下成对覆盖，亮暗主题表现一致
   ====================================================================== */
.login-page {
  /* 覆盖 Arco 主色（RGB 三元组），让输入框、复选框等控件状态色与页面品牌色统一 */
  --primary-1: 241, 242, 250;
  --primary-2: 227, 229, 245;
  --primary-3: 205, 209, 238;
  --primary-4: 175, 181, 227;
  --primary-5: 92, 104, 204;
  --primary-6: 78, 90, 193;
  --primary-7: 65, 76, 171;

  /* 页面中性色 */
  --lp-bg: #f4f5f7;
  --lp-card: #ffffff;
  --lp-line: rgba(16, 24, 40, 0.08);
  --lp-line-strong: rgba(16, 24, 40, 0.14);
  --lp-text-1: #101828;
  --lp-text-2: #475467;
  --lp-text-3: #98a2b3;
  --lp-field-bg: #ffffff;
  --lp-field-border: rgba(16, 24, 40, 0.14);
  --lp-field-border-hover: rgba(16, 24, 40, 0.28);
  --lp-fill-hover: #f9fafb;
  --lp-fill-active: #f2f4f7;
  /* 品牌辅助色 */
  --lp-accent: #4e5ac1;
  --lp-accent-hover: #414cab;
  --lp-accent-ring: rgba(78, 90, 193, 0.16);
  --lp-glow: rgba(78, 90, 193, 0.07);
  --lp-glow-soft: rgba(78, 90, 193, 0.05);
  /* 阴影 */
  --lp-shadow-card: 0 1px 2px rgba(16, 24, 40, 0.05), 0 32px 64px -32px rgba(16, 24, 40, 0.24);
  --lp-shadow-btn: 0 1px 2px rgba(16, 24, 40, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.16);
  --lp-shadow-btn-hover: 0 8px 20px -8px rgba(78, 90, 193, 0.6);

  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  color: var(--lp-text-1);
  background-color: var(--lp-bg);
  background-image:
    radial-gradient(960px 480px at 8% -12%, var(--lp-glow), transparent 62%),
    radial-gradient(720px 420px at 98% 108%, var(--lp-glow-soft), transparent 58%);
}

/* 暗色主题 */
html[arco-theme='dark'] .login-page {
  --primary-1: 32, 36, 64;
  --primary-2: 46, 52, 92;
  --primary-3: 64, 72, 124;
  --primary-4: 85, 95, 160;
  --primary-5: 124, 136, 230;
  --primary-6: 107, 120, 224;
  --primary-7: 90, 102, 200;

  --lp-bg: #17171a;
  --lp-card: #232324;
  --lp-line: rgba(255, 255, 255, 0.08);
  --lp-line-strong: rgba(255, 255, 255, 0.18);
  --lp-text-1: rgba(255, 255, 255, 0.9);
  --lp-text-2: rgba(255, 255, 255, 0.66);
  --lp-text-3: rgba(255, 255, 255, 0.42);
  --lp-field-bg: rgba(255, 255, 255, 0.05);
  --lp-field-border: rgba(255, 255, 255, 0.14);
  --lp-field-border-hover: rgba(255, 255, 255, 0.28);
  --lp-fill-hover: rgba(255, 255, 255, 0.08);
  --lp-fill-active: rgba(255, 255, 255, 0.12);
  --lp-accent: #6b78e0;
  --lp-accent-hover: #7c88e6;
  --lp-accent-ring: rgba(107, 120, 224, 0.24);
  --lp-glow: rgba(107, 120, 224, 0.1);
  --lp-glow-soft: rgba(107, 120, 224, 0.06);
  --lp-shadow-card: 0 1px 2px rgba(0, 0, 0, 0.5), 0 32px 64px -32px rgba(0, 0, 0, 0.72);
  --lp-shadow-btn: 0 1px 2px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.16);
  --lp-shadow-btn-hover: 0 8px 20px -8px rgba(90, 102, 200, 0.72);
}

/* 卡片容器：窗口过矮时页面可滚动 */
.login-shell {
  display: flex;
  width: 100%;
  max-width: 1040px;
  margin: auto;
  padding: 40px 24px;
}

.login-card {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
  width: 100%;
  min-height: 640px;
  overflow: hidden;
  background: var(--lp-card);
  border: 1px solid var(--lp-line);
  border-radius: 20px;
  box-shadow: var(--lp-shadow-card);
}

/* ------------------------------ 品牌展示区 ------------------------------ */
.login-brand {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 44px 44px;
  overflow: hidden;
  /* 暗色主题下强化品牌面板与卡片的分界 */
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  color: #fff;
  background:
    radial-gradient(520px 340px at 92% 4%, rgba(107, 120, 224, 0.26), transparent 62%),
    linear-gradient(160deg, #1e2431 0%, #171c28 48%, #10141d 100%);
}

.brand-grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
  background-size: 40px 40px;
  -webkit-mask-image: radial-gradient(420px 420px at 80% 10%, #000 0%, transparent 72%);
  mask-image: radial-gradient(420px 420px at 80% 10%, #000 0%, transparent 72%);
}

.brand-inner {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
}

.brand-head {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-mark {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  color: #fff;
  background: linear-gradient(140deg, #6b78e0 0%, #4e5ac1 52%, #414cab 100%);
  border-radius: 10px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.24),
    0 8px 18px -8px rgba(78, 90, 193, 0.9);
}

.brand-name {
  font-size: 15px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  letter-spacing: 0.2px;
}

.brand-main {
  display: grid;
  gap: 32px;
  margin: auto 0;
}

.brand-title {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  line-height: 1.5;
  color: #fff;
}

.brand-desc {
  margin: 12px 0 0;
  font-size: 14px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.56);
}

.brand-points {
  display: grid;
  gap: 14px;
  padding: 18px 20px;
  margin: 0;
  list-style: none;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
}

.brand-point {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.72);
}

.point-icon {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: #aeb6ef;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}

/* ------------------------------ 表单区 ------------------------------ */
.login-panel {
  display: flex;
  flex-direction: column;
  padding: 44px 56px 30px;
  background: var(--lp-card);
}

.panel-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
}

.panel-brand {
  display: none;
  align-items: center;
  gap: 10px;
  margin-bottom: 28px;
}

.panel-brand-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--lp-text-1);
}

.panel-head {
  margin-bottom: 30px;
}

.panel-title {
  margin: 0;
  font-size: 26px;
  font-weight: 600;
  line-height: 1.35;
  color: var(--lp-text-1);
}

.panel-sub {
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--lp-text-2);
}

/* 表单：标签、输入框与校验状态 */
.login-panel :deep(.arco-form-item) {
  margin-bottom: 18px;
}

.login-panel :deep(.login-form .arco-form-item:last-child) {
  margin-bottom: 0;
}

.login-panel :deep(.login-form .arco-form-item-layout-vertical > .arco-form-item-label-col) {
  margin-bottom: 8px;
  line-height: 20px;
}

.login-panel :deep(.login-form .arco-form-item-label-col > .arco-form-item-label) {
  font-size: 13px;
  font-weight: 500;
  color: var(--lp-text-2);
}

.login-panel :deep(.login-form .arco-input-wrapper) {
  height: 44px;
  padding-right: 14px;
  padding-left: 14px;
  background-color: var(--lp-field-bg);
  border: 1px solid var(--lp-field-border);
  border-radius: 8px;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.login-panel :deep(.login-form .arco-input-wrapper:hover) {
  background-color: var(--lp-field-bg);
  border-color: var(--lp-field-border-hover);
}

.login-panel :deep(.login-form .arco-input-wrapper:focus-within),
.login-panel :deep(.login-form .arco-input-wrapper.arco-input-focus) {
  background-color: var(--lp-field-bg);
  border-color: var(--lp-accent);
  box-shadow: 0 0 0 3px var(--lp-accent-ring);
}

.login-panel :deep(.login-form .arco-input-wrapper.arco-input-error) {
  background-color: var(--lp-field-bg);
  border-color: rgb(var(--danger-6));
}

.login-panel :deep(.login-form .arco-input-wrapper.arco-input-error:focus-within),
.login-panel :deep(.login-form .arco-input-wrapper.arco-input-error.arco-input-focus) {
  box-shadow: 0 0 0 3px rgba(245, 63, 63, 0.14);
}

.login-panel :deep(.login-form .arco-input) {
  font-size: 14px;
  color: var(--lp-text-1);
}

.login-panel :deep(.login-form .arco-input-wrapper .arco-input::placeholder) {
  color: var(--lp-text-3);
}

/* 浏览器自动填充时保持与主题一致的底色 */
.login-panel :deep(.login-form input:-webkit-autofill) {
  -webkit-box-shadow: 0 0 0 1000px var(--lp-field-bg) inset;
  -webkit-text-fill-color: var(--lp-text-1);
  caret-color: var(--lp-text-1);
}

/* 记住登录状态 / 忘记密码 */
.login-assist {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16px 0 22px;
}

.login-assist :deep(.arco-checkbox-label) {
  font-size: 13px;
  color: var(--lp-text-2);
  transition: color 0.2s ease;
}

.login-assist :deep(.arco-checkbox:hover .arco-checkbox-label) {
  color: var(--lp-text-1);
}

.login-assist :deep(.arco-checkbox-icon) {
  width: 15px;
  height: 15px;
  border-width: 1.5px;
  border-color: var(--lp-line-strong);
  border-radius: 4px;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.login-assist :deep(.arco-checkbox:hover .arco-checkbox-icon) {
  border-color: var(--lp-accent);
}

.login-forgot.arco-link {
  padding: 0;
  font-size: 13px;
  font-weight: 500;
  color: var(--lp-accent);
  transition: color 0.2s ease;
}

.login-forgot.arco-link:hover {
  color: var(--lp-accent-hover);
}

/* 主按钮 */
.login-submit.arco-btn {
  height: 46px;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 1px;
  border-radius: 8px;
}

.login-submit.arco-btn-primary:not(.arco-btn-disabled) {
  box-shadow: var(--lp-shadow-btn);
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.login-submit.arco-btn-primary:not(.arco-btn-disabled):hover {
  background-color: rgb(var(--primary-5));
  box-shadow: var(--lp-shadow-btn-hover);
  transform: translateY(-1px);
}

.login-submit.arco-btn-primary:not(.arco-btn-disabled):active {
  background-color: rgb(var(--primary-7));
  box-shadow: 0 2px 8px -2px rgba(78, 90, 193, 0.5);
  transform: translateY(0);
}

.login-submit.arco-btn-primary:focus-visible {
  outline: 2px solid var(--lp-accent);
  outline-offset: 2px;
}

/* 分割线 */
.login-divider.arco-divider {
  margin: 24px 0;
  border-color: var(--lp-line);
}

.login-divider :deep(.arco-divider-text) {
  padding: 0 14px;
  font-size: 12px;
  font-weight: 400;
  color: var(--lp-text-3);
  background: var(--lp-card);
}

/* 第三方登录 */
.login-social {
  display: flex;
  gap: 12px;
}

.social-btn.arco-btn {
  flex: 1;
  height: 44px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
}

.social-btn.arco-btn-outline:not(.arco-btn-disabled) {
  color: var(--lp-text-2);
  background-color: var(--lp-field-bg);
  border-color: var(--lp-field-border);
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.social-btn.arco-btn-outline:not(.arco-btn-disabled):hover {
  color: var(--lp-text-1);
  background-color: var(--lp-fill-hover);
  border-color: var(--lp-field-border-hover);
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
}

.social-btn.arco-btn-outline:not(.arco-btn-disabled):active {
  background-color: var(--lp-fill-active);
}

.social-btn.arco-btn-outline:focus-visible {
  outline: 2px solid var(--lp-accent);
  outline-offset: 2px;
}

/* 注册与版权 */
.login-register {
  margin: 26px 0 0;
  font-size: 13px;
  color: var(--lp-text-2);
  text-align: center;
}

.register-link {
  margin-left: 4px;
  font-weight: 500;
  color: var(--lp-accent);
  text-decoration: none;
  transition: color 0.2s ease;
}

.register-link:hover {
  color: var(--lp-accent-hover);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.login-copyright {
  margin: 20px 0 0;
  font-size: 12px;
  color: var(--lp-text-3);
  text-align: center;
}

/* ------------------------------ 响应式 ------------------------------ */
@media (max-width: 1080px) {
  .login-shell {
    padding: 32px 20px;
  }

  .login-brand {
    padding: 40px 36px;
  }

  .login-panel {
    padding: 40px 40px 26px;
  }
}

@media (max-width: 900px) {
  .login-shell {
    padding: 24px 16px;
    padding-bottom: max(24px, env(safe-area-inset-bottom));
  }

  .login-card {
    grid-template-columns: minmax(0, 1fr);
    min-height: auto;
    border-radius: 18px;
  }

  .login-brand {
    display: none;
  }

  .login-panel {
    padding: 32px 28px 24px;
  }

  .panel-brand {
    display: flex;
  }

  .panel-head {
    margin-bottom: 26px;
  }

  .panel-title {
    font-size: 23px;
  }
}

@media (max-width: 380px) {
  .login-panel {
    padding: 28px 20px 20px;
  }

  .login-social {
    flex-direction: column;
  }
}
</style>
