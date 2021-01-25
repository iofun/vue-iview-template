<template>
  <div class="error-page">
    <div class="content-con">
      <div class="img-group">
        <img :src="src" alt="">
      </div>
      <div class="btn-group">
        <h1>403</h1>
        <div class="desc">抱歉，你无权访问该页面</div>
        <div class="actions">
          <a href="/" target="_self" class="ivu-btn ivu-btn-primary ivu-btn-large"><span>返回首页</span></a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import error403 from '@/assets/images/error/error-403.svg';
export default {
  name: 'Error403',
  data() {
    return {
      src: error403
    };
  }
};
</script>
<style lang="less" scoped>
@import './error.less';
</style>
