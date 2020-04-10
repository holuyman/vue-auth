<template>
  <div :class="classObj" class="app-wrapper">
    <div class="drawer-bg">

      <navbar />

      <app-main />
    </div>
  </div>
</template>

<script>
import { AppMain, Navbar } from './components'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
  },
  computed: {
    ...mapState({
      fixedHeader: state => state.settings.fixedHeader,
    }),
    classObj() {
      return {}
    },
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
