<template>
  <div>
    <v-list>
      <v-data-table
        :headers="headers"
        :items="deals"
        class="elevation-1"
        @click:row="openDeal"
      >
        <template #[`item.img`]="{ item }">
          <v-img v-if="item.img" :src="item.img" width="75px" height="75px" class="mr-2" />
          <v-responsive v-else width="75px" height="75px" class="text-center align-center">
            <span>No img</span>
          </v-responsive>
        </template>
        <template #[`item.regDt`]="{ item }">
          <display-time :time="item.regDt" />
        </template>
      </v-data-table>
    </v-list>

    <v-btn @click="test">
      test
    </v-btn>
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
          text: '이미지',
          value: 'img',
          sortable: false,
          width: '75',
          divider: false,
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
          text: '등록일',
          value: 'regDt',
          sortable: false,
          width: '100',
          divider: true,
          align: 'center'
        }
      ],
      deals: []
    }
  },

  computed: {
  },

  mounted () {
  },

  methods: {
    openDeal (data) {
      window.open(data.link, '_blank')
    },

    async test () {
      await this.$axios.get('/api/parse')
    }
  }
}
</script>
