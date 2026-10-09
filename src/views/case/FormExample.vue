<script lang="ts" setup>
import type { FormConfig, FormExpose } from '@/components/form/types'

const formRef = ref<FormExpose>()

// 全局列数，切换即可看到整个表单在单列 / 多列间切换
const columns = ref(2)

// 表单数据
const model = ref<Record<string, unknown>>({
  name: '',
  age: 18,
  gender: 'male',
  level: 'normal',
  password: '',
  phone: '',
  email: '',
  region: undefined,
  birthday: undefined,
  workTime: undefined,
  hobby: [],
  enabled: true,
  score: 60,
  star: 3,
  remark: '',
})

// 表单配置：分组、列数、字段类型全部由配置对象描述
const config = computed<FormConfig>(() => ({
  columns: columns.value,
  layout: 'horizontal',
  labelAlign: 'right',
  size: 'medium',
  groups: [
    {
      title: '基本信息',
      // 不写 columns，继承全局列数（切换单列 / 多列）
      fields: [
        {
          field: 'name',
          label: '姓名',
          type: 'input',
          rules: [{ required: true, message: '请输入姓名' }],
          props: { maxLength: 20 },
        },
        { field: 'age', label: '年龄', type: 'number', props: { min: 0, max: 120 } },
        {
          field: 'gender',
          label: '性别',
          type: 'radio',
          defaultValue: 'male',
          options: [
            { label: '男', value: 'male' },
            { label: '女', value: 'female' },
          ],
        },
        {
          field: 'level',
          label: '等级',
          type: 'select',
          defaultValue: 'normal',
          options: [
            { label: '普通', value: 'normal' },
            { label: '高级', value: 'senior' },
            { label: '管理员', value: 'admin' },
          ],
        },
        {
          field: 'remark',
          label: '备注',
          type: 'textarea',
          // span: 24 让字段独占一行，不受列数影响
          span: 24,
          placeholder: '请输入备注信息',
        },
      ],
    },
    {
      title: '联系方式',
      // 分组列数覆盖全局，固定两列
      columns: 2,
      fields: [
        {
          field: 'phone',
          label: '手机号',
          type: 'input',
          rules: [{ match: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }],
        },
        {
          field: 'email',
          label: '邮箱',
          type: 'input',
          rules: [{ type: 'email', message: '邮箱格式不正确' }],
        },
        {
          field: 'region',
          label: '所在地区',
          type: 'select',
          options: [
            { label: '北京', value: 'beijing' },
            { label: '上海', value: 'shanghai' },
            { label: '广州', value: 'guangzhou' },
            { label: '深圳', value: 'shenzhen' },
          ],
        },
        { field: 'birthday', label: '出生日期', type: 'date' },
      ],
    },
    {
      title: '其他信息',
      fields: [
        { field: 'workTime', label: '入职时间', type: 'date' },
        {
          field: 'hobby',
          label: '爱好',
          type: 'checkbox',
          options: [
            { label: '阅读', value: 'read' },
            { label: '运动', value: 'sport' },
            { label: '音乐', value: 'music' },
            { label: '旅行', value: 'travel' },
          ],
        },
        { field: 'enabled', label: '启用账号', type: 'switch' },
        { field: 'score', label: '评分', type: 'slider' },
        { field: 'star', label: '推荐指数', type: 'rate' },
      ],
    },
  ],
}))

// 提交
const submit = async () => {
  const valid = await formRef.value?.validate()
  if (valid) {
    $message.success('校验通过，数据已提交')
    console.log('表单数据：', formRef.value?.getValues())
  }
}

// 重置
const reset = () => {
  formRef.value?.reset()
  $message.info('表单已重置')
}
</script>

<template>
  <div class="w-full pb-4">
    <a-card :bordered="false" class="rounded-lg">
      <template #title>配置化表单</template>
      <template #extra>
        <a-space :size="8">
          <span class="text-(--color-text-3) text-sm">列数：</span>
          <a-radio-group v-model="columns" type="button" size="small">
            <a-radio :value="1">单列</a-radio>
            <a-radio :value="2">两列</a-radio>
            <a-radio :value="3">三列</a-radio>
          </a-radio-group>
        </a-space>
      </template>

      <IForm ref="formRef" v-model="model" :config="config">
        <template #footer>
          <a-button type="primary" @click="submit">提交</a-button>
          <a-button @click="reset">重置</a-button>
        </template>
      </IForm>
    </a-card>
  </div>
</template>

<style lang="scss" scoped></style>
