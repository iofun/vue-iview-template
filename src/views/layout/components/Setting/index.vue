<template>
  <div class="dropdown">
    <Dropdown trigger="click" @on-click="dropdownClick">
      <div class="title">
        <Icon type="md-settings"></Icon>
        <span class="name">系统设置</span>
      </div>
      <DropdownMenu slot="list">
        <DropdownItem name="user|用户管理">用户管理</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <div class="line"></div>
  </div>
</template>

<script>
export default {
  name: 'Setting',
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  methods: {
    dropdownClick(name) {
      // console.log(name);
      const key = name.split('|')[0];
      switch (key) {
        case 'user':
          this.$router.push({
            path: '/user/list'
          });
          break;
        case 'rate':
          this.$router.push({
            name: '_rate_list'
          });
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style lang="less">
.dropdown {
  position: relative;
  z-index: 998;
  display: flex;
  align-items: center;
  margin-right: 16px;
  cursor: pointer;
  .title {
    align-items: center;
    cursor: pointer;
    padding: 0 3px;
    .name {
      padding-left: 6px;
    }
  }
  .line {
    width: 1px;
    height: 38px;
    background: #dedede;
    margin-left: 16px;
  }
}
</style>
