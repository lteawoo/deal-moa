<template>
  <div>
    <v-list>
      <template v-for="(item, i) in deals">
        <v-list-item
          :key="i"
          link
          :href="item.link"
          target="_blank"
        >
          <v-list-item-action>
            {{ item.label }}
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.category }} | {{ item.regDt | localeDateTime }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-divider
          v-if="i < deals.length - 1"
          :key="'a' + i"
        />
      </template>
    </v-list>

    <v-btn @click="test">
      test
    </v-btn>
  </div>
</template>

<script>
import dateformat from 'dateformat'

export default {
  filters: {
    numberComma (val) {
      return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },

    localeDateTime (dt) {
      return dateformat(dt, 'yyyy-mm-dd HH:MM:ss')
    }
  },

  async asyncData ({ $axios }) {
    const loadData = await $axios.get('/api/load')

    const resultArr = loadData.data.reduce((acc, cur) => {
      const remap = cur.data.map((item) => {
        item.name = cur.name
        item.label = cur.label
        return item
      })

      return acc.concat(remap)
    }, []).sort((a, b) => {
      if (a.regDt > b.regDt) {
        return -1
      } else {
        return 1
      }
    })

    return {
      deals: resultArr
    }
  },

  data () {
    return {
      deals: []
    }
  },

  computed: {
  },

  mounted () {
  },

  methods: {
    async test () {
      await this.$axios.get('/api/parse')
    }
  }
}
</script>
