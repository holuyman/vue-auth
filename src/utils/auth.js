import Cookies from 'js-cookie'

// const TokenKey = 'Admin-Token'

export function getToken(token) {
  return Cookies.get(token)
}

export function setToken(tokenname, token) {
  return Cookies.set(tokenname, token)
}

export function removeToken() {
  let result = false
  for (var i in Cookies.get()) {
    result = Cookies.remove(i)
  }
  return result
  // return Cookies.remove(TokenKey)
}