import Vue from 'vue'
import Router from 'vue-router'
import Seller from 'components/seller/seller'
import Goods from 'components/goods/goods'
import Ratings from 'components/ratings/ratings'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    redirect: '/ratings'
  },
  {
    path: '/seller',
    name: 'seller',
    component: Seller
  },
  {
    path: '/goods',
    name: 'goods',
    component: Goods
  },
  {
    path: '/ratings',
    name: 'ratings',
    component: Ratings
  }
  ]
})
