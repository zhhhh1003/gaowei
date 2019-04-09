<template>
  <div>
    <div class="main-container">
      <nav-bar :toggleClick="toggleSideBar" :isActive="sidebar"></nav-bar>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  import navBar from '../../component/navBar.vue'
  export default {
    components: {
      navBar
    },
    methods: {
      toggleSideBar () {
        if (this.$store.state.sideBarOpen) {
          this.$store.dispatch('changeSideBar')
        }else {
          this.$store.dispatch('changeSideBar')
        }
      }
    },
    computed: {
      sidebar() {
        return this.$store.state.sideBarOpen
      }
    }
  }
</script>
