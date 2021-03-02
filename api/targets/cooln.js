import RssParser from 'rss-parser'

export default class cooln {
  constructor () {
    this.name = 'cooln'
    this.label = '쿨엔'
    this.url = 'https://coolenjoy.net/'
    this.path = 'bbs/jirum'
  }

  async parseRss () {
    const rssParser = new RssParser()
    const feed = await rssParser.parseURL('https://coolenjoy.net/rss?bo_table=jirum')
    if (feed) {
      console.log('쿨엔 파싱 완료')
    }
    const returnArr = []
    feed.items.forEach((item) => {
      const link = item.link.replace('amp;', '')
      returnArr.push({
        category: 'category',
        title: item.title,
        link,
        img: '',
        regDt: this.convertDate(item.date)
      })
    })

    return {
      name: this.name,
      label: this.label,
      data: returnArr
    }
  }

  convertDate (pDate) {
    return new Date(pDate)
  }

  // async parse (browser) {
  //   const page = await browser.newPage()
  //   await page.setRequestInterception(true)

  //   page.on('request', (req) => {
  //     switch (req.resourceType()) {
  //       case 'stylesheet':
  //       case 'font':
  //       case 'image':
  //         req.abort()
  //         break
  //       default:
  //         req.continue()
  //         break
  //     }
  //   })

  //   page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36')

  //   page.waitForSelector('#fboardlist')
  //     .then(() => console.log('쿨엔 파싱완료'))

  //   await page.goto(this.url + this.path, {
  //     waitUntil: 'domcontentloaded'
  //   })

  //   const pageContent = await page.content()
  //   const cSelector = cheerio.load(pageContent)
  //   // 공지사항 제거-1: class bo_notice 제거
  //   const dealListEl = cSelector('#fboardlist tbody tr:not([class*="bo_notice"])')

  //   const returnArr = []

  //   for (let i = 0; i < dealListEl.length; i += 1) {
  //     const dealEl = cSelector(dealListEl[i])
  //     const tdEl = dealEl.children('td')
  //     const tdNum = cSelector(tdEl).filter('.td_num')
  //     // 카테고리 파싱
  //     const category = tdNum.text().trim()
  //     console.log(category)
  //     if (!category) {
  //       continue
  //     }
  //     // 이미지/제목/링크 파싱
  //     const tdSubject = cSelector(tdEl).filter('.td_subject')
  //     tdSubject.find('a span').remove()
  //     const title = tdSubject.children('a').text().trim()
  //     console.log(title)
  //     const link = tdSubject.find('a').attr('href')
  //     console.log(link)

  //     returnArr.push({
  //       category,
  //       title,
  //       link,
  //       img,
  //       regDt: this.convertDate(timeEl.attr('title'))
  //     })
  //   }

  //   await page.close()

  //   return returnArr
  // }
}
