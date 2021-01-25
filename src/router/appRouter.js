import AppLayout from '@/views/layout';

// 系统应用路由
export const appRouter = [
  {
    path: '/demo',
    name: '_demo',
    meta: {
      icon: 'md-settings',
      title: '示例',
      hideInMenu: false
    },
    component: AppLayout,
    children: [
      {
        path: 'index',
        name: '_demo_menu',
        meta: {
          icon: 'ios-paper',
          title: '示例菜单'
        },
        component: () => import('@/views/demo/index.vue')
      }
    ]
  }
];

export default appRouter;

