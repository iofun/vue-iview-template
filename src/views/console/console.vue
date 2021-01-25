<template>
  <div id="Console-container">
    <div>控制台</div>
  </div>
</template>

<script>
export default {
  name: 'Console',
  data() {
    return {
    };
  },
  computed: {
    sideMenuList() {
      return this.$store.getters.appMenuList;
    },
    dynamicList() {
      return this.$store.state.auth.routeList;
    }
  },
  created() {
  },
  methods: {
  }
};
</script>

<style lang="less" scoped>
</style>
