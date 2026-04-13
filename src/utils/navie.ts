import { createDiscreteApi } from 'naive-ui'

// 导出 naive-ui 组件
const { message, dialog, notification, loadingBar, modal } = createDiscreteApi([
  'message',
  'dialog',
  'notification',
  'loadingBar',
  'modal',
])

// 导出 naive-ui 组件的别名
export {
  message as $message,
  dialog as $dialog,
  notification as $notification,
  loadingBar as $loadingBar,
  modal as $modal,
}
