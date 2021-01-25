<template>
  <div class="header-bar">
    <SiderTrigger :collapsed="collapsed" icon="md-menu" @on-change="handleCollpasedChange" />
    <CustomBreadCrumb show-icon :list="breadCrumbList" />
    <div class="custom-content-con">
      <slot />
    </div>
  </div>
</template>
<script>
import SiderTrigger from './SiderTrigger';
import CustomBreadCrumb from './CustomBreadCrumb';
export default {
  name: 'HeaderBar',
  components: {
    SiderTrigger,
    CustomBreadCrumb,
  },
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    breadCrumbList() {
      return this.$store.state.base.breadCrumbList;
    }
  },
  methods: {
    handleCollpasedChange(state) {
      this.$emit('on-coll-change', state);
    }
  }
};
</script>
<style lang="less" scoped>
.header-bar {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  .custom-content-con {
    display: flex;
    justify-content: flex-end;
    flex: auto;
    align-items: center;
    padding-right: 10px;
  }
}
</style>
