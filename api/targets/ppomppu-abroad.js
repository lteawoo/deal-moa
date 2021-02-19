import cheerio from 'cheerio'

export default class ppomppuAboard {
  constructor () {
    this.category = 'ppomppu2'
    this.url = 'http://www.ppomppu.co.kr/zboard/'
    this.path = 'zboard.php?id=ppomppu4'
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

    page.waitForSelector('#revolution_main_table')
      .then(() => console.log('뽐뿌-해외 파싱완료'))

    await page.goto(this.url + this.path, {
      waitUntil: 'domcontentloaded'
    })

    const pageContent = await page.content()
    const cSelector = cheerio.load(pageContent)
    // 공지사항 제거
    const dealListEl = cSelector('#revolution_main_table tbody tr:not([class*="list_notice"])[class^="list"]')

    const returnArr = []

    for (let i = 0; i < dealListEl.length; i += 1) {
      const dealEl = cSelector(dealListEl[i])

      const contentEl = dealEl.find('table')

      const aEl = contentEl.find('a')

      returnArr.push({
        category: this.category,
        title: cSelector(aEl[1]).text(),
        link: this.url + aEl.attr('href'),
        img: cSelector(aEl[0]).find('img').attr('src')
      })
    }

    return returnArr
  }
}
