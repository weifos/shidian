//测试环境  
let domain = "http://sd.api.shidian.com/"
let res_domain = "http://sd.res.shidian.com/"
//正式环境
//let domain = "http://sd.api.weifos.com/"
//let res_domain = "http://sd.res.shidian.com/"

/// <summary>
/// 全局配置类
/// @author   叶委  
/// @date     2014-05-23         
/// </summary>
module.exports = {
  //资源站点
  res: res_domain,
  //微信授权
  api_100: domain + "100",
  //根据openid自动登录
  api_101: domain + "101",
  //获取微信wxconfig
  api_102: domain + "102",
  // 103 注册，小程序初始化微信用户 第一步 
  api_103: domain + "103",
  //注册，第二步绑定手机号码
  api_104: domain + "104",
  //第三步，小程序注册，授权完善微信用户数据 
  api_105: domain + "105",
  //加载用户数据
  api_106: domain + "106",
  //发送验证码
  api_110: domain + "110",
  //用户登录
  api_120: domain + "120",
  //用户注册
  api_121: domain + "121",
  //找回密码
  api_122: domain + "122",
  //更新密码
  api_123: domain + "123",
  //绑定新手机号
  api_124: domain + "124",
  //首页接口
  api_200: domain + "200",
  //咖啡页数据
  api_201: domain + "201",
  //咖啡列表数据
  api_202: domain + "202",
  //加载商品详情
  api_203: domain + "203",
  // 
  api_204: domain + "204",
  // 
  api_205: domain + "205",
  // 
  api_206: domain + "206",
  // 
  api_207: domain + "207",
  // 
  api_208: domain + "208",
  //
  api_209: domain + "209",
  //
  api_210: domain + "210",
  //
  api_211: domain + "211",
  //
  api_212: domain + "212",
  //
  api_213: domain + "213",
  //
  api_300: domain + "300",
  //
  api_301: domain + "301",
  //获取购物车
  api_302: domain + "302",
  //更新购物车
  api_303: domain + "303",
  //删除购物车
  api_304: domain + "304",
  //
  api_305: domain + "305",
  //加入购物车
  api_306: domain + "306",
  //
  api_307: domain + "307",
  //
  api_308: domain + "308",
  //
  api_309: domain + "309",
  //
  api_310: domain + "310",
  //
  api_311: domain + "311",
  //
  api_312: domain + "312",
  //
  api_313: domain + "313",
  //创建咖啡订单
  api_314: domain + "314",
  //微信小程序预支付订单
  api_317: domain + "317",

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