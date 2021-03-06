<template>
  <div>
    <v-card
      class="mb-5"
      :disabled="loading"
    >
      <v-card-text>
        <v-row>
          <v-col
            cols="12"
          >
            <v-autocomplete
              v-model="filters.name"
              :items="sites"
              item-text="name"
              item-value="code"
              label="사이트"
              multiple
              small-chips
              deletable-chips
            />
          </v-col>
          <v-col
            cols="12"
          >
            <v-text-field
              v-model="search"
              label="검색"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card>
      <v-skeleton-loader
        :loading="loading"
        type="table"
        tile
      >
        <v-data-table
          :items-per-page="30"
          :headers="headers"
          :items="filteredDeals"
          :search="search"
          class="elevation-1"
          @click:row="openDeal"
        >
          <template #[`item.reply`]="{ item }">
            {{ item.reply | numberComma }}
          </template>
          <template #[`item.view`]="{ item }">
            {{ item.view | numberComma }}
          </template>
          <template #[`item.regDt`]="{ item }">
            <display-time :time="item.regDt" />
          </template>
        </v-data-table>
      </v-skeleton-loader>
    </v-card>
  </div>
</template>

<script>
import dateformat from 'dateformat'
import displayTime from '@/components/display-time'

export default {
  components: {
    displayTime
  },

  filters: {
    numberComma (val) {
      return val ? String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
    },

    localeDateTime (dt) {
      return dateformat(dt, 'yyyy-mm-dd HH:MM:ss')
    }
  },

  async asyncData ({ $axios }) {
    const result = {}

    const dealsData = await $axios.get('/api/load')
    if (dealsData) {
      const resultArr = dealsData.data.reduce((acc, cur) => {
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

      result.deals = resultArr
    }

    const sitesData = await $axios.get('/api/sites')
    if (sitesData) {
      result.sites = sitesData.data
    }

    return result
  },

  data () {
    return {
      loading: true,
      search: '',
      sites: [],
      selectSites: null,
      headers: [
        {
          text: '사이트',
          value: 'label',
          sortable: false,
          width: '100',
          divider: true,
          align: 'center'
        },
        {
          text: '분류',
          value: 'category',
          sortable: false,
          width: '120',
          divider: true,
          align: 'center'
        },
        {
          text: '딜',
          value: 'title',
          sortable: false,
          width: '100%',
          divider: true
        },
        {
          text: '가격',
          value: 'price',
          sortable: false,
          width: '150',
          divider: true,
          align: 'center'
        },
        {
          text: '댓글',
          value: 'reply',
          sortable: false,
          width: '100',
          divider: true,
          align: 'center'
        },
        {
          text: '조회수',
          value: 'view',
          sortable: false,
          width: '100',
          divider: true,
          align: 'center'
        },
        {
          text: '등록일',
          value: 'regDt',
          sortable: false,
          width: '100',
          divider: true,
          align: 'center'
        }
      ],
      deals: [],
      filters: {
        name: []
      },
      dealInterval: null
    }
  },

  computed: {
    filteredDeals () {
      return this.deals.filter((deal) => {
        return Object.keys(this.filters).every((filter) => {
          return this.filters[filter].length < 1 || this.filters[filter].includes(deal[filter])
        })
      })
    }
  },

  mounted () {
    this.loading = false

    if (!this.dealInterval) {
      this.dealInterval = setInterval(async () => {
        console.log('client interaval')
        this.deals = await this.loadDeals()
      }, 60000)
    }
  },

  methods: {
    async loadDeals () {
      this.loading = true

      try {
        const dealsData = await this.$axios.get('/api/load?page=1')

        if (dealsData) {
          this.deals = []

          const resultArr = dealsData.data.reduce((acc, cur) => {
            const remap = cur.data.map((item) => {
              item.name = cur.name
              item.label = cur.label
              item.title = (!item.price) ? item.title : item.title + ' - ' + item.price
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

          return resultArr
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false
      }
    },

    openDeal (data) {
      window.open(data.link, '_blank')
    },

    test () {
      // await this.$axios.get('/api/parse')
      console.log(this.filters)
    }
  }
}
</script>
