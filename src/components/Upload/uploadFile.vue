<template>
  <div class="upload-container">
    <Upload
      ref="uploadFileEle"
      multiple
      :show-upload-list="false"
      :headers="uploadHeaders"
      :action="uploadApi"
      :before-upload="beforeUpload"
      :on-progress="uploadProgress"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :on-remove="handleRemove"
      :data="uploadFileParams"
    >
      <Button v-if="!uploadFile" icon="ios-cloud-upload">批量上传</Button>
      <Button v-if="uploadFile" icon="ios-paper-outline" class="selectBtn">
        {{ fileName }}
        <div class="list-cover">
          <div class="action-btn" @click.stop="handleRemove()"><a><Icon type="ios-trash-outline" /></a></div>
          <div class="action-btn"><a><Icon type="md-refresh" /></a></div>
        </div>
      </Button>
    </Upload>
    <div v-show="showUploadProgress" class="upload-progress">上传中<div data-loader="circle-side"></div></div>
  </div>
</template>

<script>
import config from '@/config';
export default {
  name: 'UploadFile',
  props: {
    /* 上传api */
    uploadApi: {
      type: String,
      default: config.apiUrl.base + 'receive_activity/file_upload'
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
    // 默认文件
    defaultFile: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      defaultUrl: [{
        name: '',
        url: ''
      }],
      uploadFile: '',
      fileName: '',
      showUploadProgress: false
    };
  },
  watch: {
    defaultFile(val) {
      this.uploadFile = val;
      // this.defaultUrl[0].url=this.uploadFile
      this.fileName = this.uploadFile.split('/').slice(-1)[0];
    }
  },
  mounted() {
    this.uploadFile = this.defaultFile;
    // this.defaultUrl[0].url=this.uploadFile
    this.fileName = this.uploadFile.split('/').slice(-1)[0];
    console.log(this.defaultFile);
  },
  methods: {
    // 上传附件之前
    beforeUpload() {
    },
    uploadProgress() {
      this.showUploadProgress = true;
    },
    // 上传图片成功
    uploadSuccess(response, file, fileList) {
      this.showUploadProgress = false;
      this.uploadFile = response.data.image_url;
      // this.defaultUrl[0].url=this.uploadFile
      this.fileName = this.uploadFile.split('/').slice(-1)[0];
      this.$emit('upload-file-success', this.uploadFile);
      // 清空已上传内容
      this.$refs.uploadFileEle.fileList.splice(fileList.indexOf(file), 1);
    },
    // 上传图片失败
    uploadError(res, file) {
      this.showUploadProgress = false;
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
      console.log('remove');
      this.$emit('upload-file-success', '');
      // this.defaultUrl=[{name:'',url:''}]
      // const fileList = this.$refs.uploadEle.fileList;
      // this.$refs.uploadEle.fileList.splice(fileList.indexOf(file), 1);
    }
  }
};
</script>

<style lang="less" scoped>
.selectBtn{
  position: relative;
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
</style>
