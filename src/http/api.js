const API = {
  baseURL: 'http://127.0.0.1:8888/api/private/v1/',
  login: '/login',
  menus: '/menus',
  //用户接口
  users: '/users',
  //动态接口
  userState: '/users/:id/state/:type',
  roles: '/roles',
  users_find: '/users/find',
  users_update: '/users/update',
  users_delete: '/users/delete'
}

export default API
