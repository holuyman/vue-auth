<template>
  <div>home
    <el-button @click="loginout">退出登录</el-button>
  </div>
</template>
<script>
export default {
  name: 'home',
  data() {
    return {}
  },

  created() {},
  methods: {
    async loginout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
  },
}
</script>