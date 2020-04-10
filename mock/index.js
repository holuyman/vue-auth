// 通过axios-mock-adapter生成代理api地址
// import axios from 'axios'
import Mock from 'mockjs'
// import MockAdapter from 'axios-mock-adapter'
import {
  param2Obj
} from '../src/utils'
import user from './user'
// import role from './role'
// import article from './article'
// import search from './remote-search'

const mocks = [
  ...user,
  // ...role,
  // ...article,
  // ...search
]
// import { LoginUsers } from './data/user'
// import {
//   users
// } from "./data/user";
// const users = [{
//     id: 1,
//     username: 'admin',
//     password: '123456',
//     email: '123456@qq.com',
//     name: '搬砖者',
//   },
//   {
//     id: 2,
//     username: 'lytton',
//     password: '123456',
//     email: 'yyyyy@163.com',
//     name: '混子',
//   },
// ]
export function mockXHR() {
  // mock patch
  // https://github.com/nuysoft/Mock/issues/300
  Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
  Mock.XHR.prototype.send = function () {
    if (this.custom.xhr) {
      this.custom.xhr.withCredentials = this.withCredentials || false

      if (this.responseType) {
        this.custom.xhr.responseType = this.responseType
      }
    }
    this.proxy_send(...arguments)
  }

  function XHR2ExpressReqWrap(respond) {
    return function (options) {
      let result = null
      if (respond instanceof Function) {
        const {
          body,
          type,
          url
        } = options
        // https://expressjs.com/en/4x/api.html#req
        result = respond({
          method: type,
          body: JSON.parse(body),
          query: param2Obj(url),
        })
      } else {
        result = respond
      }
      return Mock.mock(result)
    }
  }

  for (const i of mocks) {
    Mock.mock(
      new RegExp(i.url),
      i.type || 'get',
      XHR2ExpressReqWrap(i.response),
    )
  }
}
const responseFake = (url, type, respond) => {
  return {
    url: new RegExp(`${process.env.VUE_APP_BASE_API}${url}`),
    type: type || 'get',
    response(req, res) {
      console.log('request invoke:' + req.path)
      res.json(Mock.mock(respond instanceof Function ? respond(req, res) : respond))
    }
  }
}

export default mocks.map(route => {
  return responseFake(route.url, route.type, route.response)
})
// export default {
//   init() {
//     let mock = new MockAdapter(axios)

//     // mock success request  模拟成功请求
//     mock.onGet('/success').reply(200, {
//       msg: 'success',
//     })
//     // mock error request  模拟失败请求
//     mock.onGet('/error').reply(500, {
//       msg: 'failure',
//     })

//     // login 模拟登录接口
//     mock.onPost('/user/login').reply(config => {
//       // 解析axios传过来的数据
//       let {
//         username,
//         password
//       } = JSON.parse(config.data)
//       return new Promise((resolve, reject) => {
//         console.log(reject)
//         // 先创建一个用户为空对象
//         let user = null
//         setTimeout(() => {
//           // 判断模拟的假数据中是否有和传过来的数据匹配的
//           let hasUser = users.some(person => {
//             // 如果存在这样的数据
//             if (person.username === username && person.password === password) {
//               user = JSON.parse(JSON.stringify(person))
//               user.password = undefined
//               return true
//             } else {
//               //  如果没有这个person
//               return false
//             }
//           })
//           // 如果有那么一个人
//           if (hasUser) {
//             resolve([
//               200,
//               {
//                 code: 20000,
//                 msg: '登录成功',
//                 user,
//               },
//             ])
//           } else {
//             // 如果没有这么一个人
//             resolve([
//               200,
//               {
//                 code: 500,
//                 msg: '账号错误',
//               },
//             ])
//           }
//         }, 500)
//       })
//     })
//     //  模拟注册接口
//   },
// }