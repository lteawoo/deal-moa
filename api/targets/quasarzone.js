import cheerio from 'cheerio'

export default class quasarzone {
  constructor () {
    this.name = 'quasarzone'
    this.label = '퀘이사존'
    this.url = 'https://quasarzone.com'
    this.path = '/bbs/qb_saleinfo'
  }

  async parse (browser) {
    const page = await browser.newPage()
    await page.setRequestInterception(true)

    page.on('request', (req) => {
      switch (req.resourceType()) {
        case 'stylesheet':
        case 'font':
        case 'image':
          req.abort()
          break
        default:
          req.continue()
          break
      }
    })

    page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36')

    page.waitForSelector('.market-type-list')
      .then(() => console.log('퀘이사존 파싱완료'))

    await page.goto(this.url + this.path, {
      waitUntil: 'domcontentloaded'
    })

    const pageContent = await page.content()
    const cSelector = cheerio.load(pageContent)

    const dealListEl = cSelector('.market-type-list table tbody tr')

    const returnArr = []

    for (let i = 0; i < dealListEl.length; i += 1) {
      const dealEl = cSelector(dealListEl[i])

      const tdEl = dealEl.children('td')[1]

      const mainEl = cSelector(tdEl).find('p.tit')
      const aEl = cSelector(mainEl).find('a')
      const link = this.url + cSelector(aEl).attr('href')

      // 딜마다 조회하여 정보 파싱처리
      const dealPage = await browser.newPage()
      const dealInfo = await this.parsePage(dealPage, link)

      // 이미지
      const img = cSelector(tdEl).find('.thumb-wrap img').attr('src')

      // 타이틀
      // const title = cSelector(aEl).children('span').first().text()

      // const subEl = cSelector(tdEl).find('.market-info-sub')
      // 카테고리 파싱
      // const category = cSelector(subEl).find('.category').text()

      // 가격 파싱
      // const price = cSelector(subEl).find('span:not([class*="category"])').first().children('span').text()
      // const view = cSelector(subEl).find('.count').text()
      // 시간 파싱
      // const time = cSelector(subEl).find('.date').text().trim()
      returnArr.push({
        category: dealInfo.category,
        title: dealInfo.title,
        price: dealInfo.price,
        link,
        img,
        view: dealInfo.view,
        reply: dealInfo.reply,
        regDt: this.convertDate(dealInfo.time)
      })
    }

    await page.close()

    return {
      name: this.name,
      label: this.label,
      data: returnArr
    }
  }

  async parsePage (page, link) {
    await page.setRequestInterception(true)

    page.on('request', (req) => {
      switch (req.resourceType()) {
        case 'stylesheet':
        case 'font':
        case 'image':
          req.abort()
          break
        default:
          req.continue()
          break
      }
    })

    page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36')

    page.waitForSelector('.market-type-list')

    await page.goto(link, {
      waitUntil: 'domcontentloaded'
    })

    const pageContent = await page.content()
    const cSelector = cheerio.load(pageContent)

    const dealPageEl = cSelector('.common-view-area')
    const titleEl = cSelector(dealPageEl).find('.title')
    titleEl.children().remove()
    const title = titleEl.text().trim()

    const utilAreaEl = cSelector(dealPageEl).find('.util-area')
    const category = cSelector(utilAreaEl).find('.ca_name').text().trim()
    const reply = cSelector(utilAreaEl).find('.count .reply').text().trim()
    const view = cSelector(utilAreaEl).find('.count .view').text().trim()
    const time = cSelector(utilAreaEl).find('.date').text().trim()

    const marketInfoEl = cSelector(dealPageEl).find('.market-info-view-table')
    const trEl = cSelector(marketInfoEl).find('tbody tr')
    const price = this.convertPrice(cSelector(trEl[2]).find('td span').text())

    await page.close()

    return {
      title,
      category,
      reply,
      view,
      time,
      price
    }
  }

  convertPrice (pPrice) {
    return pPrice.replace('(KRW)', '원').replace('(USD)', '달러').trim()
  }

  convertDate (pDate) {
    // const first = pDate.substr(0, 2)
    // const second = pDate.substr(3, 2)
    // const date = new Date()
    // if (pDate.includes(':')) {
    //   date.setHours(first)
    //   date.setMinutes(second)
    //   return date
    // } else {
    //   date.setMonth(first - 1)
    //   date.setSeconds(second)
    //   return date
    // }
    return new Date(pDate)
  }
}
