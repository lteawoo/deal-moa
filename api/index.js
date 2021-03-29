import express from 'express'
import schedule from 'node-schedule'
import Parser from './parser'

const app = express()

export default app

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
    console.log('스케쥴 끝')
  })
}

app.get('/parse', async (req, res, next) => {
  await parse()

  res.send()
})

app.get('/load', async (req, res, next) => {
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
