<script lang="ts" setup>
defineOptions({ name: 'Workspace' })

/* --------------------------- 欢迎区概览（静态展示） --------------------------- */
const quickStats = [
  { label: '待办事项', value: 12 },
  { label: '未读消息', value: 5 },
  { label: '参与项目', value: 8 },
]

/* --------------------------- 常用功能 --------------------------- */
const entries = [
  {
    label: '数据分析',
    icon: 'ant-design:bar-chart-outlined',
    color: 'rgb(var(--primary-6))',
    bg: 'rgba(var(--primary-6), 0.12)',
  },
  {
    label: '用户管理',
    icon: 'ant-design:team-outlined',
    color: 'rgb(var(--success-6))',
    bg: 'rgba(var(--success-6), 0.12)',
  },
  {
    label: '内容审核',
    icon: 'ant-design:audit-outlined',
    color: 'rgb(var(--warning-6))',
    bg: 'rgba(var(--warning-6), 0.12)',
  },
  {
    label: '财务对账',
    icon: 'ant-design:account-book-outlined',
    color: 'rgb(var(--danger-6))',
    bg: 'rgba(var(--danger-6), 0.12)',
  },
  {
    label: '消息中心',
    icon: 'ant-design:message-outlined',
    color: 'rgb(var(--primary-6))',
    bg: 'rgba(var(--primary-6), 0.12)',
  },
  {
    label: '日程安排',
    icon: 'ant-design:calendar-outlined',
    color: 'rgb(var(--success-6))',
    bg: 'rgba(var(--success-6), 0.12)',
  },
  {
    label: '系统设置',
    icon: 'ant-design:setting-outlined',
    color: 'rgb(var(--warning-6))',
    bg: 'rgba(var(--warning-6), 0.12)',
  },
  {
    label: '帮助文档',
    icon: 'ant-design:file-text-outlined',
    color: 'rgb(var(--danger-6))',
    bg: 'rgba(var(--danger-6), 0.12)',
  },
]

/* --------------------------- 我的待办 --------------------------- */
const todos = [
  {
    title: '完成 Q4 数据看板需求评审',
    project: '数据平台',
    deadline: '今天 18:00',
    priority: '高',
    tagColor: 'red',
    color: 'rgb(var(--danger-6))',
  },
  {
    title: '整理用户增长周报',
    project: '增长运营',
    deadline: '明天 12:00',
    priority: '中',
    tagColor: 'orange',
    color: 'rgb(var(--warning-6))',
  },
  {
    title: '跟进第三方支付对接进度',
    project: '交易中心',
    deadline: '10-11',
    priority: '中',
    tagColor: 'orange',
    color: 'rgb(var(--warning-6))',
  },
  {
    title: '更新组件库使用文档',
    project: '基础建设',
    deadline: '10-15',
    priority: '低',
    tagColor: 'gray',
    color: 'rgb(var(--color-text-3))',
  },
]

/* --------------------------- 项目进度 --------------------------- */
const projects = [
  { name: '数据中台建设', desc: '负责人：张伟 · 12 人', percent: 82 },
  { name: '移动端改版', desc: '负责人：李娜 · 6 人', percent: 64 },
  { name: '风控规则引擎', desc: '负责人：王强 · 4 人', percent: 45 },
  { name: '运营活动系统', desc: '负责人：赵敏 · 5 人', percent: 26 },
]

/* --------------------------- 最近访问 --------------------------- */
const recentDocs = [
  {
    name: '产品需求文档 v1.4',
    time: '10 分钟前',
    icon: 'ant-design:file-text-outlined',
    color: 'rgb(var(--primary-6))',
    bg: 'rgba(var(--primary-6), 0.12)',
  },
  {
    name: '接口设计说明',
    time: '1 小时前',
    icon: 'ant-design:api-outlined',
    color: 'rgb(var(--success-6))',
    bg: 'rgba(var(--success-6), 0.12)',
  },
  {
    name: '数据字典',
    time: '昨天',
    icon: 'ant-design:database-outlined',
    color: 'rgb(var(--warning-6))',
    bg: 'rgba(var(--warning-6), 0.12)',
  },
  {
    name: '原型图评审稿',
    time: '3 天前',
    icon: 'ant-design:layout-outlined',
    color: 'rgb(var(--danger-6))',
    bg: 'rgba(var(--danger-6), 0.12)',
  },
]

/* --------------------------- 团队公告 --------------------------- */
const notices = [
  {
    title: '关于国庆假期系统维护的通知',
    desc: '运维将于假期期间对集群进行扩容，期间部分服务可能短暂不可用。',
    time: '10-01',
    color: 'rgb(var(--primary-6))',
  },
  {
    title: '新版本 v1.4.0 已发布',
    desc: '本次更新优化了表格组件与权限模型，欢迎体验并反馈问题。',
    time: '09-28',
    color: 'rgb(var(--success-6))',
  },
  {
    title: '技术分享会预告',
    desc: '本周五 16:00 线上分享《前端性能优化实践》，感兴趣的同学准时参加。',
    time: '09-25',
    color: 'rgb(var(--warning-6))',
  },
]
</script>

