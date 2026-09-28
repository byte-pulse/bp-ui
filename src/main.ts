import '@arco-design/web-vue/dist/arco.css'
import './assets/style/fonts.css'
import './assets/style/main.css'
import './assets/style/vTransition.css'
import 'animate.css'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router, { getDynamicRoutes } from './router'

const app = createApp(App)

app.use(ArcoVueIcon)

const pinia = createPinia()
// 开启 pinia 插件
pinia.use(piniaPluginPersistedstate)

app.use(pinia)

// 先获取动态路由
await getDynamicRoutes()
app.use(router)

app.mount('#app')
