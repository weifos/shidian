//测试环境  
//let domain = "http://ns.api.nongshang.com/"
//let res_domain = "https://ns.res.nongshang.com/"
//正式环境
let domain = "https://api.szmay.com/"
let res_domain = "http://res.szmay.com/"

/// <summary>
/// 全局配置类
/// @author   叶委  
/// @date     2014-05-23         
/// </summary>
module.exports = {
  //资源站点
  res : res_domain,
  //微信授权
  api_100 : domain + "100",
  //根据openid自动登录
  api_101 : domain + "101",
  //获取微信wxconfig
  api_102 : domain + "102",
  // 103 注册，小程序初始化微信用户 第一步 
  api_103: domain + "103",
  //注册，第二步绑定手机号码
  api_104: domain + "104",
  //第三步，小程序注册，授权完善微信用户数据 
  api_105: domain + "105",
  //加载用户数据
  api_106: domain + "106",
  //发送验证码
  api_110 : domain + "110",
  //用户登录
  api_120 : domain + "120",
  //用户注册
  api_121 : domain + "121",
  //找回密码
  api_122 : domain + "122",
  //更新密码
  api_123 : domain + "123",
  //绑定新手机号
  api_124 : domain + "124",
  //首页接口
  api_200 : domain + "200",
  //栏目列表
  api_201 : domain + "201",
  //商品详情
  api_202 : domain + "202",
  //商品库存详情
  api_203 : domain + "203",
  //店铺分类
  api_204 : domain + "204",
  //清空购物车
  api_205 : domain + "205",
  //删除购物车
  api_206 : domain + "206",
  //更新购物车
  api_207 : domain + "207",
  //获取购物车
  api_208 : domain + "208",
  //去借阅
  api_209 : domain + "209",
  //底部栏目
  api_210 : domain + "210",
  //头部搜索
  api_211 : domain + "211",
  //公司信息
  api_212 : domain + "212",
  //查询结果页
  api_213 : domain + "213",
  //加入收藏
  api_300 : domain + "300",
  //是否收藏
  api_301 : domain + "301",
  //取消收藏
  api_302 : domain + "302",
  //会员申请成功
  api_303 : domain + "303",
  //认证成功查看会员卡信息
  api_304 : domain + "304",
  //获取借书记录
  api_305 : domain + "305",
  //获取逾期记录
  api_306 : domain + "306",
  //支付借书罚金
  api_307 : domain + "307",
  //申请还书
  api_308 : domain + "308",
  //罚金单
  api_309 : domain + "309",
  //状态码
  state: {
      // 系统错误
      state_500: 500,
      // 响应成功 
      state_200: 200,
      // 验证通过 
      state_0: 0,
      // 验证未通过
      state_1: 1,
      // 用户未登陆
      state_30045: 30045
  }
}