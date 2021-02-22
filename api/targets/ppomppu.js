import cheerio from 'cheerio'

export default class ppomppu {
  constructor () {
    this.name = 'ppomppu'
    this.url = 'http://www.ppomppu.co.kr/zboard/'
    this.path = 'zboard.php?id=ppomppu'
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
      .then(() => console.log('뽐뿌-국내 파싱완료'))

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

      const tdEl = dealEl.children('td')
      // 카테고리 파싱
      const category = cSelector(tdEl[1]).text()
      // 이미지/제목/링크 파싱
      const contentEl = tdEl.find('table')
      const aEl = contentEl.find('a')
      const title = cSelector(aEl[1]).text()
      const img = cSelector(aEl[0]).find('img').attr('src')
      const link = this.url + aEl.attr('href')
      // 시간 파싱
      const timeEl = cSelector(tdEl[4])
      returnArr.push({
        name: this.name,
        category,
        title,
        link,
        img,
        regDt: this.convertDate(timeEl.attr('title'))
      })
    }

    await page.close()

    return returnArr
  }

  convertDate(pDate) {
    const yy = pDate.substr(0, 2)
    const mm = pDate.substr(3, 2)
    const dd = pDate.substr(6, 2)
    const HH = pDate.substr(9, 2)
    const MM = pDate.substr(12, 2)
    const ss = pDate.substr(15, 2)
    const yyyy = (yy < 60) ? '20' + yy : '19'
    const resultDate = new Date(`${yyyy}-${mm}-${dd}T${HH}:${MM}:${ss}`)
    return resultDate
  }
}