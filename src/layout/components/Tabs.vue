<script lang="ts" setup>
import { NScrollbar, NButton, NIcon } from 'naive-ui'
import { Close, CloseCircleOutline, CloseCircleSharp } from '@vicons/ionicons5'
import { ArrowRightOutlined, ArrowLeftOutlined } from '@vicons/antd'
import type { VNodeChild } from 'vue'
const scrollRef = ref<typeof NScrollbar>()
const layoutStore = useLayoutStore()

const activeTab = ref(1)

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
function handleContextMenu(e: MouseEvent, item: number) {
  console.log(item)
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

function setActiveTab(item: number) {
  activeTab.value = item
}
</script>

<template>
  <BackGround
    class="w-full h-full flex justify-center items-center border-b border-gray-200"
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
    <n-scrollbar
      content-class="h-full px-4"
      ref="scrollRef"
      x-scrollable
      x-placement="top"
      @wheel.prevent="handleWheel"
    >
      <div
        class="w-fit h-full whitespace-nowrap flex justify-start items-end gap-1"
      >
        <template v-for="(item, index) in 20" :key="index">
          <div
            class="py-1 px-2 border border-gray-400 rounded-t-lg cursor-pointer"
            @contextmenu="handleContextMenu($event, item)"
            @click="setActiveTab(item)"
            :style="{
              color:
                item === Number(activeTab)
                  ? layoutStore.themeColor?.baseColor
                  : layoutStore.themeColor?.textColorBase,
              backgroundColor:
                item === Number(activeTab)
                  ? layoutStore.themeColor?.primaryColor
                  : layoutStore.themeColor?.bodyColor,
            }"
          >
            爱在西元前{{ item }}
          </div>
        </template>
      </div>
    </n-scrollbar>
  </BackGround>
</template>

<style lang="scss" scoped></style>
