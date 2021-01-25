<template>
  <div class="avatar-dropdown">
    <Dropdown trigger="click" placement="bottom-end" @on-click="handleClick">
      <Badge :dot="!!unreadCount">
        <Avatar v-if="avatar" :src="avatar" size="default" />
        <Icon v-else type="ios-contact" size="38" />
        <span>{{ realName || 'Wecut' }}</span>
      </Badge>
      <Icon :size="20" type="md-arrow-dropdown" />
      <DropdownMenu slot="list">
        <DropdownItem>
          <Icon type="ios-contact-outline" size="18" />
          {{ userName || '--' }}
        </DropdownItem>
        <DropdownItem v-if="!isHideMenu" name="reset">
          <Icon type="ios-create-outline" size="18" />
          修改密码
        </DropdownItem>
        <DropdownItem name="logout" divided>
          <Icon type="ios-log-out" size="18"></Icon>
          退出登录
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
import apiAuth from '@/api/auth';
export default {
  name: 'User',
  props: {
    isHideMenu: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      modalOption: {}
    };
  },
  computed: {
    avatar() {
      return this.$store.state.auth.account.avatar;
    },
    userName() {
      return this.$store.state.auth.account.userName;
    },
    realName() {
      return this.$store.state.auth.account.realName;
    },
    unreadCount() {
      return this.$store.state.auth.unreadCount;
    }
  },
  methods: {
    ...mapMutations(['cleanTagNavList']),
    ...mapActions(['actionLogout']),
    logout() {
      this.handleSubmitLogout();
      this.actionLogout();
      this.cleanTagNavList();
      setTimeout(() => {
        this.$router.push({
          name: 'refresh'
        });
      }, 100);
    },
    handleClick(name) {
      switch (name) {
        case 'logout':
          this.logout();
          break;
        case 'reset':
          this.$router.push({
            name: 'reset_password'
          });
          break;
      }
    },
    // 退出登录
    async handleSubmitLogout() {
      const res = await apiAuth.logout();
      if (res.code === 1) {
        // this.$Message.success('退出成功');
      } else {
        return this.$Message.error(res.msg);
      }
    }
  }
};
</script>

<style lang="less">
.avatar-dropdown {
  cursor: pointer;
  display: flex;
  align-items: center;
  .ivu-badge-dot {
    top: 16px;
  }
  .ivu-dropdown-rel {
    .ivu-icon-ios-contact {
      vertical-align: middle;
    }
    .ivu-icon-md-arrow-dropdown {
      vertical-align: middle;
    }
  }
}
</style>
