<script lang="ts" setup>
// 图标大小
const iconSize = ref(18)

const props = defineProps({
  menus: {
    type: Array as PropType<Menu[]>,
    default: () => [],
  },
})
</script>

<template>
  <template v-for="m in props.menus" :key="m.id">
    <!-- 有 children 且长度 > 0，渲染为子菜单 -->
    <template v-if="m.children && m.children.length">
      <a-sub-menu :key="m.routeName">
        <template v-if="m.icon" #icon>
          <IIcon :width="iconSize" :icon="m.icon" />
        </template>
        <template #title>
          {{ m.title }}
        </template>
        <!-- 递归调用自身 -->
        <RecursiveMenu :menus="m.children" />
      </a-sub-menu>
    </template>
    <!-- 没有 children 且长度 <= 0，渲染为菜单项 -->
    <template v-else>
      <a-menu-item :key="m.routeName">
        <template v-if="m.icon" #icon>
          <IIcon :width="iconSize" :icon="m.icon" />
        </template>
        {{ m.title }}
      </a-menu-item>
    </template>
  </template>
</template>

<style lang="scss" scoped></style>
