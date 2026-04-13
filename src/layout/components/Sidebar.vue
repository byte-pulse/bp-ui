<script lang="ts" setup>
import type { MenuOption } from 'naive-ui'
import { BookmarkOutline, CaretDownOutline } from '@vicons/ionicons5'
import { NIcon } from 'naive-ui'
import { h, ref } from 'vue'
import { RouterLink } from 'vue-router'

const menuOptions: MenuOption[] = [
  {
    label: '工作空间',
    key: 'workspace',
    href: '/workspace',
  },
  {
    label: '仪表盘',
    key: 'dashboard',
    href: '/dashboard',
  },
  {
    label: '且听风吟',
    key: 'hear-the-wind-sing',
    href: 'https://baike.baidu.com/item/%E4%B8%94%E5%90%AC%E9%A3%8E%E5%90%9F/3199',
  },
  {
    label: '1973年的弹珠玩具',
    key: 'pinball-1973',
    disabled: true,
    children: [
      {
        label: '鼠',
        key: 'rat',
      },
    ],
  },
  {
    label: '寻羊冒险记',
    key: 'a-wild-sheep-chase',
    disabled: true,
  },
  {
    label: '舞，舞，舞',
    key: 'dance-dance-dance',
    children: [
      {
        type: 'group',
        label: '人物',
        key: 'people',
        children: [
          {
            label: '叙事者',
            key: 'narrator',
          },
          {
            label: '羊男',
            key: 'sheep-man',
          },
        ],
      },
      {
        label: '饮品',
        key: 'beverage',
        children: [
          {
            label: '威士忌',
            key: 'whisky',
            href: 'https://baike.baidu.com/item/%E5%A8%81%E5%A3%AB%E5%BF%8C%E9%85%92/2959816?fromtitle=%E5%A8%81%E5%A3%AB%E5%BF%8C&fromid=573&fr=aladdin',
          },
        ],
      },
      {
        label: '食物',
        key: 'food',
        children: [
          {
            label: '三明治',
            key: 'sandwich',
          },
        ],
      },
      {
        label: '过去增多，未来减少',
        key: 'the-past-increases-the-future-recedes',
      },
    ],
  },
]

function renderMenuLabel(option: MenuOption) {
  if ('href' in option) {
    return h(RouterLink, { to: option.href as string }, option.label as string)
  }
  return option.label as string
}

function renderMenuIcon(option: MenuOption) {
  // 渲染图标占位符以保持缩进
  if (option.key === 'sheep-man') return true
  // 返回 falsy 值，不再渲染图标及占位符
  if (option.key === 'food') return null
  return h(NIcon, null, { default: () => h(BookmarkOutline) })
}

function expandIcon() {
  return h(NIcon, null, { default: () => h(CaretDownOutline) })
}
const layoutStore = useLayoutStore()

// 公司名称
const company = ref('')

onMounted(() => {
  // 从环境变量中获取公司名称
  company.value = import.meta.env.VITE_APP_COMPANY_NAME
})
</script>

<template>
  <div class="h-screen w-full shadow-lg flex flex-col">
    <!-- logo -->
    <div class="h-15 border-b border-gray-200 p-0">
      <div
        class="w-full h-15 flex items-center"
        :class="{
          'justify-center': layoutStore.collapsed,
          'justify-around': !layoutStore.collapsed,
        }"
      >
        <p>logo</p>
        <p v-if="!layoutStore.collapsed">{{ company }}</p>
      </div>
    </div>
    <n-scrollbar class="shadow-2xl">
      <n-menu
        :collapsed="layoutStore.collapsed"
        :collapsed-width="80"
        :collapsed-icon-size="20"
        :options="menuOptions"
        :render-label="renderMenuLabel"
        :render-icon="renderMenuIcon"
        :expand-icon="expandIcon"
      >
      </n-menu>
    </n-scrollbar>
  </div>
</template>

<style lang="scss" scoped></style>
