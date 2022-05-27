import requests from './request'
import mockRequests from './mock'
// 首页三级联动
export const reqCategoryList = () => {
  return requests({
    method: 'GET',
    url: '/product/getBaseCategoryList',
  })
}
// 首页轮播图
export const reqGetBannerList = () => {
  return mockRequests({
    url: '/mock/banner',
  })
}
// 首页楼层轮播图
export const reqFloorList = () => {
  return mockRequests({
    url: '/mock/floor',
  })
}
/**
 * 搜索模块 post
 * 需要携带10个参数 可以不穿 但至少是一个空对象
 */
export const reqGetSearchInfo = params => {
  return requests({
    method: 'POST',
    url: '/list',
    data: params,
  })
}
/**
 * 商品详情模块
 * 需要传递商品的id
 */
export const reqGoodsInfo = skuId => {
  return requests({
    method: 'GET',
    url: `/item/${skuId}`,
  })
}
/**
 * 将产品添加到购物车中 || 或者更新某个产品的个数
 * 需要传递 产品的id 和 个数
 */
export const reqAddOrUpdateShopCart = (skuId, skuNum) => {
  return requests({
    method: 'POST',
    url: `/cart/addToCart/${skuId}/${skuNum}`,
  })
}
/**
 * 获取购物车列表
 */
export const reqCartList = () => {
  return requests({
    method: 'GET',
    url: '/cart/cartList',
  })
}
/**
 * 删除商品
 * 传递产品的id
 */
export const reqDeleteCartById = skuId => {
  return requests({
    method: 'DELETE',
    url: `/cart/deleteCart/${skuId}`,
  })
}
/**
 * 切换商品选中状态
 * 产品的id 和 选中状态 0未选中 1表示选中
 */
export const reqUpdateCheckdById = (skuId, isChecked) => {
  return requests({
    method: 'GET',
    url: `/cart/checkCart/${skuId}/${isChecked}`,
  })
}
/**
 * 获取短信验证码
 * 手机号
 */
export const reqGetCode = phone => {
  return requests({
    method: 'GET',
    url: `/user/passport/sendCode/${phone}`,
  })
}
/**
 * 注册
 * 手机号 密码 验证码
 */

export const reqUserRegister = data => {
  return requests({
    method: 'POST',
    url: '/user/passport/register',
    data,
  })
}
/**
 * 登陆
 * 手机号 密码
 */
export const reqUserLogin = data => {
  return requests({
    method: 'POST',
    url: '/user/passport/login',
    data,
  })
}
/**
 * 获取用户信息
 * 需要携带用户token(请求头)
 */
export const reqUserInfo = () => {
  return requests({
    method: 'GET',
    url: '/user/passport/auth/getUserInfo',
  })
}
/**
 * 退出登陆
 */
export const reqLogout = () => {
  return requests({
    method: 'GET',
    url: '/user/passport/logout',
  })
}
/**
 * 获取用户地址信息
 */
export const reqAddressInfo = () => {
  return requests({
    method: 'GET',
    url: '/user/userAddress/auth/findUserAddressList',
  })
}
/**
 * 获取商品送货清单
 */
export const reqOrderInfo = () => {
  return requests({
    method: 'GET',
    url: '/order/auth/trade',
  })
}
/**
 * 提交订单
 * 订单号 和 六个用户信息
 */

export const reqSubmitOrder = (tradeNo, data) => {
  return requests({
    method: 'POST',
    url: `/order/auth/submitOrder?tradeNo=${tradeNo}`,
    data,
  })
}
/**
 * 获取订单支付信息
 * 订单id
 */
export const reqPayInfo = orderId => {
  return requests({
    method: 'GET',
    url: `/payment/weixin/createNative/${orderId}`,
  })
}
/**
 * 查询支付状态
 * 订单id
 */
export const reqPayStatus = orderId => {
  return requests({
    method: 'GET',
    url: `/payment/weixin/queryPayStatus/${orderId}`,
  })
}
/**
 * 订单列表
 * page 当前第几页
 * limit 每页显示数量
 */
export const reqMyOrderList = (page, limit) => {
  return requests({
    method: 'GET',
    url: `/order/auth/${page}/${limit}`,
  })
}
