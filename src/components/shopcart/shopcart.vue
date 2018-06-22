<template>
  <div class="shopcart">
    <div class="content">
      <div class="content-left" @click="toggleList">
        <div class="logo-wrapper">
          <div class="logo" :class="{highlight:totalCount>0}">
            <i class="icon-shopping_cart" :class="{highlight:totalCount>0}"></i>
            <div v-show="totalCount>0" class="num">{{totalCount}}</div>
          </div>
        </div>
        <div class="price" :class="{highlight:totalCount>0}">¥{{totalPrice}}</div>
        <div class="desc">另需配送费{{deliveryPrice}}元</div>
      </div>
      <div class="content-right" @click="pay">
        <div class="pay" :class="payClass">
          {{payDesc}}
        </div>
      </div>
    </div>
    <div class="ball-container">
      <!-- transition-group 这个问题还是没搞懂 -->
      <!-- <transition-group name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop" tag="div">
        <div v-for="ball in balls" :key="ball.index" v-show="ball.show" class="ball" tag="div">
          <div class="inner inner-hook"></div>
        </div>
      </transition-group> -->
      <div v-for="ball in balls" :key="ball.index">
        <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
          <div class="ball" v-show="ball.show">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>
    </div>
    <transition name="fold">
      <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li class="food" v-for="food in selectFoods" :key="food.index">
              <span class="name">{{food.name}}</span>
              <div class="price">
                <span>￥{{food.price*food.count}}</span>
              </div>
              <div class="cartcontrol-wrapper">
                <cartcontrol @cart-add="addFood" :food="food"></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click.stop="hideMask">

      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import cartcontrol from 'components/cartcontrol/cartcontrol'
