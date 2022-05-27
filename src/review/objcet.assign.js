// 带给服务器的参数
let searchParams = {
    category1Id: '', // 一级分类
    category2Id: '', // 二级分类
    category3Id: '', // 三级分类
    categoryName: '', // 分类名字
    keyword: '', // 搜索框搜索的关键字
    order: '1:desc', // 排序(升序或降序) 初始值应该是 综合降序
    pageNo: 4, // 当前是第几页
    pageSize: 10, // 默认显示几条数据
    props: [], // 平台售卖属性操作带的参数 运行内存 手机系统...
    trademark: '', // 品牌 例如手机有很多品牌
}
// 传递过来的query参数
let query = { categoryName: "手机", category1Id: 12 }
// 传递过来的parasm参数
let parasm = { keyword: "华为" }

console.log(Object.assign(searchParams, query, parasm));
// {
//     category1Id: 12,
//     category2Id: '',
//     category3Id: '',
//     categoryName: '手机',
//     keyword: '华为',
//     order: '1:desc',
//     pageNo: 4,
//     pageSize: 10,
//     props: [],
//     trademark: ''
//   }
