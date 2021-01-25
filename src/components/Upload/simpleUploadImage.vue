<template>
  <div class="upload-container">

    <Upload
      ref="uploadSimpleEle"
      :multiple="false"
      :show-upload-list="false"
      :format="['jpg', 'jpeg', 'png', 'gif', 'webp']"
      :on-format-error="handleFormatError"
      :max-size="512000"
      :on-exceeded-size="handleMaxSize"
      :before-upload="beforeUpload"
      :on-progress="uploadProgress"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :on-remove="handleRemove"
      :data="uploadFileParams"
      :headers="uploadHeaders"
      :action="uploadApi"
    >
      <Button v-if="!uploadImgUrl" icon="ios-cloud-upload-outline">上传图片</Button>
      <div v-if="uploadImgUrl" class="upload-show-wrap">
        <div class="list-item">
          <img :src="uploadImgUrl">
          <div class="list-cover">
            <div class="action-btn" @click.stop="handleRemove()"><a><Icon type="ios-trash-outline" /></a></div>
            <div class="action-btn"><a><Icon type="md-refresh" /></a></div>
            <div class="action-btn" @click.stop="handleView"><a><Icon type="ios-eye-outline" /></a></div>
          </div>
        </div>
      </div>
      <!-- <div v-if="imgUrl" class="imgbox">
           <img :src="imgUrl">
         </div> -->
    </Upload>
    <div v-show="showUploadProgress" class="upload-progress">上传中<div data-loader="circle-side"></div></div>

    <!-- 查看大图 -->
    <Modal v-model="viewImg" class="simple-show" :width="600" title="查看大图">
      <div class="view-img-box">
        <img v-if="viewImg" :src="uploadImgUrl">
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
import config from '@/config';
export default {
  name: 'SimpleUploadImage',
  components: {
    // CommonIcon
  },
  props: {
    /* 上传api */
    uploadApi: {
      type: String,
      default: config.apiUrl.base + 'upload'
    },
    /* 上传api请求头 */
    uploadHeaders: {
      type: Object,
      default: function() {
        return {
          'Authorization': 'Bearer ' + this.$store.state.auth.token
        };
      }
    },
    /* 上传参数 */
    uploadFileParams: {
      type: Object,
      default: () => ({})
    },
    uploadImgType: {
      type: Number,
      default: 0
    },
    uploadImgIdx: {
      type: Number,
      default: 0
    },
    // uploadImgName: {
    //   type: String,
    //   default: ''
    // },
    // 默认图片
    defaultImg: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showModal: false, // 显示上传弹窗
      viewImg: false, // 查看大图
      showUploadProgress: false, // 显示上传中
      uploadImgUrl: ''
    };
  },
  watch: {
    defaultImg(val) {
      this.uploadImgUrl = val;
    }
  },

  mounted() {
    this.uploadImgUrl = this.defaultImg;
  },
  methods: {
    // 上传附件之前
    beforeUpload() {
    },
    // 文件上传时
    uploadProgress() {
      this.showUploadProgress = true;
    },
    // 上传图片成功
    uploadSuccess(response, file, fileList) {
      this.showUploadProgress = false;
      this.uploadImgUrl = encodeURI(response.data.image_url);// 防止图品命名带空格时在部分手机上不显示
      this.$emit('upload-image-success', this.uploadImgUrl, this.uploadImgType, this.uploadImgIdx);

      // 清空已上传内容
      this.$refs.uploadSimpleEle.fileList.splice(fileList.indexOf(file), 1);
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
    handleRemove() {
      this.$emit('upload-image-success', '', this.uploadImgType, this.uploadImgIdx);
    },
    // 预览大图
    handleView() {
      this.viewImg = true;
    }
  }
};
</script>

<style lang="less" scoped>
.upload-btn-box{
  padding: 20px;
}
.upload-progress{
  display: flex;
  align-items: center;
  justify-content: center;
  div[data-loader='circle-side']{
    width: 16px;
    height: 16px;
  }
}
.upload-show-wrap{
  display: flex;
  position: relative;
  margin-top: 5px;
  .list-item{
    position: relative;
    min-height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    // min-height: 126px;
    img{
      width: 90%;
      min-width: 110px;
      max-height:180px;
      display: block;
      // max-width: 320px;
    }
    .list-cover{
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,.3);
      align-items: center;
      justify-content: center;
      transition: all .3s ease;
      &:hover{
        opacity: 1;
      }
      .action-btn{
        width: 30px;
        height: 30px;
        margin: 0 5px;
        line-height: 1.5;
        cursor: pointer;
        color: #212121;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 1px solid #fff;
        border-radius: 100%;
        background-color: rgba(255,255,255,.8);
        a{
          display: block;
          text-align: center;
        }
        i{
          font-size: 20px;
          cursor: pointer;
          margin: 0 15px;
        }
      }

    }
  }
}
.view-img-box{
  display: flex;
  align-items: center;
  justify-content: center;
  img{
    max-width: 320px;
  }
}
.simple-show{
  /deep/
  .ivu-modal-footer{
    border-top: none;
  }
}

</style>
