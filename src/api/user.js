import request from '@/utils/request'

export function login(data) {

  return request({
    url: '/user/login',
    method: 'post',
    data: data
  })
}

export function getInfo(token, username) {

  return request({
    url: '/user/info',
    method: 'get',
    params: {
      token,
      username
    }

  })

}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
//更新用户
export function updateUser(userInfo) {
  return request({
    url: '/user/updateUser',
    method: 'post',
    params: {
      userInfo
    }
  })
}
//删除用户
export function removeUser(userInfo) {
  return request({
    url: '/user/removeUser',
    method: 'post',
    params: {
      userInfo
    }
  })
}
export function batchDelUser(ids) {
  return request({
    url: '/user/delUser',
    method: 'post',
    params: {
      'ids': ids
    }
  })
}
//获取所有用户信息
export function getUserList(params) {
  return request({
    url: '/user/queryUser',
    method: 'get',
    params: {
      params
    }
  })
}
//添加用户
export function addUser(userInfo) {
  return request({
    url: '/user/addUser',
    method: 'post',
    params: {
      userInfo
    }
  })
}