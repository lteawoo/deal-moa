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
            {{ getTargetLabel(item.name) }}
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.category }} | {{ item.regDt | localeDateTime }}</v-list-item-subtitle>
            <!-- <v-list-item-subtitle>{{ item.price | numberComma }}원 / 배송비: {{ item.shippingFee ? item.shippingFee + '원' : '무료' | numberComma }}</v-list-item-subtitle> -->
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
    console.log(loadData.data)

    const resultArr = loadData.data
    return {
      deals: resultArr
    }
  },

  data () {
    return {
      targets: [
        {
          name: 'ppomppu',
          label: '뽐뿌 - 국내'
        },
        {
          name: 'ppomppu2',
          label: '뽐뿌 - 해외'
        }
      ],
      deals: []
    }
  },
  mounted () {
  },

  methods: {
    getTargetLabel (name) {
      for (let i = 0; i < this.targets.length; i += 1) {
        const item = this.targets[i]

        if (item.name === name) {
          return item.label
        }
      }

      return name
    },

    async test () {
      await this.$axios.get('/api/parse')
    }
  }
}
</script>
