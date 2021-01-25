const global$1 = tinymce.util.Tools.resolve('tinymce.PluginManager');
const global$2 = tinymce.util.Tools.resolve('tinymce.util.VK');

export default class LinkBtn {
  constructor() {
    global$1.add('linkBtn', editor => {
      this.editor = editor;
      this.setupButtons(editor);
    });
  }
  setupButtons() {
    this.editor.ui.registry.addToggleButton('linkBtn', {
      icon: 'link',
      tooltip: '插入链接',
      onAction: this.onAction(),
      onSetup: this.setup()
    });
  }
  onAction() {
    return api => {
      const linkBtnClick = this.editor.getParam('linkBtnClick');
      const attrs = this.getAnchorAttrs();
      linkBtnClick && linkBtnClick(attrs);
    };
  }
  setup() {
    const editor = this.editor;

    return api => {
      // 设置状态
      const nodeChangeHandler = e => {
        return api.setActive(!editor.readonly && !!this.getAnchorElement(e.element));
      };
      editor.on('NodeChange', nodeChangeHandler);
      return () => editor.off('NodeChange', nodeChangeHandler);
    };
  }
  // 获取a标签
  getAnchorElement(selectedElm) {
    const editor = this.editor;

    selectedElm = selectedElm || editor.selection.getNode();

    return editor.dom.getParent(selectedElm, 'a[href]');
  }

  // 获取a标签的内容以及属性
  getAnchorAttrs() {
    const editor = this.editor;

    const anchor = this.getAnchorElement();

    const dom = editor.dom;
    const selectedHtml = editor.selection.getContent();
    const onlyText = this.isOnlyTextSelected(selectedHtml);

    const text = onlyText ? this.getAnchorText(editor.selection, anchor) : null;
    const href = anchor ? dom.getAttrib(anchor, 'href') : '#';
    const target = anchor ? dom.getAttrib(anchor, 'target') : null;
    const dataMethod = anchor ? dom.getAttrib(anchor, 'data-method') : null;
    const dataParams = anchor ? dom.getAttrib(anchor, 'data-params') : null;

    return {
      text,
      href,
      target,
      'data-method': dataMethod,
      'data-params': dataParams,
      onlyText
    };
  }

  // 获取a标签文本
  getAnchorText(selection, anchorElm) {
    const text = anchorElm ? anchorElm.innerText || anchorElm.textContent : selection.getContent({ format: 'text' });
    return text.replace(/\uFEFF/g, '');
  }
  // 设置链接
  setLink(options) {
    const _this = this;
    const editor = this.editor;
    const selectedElm = editor.selection.getNode();
    const anchorElm = this.getAnchorElement(selectedElm);

    let attrs = this.getAnchorAttrs();
    attrs = Object.assign(attrs, options);

    editor.undoManager.transact(function() {
      if (anchorElm) {
        editor.focus();
        _this.updateLink(editor, anchorElm, attrs);
      } else {
        _this.createLink(editor, attrs);
      }
    });
  }
  // 更新链接
  updateLink(editor, anchorElm, attrs) {
    // 如果是有文本的更新
    if (attrs.text) {
      if (anchorElm.hasOwnProperty('innerText')) {
        anchorElm.innerText = attrs.text;
      } else {
        anchorElm.textContent = attrs.text;
      }
    }
    console.log(attrs);
    editor.dom.setAttribs(anchorElm, attrs);
    editor.selection.select(anchorElm);
  }
  // 创建链接
  createLink(editor, attrs) {
    const defaultAttrs = this.getAnchorAttrs();
    if (!defaultAttrs.onlyText) {
      editor.execCommand('mceInsertLink', false, attrs);
    } else {
      editor.insertContent(editor.dom.createHTML('a', attrs, editor.dom.encode(attrs.text)));
    }
  }
  // 选取节点是否为图片
  isImg(elm) {
    return elm && elm.nodeName === 'IMG';
  }
  // 判断是否只选择了文本
  isOnlyTextSelected(html) {
    if (/</.test(html) && (!/^<a [^>]+>[^<]+<\/a>$/.test(html) || html.indexOf('href=') === -1)) {
      return false;
    }
    return true;
  }
}
