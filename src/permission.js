//权限控制
import router from './router'
import store from './store'
import {
    Message
} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {
    getToken
} from '@/utils/auth' // get token from cookie
import Layout from '@/layout'
import permission from './store/modules/permission'
const _import = require('./router/_import_' + process.env.NODE_ENV)
// const _import = null
NProgress.configure({
    showSpinner: false
}) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
    // start progress bar
    NProgress.start()


    // determine whether the user has logged in
    const hasToken = getToken('Admin-Token')

    if (hasToken) {
        if (to.path === '/login') {
            // if is logged in, redirect to the home page
            next({
                path: '/'
            })
            NProgress.done()
        } else {
            // determine whether the user has obtained his permission roles through getInfo
            const hasRoles = store.getters.roles && store.getters.roles.length > 0
            if (hasRoles) {
                next()
            } else {
                try {
                    // get user info
                    // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
                    const {
                        roles
                    } = await store.dispatch('user/getInfo')
                    // await store.dispatch('user/getInfo')
                    // console.log(store.getters.menus)
                    if (store.getters.menus.length < 1) {
                        global.antRouter = []
                        next()
                    }
                    const menus = filterAsyncRouter(store.getters.menus) //1.过滤路由
                    router.addRoutes(menus) //2.动态添加路由
                    global.antRouter = menus //3.将路由数据传递给全局变量，做侧边栏菜单渲染工作
                    // permission.commit('SET_ROUTES', menus)
                    // resolve(accessedRoutes)
                    // generate accessible routes map based on roles
                    // const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
                    // dynamically add accessible routes
                    // router.addRoutes(accessRoutes)

                    // hack method to ensure that addRoutes is complete
                    // set the replace: true, so the navigation will not leave a history record
                    next({
                        ...to,
                        replace: true
                    })
                } catch (error) {
                    // remove token and go to login page to re-login
                    await store.dispatch('user/resetToken')
                    Message.error(error || 'Has Error')
                    next(`/login?redirect=${to.path}`)
                    NProgress.done()
                }
            }
        }
    } else {
        /* has no token*/

        if (whiteList.indexOf(to.path) !== -1) {
            // in the free login whitelist, go directly
            next()
        } else {
            // other pages that do not have permission to access are redirected to the login page.
            next(`/login?redirect=${to.path}`)
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    // finish progress bar
    NProgress.done()
})

function filterAsyncRouter(asyncRouterMap) {
    const accessedRouters = asyncRouterMap.filter(route => {
        if (route.component) {
            if (route.component === 'Layout') {
                route.component = Layout
            } else {
                route.component = _import(route.component) // 导入组件
            }
        }
        if (route.children && route.children.length) {
            route.children = filterAsyncRouter(route.children)
        }
        return true
    })
    return accessedRouters
}