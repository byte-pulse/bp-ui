<script lang="ts" setup>
const layoutStore = useLayoutStore()

const active = defineModel({ type: Boolean, default: false })

// 暗色菜单
const darkMenu = (flag: boolean) => {
  layoutStore.darkMenu = flag
}
</script>

<template>
  <n-drawer v-model:show="active" :width="300" placement="right">
    <n-drawer-content title="页面设置">
      <div class="h-full w-full">
        <n-grid x-gap="12" y-gap="20" :cols="6">
          <n-gi :span="6">
            <n-divider title-placement="center"> 菜单风格 </n-divider>
          </n-gi>
          <n-gi :span="6">
            <div class="w-full flex justify-around">
              <img width="100" src="@/assets/images/menus/white.png" class="cursor-pointer" @click="darkMenu(false)" />
              <img width="100" src="@/assets/images/menus/black.png" class="cursor-pointer" @click="darkMenu(true)" />
            </div>
          </n-gi>
          <n-gi :span="6">
            <n-divider title-placement="center"> 基础设置 </n-divider>
          </n-gi>
          <n-gi :span="2">
            <span class="text-sm font-bold">系统主题</span>
          </n-gi>
          <n-gi :span="4">
            <n-select
              v-model:value="layoutStore.themeName"
              :disabled="layoutStore.isDark"
              :options="[
                { label: '默认主题', value: 'default' },
                { label: '黑白主题', value: 'blackWhite' },
                { label: '深色模式', value: 'dark', disabled: true },
              ]"
            />
          </n-gi>
          <n-gi :span="2">
            <span class="text-sm font-bold">展示标签页</span>
          </n-gi>
          <n-gi :span="4">
            <n-switch v-model:value="layoutStore.showTabs" />
          </n-gi>
        </n-grid>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<style lang="scss" scoped></style>