import BScroll from 'better-scroll'
export default {
  props: {
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    },
    selectFoods: {
      type: Array,
      default () {
        return [
          {
            price: 10,
            count: 1
          }
        ]
      }
    }
  },
  data () {
    return {
      balls: [
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        }
      ],
      dropBalls: [],
      fold: true
    }
  },
  components: {
    cartcontrol
  },
  methods: {
    drop (el) {
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i]
        if (!ball.show) {
          ball.show = true
          ball.el = el
          this.dropBalls.push(ball)
          return
        }
      }
    },
    beforeDrop (el) {
      let count = this.balls.length
      while (count--) {
        let ball = this.balls[count]
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect()
          let x = rect.left - 32
          let y = -(window.innerHeight - rect.top - 22)
          el.style.display = 'none'
          el.style.webkitTransform = `translate3d(0,${y}px,0)`
          el.style.transform = `translate3d(0,${y}px,0)`
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`
          inner.style.transform = `translate3d(${x}px,0,0)`
        }
      }
    },
    dropping (el, done) {
      /* eslint-disable no-unused-vars */
      let rf = el.offsetHeight
      this.$nextTick(() => {
        el.style.webkitTransform = 'translate3d(0,0,0)'
        el.style.transform = 'translate3d(0,0,0)'
        let inner = el.getElementsByClassName('inner-hook')[0]
        inner.style.webkitTransform = 'translate3d(0,0,0)'
        inner.style.transform = 'translate3d(0,0,0)'
        el.addEventListener('transitionend', done)
      })
    },
    afterDrop (el) {
      let ball = this.dropBalls.shift()
      if (ball) {
        ball.show = false
        el.style.display = 'none'
      }
    },
    toggleList () {
      if (!this.totalCount) {
        return
      }
      this.fold = !this.fold
    },
    setFold (boolean) {
      this.fold = boolean
    },
    empty () {
      this.selectFoods.forEach(food => {
        food.count = 0
      })
    },
    addFood (target) {
      this.drop(target)
      // console.log('drop---')
    },
    hideMask () {
      this.setFold(true)
    },
    pay () {
      if (this.totalPrice < this.minPrice) {
        return
      }
      window.alert(`你需要支付${this.totalPrice}元`)
    },
    _initScroll () {
      this.scroll = new BScroll(this.$refs.listContent, {
        // click: true
      })
    }
  },
  computed: {
    totalPrice () {
      let total = 0
      this.selectFoods.forEach(food => {
        total += food.price * food.count
      })
      return total
    },
    totalCount () {
      let totalCount = 0
      this.selectFoods.forEach(food => {
        totalCount += food.count
      })
      return totalCount
    },
    payDesc () {
      if (this.totalPrice === 0) {
        return `${this.minPrice}元起送`
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice
        return `还差${diff}元起送`
      } else {
        return '立即结算'
      }
    },
    payClass () {
      if (this.totalPrice >= this.minPrice) {
        return 'enough'
      }
      return 'not-enough'
    },
    listShow () {
      if (!this.totalCount) {
        this.setFold(true)
        return false
      }
      let show = !this.fold
      if (show) {
        this.$nextTick(() => {
          if (!this.scroll) {
            this._initScroll()
          } else {
            this.scroll.refresh()
          }
        })
      }
      return show
    }
  }
}
</script>

<style scoped lang="stylus">
@import '../../common/stylus/mixin'

.shopcart
  position fixed
  left 0
  bottom 0
  z-index 50
  width 100%
  height 48px

  .content
    display flex
    background-color #141d27
    // background-color #ccc
    height 100%

    .content-left
      flex 1

      .logo-wrapper
        display inline-block
        vertical-align top
        position relative
        top -10px
        margin 0 12px
        padding 6px
        width 56px
        height 56px
        box-sizing border-box
        border-radius 50%
        background-color #141d27

        .logo
          width 100%
          height 100%
          border-radius 50%
          text-align center
          background rgba(255, 255, 255, 0.1)

          &.highlight
            background rgb(0, 160, 220)

          .icon-shopping_cart
            display inline-block
            width 100%
            height 100%
            line-height 44px
            font-size 24px
            color #80858a

            &.highlight
              color #fff

        .num
          position absolute
          top 0
          right 0
          width 24px
          height 16px
          border-radius 8px
          line-height 16px
          font-size 9px
          font-weight 700
          text-align center
          color #ffffff
          background-color rgb(240, 20, 20)
          box-shadow 0 4px 8px rgba(0, 0, 0, 0.4)

      .price
        display inline-block
        vertical-align top
        margin-top 12px
        line-height 24px
        padding-right 12px
        box-sizing border-box
        border-right 1px solid rgba(255, 255, 255, 0.1)
        font-size 16px
        font-weight 700
        color rgba(255, 255, 255, 0.4)

        &.highlight
          color #fff

      .desc
        display inline-block
        line-height 24px
        margin 12px 0 0 12px
        font-size 12px
        color rgba(255, 255, 255, 0.4)

    .content-right
      flex 0 0 105px
      width 105px
      text-align center

      .pay
        font-size 24px
        line-height 48px
        font-size 12px
        height 48px
        font-weight 700

        &.not-enough
          background-color rgba(255, 255, 255, 0.1)
          color rgba(255, 255, 255, 0.4)

        &.enough
          background-color #00b43c
          color #fff

  .ball-container
    .ball
      position fixed
      left 32px
      bottom 22px
      z-index 200

      .inner
        width 16px
        height 16px
        border-radius 50%
        background rgb(0, 160, 220)

      &.drop-enter-active
        transition all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)

        .inner
          transition all 0.4s linear

      &.drop-enter, &.drop-leave-to
        .inner
          opacity 0.5
          width 12px
          height 12px

  .shopcart-list
    position absolute
    top 0
    left 0
    width 100%
    z-index -1
    transform translate3d(0, -100%, 0)

    &.fold-enter-active, &.fold-leave-active
      transition all 0.3s ease-in-out

    &.fold-enter, &.fold-leave-to
      transform translate3d(0, 0, 0)

    .list-header
      height 40px
      line-height 40px
      padding 0 18px
      background #f3f5f7
      border-bottom 1px solid rgba(7, 17, 27, 0.1)

      .title
        float left
        font-size 14px
        color rgb(7, 17, 27)

      .empty
        float right
        font-size 12px
        color rgb(0, 160, 220)

    .list-content
      padding 0 18px
      max-height 217px
      overflow hidden
      background #fff

      .food
        position relative
        padding 12px 0
        box-sizing border-box
        border-1px(rgba(7, 17, 27, 0.1), 'bottom')

        .name
          line-height 24px
          font-size 14px
          color rgb(7, 17, 27)

        .price
          position absolute
          right 90px
          bottom 12px
          line-height 24px
          font-size 14px
          font-weight 700
          color rgb(240, 20, 20)

        .cartcontrol-wrapper
          position absolute
          right 0
          bottom 12px

  .list-mask
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    z-index -2
    background rgba(0, 0, 0, 0.8)
    backdrop-filter blur(10px)

    &.fade-enter-active, &.fade-leave-active
      transition all 0.2s ease-in-out

    &.fade-enter, &.fade-leave-to
      opacity 0
</style>
