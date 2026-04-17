<script lang="ts" setup>
import { NScrollbar, NButton, NIcon } from 'naive-ui'
import { Close, CloseCircleOutline, CloseCircleSharp } from '@vicons/ionicons5'
import { ArrowRightOutlined, ArrowLeftOutlined } from '@vicons/antd'
import type { VNodeChild } from 'vue'
const scrollRef = ref<typeof NScrollbar>()

// 处理横向滚动事件
const handleWheel = (e: WheelEvent) => {
  e.preventDefault()
  scrollRef.value?.scrollBy({ left: e.deltaY })
}

// 菜单选项生成函数
function generateMenuOptions(label: string, icon: Component): VNodeChild {
  return h(
    NButton,
    {
      bordered: false,
    },
    {
      default: () => label,
      icon: () => h(NIcon, {}, () => h(icon)),
    },
  )
}

// 右键菜单列表
const options = [
  {
    label: () => generateMenuOptions('关闭当前标签', Close),
    key: 'closeCurrent',
  },
  {
    label: () => generateMenuOptions('关闭其他标签', CloseCircleOutline),
    key: 'closeOthers',
  },
  {
    label: () => generateMenuOptions('关闭右侧标签', ArrowRightOutlined),
    key: 'closeRight',
  },
  {
    label: () => generateMenuOptions('关闭左侧标签', ArrowLeftOutlined),
    key: 'closeLeft',
  },
  {
    label: () => generateMenuOptions('关闭全部标签', CloseCircleSharp),
    key: 'closeAll',
  },
]

// 处理右键菜单事件
const showDropdown = ref(false)
const x = ref(0)
const y = ref(0)

// 处理右键菜单选择事件
function handleSelect(key: string | number) {
  showDropdown.value = false
  $message.info(String(key))
}

// 处理右键菜单事件
function handleContextMenu(e: MouseEvent) {
  e.preventDefault()
  showDropdown.value = false
  nextTick().then(() => {
    showDropdown.value = true
    x.value = e.clientX
    y.value = e.clientY
  })
}

// 处理点击外部事件
function onClickoutside() {
  showDropdown.value = false
}
</script>

<template>
  <div
    class="w-full h-full flex justify-center items-center overflow-x-scroll overflow-y-hidden"
    style="scrollbar-width: none; border: none"
  >
    <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :x="x"
      :y="y"
      :options="options"
      :show="showDropdown"
      :on-clickoutside="onClickoutside"
      @update:show="(v) => (showDropdown = v)"
      @select="handleSelect"
    />
    <n-scrollbar ref="scrollRef" x-scrollable @wheel.prevent="handleWheel">
      <div class="w-full h-full flex justify-start items-center pt-4 gap-2">
        <p @contextmenu="handleContextMenu">爱在西元前</p>
      </div>
    </n-scrollbar>
  </div>
</template>

<style lang="scss" scoped></style>
