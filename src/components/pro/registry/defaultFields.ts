import { Cascader, Rate, Slider, TimePicker, TreeSelect, Upload } from '@arco-design/web-vue'
import { registerFields } from './componentMap'
import ProFieldInput from '../components/fields/ProFieldInput.vue'
import ProFieldTextarea from '../components/fields/ProFieldTextarea.vue'
import ProFieldPassword from '../components/fields/ProFieldPassword.vue'
import ProFieldDigit from '../components/fields/ProFieldDigit.vue'
import ProFieldSelect from '../components/fields/ProFieldSelect.vue'
import ProFieldSwitch from '../components/fields/ProFieldSwitch.vue'
import ProFieldRadio from '../components/fields/ProFieldRadio.vue'
import ProFieldCheckbox from '../components/fields/ProFieldCheckbox.vue'
import ProFieldDate from '../components/fields/ProFieldDate.vue'
import ProFieldDateRange from '../components/fields/ProFieldDateRange.vue'

/** 是否已完成默认注册，避免重复执行 */
let installed = false

/**
 * 安装内置字段组件
 *
 * 将 `ProValueType` 映射到具体组件；对无需额外封装的类型直接复用 Arco 组件。
 * 该函数幂等，可安全多次调用。
 */
export function installDefaultFields(): void {
  if (installed) {
    return
  }
  installed = true

  registerFields({
    // 文本类
    text: ProFieldInput,
    input: ProFieldInput,
    textarea: ProFieldTextarea,
    password: ProFieldPassword,
    // 数值类
    digit: ProFieldDigit,
    slider: Slider,
    rate: Rate,
    // 选择类
    select: ProFieldSelect,
    radio: ProFieldRadio,
    checkbox: ProFieldCheckbox,
    switch: ProFieldSwitch,
    treeSelect: TreeSelect,
    cascader: Cascader,
    // 日期类
    date: ProFieldDate,
    dateRange: ProFieldDateRange,
    time: TimePicker,
    // 上传
    upload: Upload,
  })
}
