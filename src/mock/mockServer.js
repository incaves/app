import Mock from 'mockjs'
// JSON 和 img 不需要对外暴露可以直接引入
import banner from './banner.json'
import floor from './floor.json'
// 第一个参数请求的地址
// 第二个参数: code状态码 请求的数据
Mock.mock('/mock/banner', { code: 200, data: banner })
Mock.mock('/mock/floor', { code: 200, data: floor })
