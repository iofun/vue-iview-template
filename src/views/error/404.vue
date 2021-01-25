<template>
  <div class="error-page">
    <div class="content-con">
      <div class="img-group">
        <img :src="src" alt="">
      </div>
      <div class="btn-group">
        <h1>404</h1>
        <div class="desc">抱歉，你访问的页面不存在</div>
        <div class="actions">
          <a href="/" target="_self" class="ivu-btn ivu-btn-primary ivu-btn-large"><span>返回首页</span></a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import error404 from '@/assets/images/error/error-404.svg';
export default {
  name: 'Error404',
  data() {
    return {
      src: error404
    };
  }
};
</script>
<style lang="less" scoped>
@import './error.less';
</style>
