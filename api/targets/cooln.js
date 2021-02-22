import cheerio from 'cheerio'

export default class cooln {
  constructor () {
    this.name = 'cooln'
    this.url = 'https://coolenjoy.net/'
    this.path = 'bbs/jirum'
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

    page.waitForSelector('#fboardlist')
      .then(() => console.log('쿨엔 파싱완료'))

    await page.goto(this.url + this.path, {
      waitUntil: 'domcontentloaded'
    })

    const pageContent = await page.content()
    const cSelector = cheerio.load(pageContent)
    // 공지사항 제거-1: class bo_notice 제거
    const dealListEl = cSelector('#fboardlist tbody tr:not([class*="bo_notice"])')

    const returnArr = []

    for (let i = 0; i < dealListEl.length; i += 1) {
      const dealEl = cSelector(dealListEl[i])

      const tdNum = cSelector(dealEl).find('.td_num')
      console.log(tdNum.html())

      // returnArr.push({
      //   name: this.name,
      //   title: cSelector(aEl[1]).text(),
      //   link: this.url + aEl.attr('href'),
      //   img: cSelector(aEl[0]).find('img').attr('src')
      // })
    }

    await page.close()

    return returnArr
  }
}
