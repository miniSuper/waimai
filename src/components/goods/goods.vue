<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item,index) in goods" :key="item.id" class="menu-item" :class="{'current':currentIndex === index}" @click="selectMenu(index)">
          <span class="text">
            <span v-if="item.type>0" :class="classMap[item.type]" class="icon"></span>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="item in goods" :key="item.id" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" :key="food.id" class="food-item">
              <div class="icon" @click="showFoodDetail(food,$event)">
                <img :src="food.icon" width="57px" height="57px">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p v-if="food.description" class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="new">￥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="control-wrapper">
                  <cartcontrol :food="food" @cart-add="cartAdd"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
      <shopcart :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" :select-foods="selectedFoods" ref="shopcart"></shopcart>
    </div>
    <food :food="foodDetail" ref="food" @cart-add="cartAdd"></food>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import shopcart from 'components/shopcart/shopcart'
import cartcontrol from 'components/cartcontrol/cartcontrol'
import food from 'components/food/food'
const ERR_OK = 0
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      foodDetail: {}
    }
  },
  components: {
    shopcart,
    cartcontrol,
    food
  },
  computed: {
    currentIndex () {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if (!height2 || (this.scrollY >= height1 && this.scrollY <= height2)) {
          return i
        }
      }
      return 0
    },
    selectedFoods () {
      let foods = []
      this.goods.forEach(good => {
        good.foods.forEach(food => {
          if (food.count) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  methods: {
    selectMenu (index) {
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let target = foodList[index]
      this.foodsScroll.scrollToElement(target, 350)
    },
    cartAdd (target) {
      // 优化体验，异步执行
      this.$nextTick(() => {
        this._drop(target)
      })
    },
    showFoodDetail (food, event) {
      if (!event._constructed) {
        return
      }
      this.foodDetail = food
      this.$refs.food.show()
    },
    _initScroll () {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true
      })
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true,
        probeType: 3
      })
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    _calculateHeight () {
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    _drop (target) {
      this.$refs.shopcart.drop(target)
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    this.$http.get('/api/goods').then((res) => {
      let result = res.data
      if (result.errno === ERR_OK) {
        this.goods = result.data
        this.$nextTick(() => {
          this._initScroll()
          this._calculateHeight()
        })
      }
    })
  }
}
</script>

<style scoped lang="stylus">
@import '../../common/stylus/mixin'

// @import '../../common/stylus/icon'
.goods
  display flex
  position absolute
  top 174px
  bottom 46px
  width 100%
  overflow hidden

  .menu-wrapper
    flex 0 0 80px
    width 80px
    background #f3f5f7

    .menu-item
      display table
      width 56px
      height 54px
      padding 0 12px
      line-height 14px
      font-size 12px

      &.current
        color #222
        background-color #ffffff
        font-weight 700

      // border-1px(rgba(7, 17, 27, 0.1), 'bottom')
      .icon
        display inline-block
        vertical-align middle
        width 12px
        height 12px
        margin-right 2px
        background-size 12px 12px
        background-repeat no-repeat

        &.decrease
          bg-image('decrease_3')

        &.discount
          bg-image('discount_3')

        &.guarantee
          bg-image('guarantee_3')

        &.invoice
          bg-image('invoice_3')

        &.special
          bg-image('special_3')

      .text
        display table-cell
        width 56px
        font-size 12px
        vertical-align middle
        border-1px(rgba(7, 17, 27, 0.1), 'bottom')

  .foods-wrapper
    flex 1
    overflow hidden

    .title
      padding-left 14px
      height 26px
      line-height 26px
      border-left 2px solid #d9dde1
      font-size 12px
      color rgb(147, 153, 159)
      background #f3f5f7

    .food-item
      display flex
      margin 18px
      padding-bottom 18px
      border-1px(rgba(7, 17, 27, 0.1), 'bottom')

      &:last-child
        boder-none()
        margin-bottom 0

      .icon
        flex 0 0 57px
        margin-right 10px

      .content
        flex 1

        .name
          margin 2px 0 8px
          height 14px
          line-height 14px
          font-size 14px
          color rgb(7, 17, 27)

        .desc, .extra
          line-height 16px
          font-size 10px
          color rgb(147, 153, 159)

        .desc
          // margin-bottom 8px
          width 70%
          height 16px
          overflow hidden
          text-overflow ellipsis
          white-space nowrap

        .extra
          .count
            margin-right 12px

        .price
          font-weight 700
          line-height 24px

          .new
            margin-right 8px
            font-size 14px
            color rgb(240, 20, 20)

          .old
            text-decoration line-through
            font-size 10px
            color rgb(147, 153, 159)

        .control-wrapper
          position absolute
          right 0
          bottom 12px

        .pay
          height 48px
          line-height 48px
          text-align center
          font-size 12px
          font-weight 700
</style>
