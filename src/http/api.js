const API = {
  baseURL: 'http://127.0.0.1:8888/api/private/v1/',
  login: '/login',
  menus: '/menus',
  //用户接口
  users: '/users',
  //“修改”与“删除”用户接口
  usersEdit: '/users/:id',
  //动态接口
  userState: '/users/:id/state/:type'
}

export default API
