<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="24" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="24" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="ratings" @on-onlyContent="_onlyContent" @on-selectType="_selectType"></ratingselect>
      <div class="rating-wrapper">
        <ul>
          <li v-for="rating in ratings" :key="rating.index" v-show="isItemShow(rating.rateType, rating.text)" class="rating-item">
            <div class="avatar">
              <img width="28" height="28" :src="rating.avatar">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span class="item" v-for="item in rating.recommend" :key="item.index">{{item}}</span>
              </div>
              <div class="time">
                {{rating.rateTime | formatDate}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import star from 'components/star/star'
import split from 'components/split/split'
import ratingselect from 'components/ratingselect/ratingselect'
/* eslint-disable no-unused-vars */
const POSITIVE = 0
const NEGATIVE = 1
const ALL = 2
const ERR_OK = 0
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
      selectType: ALL,
      onlyContent: true,
      ratings: [],
      desc: {
        all: '全部',
        positive: '满意',
        negative: '吐槽'
      }
    }
  },
  components: {
    star,
    split,
    ratingselect
  },
  methods: {
    isItemShow (type, text) {
      if (this.onlyContent && !text) {
        return false
      }
      if (this.selectType === ALL || this.selectType === type) {
        return true
      }
    },
    _onlyContent (boolean) {
      this.onlyContent = !this.onlyContent
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    _selectType (type) {
      this.selectType = type
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    _initScroll () {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.ratings, {
          click: true
        })
      } else {
        this.scroll.refresh()
      }
    }
  },
  created () {
    this.$http.get('/api/ratings').then(res => {
      let result = res.data
      if (result.errno === ERR_OK) {
        this.ratings = result.data
        this.$nextTick(() => {
          this._initScroll()
        })
      }
    })
  }
}
</script>

<style scoped lang="stylus">
@import '../../common/stylus/mixin'

.ratings
  position absolute
  top 174px
  bottom 0
  width 100%
  overflow hidden

  .overview
    display flex
    padding 18px 0

    .overview-left
      flex 0 0 137px
      width 137px
      border-right 1px solid rgba(7, 17, 27, 0.1)
      text-align center

      @media only screen and (max-width: 320px)
        flex 0 0 120px
        width 120px

      .score
        margin-bottom 6px
        line-height 28px
        font-size 24px
        font-weight 400
        color rgb(255, 153, 0)

      .title
        margin-bottom 8px
        line-height 12px
        font-size 12px
        color rgba(7, 17, 27, 0.8)

      .rank
        line-height 10px
        font-size 10px
        color rgb(147, 153, 159)

    .overview-right
      flex 1
      padding 6px 0 6px 30px

      @media only screen and (max-width: 320px)
        padding-left 14px

      .score-wrapper
        margin-bottom 8px
        font-size 0

        .title
          display inline-block
          line-height 18px
          vertical-align top
          font-size 12px
          color rgb(7, 17, 27)

        .star
          display inline-block
          margin 2px 12px
          vertical-align top

        .score
          display inline-block
          line-height 18px
          vertical-align top
          font-size 12px
          color rgb(255, 153, 0)

      .delivery-wrapper
        font-size 0

        .title
          line-height 18px
          font-size 12px
          color rgb(7, 17, 27)

        .delivery
          margin-left 12px
          font-size 12px
          color rgb(147, 153, 159)

  .rating-wrapper
    padding 0 18px

    .rating-item
      display flex
      padding 18px 0
      border-1px(rgba(7, 17, 27, 0.1), 'bottom')

      .avatar
        flex 0 0 28px
        width 28px
        margin-right 12px

        img
          border-radius 50%

      .content
        position relative
        flex 1

        .name
          margin-bottom 4px
          line-height 12px
          font-size 10px
          color rgb(7, 17, 27)

        .star-wrapper
          margin-bottom 6px
          font-size 0

          .star
            display inline-block
            margin-right 6px
            vertical-align top

          .delivery
            display inline-block
            vertical-align top
            line-height 12px
            font-size 10px
            color rgb(147, 153, 159)

        .text
          margin-bottom 8px
          line-height 18px
          color rgb(7, 17, 27)
          font-size 12px

        .recommend
          line-height 16px
          font-size 0

          .icon-thumb_up, .item
            display inline-block
            margin 0 8px 4px 0
            font-size 9px

          .icon-thumb_up
            color rgb(0, 160, 220)

          .item
            padding 0 6px
            border 1px solid rgba(7, 17, 27, 0.1)
            border-radius 1px
            color rgb(147, 153, 159)
            background #fff

        .time
          position absolute
          top 0
          right 0
          line-height 12px
          font-size 10px
          color rgb(147, 153, 159)
</style>
