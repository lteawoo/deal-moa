import cheerio from 'cheerio'
import puppeteer from 'puppeteer'

export class Ppomppu {
  constructor () {
    this.url = 'http://www.ppomppu.co.kr/zboard/zboard.php?id=ppomppu'
  }

  async parse () {
    const browser = await puppeteer.launch({
      headless: false
    })

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
      .then(() => console.log('뽐뿌 파싱완료'))

    await page.goto(this.url, {
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
      console.log('==================================================================================================')
      console.log(aEl.attr('href'))
      console.log(cSelector(aEl[0]).html())
      console.log(cSelector(aEl[1]).html())
    }

    await browser.close()
  }
}
