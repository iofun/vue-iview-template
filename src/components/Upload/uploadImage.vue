<template>
  <div class="upload-container">
    <Button id="editor-upload-btn" size="default" icon="ios-cloud-upload" type="primary" style="display:none;" @click="showModal=true">点击上传</Button>
    <Modal
      v-model="showModal"
      paste
      type="drag"
      title="本地上传图片"
      @on-ok="handleSubmit"
      @on-cancel="showModal = false"
    >
      <div class="upload-wrap">
        <div v-for="item in uploadList" :key="item.id" class="list-item">
          <template v-if="item.status === 'finished'">
            <img :src="item.response.data.image_url">
            <div class="list-cover">
              <Icon type="ios-eye-outline" @click.native="handleView(item.response.data.image_url)"></Icon>
              <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
            </div>
          </template>
          <template v-else>
            <Progress v-if="item.showProgress" :percent="parseInt(item.percentage)" :stroke-width="14" text-inside></Progress>
          </template>
        </div>
        <Upload
          ref="uploadImageEle"
          class="upload-btn"
          multiple
          paste
          type="drag"
          :headers="uploadHeaders"
          :show-upload-list="false"
          :format="['jpg', 'jpeg', 'png', 'gif', 'webp']"
          :on-format-error="handleFormatError"
          :max-size="512000"
          :on-exceeded-size="handleMaxSize"
          :before-upload="beforeUpload"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :on-remove="handleRemove"
          :action="uploadApi"
        >
          <Icon type="ios-camera" size="32"></Icon>
        </Upload>
      </div>
    </Modal>
    <!-- 查看大图 -->
    <Modal v-model="viewImg" title="查看大图">
      <div class="view-img-box">
        <img v-if="viewImg" :src="viewImgUrl">
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'UploadImage',
  props: {
    /* 上传api */
    uploadApi: {
      type: String,
      default: ''
    },
    /* 上传api请求头 */
    uploadHeaders: {
      type: Object,
      default: () => ({})
    },
    /* 上传参数 */
    uploadParams: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      showModal: false, // 显示上传弹窗
      viewImg: false, // 查看大图
      uploadList: [] // 已经上传的文件列表
    };
  },
  methods: {
    handleSubmit() {
      this.$emit('upload-image-success', this.uploadList);
      this.showModal = false;
      this.uploadList = [];
    },
    // 上传附件之前
    beforeUpload() {
    },
    // 上传图片成功
    uploadSuccess(response, file) {
      this.uploadList.push(file);
    },
    // 上传图片失败
    uploadError(res, file) {
      this.$Notice.warning({
        title: '上传图片失败',
        desc: '文件 ' + file.name + ' 上传失败'
      });
    },
    // 校验文件格式失败
    handleFormatError(file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: '文件 ' + file.name + ' 格式不正确'
      });
    },
    // 文件超出大小限制
    handleMaxSize(file) {
      this.$Notice.warning({
        title: '超出文件大小限制',
        desc: '文件 ' + file.name + ' 超出大小限制'
      });
    },
    // 删除文件
    handleRemove(file) {
      const fileList = this.$refs.uploadImageEle.fileList;
      this.$refs.uploadImageEle.fileList.splice(fileList.indexOf(file), 1);
      this.uploadList.splice(this.uploadList.indexOf(file), 1);
    },
    // 预览大图
    handleView(url) {
      this.viewImgUrl = url;
      this.viewImg = true;
    }
  }
};
</script>

<style lang="less" scoped>
.upload-wrap{
  display: flex;
  flex-wrap: wrap;
  padding: 10px 0;
  .list-item{
    display: flex;
    width: 90px;
    height: 90px;
    border: 1px solid #dcdee2;
    background-color: #dcdee2;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    margin: 3px;
    img{
      width: 100%;
    }
    .list-cover{
      opacity: 0;
      position: absolute;
      display: flex;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,.6);
      align-items: center;
      justify-content: space-between;
      transition: all .3s ease;
      &:hover{
        opacity: 1;
      }
      i{
        color: #fff;
        font-size: 28px;
        cursor: pointer;
        margin: 0 6px;
      }
    }
  }
  .ivu-progress{
    width: 90%;
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    position: relative;
    /deep/.ivu-progress-inner-text{
      position: absolute;
      top: 50%;
      right: 0;
      line-height: 1;
      transform: translate(0,-50%);
    }
  }
  .upload-btn{
    width: 90px;
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 3px;
    /deep/.ivu-upload-drag{
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

}
.view-img-box{
  text-align: center;
  img{
    max-width: 100%;
    max-height: 500px;
  }
}

</style>
