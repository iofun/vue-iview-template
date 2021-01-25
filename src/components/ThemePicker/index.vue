<template>
  <ColorPicker v-model="appTheme" :colors="perdefine" size="small" />
</template>

<script>
import { getStorage } from '@/utils/tools';

export default {
  name: 'ThemePicker',
  data() {
    return {
      localChalk: '', // 主题样式
      original: '#2d8cf0', // viewUI默认颜色
      appTheme: getStorage('theme') || this.$config.theme.primary, // 默认主题颜色
      perdefine: [
        '#2d8cf0',
        '#19be6c',
        '#13c2c2',
        '#ff9800',
        '#ee3f16',
        '#212121',
        '#ee7c96',
        '#e46cba',
        '#9866e2',
        '#6959CD',
        '#f5222d'
      ] // 默认可选择颜色
    };
  },
  watch: {
    async appTheme(val) {
      // 更换主题颜色
      this.changeTheme(val);

      // 存储到localStorage
      this.$emit('on-change-theme', val);
    }
  },
  mounted() {
    if (this.original !== this.appTheme) {
      this.changeTheme(this.appTheme);
    }
  },
  methods: {
    updateStyle(style, oldCluster, newCluster) {
      let newStyle = style;
      oldCluster.forEach((color, index) => {
        newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index]);
      });
      return newStyle;
    },
    getCSSString(url) {
      const _this = this;
      return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4 && xhr.status === 200) {
            _this.localChalk = xhr.responseText.replace(
              /@font-face{[^}]+}/,
              ''
            );
            resolve(_this.localChalk);
          }
        };
        xhr.open('GET', url);
        xhr.send();
      });
    },
    getThemeCluster(theme) {
      const tintColor = (color, tint) => {
        let red = parseInt(color.slice(0, 2), 16);
        let green = parseInt(color.slice(2, 4), 16);
        let blue = parseInt(color.slice(4, 6), 16);

        if (tint === 0) {
          // when primary color is in its rgb space
          return [red, green, blue].join(',');
        } else {
          red += Math.round(tint * (255 - red));
          green += Math.round(tint * (255 - green));
          blue += Math.round(tint * (255 - blue));

          red = red.toString(16);
          green = green.toString(16);
          blue = blue.toString(16);

          return `#${red}${green}${blue}`;
        }
      };
      const shadeColor = (color, shade) => {
        let red = parseInt(color.slice(0, 2), 16);
        let green = parseInt(color.slice(2, 4), 16);
        let blue = parseInt(color.slice(4, 6), 16);

        red = Math.round((1 - shade) * red);
        green = Math.round((1 - shade) * green);
        blue = Math.round((1 - shade) * blue);

        red = red.toString(16);
        green = green.toString(16);
        blue = blue.toString(16);

        return `#${red}${green}${blue}`;
      };

      const clusters = [theme];
      for (let i = 0; i <= 9; i++) {
        clusters.push(tintColor(theme, Number((i / 10).toFixed(2))));
      }
      clusters.push(shadeColor(theme, 0.1));
      return clusters;
    },
    changeTheme(theme) {
      if (typeof theme !== 'string') {
        return;
      }

      const getHandler = (variable, id) => {
        let styleTag = document.getElementById(id);
        if (!styleTag) {
          styleTag = document.createElement('style');
          styleTag.setAttribute('id', id);
          document.head.appendChild(styleTag);
        }

        const originalCluster = this.getThemeCluster(
          this.original.replace('#', '')
        );
        const themeCluster = this.getThemeCluster(theme.replace('#', ''));
        const newStyle = this.updateStyle(
          variable,
          originalCluster,
          themeCluster
        );

        // 写入样式
        styleTag.innerText = newStyle;
      };

      if (!this.localChalk) {
        const version = require('view-design/package.json').version;
        const url = `https://unpkg.com/view-design@${version}/dist/styles/iview.css`;
        this.getCSSString(url).then(() => {
          return getHandler(this.localChalk, 'chalk-style');
        });
      } else {
        return getHandler(this.localChalk, 'chalk-style');
      }
    }
  }
};
</script>

<style lang="less">
.ivu-color-picker {
  margin-right: 18px;
}
@import './index.less';
</style>
