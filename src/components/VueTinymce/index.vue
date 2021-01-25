
<template>
  <div>
    <!--
    给editor加key是因为给tinymce keep-alive以后组件切换时tinymce编辑器会显示异常，
    在activated钩子里改变key的值可以让编辑器重新创建
  -->
    <editor id="tinymceEditor" :key="flag" v-model="content" :init="config"></editor>
    <Modal
      v-model="setLinkShow"
      title="设置链接"
      @on-ok="setLinkOk"
    >
      <Form :label-width="80">
        <Form-item label="路由类型">
          <Select v-model="currAttrs['data-method']" @on-change="selectChange">
            <Option v-for="(item, index) in links" :key="index" :value="item.method">{{ item.name }}</Option>
          </Select>
        </Form-item>
        <template v-if="currSelected.paramsTips">
          <Form-item :label="currSelected.paramsTips == 'url' ? '链接' : '参数'">
            <Input v-model="currAttrs['data-params']" :placeholder="currSelected.paramsTips"></Input>
          </Form-item>
        </template>
        <Form-item v-if="currAttrs.onlyText" label="显示文字">
          <Input v-model="currAttrs.text" placeholder="输入内容"></Input>
        </Form-item>
      </Form>
    </Modal>
    <!-- 图片上传组件辅助-->
    <uploadImage :upload-api="uploadApi" :upload-headers="uploadHeaders" @upload-image-success="uploadImageSuccessCallBack" />
  </div>
</template>

<script>
import links from '@/config/list_dressupGirl';
import uploadImage from '@/components/Upload/uploadImage';

import tinymce from 'tinymce/tinymce';
import Editor from '@tinymce/tinymce-vue';
import 'tinymce/themes/silver';

import 'tinymce/plugins/textcolor';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/table';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/fullscreen';

import defaultConfig from './config';
import LinkBtn from './linkBtn';
import config from '@/config';

export default {
  name: 'TinymceEditor',
  components: {
    Editor,
    uploadImage
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      uploadApi: config.apiUrl.base + 'upload',
      uploadHeaders: {
        'Authorization': 'Bearer ' + this.$store.state.auth.token
      },
      links,
      flag: 1,
      content: '',
      config: {},
      linkBtn: undefined,
      currAttrs: {},
      currSelected: {},
      setLinkShow: false,
      imageUploadShow: false,
      params: ''
    };
  },
  watch: {
    currAttrs(val) {
      this.currSelected = this.getCurrSelected(val['data-method']);
    },
    value(val) {
      this.content = val;
    },
    content(val) {
      this.$emit('input', val);
    }
  },
  created() {
    const _this = this;
    _this.linkBtn = new LinkBtn();

    _this.config = Object.assign(defaultConfig, {
      linkBtnClick(attrs) {
        _this.currAttrs = { ...attrs };
        _this.setLinkShow = true;
      },
      /**
       * 下面方法是为tinymce添加自定义插入图片按钮
       * 借助iview的Upload组件,将图片先上传到存储云上，再将图片的存储地址放入编辑器内容
       */
      setup: (editor) => {
        _this.editor = editor;
        editor.ui.registry.addToggleButton('imageUpload', {
          tooltip: '插入图片',
          icon: 'image',
          onAction: () => {
            document.querySelector('#editor-upload-btn').click();
          }
        });
      }
    });
  },

  activated() {
    this.flag++;
  },
  mounted() {
  },
  methods: {
    selectChange(e) {
      this.currSelected = this.getCurrSelected(e);
    },
    getCurrSelected(method) {
      let currSelected = {};
      this.links.map(item => {
        if (item.method === method) {
          currSelected = item;
        }
      });
      return currSelected;
    },
    setLinkOk() {
      const attrs = { ...this.currAttrs };
      const currSelected = this.getCurrSelected(attrs['data-method']);
      if (!currSelected.paramsTips) {
        attrs['data-params'] = '';
      }
      this.linkBtn.setLink(attrs);
    },
    // 上传图片完成返回
    uploadImageSuccessCallBack(list) {
      list.forEach(item => {
        let src = item.response.data.image_url;
        src = encodeURI(src); // 防止图片名称出现空格时出现裂图
        tinymce.execCommand('mceInsertContent', false, `<p style="margin: 0;"><img style="width: 100%;" src='${src}'></p>`);
      });
    }
  }
};
</script>

<style>
  .quill-wrap {
    position: relative;
  }
</style>
