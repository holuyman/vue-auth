import {
  asyncRoutes,
  constantRoutes
} from '@/router'
import {
  getRoutes
} from '@/api/role'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = {
      ...route
    }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    debugger
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  // generateRoutes({
  //   commit
  // }, roles) {
  //   return new Promise(resolve => {
  //     let accessedRoutes
  //     debugger
  //     if (roles.includes('admin')) {
  //       accessedRoutes = asyncRoutes || []
  //       console.log(accessedRoutes)
  //       // getRoutes('admin').then(res => {
  //       //   accessedRoutes = res.data || []
  //       //   commit('SET_ROUTES', accessedRoutes)
  //       //   resolve(accessedRoutes)
  //       // })
  //       // console.log(routes)
  //       // accessedRoutes = asyncRoutes || []
  //       // getRoutes('admin')
  //     } else {
  //       // getRoutes(roles).then(res => {
  //       //   accessedRoutes = res.data || []
  //       //   commit('SET_ROUTES', accessedRoutes)
  //       //   resolve(accessedRoutes)
  //       // })
  //       accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
  //       // getRoutes(roles)
  //     }
  //     commit('SET_ROUTES', accessedRoutes)
  //     resolve(accessedRoutes)

  //   })
  // }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}