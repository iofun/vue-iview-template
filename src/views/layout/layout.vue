<template>
  <Layout class="app-layout">
    <Sider
      v-if="!isHideMenu"
      v-model="collapsed"
      hide-trigger
      collapsible
      :width="siderWidth"
      breakpoint="lg"
      :collapsed-width="collapsedWidth"
      class="left-sider"
      :style="{ overflow: 'hidden' }"
    >
      <!-- 系统logo -->
      <div class="logo-con">
        <h2 v-show="!collapsed" class="title">{{ appName }}</h2>
        <img v-show="collapsed" key="min-logo" :src="minLogo" />
      </div>

      <!-- 左侧菜单内容 -->
      <SideMenu
        ref="sideMenu"
        accordion
        :active-name="$route.name"
        :collapsed="collapsed"
        :side-menu-list="sideMenuList"
        @on-select="turnToPage"
      ></SideMenu>
    </Sider>
    <Layout>
      <!-- 顶部内容 -->
      <Header class="header-con">
        <HeaderBar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <!-- 全屏 -->
          <FullScreen v-if="$config.isOpenFullScreen" v-model="isFullScreen" />
          <!-- 主题选择 -->
          <ThemePicker v-if="$config.isOpenThemePicker" @on-change-theme="setTheme" />
          <!-- 用户信息 -->
          <User :is-hide-menu="isHideMenu"></User>
        </HeaderBar>
      </Header>
      <!-- 中间内容 -->
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <Content class="content-wrapper">
            <keep-alive :include="cacheList">
              <router-view />
            </keep-alive>
            <!-- 返回顶部 -->
            <BackTop :height="100" :bottom="50" :right="20" container=".content-wrapper" />
          </Content>
          <!-- 接口loading -->
          <Loading></Loading>
        </Layout>
      </Content>
    </Layout>
  </Layout>
</template>
<script>
import SideMenu from './components/SideMenu';
import HeaderBar from './components/HeaderBar';
import User from './components/User';
import BackTop from './components/BackTop';
import FullScreen from './components/FullScreen';
import ThemePicker from '@/components/ThemePicker';
import Loading from '@/components/Loading';
import { mapMutations } from 'vuex';
import { getNewTagList, routeEqual } from '@/utils/util';
import baseRouter from '@/router/baseRouter';
import minLogo from '@/assets/images/logo-min.jpg';
export default {
  name: 'AppLayout',
  components: {
    SideMenu,
    HeaderBar,
    ThemePicker,
    FullScreen,
    User,
    Loading,
    BackTop
  },
  data() {
    return {
      collapsed: false,
      siderWidth: 230,
      md: '768px',
      lg: '992px',
      xl: '1200px',
      collapsedWidth: 80,
      minLogo,
      isFullScreen: false,
      isHideMenu: false,
      hasSuperAuth: false
    };
  },
  computed: {
    appName() {
      return this.$config.title;
    },
    tagNavList() {
      return this.$store.state.base.tagNavList || [];
    },
    tagRouter() {
      return this.$store.state.base.tagRouter;
    },
    cacheList() {
      const list = [
        'ParentView',
        ...(this.tagNavList.length
          ? this.tagNavList.filter((item) => !(item.meta && item.meta.notCache)).map((item) => item.name)
          : [])
      ];
      return list;
    },
    sideMenuList() {
      return this.$store.getters.appMenuList;
    },
    dynamicList() {
      return this.$store.state.auth.routeList;
    }
  },
  watch: {
    $route(newRoute) {
      const { name, query, params, meta } = newRoute;
      this.addTag({
        route: { name, query, params, meta },
        type: 'push'
      });
      this.setBreadCrumb(newRoute);
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute));
      this.$refs.sideMenu.updateOpenName(newRoute.name);
    }
  },
  beforeMount() {
    const urlPath = window.location.pathname;
    if (urlPath.indexOf('/orders/detail') > -1) {
      this.isHideMenu = true;
    }
  },
  mounted() {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    // 设置标签导航列表
    this.setTagNavList();

    // 主路由
    this.setHomeRoute(baseRouter);
    const { name, params, query, meta } = this.$route;
    this.addTag({
      route: { name, params, query, meta }
    });

    // 设置面包屑
    this.setBreadCrumb(this.$route);

    // 如果当前打开页面不在标签栏中，跳到home页
    if (!this.tagNavList.find((item) => item.name === this.$route.name)) {
      this.$router.push({
        name: this.$config.pageName.home
      });
    }

    // 判断是否有管理人员权限
    if (this.dynamicList.length > 0) {
      for (const key in this.dynamicList) {
        if (this.dynamicList.hasOwnProperty(key)) {
          const element = this.dynamicList[key];
          if (element.path.indexOf('/system') > -1) {
            this.hasSuperAuth = true;
            break;
          }
        }
      }
    }

    // console.log(this.hasSuperAuth);
  },
  methods: {
    ...mapMutations(['setBreadCrumb', 'setTagNavList', 'addTag', 'setTheme', 'setHomeRoute', 'closeTag']),
    turnToPage(route) {
      let { name, params, query } = {};
      if (typeof route === 'string') name = route;
      else {
        name = route.name;
        params = route.params;
        query = route.query;
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1]);
        return;
      }
      this.$router.push({
        name,
        params,
        query
      });
    },
    handleCollapsedChange(state) {
      this.collapsed = state;
    },
    handleCloseTag(res, type, route) {
      if (type !== 'others') {
        if (type === 'all') {
          this.turnToPage(this.$config.pageName.home);
        } else {
          if (routeEqual(this.$route, route)) {
            this.closeTag(route);
          }
        }
      }
      this.setTagNavList(res);
    },
    handleClick(item) {
      this.turnToPage(item);
    }
  }
};
</script>
<style lang="less">
@import './layout.less';
</style>
