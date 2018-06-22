<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img :src="seller.avatar" alt="">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <div v-if="seller.supports" class="support">
          <span class="icon" :class="classMap[seller.supports[0].type]"> </span>
          <span class="text">
            {{seller.supports[0].description}}
          </span>
        </div>
        <div class="support-count" v-if="seller.supports" @click="showDetail">
          <span class="count">{{seller.supports.length}}个</span>
          <i class="icon-keyboard_arrow_right"></i>
        </div>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showDetail">
      <div class="bulletin-title"></div>
      <div class="bulletin-text">{{seller.bulletin}}</div>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="header-bg">
      <img :src="seller.avatar" alt="header的背景图片" width="100%" height="100%">
    </div>
    <transition name="fade">
      <div v-show="detailShow" class="detail">
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
            <div class="name">{{seller.name}}</div>
            <div class="star-wrapper">
              <star :size="48" :score="seller.score"></star>
            </div>
            <div class="title">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul v-if="seller.supports" class="supports">
              <li v-for="(item,index) in seller.supports" :key="item.id" class="support-item">
                <span class="icon" :class="classMap[seller.supports[index].type]"></span>
                <span class="text">{{seller.supports[index].description}}</span>
              </li>
            </ul>
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="bulletin">
              <p class="content">{{seller.bulletin}}</p>
            </div>
          </div>
        </div>
        <div class="detail-close" @click="hideDetail">
          <i class="icon-close"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import star from 'components/star/star'
export default {
  props: {
    seller: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      detailShow: false
    }
  },
  components: {
    star
  },
  methods: {
    showDetail () {
      this.detailShow = true
    },
    hideDetail () {
      this.detailShow = false
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  }
}
</script>

<style scoped lang="stylus">
@import '../../common/stylus/mixin.styl'
@import '../../common/stylus/icon.styl'

.header
  position relative
  color #ffffff
  background-color rgba(7, 17, 27, 0.5)
  overflow hidden

  .content-wrapper
    position relative
    padding 24px 12px 18px 24px

    .avatar
      display inline-block
      vertical-align top

      &>img
        width 64px
        height 64px
        border-radius 2px

    .content
      display inline-block
      margin-left 16px

      .title
        margin 2px 0 8px 0

        .brand
          display inline-block
          width 30px
          height 18px
          bg-image('brand')
          background-size 30px 18px
          background-repeat no-repeat
          vertical-align top

        .name
          margin-left 6px
          font-size 16px

      .description
        margin-bottom 10px
        font-size 12px
        line-height 12px

      .support
        .icon
          display inline-block
          width 12px
          height 12px
          margin-right 4px
          background-size 12px 12px
          background-repeat no-repeat
          vertical-align bottom

          &.decrease
            bg-image('decrease_1')

          &.discount
            bg-image('discount_1')

          &.special
            bg-image('special_1')

          &.invoice
            bg-image('invoice_1')

          &.guarantee
            bg-image('guarantee_1')

        .text
          line-height 12px
          font-size 10px

      .support-count
        position absolute
        right 12px
        bottom 14px
        padding 0 8px
        height 24px
        line-height 24px
        border-radius 14px
        background rgba(0, 0, 0, 0.2)
        text-align center
        cursor pointer

        .count
          vertical-align top
          font-size 10px

        .icon-keyboard_arrow_right
          margin-left 2px
          line-height 24px
          font-size 10px

  .bulletin-wrapper
    height 28px
    line-height 28px
    padding 0 18px
    background-color rgba(7, 17, 27, 0.2)
    display flex

    // font-size 0
    .bulletin-title
      // display block
      flex-shrink 0
      vertical-align top
      margin-top 8px
      width 22px
      height 12px
      bg-image('bulletin')
      background-size cover
      background-repeat no-repeat

    .bulletin-text
      display inline-block
      vertical-align top
      font-size 10px
      margin 0 4px 0 8px
      overflow hidden
      text-overflow ellipsis
      white-space nowrap

    .icon-keyboard_arrow_right
      display inline-block
      vertical-align top
      // position relative
      margin-top 6px

  .header-bg
    position absolute
    width 100%
    height 100%
    top 0
    left 0
    z-index -1
    filter blur(10px)

  .detail
    position fixed
    z-index 1999
    width 100%
    height 100%
    top 0
    left 0
    overflow auto
    background rgba(7, 17, 27, 0.8)
    backdrop-filter blur(10px)

    &.fade-enter-active, &.fade-leave-active
      transition opacity 0.5s ease

    &.fade-enter, &.fade-leave-to
      opacity 0

    .detail-wrapper
      width 100%
      min-height 100%

      .detail-main
        margin-top 64px
        padding-bottom 64px

        .name
          line-height 16px
          font-size 16px
          font-weight 700
          text-align center

        .star-wrapper
          text-align center
          margin-top 18px
          padding 2px 0

        .title
          display flex
          width 80%
          margin 30px auto

          .line
            flex 1
            position relative
            top -6px
            border-bottom 1px solid rgba(255, 255, 255, 0.2)

          .text
            padding 0 12px
            font-size 14px
            font-weight 700

        .supports
          width 80%
          margin 0 auto

          .support-item
            padding 0 12px
            margin-bottom 12px

            &:last-child
              margin-bottom 0

            .icon
              display inline-block
              width 16px
              height 16px
              margin-right 6px
              vertical-align top
              background-size cover
              background-repeat no-repeat

              &.decrease
                bg-image('decrease_2')

              &.discount
                bg-image('discount_2')

              &.guarantee
                bg-image('guarantee_2')

              &.invoice
                bg-image('invoice_2')

              &.special
                bg-image('special_2')

            .text
              line-height 16px
              font-size 12px

        .bulletin
          width 80%
          margin 0 auto

          .content
            padding 0 12px
            line-height 24px
            font-size 12px

    .detail-close
      position relative
      width 32px
      height 32px
      margin -64px auto
      clear both
      font-size 32px
</style>
