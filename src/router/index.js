import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'
// import Home from '../views/Home.vue'

Vue.use(Router)
/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/homePage'),
      meta: {
        title: '主页',
        icon: 'homePage',
        affix: true
      }
    }, ]
  },

  {
    path: '/echarts',
    component: Layout,
    redirect: '/echarts/index',
    children: [{
      path: 'index',
      component: () => import('@/views/echarts/index'),
      name: 'echarts',
      meta: {
        title: 'echart',
        icon: 'homePage',
        affix: true
      }
    }]



  },

]

export const asyncRoutes = [{
    path: '/permission',
    name: 'UserManage',
    component: Layout,
    meta: {
      title: 'UserManage',
      icon: 'lock',
      roles: ['admin']
    },
    children: [{
      path: '/UserManage',
      name: 'UserManage',
      component: () =>
        import('../views/user/UserManage.vue'),
      meta: {
        title: '用户管理',
        icon: 'lock',
        roles: ['admin']
      }
    }]
  },
  {
    path: '/permission/role',
    name: '角色',
    component: Layout,
    meta: {
      title: '角色管理',
      icon: 'lock',
      roles: ['admin']
    },
    children: [{
      path: '/roles',
      name: 'roles',
      component: () =>
        import('../views/user/roles.vue'),
      meta: {
        title: '角色管理',
        icon: 'lock',
        roles: ['admin']
      }
    }]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
export default router