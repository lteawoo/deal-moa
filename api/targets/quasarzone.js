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
    // page.waitForSelector('.market-type-list')
    //   .then(() => console.log('퀘이사존 파싱완료'))
    page.on('domcontentloaded', () => console.log('퀘이사존 파싱완료'))

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
    dealPage.on('domcontentloaded', () => console.log('퀘이사존 딜 파싱완료'))
    dealPage.on('dialog', async (dialog) => {
      console.log(dialog.message())
      await dialog.accept()
    })
    // dealPage.waitForSelector('.common-view-area')
    //   .then(() => console.log('퀘이사존 딜페이지완료'))

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
      let dealInfo = null
      try {
        dealInfo = await this.parsePage(dealPage, link)
      } catch (e) {
        console.error('에러 아마 블라인드', e)
        continue
      }

      // 이미지
      const img = cSelector(tdEl).find('.thumb-wrap img').attr('src')

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
    return new Date(pDate)
  }
}
