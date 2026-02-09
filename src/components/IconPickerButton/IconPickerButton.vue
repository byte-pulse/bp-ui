<template>
  <div class="icon-picker-container">
    <!-- 预览 -->
    <div class="preview">
      <n-icon size="40">
        <component :is="IconComp" />
      </n-icon>
    </div>

    <!-- 选择器 -->
    <n-popover trigger="click" placement="right" :show-arrow="false" v-model:show="isShow">
      <template #trigger>
        <n-button>选择图标</n-button>
      </template>

      <div v-if="isShow" class="popover-body">
        <n-input v-model:value="keyword" placeholder="搜索图标名称" clearable size="small" />

        <n-tabs v-model:value="activeTab" animated size="small">
          <n-tab-pane v-for="lib in iconLibs" :key="lib.key" :name="lib.key" :tab="lib.label">
            <!-- 行级虚拟列表 -->
            <n-virtual-list
              :items="rowIcons(filteredIcons(lib.icons))"
              :item-size="ROW_HEIGHT"
              class="icon-virtual-list"
            >
              <template #default="{ item: row }">
                <div class="icon-row">
                  <div
                    v-for="icon in row"
                    :key="icon.name"
                    class="icon-item"
                    @click="selectIcon(lib.key, icon.name)"
                  >
                    <n-popover trigger="hover">
                      <template #trigger>
                        <div class="icon-box">
                          <component :is="icon.component" />
                        </div>
                      </template>
                      <span>{{ icon.name }}</span>
                    </n-popover>
                  </div>
                </div>
              </template>
            </n-virtual-list>
          </n-tab-pane>
        </n-tabs>
      </div>
    </n-popover>
  </div>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'
import * as ionicons5 from '@vicons/ionicons5'
import * as antd from '@vicons/antd'

/* ================= 配置 ================= */
const COLS = 6
const ROW_HEIGHT = 40

/* ================= v-model ================= */
const model = defineModel<string>()

/* ================= state ================= */
const isShow = ref(false)
const keyword = ref('')
const activeTab = ref('ionicons5')

const IconComp = computed(() => renderIconUtilNoNIcon(model.value))

/* ================= icon 数据 ================= */
interface IconItem {
  name: string
  component: Component
}

const normalizeIcons = (icons: Record<string, Component>): IconItem[] =>
  Object.entries(icons).map(([name, component]) => ({
    name,
    component
  }))

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

/* ================= 搜索 ================= */
const filteredIcons = (list: IconItem[]) => {
  if (!keyword.value) return list
  const k = keyword.value.toLowerCase()
  return list.filter((i) => i.name.toLowerCase().includes(k))
}

/* ================= 行切分 ================= */
const rowIcons = (icons: IconItem[]) => {
  const rows: IconItem[][] = []
  for (let i = 0; i < icons.length; i += COLS) {
    rows.push(icons.slice(i, i + COLS))
  }
  return rows
}

/* ================= 选择 ================= */
const emit = defineEmits<{
  (e: 'select', value: string): void
}>()

function selectIcon(lib: string, name: string) {
  const value = `${lib}/${name}`
  model.value = value
  navigator.clipboard.writeText(value)
  emit('select', value)
}
</script>

<style scoped lang="scss">
.icon-picker-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.preview {
  width: 40px;
  height: 40px;
}

.popover-body {
  width: 300px;
  height: 300px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.icon-virtual-list {
  height: 220px;
}

.icon-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  height: 40px;
}

.icon-item {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.icon-box {
  width: 20px;
  height: 20px;
}
</style>
