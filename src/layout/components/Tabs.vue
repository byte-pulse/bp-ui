<script lang="ts" setup>
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

// 当前右键的标签页
const currentClickKey = ref('')

// 处理右键菜单选择事件
function handleSelect(key: string | number | Record<string, unknown> | undefined) {
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

// 移除前钩子, 防止布局错误
const beforeLeave = (el: Element) => {
  const div = el as HTMLDivElement
  const container = el.parentElement
  const rect = el.getBoundingClientRect()
  const containerRect = container!.getBoundingClientRect()

  // 锁定元素当前相对容器的位置
  div.style.left = rect.left - containerRect.left + 'px'
  div.style.top = rect.top - containerRect.top + 'px'
  div.style.width = rect.width + 'px'
  // 手动设置 absolute，确保 left/top 生效（leave-active 类稍后才会添加）
  div.style.position = 'absolute'
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
  <Transition name="tabs">
    <BackGround
      v-if="layoutStore.showTabs"
      class="w-full h-8 mb-3 flex justify-center items-center border-b bg-(--color-bg-4)"
    >
      <!-- 标签页列表 -->
      <div ref="scrollRef" class="h-full w-full px-4 overflow-x-scroll no-scrollbar" @wheel.prevent="handleWheel">
        <!-- 标签页列表 -->
        <TransitionGroup
          name="routes"
          tag="div"
          class="w-full h-full whitespace-nowrap flex justify-start items-end gap-2 relative"
          enter-active-class="animate__animated animate__backInUp animate__faster"
          leave-active-class="animate__animated animate__backOutDown animate__faster"
          @before-leave="beforeLeave"
        >
          <!-- 标签页列表项 -->
          <div v-for="item in tabStore.tabs" :key="item.key">
            <a-dropdown trigger="contextMenu" alignPoint @select="handleSelect" :style="{ display: 'block' }">
              <div
                class="pt-2 pb-1 px-3 border border-b-0 rounded-t-md cursor-pointer text-xs flex items-center"
                @contextmenu="handleContextMenu($event, item.key)"
                @click="setActiveTab(item.key)"
              >
                <span class="mr-1 select-none">{{ item.label }}</span>
                <!-- 关闭按钮 -->
                <IIcon
                  icon="ant-design:close-circle-outlined"
                  v-if="tabStore.tabs.length > 1"
                  @click.stop="closeCurrent(item.key)"
                  @mouseenter="handleHover(true, item.key)"
                  @mouseleave="handleHover(false, item.key)"
                ></IIcon>
              </div>
              <template #content>
                <a-doption value="closeCurrent">
                  <template #icon>
                    <IIcon icon="ant-design:close-circle-outlined"></IIcon>
                  </template>
                  关闭当前标签
                </a-doption>
                <a-doption value="closeOthers">
                  <template #icon>
                    <IIcon icon="ant-design:close-circle-outlined"></IIcon>
                  </template>
                  关闭其他标签页
                </a-doption>
                <a-doption value="closeRight">
                  <template #icon>
                    <IIcon icon="ant-design:close-circle-outlined"></IIcon>
                  </template>
                  关闭右侧标签页
                </a-doption>
                <a-doption value="closeLeft">
                  <template #icon>
                    <IIcon icon="ant-design:close-circle-outlined"></IIcon>
                  </template>
                  关闭左侧标签页
                </a-doption>
                <a-doption value="closeAll">
                  <template #icon>
                    <IIcon icon="ant-design:close-circle-outlined"></IIcon>
                  </template>
                  关闭所有标签页
                </a-doption>
              </template>
            </a-dropdown>
          </div>
        </TransitionGroup>
      </div>
    </BackGround>
  </Transition>
</template>

<style lang="scss" scoped></style>
