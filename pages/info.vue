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
            {{ getCategoryLabel(item.category) }}
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
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
export default {
  filters: {
    numberComma (val) {
      return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  },

  async asyncData ({ $axios }) {
    const deals = await $axios.get('/api/load/ppomppu')
    return {
      deals: deals.data
    }
  },

  data () {
    return {
      categories: [
        {
          category: 'ppomppu1',
          label: '뽐뿌 - 국내'
        }
      ],
      deals: []
    }
  },
  mounted () {
  },

  methods: {
    getCategoryLabel (category) {
      for (let i = 0; i < this.categories.length; i += 1) {
        const item = this.categories[i]

        if (item.category === category) {
          return item.label
        }
      }

      return category
    },

    async test () {
      await this.$axios.get('/api/parse/ppomppu')
    }
  }
}
</script>
