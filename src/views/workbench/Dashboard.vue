<script lang="ts" setup>
defineOptions({ name: 'Dashboard' })

/* --------------------------- 概览指标（静态展示） --------------------------- */
const stats = [
  {
    label: '总访问量',
    value: '128,964',
    unit: '次',
    icon: 'ant-design:eye-outlined',
    trend: 12.5,
    color: 'rgb(var(--primary-6))',
    bg: 'rgba(var(--primary-6), 0.12)',
  },
  {
    label: '活跃用户',
    value: '8,846',
    unit: '人',
    icon: 'ant-design:team-outlined',
    trend: 8.2,
    color: 'rgb(var(--success-6))',
    bg: 'rgba(var(--success-6), 0.12)',
  },
  {
    label: '新增订单',
    value: '1,246',
    unit: '单',
    icon: 'ant-design:shopping-cart-outlined',
    trend: -3.1,
    color: 'rgb(var(--warning-6))',
    bg: 'rgba(var(--warning-6), 0.12)',
  },
  {
    label: '转化率',
    value: '32.8',
    unit: '%',
    icon: 'ant-design:rise-outlined',
    trend: 4.6,
    color: 'rgb(var(--danger-6))',
    bg: 'rgba(var(--danger-6), 0.12)',
  },
]

/* --------------------------- 访问来源占比 --------------------------- */
const sources = [
  { name: '直接访问', value: 42, color: 'rgb(var(--primary-6))' },
  { name: '搜索引擎', value: 28, color: 'rgb(var(--success-6))' },
  { name: '社交媒体', value: 18, color: 'rgb(var(--warning-6))' },
  { name: '其他来源', value: 12, color: 'rgb(var(--danger-6))' },
]

// 由各项占比拼接环形渐变
const conicGradient = computed(() => {
  let start = 0
  const stops = sources.map((item) => {
    const from = start
    start += item.value
    return `${item.color} ${from}% ${start}%`
  })
  return `conic-gradient(${stops.join(', ')})`
})

/* --------------------------- 趋势折线图坐标（静态） --------------------------- */
const weekLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const xTicks = [40, 137, 233, 330, 427, 523, 620]
const gridY = [20, 60, 100, 140, 180]
const lineVisit = 'M40,113 L137,71 L233,92 L330,49 L427,62 L523,26 L620,39'
const lineOrder = 'M40,132 L137,108 L233,119 L330,84 L427,97 L523,68 L620,74'
const areaVisit = `${lineVisit} L620,180 L40,180 Z`
const dotsVisit = [
  { x: 40, y: 113 },
  { x: 137, y: 71 },
  { x: 233, y: 92 },
  { x: 330, y: 49 },
  { x: 427, y: 62 },
  { x: 523, y: 26 },
  { x: 620, y: 39 },
]

/* --------------------------- 热门页面排行 --------------------------- */
const topPages = [
  { name: '/workbench/dashboard', value: '32,480', percent: 92, color: 'rgb(var(--primary-6))' },
  { name: '/workbench/workspace', value: '21,360', percent: 74, color: 'rgb(var(--success-6))' },
  { name: '/case/table', value: '15,820', percent: 58, color: 'rgb(var(--warning-6))' },
  { name: '/case/form', value: '9,640', percent: 36, color: 'rgb(var(--danger-6))' },
  { name: '/login', value: '4,210', percent: 18, color: 'rgb(var(--primary-6))' },
]

/* --------------------------- 最近动态 --------------------------- */
const activities = [
  { title: '张伟 发布了新版本 v1.4.0', time: '10 分钟前', color: 'rgb(var(--primary-6))' },
  { title: '李娜 提交了 3 个代码评审', time: '1 小时前', color: 'rgb(var(--success-6))' },
  { title: '系统完成每日数据备份', time: '3 小时前', color: 'rgb(var(--warning-6))' },
  { title: '王强 更新了项目文档', time: '昨天 18:20', color: 'rgb(var(--danger-6))' },
]

/* --------------------------- 目标完成度 --------------------------- */
const targets = [
  { label: '季度营收目标', value: 78 },
  { label: '用户增长目标', value: 64 },
  { label: '内容产出目标', value: 46 },
]
</script>

