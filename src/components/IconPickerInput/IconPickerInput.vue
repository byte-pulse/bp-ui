<template>
  <div class="w-full">
    <!-- 选择器 -->
    <n-popover
      trigger="click"
      placement="bottom-start"
      :show-arrow="false"
      v-model:show="isShow"
    >
      <!-- 触发 -->
      <template #trigger>
        <!-- <n-button>选择图标</n-button> -->
        <n-input
          :value="model"
          type="text"
          placeholder="选择图标"
          :size="props.size"
        >
          <template #prefix v-if="props.preview === 'prefix'">
            <n-icon color="#323538" size="23">
              <component :is="IconComp" />
            </n-icon>
          </template>
          <template #suffix v-if="props.preview === 'suffix'">
            <n-icon color="#323538" size="23">
              <component :is="IconComp" />
            </n-icon>
          </template>
        </n-input>
      </template>
      <!-- 弹出框 -->
      <div v-if="isShow" class="w-75 h-75 flex flex-col">
        <n-input
          v-model:value="keyword"
          placeholder="搜索图标名称"
          clearable
          size="small"
        />

        <n-tabs v-model:value="activeTab" animated size="small">
          <n-tab-pane
            v-for="lib in iconLibs"
            :key="lib.key"
            :name="lib.key"
            :tab="lib.label"
          >
            <!-- 行级虚拟列表 -->
            <n-virtual-list
              :items="rowIcons(filteredIcons(lib.icons))"
              :item-size="ROW_HEIGHT"
              style="height: 220px"
            >
              <template #default="{ item: row }">
                <div class="h-10 grid grid-cols-6">
                  <div
                    v-for="icon in row"
                    :key="icon.name"
                    class="flex items-center justify-center cursor-pointer"
                    @click="selectIcon(lib.key, icon.name)"
                  >
                    <n-popover trigger="hover">
                      <template #trigger>
                        <div class="h-4 w-4">
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

const props = withDefaults(
  defineProps<{
    preview?: 'suffix' | 'prefix' | ''
    size?: 'tiny' | 'small' | 'medium' | 'large'
  }>(),
  {
    preview: '',
    size: 'medium',
  },
)

const COLS = 6
const ROW_HEIGHT = 40

const model = defineModel<string>('value')

const isShow = ref(false)
const keyword = ref('')
const activeTab = ref('ionicons5')

const IconComp = computed(() => renderIconUtilNoNIcon(model.value))

interface IconItem {
  name: string
  component: Component
}

const normalizeIcons = (icons: Record<string, Component>): IconItem[] =>
  Object.entries(icons).map(([name, component]) => ({
    name,
    component,
  }))

const iconLibs = [
  {
    key: 'ionicons5',
    label: 'Ionicons5',
    icons: normalizeIcons(ionicons5),
  },
  {
    key: 'antd',
    label: 'Ant Design',
    icons: normalizeIcons(antd),
  },
]

// 搜索
const filteredIcons = (list: IconItem[]) => {
  if (!keyword.value) return list
  const k = keyword.value.toLowerCase()
  return list.filter((i) => i.name.toLowerCase().includes(k))
}

// 行切分
const rowIcons = (icons: IconItem[]) => {
  const rows: IconItem[][] = []
  for (let i = 0; i < icons.length; i += COLS) {
    rows.push(icons.slice(i, i + COLS))
  }
  return rows
}

// 选择
const emit = defineEmits<{
  (e: 'select', value: string): void
}>()

function selectIcon(lib: string, name: string) {
  const value = `${lib}/${name}`
  model.value = value
  navigator.clipboard.writeText(value)
  isShow.value = false
  emit('select', value)
}
</script>

<style scoped lang="scss">
.popover-body {
  width: 300px;
  height: 300px;
  display: flex;
  flex-direction: column;
  gap: 0px;
}
</style>
