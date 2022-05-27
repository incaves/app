/**
 * 游客身份
 * 生成一个随机的token 用于请求数据
 * 每次执行不能发生变化
 * 游客身份持久存储
 */
import { v4 as uuidv4 } from 'uuid'
export const getUUid = () => {
  // 先从本地存储中获取uuid(看一下本地存储里面是否有)
  let uuid_token = localStorage.getItem('UUIDTOKEN')
  // 如果没有(返回的是null) 生成uuid !uuid_token = true
  if (!uuid_token) {
    // 生成uuid
    uuid_token = uuidv4()
    // 存储本地存储
    localStorage.setItem('UUIDTOKEN', uuid_token)
  }
  return uuid_token
}