<template>
  <div class="w-full pb-4 space-y-4">
    <!-- 页面标题 -->
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div>
        <h2 class="text-lg font-semibold text-(--color-text-1)">概念仪表盘</h2>
        <p class="mt-0.5 text-sm text-(--color-text-3)">实时概览平台核心指标与运行状态</p>
      </div>
      <a-space :size="8">
        <a-tag color="arcoblue">数据实时更新</a-tag>
        <a-tag>2026-10-09</a-tag>
      </a-space>
    </div>

    <!-- 概览指标 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <a-card v-for="item in stats" :key="item.label" :bordered="false" class="rounded-xl">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="text-sm text-(--color-text-3)">{{ item.label }}</div>
            <div class="mt-2 text-2xl font-semibold text-(--color-text-1)">
              {{ item.value }}
              <span class="ml-1 text-sm font-normal text-(--color-text-3)">{{ item.unit }}</span>
            </div>
          </div>
          <div
            class="h-11 w-11 shrink-0 rounded-lg flex items-center justify-center"
            :style="{ backgroundColor: item.bg, color: item.color }"
          >
            <IIcon :icon="item.icon" :width="22" />
          </div>
        </div>
        <div class="mt-3 flex items-center gap-1.5 text-xs">
          <span
            class="inline-flex items-center"
            :style="{ color: item.trend >= 0 ? 'rgb(var(--success-6))' : 'rgb(var(--danger-6))' }"
          >
            <IIcon
              :icon="item.trend >= 0 ? 'ant-design:arrow-up-outlined' : 'ant-design:arrow-down-outlined'"
              :width="12"
            />
            {{ Math.abs(item.trend) }}%
          </span>
          <span class="text-(--color-text-3)">较上周</span>
        </div>
      </a-card>
    </div>

    <!-- 趋势图 + 来源占比 -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <a-card :bordered="false" class="rounded-xl xl:col-span-2">
        <template #title>访问趋势</template>
        <template #extra>
          <div class="flex items-center gap-4">
            <div class="hidden sm:flex items-center gap-4 text-xs text-(--color-text-3)">
              <span class="flex items-center gap-1.5">
                <span class="h-2 w-2 rounded-full bg-[rgb(var(--primary-6))]"></span>访问量
              </span>
              <span class="flex items-center gap-1.5">
                <span class="h-2 w-2 rounded-full bg-[rgb(var(--color-text-4))]"></span>订单量
              </span>
            </div>
            <div class="flex gap-0.5 rounded-md bg-(--color-fill-2) p-0.5 text-xs">
              <span class="rounded bg-(--color-bg-2) px-2 py-0.5 text-(--color-text-1) shadow-sm"> 近 7 天 </span>
              <span class="px-2 py-0.5 text-(--color-text-3)">近 30 天</span>
            </div>
          </div>
        </template>

        <svg viewBox="0 0 660 215" class="w-full">
          <defs>
            <linearGradient id="dashboardAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" class="chart-grad-start" />
              <stop offset="100%" class="chart-grad-end" />
            </linearGradient>
          </defs>

          <!-- 网格 -->
          <line v-for="y in gridY" :key="y" x1="40" :y1="y" x2="620" :y2="y" class="chart-grid" />

          <!-- 面积 + 折线 -->
          <path :d="areaVisit" fill="url(#dashboardAreaGrad)" />
          <path :d="lineOrder" class="chart-line-2" />
          <path :d="lineVisit" class="chart-line" />

          <!-- 数据点 -->
          <circle v-for="dot in dotsVisit" :key="dot.x" :cx="dot.x" :cy="dot.y" r="3.5" class="chart-dot" />

          <!-- 横轴 -->
          <text v-for="(tick, index) in xTicks" :key="tick" :x="tick" y="206" text-anchor="middle" class="chart-axis">
            {{ weekLabels[index] }}
          </text>
        </svg>
      </a-card>

      <a-card :bordered="false" class="rounded-xl">
        <template #title>访问来源</template>
        <div class="flex flex-col items-center gap-5 pt-2">
          <div class="relative h-37.5 w-37.5 rounded-full" :style="{ background: conicGradient }">
            <div class="absolute inset-6 flex flex-col items-center justify-center rounded-full bg-(--color-bg-2)">
              <span class="text-xl font-semibold text-(--color-text-1)">8,846</span>
              <span class="text-xs text-(--color-text-3)">总访问</span>
            </div>
          </div>
          <div class="w-full flex flex-col gap-2.5">
            <div v-for="item in sources" :key="item.name" class="flex items-center gap-2 text-sm">
              <span class="h-2.5 w-2.5 rounded-sm" :style="{ background: item.color }"></span>
              <span class="flex-1 text-(--color-text-2)">{{ item.name }}</span>
              <span class="text-(--color-text-3)">{{ item.value }}%</span>
            </div>
          </div>
        </div>
      </a-card>
    </div>

    <!-- 排行 + 动态 + 目标 -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <a-card :bordered="false" class="rounded-xl">
        <template #title>热门页面排行</template>
        <div class="flex flex-col gap-3 pt-1">
          <div v-for="(item, index) in topPages" :key="item.name" class="flex items-center gap-3">
            <span
              class="flex h-5 w-5 shrink-0 items-center justify-center rounded text-xs font-medium"
              :style="{
                color: index < 3 ? 'rgb(var(--primary-6))' : 'rgb(var(--color-text-3))',
                backgroundColor: index < 3 ? 'rgba(var(--primary-6), 0.12)' : 'transparent',
              }"
            >
              {{ index + 1 }}
            </span>
            <div class="min-w-0 flex-1">
              <div class="mb-1 flex items-center justify-between gap-2 text-sm">
                <span class="truncate text-(--color-text-2)">{{ item.name }}</span>
                <span class="shrink-0 text-xs text-(--color-text-3)">{{ item.value }}</span>
              </div>
              <a-progress :percent="item.percent" :show-text="false" size="small" :color="item.color" />
            </div>
          </div>
        </div>
      </a-card>

      <a-card :bordered="false" class="rounded-xl">
        <template #title>最近动态</template>
        <div class="flex flex-col pt-1">
          <div v-for="(item, index) in activities" :key="item.title" class="flex gap-3">
            <div class="flex flex-col items-center">
              <span class="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" :style="{ background: item.color }"></span>
              <span v-if="index < activities.length - 1" class="my-1 w-px flex-1 bg-(--color-border-2)"></span>
            </div>
            <div class="pb-4">
              <div class="text-sm text-(--color-text-2)">{{ item.title }}</div>
              <div class="mt-0.5 text-xs text-(--color-text-3)">{{ item.time }}</div>
            </div>
          </div>
        </div>
      </a-card>

      <a-card :bordered="false" class="rounded-xl md:col-span-2 xl:col-span-1">
        <template #title>目标完成度</template>
        <div class="flex flex-col gap-5 pt-2">
          <div v-for="item in targets" :key="item.label">
            <div class="mb-2 flex items-center justify-between text-sm">
              <span class="text-(--color-text-2)">{{ item.label }}</span>
              <span class="text-(--color-text-3)">{{ item.value }}%</span>
            </div>
            <a-progress :percent="item.value" :show-text="false" :stroke-width="8" />
          </div>
        </div>
      </a-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chart-grid {
  stroke: rgb(var(--color-border-1));
  stroke-width: 1;
}

.chart-line {
  fill: none;
  stroke: rgb(var(--primary-6));
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.chart-line-2 {
  fill: none;
  stroke: rgb(var(--color-text-4));
  stroke-width: 2;
  stroke-dasharray: 6 6;
  stroke-linecap: round;
}

.chart-dot {
  fill: rgb(var(--color-bg-2));
  stroke: rgb(var(--primary-6));
  stroke-width: 2;
}

.chart-axis {
  fill: rgb(var(--color-text-3));
  font-size: 11px;
}

.chart-grad-start {
  stop-color: rgb(var(--primary-6));
  stop-opacity: 0.28;
}

.chart-grad-end {
  stop-color: rgb(var(--primary-6));
  stop-opacity: 0;
}
</style>
