export default {
  skin_url: '/tinymce/skins/ui/oxide',
  content_css: '/tinymce/skins/content/default/content.css',
  language_url: '/tinymce/langs/zh_CN.js',
  language: 'zh_CN',
  height: document.body.offsetHeight - 200,
  tooltips: true,
  // 多余工具是否3点省略号显示
  toolbar_drawer: false,
  // 拼写检查
  browser_spellcheck: true,
  // 去水印
  branding: false,
  // 禁用编辑器底部的状态栏
  elementpath: false,
  // 隐藏编辑器底部的状态栏
  statusbar: false,
  // 允许粘贴图像
  paste_data_images: true,
  // 隐藏最上方menu
  menubar: false,
  /* 字体大小设置*/
  fontsize_formats: '10px 11px 12px 13px 14px 16px 18px 24px 36px 42px',
  plugins: 'linkBtn advlist table lists paste fullscreen',
  toolbar: `undo redo bold italic underline strikethrough | 
            fontsizeselect forecolor backcolor | 
            alignleft aligncenter alignright alignjustify | 
            linkBtn imageUpload | fullscreen`
};
