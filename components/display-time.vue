<template>
  <v-tooltip bottom>
    <template #activator="{ on }">
      <span v-on="on">{{ displayTime }}</span>
    </template>
    <span>{{ toolTipTime }}</span>
  </v-tooltip>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    time: {
      type: [String, Date],
      default: new Date(),
      require: true
    },
    showSimple: Boolean
  },

  computed: {
    displayTime () {
      moment.locale('ko')
      const now = Date.now()
      const temp = new Date(this.time).getTime()
      const diff = (now - temp) / 3600000

      if (diff <= 1) {
        return moment(this.time).fromNow()
      } else if (diff <= 24) {
        return this.$dateformat(this.time, 'HH:MM')
      } else {
        return this.$dateformat(this.time, 'yyyy.mm.dd')
      }
    },

    toolTipTime () {
      const format = !this.showSimple ? 'yyyy.mm.dd HH:MM:ss' : 'yyyy.mm.dd'

      return this.$dateformat(this.time, format)
    }
  }
}
</script>
