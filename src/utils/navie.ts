import { createDiscreteApi } from 'naive-ui'

const { message, dialog, notification, loadingBar, modal } = createDiscreteApi([
  'message',
  'dialog',
  'notification',
  'loadingBar',
  'modal'
])

export {
  message as $message,
  dialog as $dialog,
  notification as $notification,
  loadingBar as $loadingBar,
  modal as $modal
}
