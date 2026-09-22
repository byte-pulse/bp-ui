<template>
  <div class="home-container">
    文件上传测试
    <n-progress
      type="line"
      :percentage="percentage"
      indicator-placement="inside"
      processing
      style="width: 300px"
    />
    <input type="file" @change="onFileChange" />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
    <n-button @click="handleLogin">登陆</n-button><br />
  </div>
</template>

<script lang="ts" setup>
import { checkLogin } from '@/api/login'

const handleLogin = throttle(async () => {
  await checkLogin()
}, 2000)

const percentage = ref(0)
function uploadFile(form: FormData) {
  console.log('正在上传')

  fileAxios.filePost('http://127.0.0.1:19420/auth/tttt', form, {
    $onUploadProgress: (progress, e) => {
      percentage.value = progress
      console.log(e)

      if (progress >= 100) {
        $message.info('文件上传成功')
      }
    }
  })
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files || !input.files[0]) return
  percentage.value = 0
  const file = input.files[0]

  const form = new FormData()
  form.append('file', file) // key 要和后端一致

  uploadFile(form)
}
</script>
<style lang="scss" scoped></style>
