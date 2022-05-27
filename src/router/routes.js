export default [
  {
    path: '*',
    redirect: '/home', // 路由重定向
  },
  // 首页
  {
    path: '/home',
    component: () => import('@/views/Home'),
    meta: {
      show: true,
    },
  },
  // 搜索
  {
    path: '/search/:keyword?',
    name: 'search',
    component: () => import('@/views/Search'),
    meta: {
      show: true,
    },
  },
  // 登陆
  {
    path: '/login',
    component: () => import('@/views/Login'),
    meta: {
      show: false,
    },
  },
  // 注册
  {
    path: '/register',
    component: () => import('@/views/Register'),
    meta: {
      show: false,
    },
  },
  // 产品详情
  {
    path: '/detail/:skuid',
    component: () => import('@/views/Detail'),
    meta: {
      show: true,
    },
  },
  // 提示
  {
    path: '/addcartsuccess',
    name: 'addcartsuccess',
    component: () => import('@/views/AddCartSuccess'),
    meta: {
      show: true,
    },
  },
  // 购物车
  {
    path: '/shopcart',
    name: 'shopcart',
    component: () => import('@/views/ShopCart'),
    meta: {
      show: true,
    },
  },
  // 提交订单
  {
    path: '/trade',
    name: 'trade',
    component: () => import('@/views/Trade'),
    meta: {
      show: true,
    },
    beforeEnter: (to, from, next) => {
      // 必须从购物车shpcart页面来 才可以进
      if (from.path == '/shopcart') {
        next()
      } else {
        next(false) // 停留在当前页
      }
    },
  },
  // 支付页面
  {
    path: '/pay',
    name: 'pay',
    component: () => import('@/views/Pay'),
    meta: {
      show: true,
    },
    beforeEnter: (to, from, next) => {
      if (from.path == '/trade') {
        next()
      } else {
        next(false)
      }
    },
  },
  // 支付成功
  {
    path: '/paysuccess',
    name: 'paysuccess',
    component: () => import('@/views/PaySuccess'),
    meta: {
      show: true,
    },
  },
  // 我的订单
  {
    path: '/center',
    name: 'center',
    redirect: '/center/myorder',
    component: () => import('@/views/Center'),
    children: [
      {
        path: 'myorder',
        component: () => import('@/views/Center/myOrder'),
      },
      {
        path: 'grouporder',
        component: () => import('@/views/Center/groupOrder'),
      },
    ],
    meta: {
      show: true,
    },
  },
]
