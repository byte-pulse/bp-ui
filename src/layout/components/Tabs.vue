<script lang="ts" setup>
import { NButton, NIcon } from 'naive-ui'
import { Close, CloseCircleOutline, CloseCircleSharp } from '@vicons/ionicons5'
import {
  ArrowRightOutlined,
  ArrowLeftOutlined,
  CloseCircleOutlined,
} from '@vicons/antd'
import type { VNodeChild } from 'vue'

const layoutStore = useLayoutStore()

const tabStore = useTabStore()

const router = useRouter()

const route = useRoute()

const scrollRef = ref<HTMLDivElement>()

const activeTab = ref('')

// 关闭按钮悬浮
const hover = ref(false)
// 悬浮的按钮
const hoverKey = ref('')

const handleHover = (isHover: boolean, key: string) => {
  hoverKey.value = key
  hover.value = isHover
}

// 处理横向滚动事件
const handleWheel = (e: WheelEvent) => {
  e.preventDefault()
  // div 横向滚动事件
  if (scrollRef.value) {
    scrollRef.value.scrollLeft += e.deltaY
  }
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

// 关闭当前标签页
const closeCurrent = (key: string) => {
  // 判断是否是最后一个标签页
  if (tabStore.tabs.length <= 1) {
    return
  }
  // 获取当前的下标
  const currentIndex = tabStore.tabs.findIndex((item) => item.key === key)
  // 从 tabStore 中删除当前标签页
  tabStore.tabs = tabStore.tabs.filter((item) => item.key !== key)
  // 删除的不是当前选中的, 则不切换
  if (key !== activeTab.value) {
    return
  }
  // 切换到标签页 , 如果删除的是最后一个标签页, 则切换到上一个标签页
  if (currentIndex === tabStore.tabs.length) {
    setActiveTab(tabStore.tabs[currentIndex - 1]!.key)
  } else {
    setActiveTab(tabStore.tabs[currentIndex]!.key)
  }
}

// 关闭其他标签
const closeOthers = (key: string) => {
  tabStore.tabs = tabStore.tabs.filter((item) => item.key === key)
  setActiveTab(key)
}

// 关闭右侧标签
const closeRight = (key: string) => {
  const index = tabStore.tabs.findIndex((item) => item.key === key)
  tabStore.tabs = tabStore.tabs.slice(0, index + 1)

  // 如果当前激活的不在剩余里面, 切到当前 key
  if (!tabStore.tabs.some((item) => item.key === activeTab.value)) {
    setActiveTab(key)
  }
}

// 关闭左侧标签
const closeLeft = (key: string) => {
  const index = tabStore.tabs.findIndex((item) => item.key === key)
  tabStore.tabs = tabStore.tabs.slice(index)

  if (!tabStore.tabs.some((item) => item.key === activeTab.value)) {
    setActiveTab(key)
  }
}

// 关闭全部标签
const closeAll = () => {
  tabStore.tabs = []
  const routes = router.getRoutes()
  const firstRoute = routes[0]!.meta as unknown as Menu
  const label = firstRoute.title as string
  const key = firstRoute.routeName as string
  tabStore.tabs.push({
    label,
    key,
  })
  nextTick(() => {
    // 一般你会跳首页, 不然会空白
    router.push({ name: key })
  })
}

// 处理右键菜单事件
const showDropdown = ref(false)
const x = ref(0)
const y = ref(0)
// 当前右键的标签页
const currentClickKey = ref('')

// 处理右键菜单选择事件
function handleSelect(key: string) {
  showDropdown.value = false
  if (key === 'closeCurrent') {
    closeCurrent(currentClickKey.value)
  } else if (key === 'closeOthers') {
    closeOthers(currentClickKey.value)
  } else if (key === 'closeRight') {
    closeRight(currentClickKey.value)
  } else if (key === 'closeLeft') {
    closeLeft(currentClickKey.value)
  } else if (key === 'closeAll') {
    closeAll()
  }
}

// 处理右键菜单事件
function handleContextMenu(e: MouseEvent, key: string) {
  currentClickKey.value = key
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

// 设置切换标签页
function setActiveTab(key: string) {
  router.push({ name: key })
}

// 添加标签页
const addTab = () => {
  activeTab.value = route.name as string
  // 判断是否需要添加标签页
  const meta = route.meta as unknown as Menu
  if (meta.tabShow !== true) {
    return
  }
  // 判断标签列表是否已有该标签页
  if (tabStore.tabs.some((item) => item.key === route.name)) {
    return
  }
  // 添加标签页
  tabStore.tabs.push({
    label: meta.title as string,
    key: route.name as string,
  })
}

// 监听路由变化, 当路由变化时, 更新 activeTab, 并判断是否需要添加标签页
watch(
  () => route.name,
  () => {
    addTab()
  },
)

onMounted(() => {
  addTab()
})
</script>

<template>
  <BackGround
    class="w-full h-full flex justify-center items-center border-b border-gray-200"
  >
    <!-- 标签页列表 -->
    <div
      ref="scrollRef"
      class="h-full w-full px-4 overflow-x-scroll no-scrollbar"
      @wheel.prevent="handleWheel"
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
      <!-- 标签页列表 -->
      <div
        class="w-full h-full whitespace-nowrap flex justify-start items-end gap-1"
      >
        <!-- 标签页列表项 -->
        <template v-for="item in tabStore.tabs" :key="item.key">
          <div
            class="pt-2 pb-1 px-3 border border-b-0 border-gray-300 rounded-t-md cursor-pointer text-xs flex items-center"
            @contextmenu="handleContextMenu($event, item.key)"
            @click="setActiveTab(item.key)"
            :style="{
              color:
                item.key === activeTab
                  ? layoutStore.themeColor?.baseColor
                  : layoutStore.themeColor?.textColorBase,
              backgroundColor:
                item.key === activeTab
                  ? layoutStore.themeColor?.primaryColor
                  : layoutStore.themeColor?.bodyColor,
            }"
          >
            <span class="mr-1 select-none">{{ item.label }}</span>
            <!-- 关闭按钮 -->
            <n-icon
              @click.stop="closeCurrent(item.key)"
              :color="
                hover && hoverKey === item.key && activeTab !== item.key
                  ? layoutStore.themeColor?.primaryColor
                  : undefined
              "
              @mouseenter="handleHover(true, item.key)"
              @mouseleave="handleHover(false, item.key)"
            >
              <CloseCircleOutlined />
            </n-icon>
          </div>
        </template>
      </div>
    </div>
  </BackGround>
</template>

<style lang="scss" scoped></style>
