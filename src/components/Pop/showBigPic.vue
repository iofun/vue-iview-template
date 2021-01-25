<template>
  <div v-if="open" class="pop_layout_tips" @click="popClose($event)">
    <div class="pics_layout">
      <img v-if="picType !== 'mp4'" :src="picSrc">
      <video
        v-else
        :preload="picPreview"
        autoplay="autoplay"
        controls="controls"
        loop="loop"
        :src="picSrc"
        @click="cancleBubble($event)"
      ></video>
      <div v-if="picDetail" class="pic_detail">
        <span>{{ picDetail }}</span>
      </div>
    </div>
    <div v-if="!noSwitch" class="pic_switch pre_pic" @click.stop="switchPic('pre')"></div>
    <div v-if="!noSwitch" class="pic_switch next_pic" @click.stop="switchPic('next')"></div>
  </div>
</template>

<script>
/**
 * 预览大图组件
 * 传入图片数组和指定index(默认为0)即可展示对应原图，需手动设置是否开启翻页
 * 图片数组内格式(可只传指定键值)：
 * {
 *  src : "",  //原图
 *  preview : "" //预览图
 *  detail : "", //注释文字
 *  type : "" // 区分mp4和图片
 * }
 */
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    picImgsIndex: {
      type: Number,
      default: 0
    },
    picImgsArray: {
      type: Array,
      default() {
        return [];
      }
    },
    noSwitch: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      picIndex: '',
      picDetail: '',
      picSrc: '',
      picPreview: '',
      picType: '',
      open: false,
      thisPic: '',
      temData: {
        src: '', // 原图
        preview: '', // 预览图
        detail: '', // 注释文字
        type: '' // 区分mp4和图片
      }
    };
  },
  computed: {

  },
  watch: {
    value(val) {
      this.open = val;
    },
    open(val) {
      this.$emit('input', val);
    },
    picImgsArray(val) {
      if (val.length === 0) {
        return;
      }
      const { src = '', preview = '', detail = '', type = '' } = val[this.picIndex];
      this.picDetail = detail;
      this.picPreview = preview;
      this.picSrc = src;
      this.picType = type;
    },
    picImgsIndex(val) {
      this.picIndex = val;
    }
  },
  created() {
    this.open = this.value;
  },
  mounted() {
    this.picIndex = this.picImgsIndex;
  },
  beforeDestroy() {
    this._close();
  },
  deactivated() {
    this._close();
  },
  methods: {
    switchPic(type) {
      let temIndex = this.picIndex;
      if (type === 'pre') {
        temIndex--;
        if (temIndex < 0) {
          temIndex = 0;
        }
      } else if (type === 'next') {
        temIndex++;
        if (temIndex > this.picImgsArray.length - 1) {
          temIndex = this.picImgsArray.length - 1;
        }
      }
      this.picIndex = temIndex;
    },
    popClose() {
      this._close();
    },
    cancleBubble(e) {
      e.stopPropagation();
    },
    _close() {
      this.$emit('input', false);
    }
  }
};
</script>
<style lang="less" scoped>
.pop_layout_tips {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  background: rgba(0, 0, 0, 0.8);
  .pics_layout {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    user-select: none;
    max-height: calc(100vh - 100px);
    max-width: calc(100vw - 200px);
    overflow-y: scroll;
    font-size: 0;
    img,
    video {
      width: 100%;
      height: auto;
    }
    .pic_detail {
      text-align: center;
      margin-top: 10px;
      span {
        padding: 10px 20px;
        color: #fff;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 5px;
      }
    }
  }
  .pic_switch {
    position: absolute;
    width: 64px;
    height: 64px;
    background: url(~@/assets/img/icon_switch.png) no-repeat center;
    background-size: 100% 100%;
    top: 50%;
    transform: translate(0, -50%);
  }
  .pre_pic {
    left: 30px;
  }
  .next_pic {
    right: 30px;
    transform: rotateY(180deg) translate(0, -50%);
  }
}
</style>
