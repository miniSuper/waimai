<template>
  <div>
    <my-header :seller="seller"></my-header>
    <div class="tab">
      <div class="tab-item">
        <router-link to='/goods'>商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to='/ratings'>评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to='/seller'>商家</router-link>
      </div>
    </div>
    <div class="content">
      <router-view :seller="seller" keep-alive></router-view>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import myHeader from 'components/header/header.vue'
import { urlParse } from 'common/js/util'
const ERR_OK = 0
export default {
  data () {
    return {
      seller: {
        id: (() => {
          let queryParam = urlParse()
          return queryParam.id
        })()
      }
    }
  },
  components: {
    myHeader
  },
  created () {
    this.$http.get('/api/seller?id=' + this.seller.id).then((res) => {
      const result = res.data
      if (result.errno === ERR_OK) {
        // this.seller = result.data
        this.seller = Object.assign({}, this.seller, result.data)
      }
    })
  },
  mounted () {
    // console.log(this.seller)
  }
}
</script>

<style scoped lang="stylus">
@import './common/stylus/mixin'

.tab
  display flex
  width 100%
  height 40px
  line-height 40px

  .tab-item
    flex 1
    text-align center
    font-weight 400
    border-1px(rgba(7, 17, 27, 0.1), bottom)

    a
      display block
      font-size 14px
      color rgb(77, 85, 93)

      &.router-link-active
        color #ea6464
</style>
