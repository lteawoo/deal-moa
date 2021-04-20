import cheerio from 'cheerio'

export default class ppomppu {
  constructor () {
    this.name = 'ppomppu'
    this.label = '뽐뿌-국내'
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
        // case 'image':
          req.abort()
          break
        default:
          req.continue()
          break
      }
    })
    page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36')
    page.on('domcontentloaded', () => console.log('뽐뿌-국내 파싱완료'))

    const dealPage = await browser.newPage()
    await dealPage.setRequestInterception(true)
    dealPage.on('request', (req) => {
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
    dealPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36')
    dealPage.on('domcontentloaded', () => console.log('뽐뿌-국내 딜 파싱완료'))

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

      // 이미지/링크 파싱
      const contentEl = tdEl.find('table')
      const aEl = contentEl.find('a')
      const img = cSelector(aEl[0]).find('img').attr('src')
      const link = this.url + aEl.attr('href')

      const dealInfo = await this.parsePage(dealPage, link)

      returnArr.push({
        category: dealInfo.category,
        title: dealInfo.title,
        link,
        img: img.includes('noimage') ? null : img,
        view: dealInfo.view,
        reply: dealInfo.reply,
        regDt: this.convertDate(dealInfo.time)
      })
    }

    await dealPage.close()
    await page.close()

    return {
      name: this.name,
      label: this.label,
      data: returnArr
    }
  }

  async parsePage (page, link) {
    await page.goto(link, {
      waitUntil: 'domcontentloaded'
    })

    const pageContent = await page.content()
    const cSelector = cheerio.load(pageContent)

    const headerEl = cSelector('.container table.info_bg .sub-top-text-box')
    const title = cSelector(headerEl).find('.view_title2').text().trim()
    const category = cSelector(headerEl).find('.view_cate').text().trim()

    const headerElSplit = cSelector(headerEl).text().split('\n')
    const regDtEl = headerElSplit.filter(el => el.includes('등록일'))[0]
    const regDt = regDtEl.substring(regDtEl.indexOf(':') + 1).trim()
    let viewReplyEl = headerElSplit.filter(el => el.includes('조회수'))[0]
    let view = null
    let reply = null
    if (viewReplyEl) {
      viewReplyEl = viewReplyEl.split('/')
      view = viewReplyEl[0].replace(/[^\d]/g, '').trim()
      reply = viewReplyEl[1].replace(/[^\d]/g, '').trim()
    }

    return {
      title,
      category,
      reply,
      view,
      time: regDt,
      price: 0
    }
  }

  convertDate (pDate) {
    return new Date(pDate)
  }
}
