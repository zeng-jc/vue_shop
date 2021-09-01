const API = {
  baseURL: 'http://127.0.0.1:8888/api/private/v1/',
  login: '/login',
  menus: '/menus',

  /**
   * users
   */
  // 获取用户数据列表，添加用户
  users: '/users',
  // “修改”与“删除”用户接口
  usersEdit: '/users/:id',
  // 修改用户状态
  userState: '/users/:id/state/:type',
  // 分配角色
  userAllotRole: 'users/:id/role',

  /**
   * power
   */
  // 获取权限列表（列表结构的数据）
  rightsList: '/rights/list',
  // 获取权限列表（树型结构的数据）
  rightsTree: '/rights/tree',
  // 获取角色列表
  roles: '/roles',
  // 删除、编辑角色
  rolesID: '/roles/:id',
  // 删除角色指定权限
  deleteRolesRights: 'roles/:roleId/rights/:rightId',
  // 角色授权
  addRights: 'roles/:roleId/rights',

  /**
   * product
   */
  // 分类数据列表，添加分类也是此接口（不同的是post请求）
  categories: 'categories',
  // 编辑删除操作
  categoriesID: 'categories/:id'
}

export default API
