<template>
  <n-layout-sider
    bordered
    collapse-mode="width"
    :collapsed-width="64"
    :width="240"
    :collapsed="collapsed"
    :native-scrollbar="false"
    show-trigger
    @collapse="collapsed = true"
    @expand="collapsed = false"
  >
    <div class="h-16 flex items-center justify-center border-b logo-div">
      <img v-if="!collapsed" src="@/assets/images/github.png" alt="Logo" />
    </div>
    <div class="menu-div">
      <n-scrollbar>
        <n-menu
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menuOptions"
          :value="activeKey"
        />
      </n-scrollbar>
    </div>
  </n-layout-sider>
</template>

<script lang="ts" setup>
import { ref, h, computed } from 'vue'
import { RouterLink } from 'vue-router'

const collapsed = ref(false)
const activeKey = ref('dashboard')

// 菜单配置
const menuOptions = computed(() => [
  {
    label: () => h(RouterLink, { to: '/dashboard' }, { default: () => '仪表盘' }),
    key: 'dashboard'
  },
  {
    label: '用户管理',
    key: 'user',
    children: [
      {
        label: () => h(RouterLink, { to: '/user/list' }, { default: () => '用户列表' }),
        key: 'user-list'
      },
      {
        label: () => h(RouterLink, { to: '/user/add' }, { default: () => '添加用户' }),
        key: 'user-add'
      }
    ]
  },
  {
    label: '内容管理',
    key: 'content',
    children: [
      {
        label: () => h(RouterLink, { to: '/content/list' }, { default: () => '文章列表' }),
        key: 'content-list'
      },
      {
        label: () => h(RouterLink, { to: '/content/category' }, { default: () => '分类管理' }),
        key: 'content-category'
      }
    ]
  },
  {
    label: () => h(RouterLink, { to: '/statistics' }, { default: () => '数据统计' }),
    key: 'statistics'
  },
  {
    label: () => h(RouterLink, { to: '/system' }, { default: () => '系统设置' }),
    key: 'system'
  },
  {
    label: () => h(RouterLink, { to: '/happy' }, { default: () => '找点乐子' }),
    key: 'happy'
  }
])
</script>

<style lang="scss" scoped>
/* 自定义侧边栏样式 */
.n-layout-sider {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo-div {
  height: vv.$header-heigth;
  display: flex;
  align-items: center;
  padding: 0 vv.$primary-padding;

  img {
    height: 80%;
  }
}

.menu-div {
  width: 100%;
  height: calc(100vh - vv.$header-heigth);
}
</style>
