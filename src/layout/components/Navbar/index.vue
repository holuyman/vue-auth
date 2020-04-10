<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-menu :default-active="activeMenu" class="el-menu-demo" mode="horizontal" :background-color="variables.menuBg"
      :text-color="variables.menuText" :active-text-color="variables.menuActiveText">
      <navbar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import NavbarItem from './NavbarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { NavbarItem, Logo },
  computed: {
    // ...mapGetters(['permission_routes']),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    permission_routes() {
      return this.$router.options.routes.concat(global.antRouter)
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
  },
}
</script>
