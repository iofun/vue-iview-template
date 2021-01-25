import AppLayout from '@/views/layout';

/**
 * redirect: '/index', //重定向地址
 * meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 *  showAlways: (false) 设为true后此路由即使有一个二级路由都会折叠
 *
 * }
 */

// 固定框架路由（不需要修改）
export const baseRouter = [
  // 首页
  {
    path: '/',
    name: 'home',
    redirect: {
      name: 'console'
    },
    component: AppLayout,
    meta: {
      icon: 'md-home',
      title: '首页',
      hideInMenu: true,
      showAlways: false
    },
    children: [
      {
        path: '/console',
        name: 'console',
        meta: {
          title: '控制台',
          icon: 'md-cube'
        },
        component: () => import('@/views/console/console.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '用户登录',
      icon: 'ios-log-in',
      hideInMenu: true
    },
    component: () => import('@/views/auth/login.vue')
  },
  {
    path: '/register',
    name: 'register',
    meta: {
      title: '注册帐号',
      hideInMenu: true
    },
    component: () => import('@/views/auth/register.vue')
  },
  {
    path: '/forget',
    name: 'forget',
    meta: {
      title: '忘记密码',
      hideInMenu: true
    },
    component: () => import('@/views/auth/forget.vue')
  },
  {
    path: '/reset/:md5',
    name: 'reset_md5',
    meta: {
      title: '重置密码',
      hideInMenu: true
    },
    component: () => import('@/views/auth/reset.vue')
  },
  {
    path: '/reset_password',
    name: '_reset_password',
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    component: AppLayout,
    children: [
      {
        path: '/reset_password',
        name: 'reset_password',
        meta: {
          icon: 'ios-create-outline',
          title: '重置密码'
        },
        component: () => import('@/views/auth/reset_password.vue')
      }
    ]
  },
  {
    path: '/refresh',
    name: 'refresh',
    meta: {
      hideInMenu: true,
      hideInBread: true,
      notCache: true
    },
    component: () => import('@/views/refresh/refresh.vue')
  },
  {
    path: '/403',
    name: 'error_403',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/views/error/403.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/views/error/500.vue')
  },
  {
    path: '/404',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/views/error/404.vue')
  }
];

export default baseRouter;
