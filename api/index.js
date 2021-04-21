import express from 'express'
import schedule from 'node-schedule'
import Parser from './parser'

const app = express()

export default app

// let cacheDeals = null

const parser = new Parser()

const parse = async () => {
  console.log('parse start')
  let data = await parser.parse()
  data = data.concat(await parser.parseRss())

  await parser.writeFiles(data)

  console.log('parse end')
}

if (!schedule.scheduledJobs.parse) {
  schedule.scheduleJob('parse', '*/1 * * * *', async () => {
    console.log('스케쥴 시작')
    await parse()

    // cacheDeals = await parser.loadFiles()
    console.log('스케쥴 끝')
  })
}

app.get('/parse', async (req, res, next) => {
  await parse()

  res.send()
})

// const handlePage = (page, content) => {
//   if (page && content && content.length > 1) {
//     const PAGE_COUNT = 30
//     const contentSize = content.length

//     const startIndex = (page - 1) * PAGE_COUNT
//     const endIndex = (contentSize < page * PAGE_COUNT) ? contentSize : page * PAGE_COUNT
//     return content.slice(startIndex, endIndex)
//   }
// }

app.get('/load', async (req, res, next) => {
  // if (!cacheDeals) {
  //   await parse()

  //   cacheDeals = await parser.loadFiles()
  // }

  // const { page = 1 } = req.query
  // const pagingContent = handlePage(page, cacheDeals)
  // console.log(pagingContent)
  res.send(await parser.loadFiles())
})

app.get('/sites', (req, res, next) => {
  const sites = [
    {
      code: 'ppomppu',
      name: '뽐뿌-국내'
    },
    {
      code: 'ppomppu2',
      name: '뽐뿌-해외'
    },
    {
      code: 'cooln',
      name: '쿨엔조이'
    },
    {
      code: 'quasarzone',
      name: '퀘이사존'
    }
  ]

  res.send(sites)
})
