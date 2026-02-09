<template>
  <div class="icon-picker">
    <!-- 左侧 图标列表 -->
    <div class="left">
      <n-input v-model:value="keyword" placeholder="搜索图标名称" clearable class="search-input" />

      <n-tabs v-model:value="activeTab" type="line" animated>
        <n-tab-pane v-for="lib in iconLibs" :key="lib.key" :name="lib.key" :tab="lib.label">
          <n-scrollbar style="max-height: 70vh">
            <div class="icon-container">
              <div
                v-for="item in filteredIcons(lib.icons)"
                :key="item.name"
                class="icon-item"
                @click="copyIcon(lib.key, item.name)"
              >
                <n-icon size="20">
                  <component :is="item.component" />
                </n-icon>
                <div class="icon-name">{{ item.name }}</div>
              </div>
            </div>
          </n-scrollbar>
        </n-tab-pane>
      </n-tabs>
    </div>

    <!-- 右侧 测试栏 -->
    <div class="right" v-if="props.preview">
      <div class="preview-title">图标测试</div>

      <n-input v-model:value="testIcon" placeholder="例如 ionicons5/AppsOutline" clearable />

      <div class="preview-box">
        <n-icon v-if="previewIcon" size="48">
          <component :is="previewIcon" />
        </n-icon>
        <span v-else class="empty">未匹配到图标</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'
import * as ionicons5 from '@vicons/ionicons5'
import * as antd from '@vicons/antd'

const props = withDefaults(
  defineProps<{
    preview?: boolean
  }>(),
  {
    preview: false
  }
)

// 事件回调
const emit = defineEmits<{
  (e: 'select', value: string): void
}>()

// 图标结构
interface IconItem {
  name: string
  component: Component
}

const keyword = ref('')
const activeTab = ref('ionicons5')
const testIcon = ref('')

// 把图标库对象转成数组
const normalizeIcons = (icons: Record<string, Component>): IconItem[] => {
  return Object.entries(icons).map(([name, component]) => ({
    name,
    component
  }))
}

// 图标库配置
const iconLibs = [
  {
    key: 'ionicons5',
    label: 'Ionicons5',
    icons: normalizeIcons(ionicons5)
  },
  {
    key: 'antd',
    label: 'Ant Design',
    icons: normalizeIcons(antd)
  }
]

// 模糊搜索
const filteredIcons = (list: IconItem[]) => {
  if (!keyword.value) return list
  const k = keyword.value.toLowerCase()
  return list.filter((item) => item.name.toLowerCase().includes(k))
}

// 点击复制 + 填入测试框
const copyIcon = (lib: string, name: string) => {
  const value = `${lib}/${name}`
  navigator.clipboard.writeText(value)
  testIcon.value = value
  emit('select', value) // ⭐ 点
}

// 右侧预览图标
const previewIcon = computed(() => {
  return renderIconUtil(testIcon.value)
})
</script>

<style scoped lang="scss">
.icon-picker {
  display: flex;
  height: 100%;
  width: 100%;
  gap: 16px;
}

.left {
  flex: 1;
  min-width: 0;
}

.right {
  width: 260px;
  padding: 12px;
  border-left: 1px solid var(--n-border-color);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.search-input {
  margin-bottom: 12px;
}
.n-tabs {
  height: 82%;
}
.icon-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 16px;
  padding: 8px 4px;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 6px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.icon-item:hover {
  background-color: var(--n-color-hover);
}

.icon-name {
  margin-top: 6px;
  font-size: 12px;
  text-align: center;
  word-break: break-all;
}

.preview-title {
  font-weight: 600;
}

.preview-box {
  height: 120px;
  border: 1px dashed var(--n-border-color);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty {
  font-size: 12px;
  color: var(--n-text-color-3);
}
</style>
