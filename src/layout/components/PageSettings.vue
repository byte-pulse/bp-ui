<script lang="ts" setup>
const layoutStore = useLayoutStore()

const active = defineModel({ type: Boolean, default: false })

// 暗色菜单
const darkMenu = (flag: boolean) => {
  layoutStore.darkMenu = flag
}
</script>

<template>
  <a-drawer v-model:visible="active" :width="300" placement="right" :closable="false" hide-cancel>
    <template #title>
      <span>页面设置</span>
    </template>
    <div class="h-full w-full">
      <a-space direction="vertical" :size="16" style="display: block">
        <a-row :gutter="[20, 16]">
          <a-col>
            <a-divider orientation="center"> 菜单风格 </a-divider>
          </a-col>
          <a-col>
            <div class="w-full flex justify-around">
              <img
                width="100"
                src="@/assets/images/menus/white.png"
                class="cursor-pointer"
                :class="!layoutStore.darkMenu ? 'border-2 border-blue-600 ring-4 ring-blue-600/60' : 'border-gray-300'"
                @click="darkMenu(false)"
              />
              <img
                width="100"
                src="@/assets/images/menus/black.png"
                class="cursor-pointer"
                :class="layoutStore.darkMenu ? 'border-2 border-blue-600 ring-4 ring-blue-600/60' : 'border-gray-300'"
                @click="darkMenu(true)"
              />
            </div>
          </a-col>
          <a-col>
            <a-divider orientation="center"> 基础设置 </a-divider>
          </a-col>
          <a-col :span="8">
            <span class="text-sm font-bold">展示标签页</span>
          </a-col>
          <a-col :span="16">
            <a-switch v-model:model-value="layoutStore.showTabs" />
          </a-col>
          <a-col :span="8">
            <span class="text-sm font-bold">侧边栏宽度</span>
          </a-col>
          <a-col :span="16">
            <a-input-number v-model="layoutStore.sidebarWidth" :min="layoutStore.collapsedCollapsedWidth" :max="500" />
          </a-col>
        </a-row>
      </a-space>
    </div>
  </a-drawer>
</template>

<style lang="scss" scoped></style>
