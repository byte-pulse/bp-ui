export function printBanner() {
  const b1 = ' ▄▄▄▄·  ▄· ▄▌▄▄▄▄▄▄▄▄ .     ▄▄▄·▄• ▄▌▄▄▌  .▄▄ · ▄▄▄ .\n'
  const b2 = ' ▐█ ▀█▪▐█▪██▌•██  ▀▄.▀·    ▐█ ▄██▪██▌██•  ▐█ ▀. ▀▄.▀·\n'
  const b3 = ' ▐█▀▀█▄▐█▌▐█▪ ▐█.▪▐▀▀▪▄     ██▀·█▌▐█▌██▪  ▄▀▀▀█▄▐▀▀▪▄\n'
  const b4 = ' ██▄▪▐█ ▐█▀·. ▐█▌·▐█▄▄▌    ▐█▪·•▐█▄█▌▐█▌▐▌▐█▄▪▐█▐█▄▄▌\n'
  const b5 = ' ·▀▀▀▀   ▀ •  ▀▀▀  ▀▀▀     .▀    ▀▀▀ .▀▀▀  ▀▀▀▀  ▀▀▀\n'
  console.info(
    `%c${b1 + b2 + b3 + b4 + b5}`,
    'color: #20bcca; font-size: 10px;',
  )
  const companyName = import.meta.env.VITE_APP_COMPANY_NAME
  const version = import.meta.env.VITE_APP_VERSION
  console.info(
    `%c${companyName} %c${version}`,
    'padding: 2px 6px; border-radius: 3px 0 0 3px; color: #fff; background: #20bcca; font-weight: bold;',
    'padding: 2px 6px; border-radius: 0 3px 3px 0; color: #fff; background: #26dff0; font-weight: bold;',
  )
}