<template>
  <div class="w-full pb-4 space-y-4">
    <!-- 欢迎区 -->
    <div
      class="relative overflow-hidden rounded-xl p-5 sm:p-6 text-white"
      style="background: linear-gradient(135deg, rgb(var(--primary-6)) 0%, rgb(var(--primary-5)) 100%)"
    >
      <div class="relative z-1 flex flex-wrap items-center justify-between gap-5">
        <div class="flex items-center gap-4">
          <a-avatar :size="64" class="bg-white/20 text-white">
            <IIcon icon="ant-design:user-outlined" :width="30" />
          </a-avatar>
          <div>
            <div class="text-xl font-semibold">早上好，Admin，祝你开心每一天！</div>
            <div class="mt-1 text-sm text-white/80">今天是 2026 年 10 月 9 日 星期五 · 字节脉搏研发中心</div>
          </div>
        </div>
        <div class="flex items-center gap-8 sm:gap-10">
          <div v-for="item in quickStats" :key="item.label" class="text-center">
            <div class="text-2xl font-semibold">{{ item.value }}</div>
            <div class="mt-0.5 text-xs text-white/75">{{ item.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 常用功能 -->
    <a-card :bordered="false" class="rounded-xl">
      <template #title>常用功能</template>
      <div class="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-2">
        <div
          v-for="item in entries"
          :key="item.label"
          class="flex cursor-pointer flex-col items-center gap-2 rounded-lg py-4 transition hover:bg-(--color-fill-2)"
        >
          <div
            class="flex h-11 w-11 items-center justify-center rounded-lg"
            :style="{ backgroundColor: item.bg, color: item.color }"
          >
            <IIcon :icon="item.icon" :width="22" />
          </div>
          <span class="text-sm text-(--color-text-2)">{{ item.label }}</span>
        </div>
      </div>
    </a-card>

    <!-- 待办 + 项目进度 -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <a-card :bordered="false" class="rounded-xl xl:col-span-2">
        <template #title>我的待办</template>
        <template #extra>
          <a-link>查看全部</a-link>
        </template>
        <div
          v-for="item in todos"
          :key="item.title"
          class="flex items-start gap-3 border-b border-(--color-border-1) py-3 last:border-0 last:pb-0"
        >
          <span
            class="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border"
            :style="{ borderColor: item.color }"
          >
            <span class="h-2 w-2 rounded-full" :style="{ background: item.color }"></span>
          </span>
          <div class="min-w-0 flex-1">
            <div class="truncate text-sm text-(--color-text-1)">{{ item.title }}</div>
            <div class="mt-1 text-xs text-(--color-text-3)">{{ item.project }} · 截止 {{ item.deadline }}</div>
          </div>
          <a-tag :color="item.tagColor" size="small">{{ item.priority }}</a-tag>
        </div>
      </a-card>

      <a-card :bordered="false" class="rounded-xl">
        <template #title>项目进度</template>
        <div
          v-for="item in projects"
          :key="item.name"
          class="flex items-center gap-4 border-b border-(--color-border-1) py-3 last:border-0 last:pb-0"
        >
          <a-progress type="circle" :percent="item.percent" :width="52" :stroke-width="5" />
          <div class="min-w-0 flex-1">
            <div class="truncate text-sm text-(--color-text-1)">{{ item.name }}</div>
            <div class="mt-1 text-xs text-(--color-text-3)">{{ item.desc }}</div>
          </div>
        </div>
      </a-card>
    </div>

    <!-- 最近访问 + 团队公告 -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <a-card :bordered="false" class="rounded-xl xl:col-span-2">
        <template #title>最近访问</template>
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div
            v-for="item in recentDocs"
            :key="item.name"
            class="flex cursor-pointer items-center gap-3 rounded-lg border border-(--color-border-1) p-3 transition hover:shadow-sm"
          >
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
              :style="{ backgroundColor: item.bg, color: item.color }"
            >
              <IIcon :icon="item.icon" :width="20" />
            </div>
            <div class="min-w-0">
              <div class="truncate text-sm text-(--color-text-1)">{{ item.name }}</div>
              <div class="mt-0.5 text-xs text-(--color-text-3)">{{ item.time }}</div>
            </div>
          </div>
        </div>
      </a-card>

      <a-card :bordered="false" class="rounded-xl">
        <template #title>团队公告</template>
        <div
          v-for="item in notices"
          :key="item.title"
          class="border-b border-(--color-border-1) py-3 first:pt-0 last:border-0 last:pb-0"
        >
          <div class="flex items-center gap-2">
            <span class="h-1.5 w-1.5 shrink-0 rounded-full" :style="{ background: item.color }"></span>
            <span class="flex-1 truncate text-sm text-(--color-text-1)">{{ item.title }}</span>
            <span class="shrink-0 text-xs text-(--color-text-3)">{{ item.time }}</span>
          </div>
          <p class="mt-1.5 line-clamp-2 text-xs text-(--color-text-3)">{{ item.desc }}</p>
        </div>
      </a-card>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
