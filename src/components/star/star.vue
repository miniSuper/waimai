<template>
  <div class="star" :class="starType">
    <span v-for="item in itemClasses" :class="item" :key="item.id" class="star-item">

    </span>
  </div>
</template>

<script type="text/ecmascript-6">
const LENGTH = 5
const CLS_ON = 'on'
const CLS_HALF = 'half'
const CLS_OFF = 'off'
export default {
  props: {
    size: {
      type: Number
    },
    score: {
      type: Number
    }
  },
  data () {
    return {

    }
  },
  computed: {
    starType () {
      return 'star-' + this.size
    },
    itemClasses () {
      let result = []
      let integer = Math.floor(this.score)
      let hasDecimal = (this.score % 1) >= 0.5
      for (let i = 0; i < integer; i++) {
        result.push(CLS_ON)
      }
      if (hasDecimal) {
        result.push(CLS_HALF)
      }
      while (result.length < LENGTH) {
        result.push(CLS_OFF)
      }
      return result
    }
  },
  components: {

  }
}
</script>

<style scoped lang="stylus">
@import '../../common/stylus/mixin'

.star
  font-size 0

  .star-item
    display inline-block
    background-repeat no-repeat

  &.star-48
    .star-item
      width 20px
      height 20px
      margin-right 22px
      background-size cover

      &:last-child
        margin-right 0

      &.on
        bg-image('star48_on')

      &.half
        bg-image('star48_half')

      &.off
        bg-image('star48_off')

  &.star-36
    .star-item
      width 15px
      height 15px
      margin-right 16px
      background-size cover

      &:last-child
        margin-right 0

      &.on
        bg-image('star36_on')

      &.half
        bg-image('star36_half')

      &.off
        bg-image('star36_off')

  &.star-24
    .star-item
      width 10px
      height 10px
      margin-right 3 px
      background-size cover

      &:last-child
        margin-right 0

      &.on
        bg-image('star24_on')

      &.half
        bg-image('star24_half')

      &.off
        bg-image('star24_off')
</style>
