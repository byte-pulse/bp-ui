import { createDiscreteApi } from 'naive-ui'

export const {
  message: $message,
  dialog: $dialog,
  notification: $notification,
  loadingBar: $loadingBar,
} = createDiscreteApi(['message', 'dialog', 'notification', 'loadingBar'])
