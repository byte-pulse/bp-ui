export function sendSystemNotification(title: string, options?: NotificationOptions | undefined) {
  // 第一步：检查浏览器是否支持 Notification API
  if (!('Notification' in window)) {
    return
  }

  // 第二步：检查当前权限状态
  if (Notification.permission === 'granted') {
    // 已授权，直接发送
    new Notification(title, options)
  } else {
    // 默认状态（'default'），尚未询问，请求权限
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification(title, options)
      }
    })
  }
}

// 请求通知权限
export function requestNotif() {
  Notification.requestPermission().then(() => {
    if (Notification.permission === 'denied') {
      // 被拒绝，提示用户
      const guideUrl = getBrowserGuideUrl()
      const browserName = navigator.userAgent.toLowerCase().includes('edg')
        ? 'Edge'
        : navigator.userAgent.toLowerCase().includes('chrome')
          ? 'Chrome'
          : '您的浏览器'

      $message.warning('', {
        duration: 8000,
        render: () => {
          return h(
            'div',
            {
              class: ['n-message', 'n-message--info-type'],
            },
            [
              `当前 ${browserName} 浏览器拒绝通知权限，`,
              h(
                'a',
                {
                  href: guideUrl,
                  target: '_blank',
                  style: {
                    color: '#18a058',
                    fontWeight: 'bold',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  },
                },
                '点击查看如何开启通知',
              ),
              ' 以获得更好体验',
            ],
          )
        },
      })
    }
  })
}

function getBrowserGuideUrl() {
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes('edg')) {
    return 'https://support.microsoft.com/zh-cn/edge/manage-website-notifications-in-microsoft-edge'
  } else if (ua.includes('chrome') && !ua.includes('edg')) {
    return 'https://support.google.com/chrome/answer/3220216?hl=zh-Hans'
  } else if (ua.includes('firefox')) {
    return 'https://support.mozilla.org/zh-CN/kb/%E7%BD%91%E9%A1%B5%E6%8E%A8%E9%80%81%E9%80%9A%E7%9F%A5#w_wang-zhan-ru-he-qing-qiu-tong-zhi-quan-xian'
  } else if (ua.includes('safari') && !ua.includes('chrome')) {
    return 'https://support.apple.com/zh-cn/guide/safari/sfri40734/mac'
  } else {
    // 兜底链接：可指向一个通用的搜索引擎结果
    return 'https://www.baidu.com/s?wd=浏览器 通知 权限 开启'
  }
}
