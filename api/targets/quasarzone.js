import cheerio from 'cheerio'

export default class quasarzone {
  constructor () {
    this.name = 'quasarzone'
    this.label = '퀘이사존'
    this.url = 'https://quasarzone.com/bbs/'
    this.path = 'qb_saleinfo'
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

      // 이미지
      const img = cSelector(tdEl).find('.thumb-wrap img').attr('src')

      const mainEl = cSelector(tdEl).find('p.tit')
      // 타이틀
      const aEl = cSelector(mainEl).find('a')
      const title = cSelector(aEl).children('span').first().text()

      const link = cSelector(aEl).attr('href')

      const subEl = cSelector(tdEl).find('.market-info-sub')
      // 카테고리 파싱
      const category = cSelector(subEl).find('.category').text()

      // 가격 파싱
      const price = cSelector(subEl).find('span:not([class*="category"])').first().children('span').text()
      // 시간 파싱
      const time = cSelector(subEl).find('.date').text().trim()
      returnArr.push({
        category,
        title: title + ' - ' + price.replace('￦', '').replace('(KRW)', '원').trim(),
        link,
        img,
        regDt: this.convertDate(time)
      })
    }

    await page.close()

    return {
      name: this.name,
      label: this.label,
      data: returnArr
    }
  }

  convertDate (pDate) {
    const first = pDate.substr(0, 2)
    const second = pDate.substr(3, 2)
    const date = new Date()
    if (pDate.includes(':')) {
      date.setHours(first)
      date.setMinutes(second)
      return date
    } else {
      date.setMonth(first - 1)
      date.setSeconds(second)
      return date
    }
  }
}
