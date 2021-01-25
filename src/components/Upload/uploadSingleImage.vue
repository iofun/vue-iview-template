<template>
  <div class="single-img">
    <Upload
      type="drag"
      :action="api"
      :headers="header"
      :show-upload-list="false"
      :on-success="onSuccess"
    >
      <div v-if="!value" style="padding: 20px 0">
        <Icon type="ios-cloud-upload" size="40" style="color: #c0c4cc"></Icon>
        <p>拖入文件，或者点击上传</p>
      </div>
      <Row v-else type="flex" justify="center" align="middle">
        <Col span="24" class="img-wrap">
        <img :src="value" class="img">
        </Col>
      </Row>
    </Upload>
  </div>
</template>

<script>
import config from '@/config';
export default {
  name: 'UploadSingleImage',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      api: config.apiUrl.base + 'upload',
      header: {
        'Authorization': 'Bearer ' + this.$store.state.auth.token
      }
    };
  },
  methods: {
    onSuccess(e) {
      const imageUrl = e.data.image_url;
      this.$emit('input', imageUrl);
    }
  }
};
</script>

<style lang="less" scoped>
  .single-img {
    position: relative;
    .img-wrap {
      width: 100%;
      height: 100px;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }
</style>
