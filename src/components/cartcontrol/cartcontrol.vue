<template>
  <div class="cartcontrol">
    <transition name="slide-fade">
      <div class="cart-decrease" @click.stop.prevent="decreaseCart" v-show="food.count>0">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <transition name="fade">
      <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    </transition>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue'
export default {
  props: {
    food: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      count: 0
    }
  },
  components: {

  },
  methods: {
    addCart (event) {
      // 下面这句代码判断 好像不需要
      if (!event._constructed) {
        console.log('from PC click')
        return
      }
      console.log('from better click')
      if (!this.food.count) {
        Vue.set(this.food, 'count', 1)
      } else {
        this.food.count++
      }
      this.$emit('cart-add', event.target)
    },
    decreaseCart () {
      if (!event._constructed) {
        console.log('from PC click')
        return
      }
      if (this.food.count) {
        this.food.count--
      }
    },
    _initCount () {
      this.count = this.food.count
    }
  },
  created () {
    // this._initCount()
  }
}
</script>

<style scoped lang="stylus">
.cartcontrol
  position relative

  .cart-decrease
    display inline-block

    .inner
      display inline-block
      line-height 24px
      font-size 24px
      color rgb(0, 160, 220)
      transform rotate(0)

    &.slide-fade-enter-active
      transition all 0.3s cubic-bezier(0.5, 0.01, 0.18, 1)
      transform translate3D(0, 0, 0)

      .inner
        transition all 0.3s cubic-bezier(0.5, 0.01, 0.18, 1)

    &.slide-fade-leave-active
      transition all 0.3s cubic-bezier(0.5, 0.01, 0.18, 1)
      transform translate3D(0, 0, 0)

      .inner
        transition all 0.3s cubic-bezier(0.5, 0.01, 0.18, 1)

    &.slide-fade-enter, &.slide-fade-leave-to
      opacity 0
      transform translate3D(24px, 0, 0)

      .inner
        transform rotate(180deg)

  .cart-count
    display inline-block
    line-height 24px
    height 24px
    width 20px
    text-align center
    font-size 16px
    font-weight 400
    color #6d747b
    vertical-align top

    &.fade-enter-active
      transition all 0.3s cubic-bezier(0.5, 0.01, 0.18, 1)
      transform translate3d(0, 0, 0)

    &.fade-leave-active
      transition all 0.3s cubic-bezier(0.5, 0.01, 0.18, 1)
      transform translate3d(0, 0, 0)

    &.fade-enter, &.fade-leave-to
      opacity 0
      transform translate3d(24px, 0, 0)

  .cart-add
    display inline-block
    line-height 24px
    font-size 24px
    color rgb(0, 160, 220)
</style>
