import CommonIcon from '@/components/CommonIcon';
import { showTitle } from '@/utils/util';
export default {
  components: {
    CommonIcon
  },
  methods: {
    showTitle(item) {
      return showTitle(item, this);
    },
    showChildren(item) {
      return item.children && (item.children.length > 1 || (item.meta && item.meta.showAlways));
    },
    getNameOrHref(item, children0) {
      return item.href ? `isTurnByHref|${item.href}` : (children0 ? item.children[0].name : item.name);
    }
  }
};
