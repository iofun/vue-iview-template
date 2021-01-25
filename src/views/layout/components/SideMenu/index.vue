<template>
  <div class="side-menu-wrapper">
    <template v-if="useGroup">
      <Menu
        v-show="!collapsed"
        ref="menu"
        :active-name="activeName"
        :theme="theme"
        width="auto"
        @on-select="handleSelect"
      >
        <template v-for="(menuItem,index) in sideMenuList">
          <template v-if="menuItem.children">
            <MenuGroup :key="index" :title="showTitle(menuItem)">
              <MenuItem
                v-for="item in menuItem.children"
                :key="`menu-${item.name}`"
                :name="getNameOrHref(item)"
              >
                <common-icon :type="item.icon || ''" />
                <span>{{ showTitle(item) }}</span>
              </MenuItem>
            </MenuGroup>
          </template>
        </template>
        </MenuGroup>
      </Menu>
    </template>
    <template v-else>
      <!--左侧菜单收起之前 -->
      <Menu
        v-show="!collapsed"
        ref="menu"
        :active-name="activeName"
        :open-names="openedNames"
        :accordion="accordion"
        :theme="theme"
        width="auto"
        @on-select="handleSelect"
      >
        <template v-for="item in sideMenuList">
          <template v-if="item.children && item.children.length === 1">
            <side-menu-item
              v-if="showChildren(item)"
              :key="`menu-${item.name}`"
              :parent-item="item"
            />
            <menu-item
              v-else
              :key="`menu-${item.children[0].name}`"
              :name="getNameOrHref(item, true)"
            >
              <common-icon :type="item.children[0].icon || ''" />
              <span>{{ showTitle(item.children[0]) }}</span>
            </menu-item>
          </template>
          <template v-else>
            <side-menu-item
              v-if="showChildren(item)"
              :key="`menu-${item.name}`"
              :parent-item="item"
            />
            <menu-item
              v-else
              :key="`menu-${item.name}`"
              :name="getNameOrHref(item)"
            >
              <common-icon :type="item.icon || ''" />
              <span>{{ showTitle(item) }}</span>
            </menu-item>
          </template>
        </template>
      </Menu>
    </template>
    <!-- 左侧菜单收起之后 -->
    <div
      v-show="collapsed"
      class="menu-collapsed"
      :list="sideMenuList"
    >
      <template v-for="item in sideMenuList">
        <collapsed-menu
          v-if="item.children && item.children.length > 1"
          :key="`drop-menu-${item.name}`"
          hide-title
          :root-icon-size="rootIconSize"
          :icon-size="iconSize"
          :theme="theme"
          :parent-item="item"
          @on-click="handleSelect"
        />
        <Tooltip
          v-else
          :key="`drop-menu-${item.name}`"
          transfer
          :content="showTitle(item.children && item.children[0] ? item.children[0] : item)"
          placement="right"
        >
          <a
            class="drop-menu-a"
            :style="{ textAlign: 'center' }"
            @click="handleSelect(getNameOrHref(item, true))"
          >
            <common-icon
              :size="rootIconSize"
              :color="textColor"
              :type="item.icon || (item.children && item.children[0].icon)"
            />
          </a>
        </Tooltip>
      </template>
    </div>
  </div>
</template>
<script>
import SideMenuItem from './components/SideMenuItem.vue';
import CollapsedMenu from './components/CollapsedMenu.vue';
import { getUnion } from '@/utils/tools';
import mixin from './components/mixin';
import { mapMutations } from 'vuex';

export default {
  name: 'SideMenu',
  components: {
    SideMenuItem,
    CollapsedMenu
  },
  mixins: [mixin],
  props: {
    sideMenuList: {
      type: Array,
      default() {
        return [];
      }
    },
    collapsed: {
      type: Boolean
    },
    theme: {
      type: String,
      default: 'dark'
    },
    rootIconSize: {
      type: Number,
      default: 20
    },
    iconSize: {
      type: Number,
      default: 14
    },
    accordion: Boolean,
    activeName: {
      type: String,
      default: ''
    },
    openNames: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      openedNames: []
    };
  },
  computed: {
    textColor() {
      return this.theme === 'dark' ? '#fff' : '#495060';
    },
    useGroup() {
      return !!this.$config.sideMenuGroup;
    }
  },
  watch: {
    activeName(name) {
      if (this.accordion) this.openedNames = this.getOpenedNamesByActiveName(name);
      else this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name));
    },
    openNames(newNames) {
      this.openedNames = newNames;
    },
    openedNames() {
      this.$nextTick(() => {
        if (this.$route.path === '/refresh') return;
        this.$refs.menu.updateOpened();
        // this.$refs.menu.updateActiveName();
      });
    }
  },
  mounted() {
    this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name));
    this.saveAppMenuId(this.activeName);
  },
  methods: {
    ...mapMutations(['setMenuId']),
    handleSelect(name) {
      // console.log(name)
      this.$emit('on-select', name);
      this.saveAppMenuId(name);
    },
    getOpenedNamesByActiveName(name) {
      return this.$route.matched.map((item) => item.name).filter((item) => item !== name);
    },
    updateOpenName(name) {
      if (name === this.$config.pageName.home) this.openedNames = [];
      else this.openedNames = this.getOpenedNamesByActiveName(name);
    },
    // 存储选中应用ID
    saveAppMenuId(name) {
      const list = this.$store.getters.appMenuList;
      // console.log(list)
      for (const i in list) {
        const itemArr = list[i].children;
        // console.log(itemArr)
        for (const i in itemArr) {
          const element = itemArr[i];
          if (element.name === name) {
            // console.log(element)
            // this.setMenuId(element.data.id);
            return;
          }
        }
      }
    }
  }
};
</script>
<style lang="less">
  @import './index.less';
</style>
