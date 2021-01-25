<template>
  <div class="custom-bread-crumb">
    <Breadcrumb :style="{ fontSize: `${fontSize}px` }">
      <BreadcrumbItem v-for="item in list" :key="`bread-crumb-${item.name}`" :to="item.to">
        <CommonIcon :type="item.icon || ''" />
        {{ showTitle(item) }}
      </BreadcrumbItem>
    </Breadcrumb>
  </div>
</template>

<script>
import { showTitle } from '@/utils/util';
import CommonIcon from '@/components/CommonIcon';
export default {
  name: 'CustomBreadCrumb',
  components: {
    CommonIcon
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    fontSize: {
      type: Number,
      default: 14
    },
    showIcon: {
      type: Boolean,
      default: false
    }
  },
  mounted() {},
  methods: {
    showTitle(item) {
      return showTitle(item, this);
    },
    isCustomIcon(iconName) {
      return iconName.indexOf('_') === 0;
    },
    getCustomIconName(iconName) {
      return iconName.slice(1);
    }
  }
};
</script>
<style lang="less" scoped>
.custom-bread-crumb {
  display: flex;
  margin-left: 24px;
  .ivu-icon {
    vertical-align: middle;
    margin-top: -3px;
  }
}
</style>
