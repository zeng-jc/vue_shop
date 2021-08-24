<template></template>

<script>
export default {
  created() {},
  methods: {
    //示例：设置用户状态。需要动态携带用户“id”与“修改后的状态”
    setUserState() {
      const { data: result } = await this.$http({
        method: 'put',
        //这里的动态接口写法模仿的是vue的动态路由
        //这里 params 携带的是动态参数 key 需要与 api 接口中的 :id、:type 对应
        //你只需要保证携带的参数 key 值与 api 接口中的 :xx 一致
        url: {
          name: 'userState',
          params: {
            id: userinfo.id,
            type: userinfo.mg_state,
          },
        },
      })
    },
  },
}
</script>

<style>
</style>