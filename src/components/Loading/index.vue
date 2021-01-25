<template>
  <div v-if="apiLoading" class="container">
    <Spin size="large" fix>
      <!-- <Icon type="ios-loading" size="26" class="spin-icon-load"></Icon>
      <div>Loading</div> -->
    </Spin>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Loading',
  computed: {
    ...mapGetters(['apiLoading'])
  }
};
</script>
<style lang="less" scoped>
@keyframes ani-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes ani-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  .ivu-spin {
    z-index: 9;
  }
  .spin-icon-load {
    animation: ani-spin 1s linear infinite;
    -webkit-animation: ani-spin 1s linear infinite;
  }
}
.ivu-spin-fix {
  background-color: rgba(255, 255, 255, 0.75);
}
</style>
