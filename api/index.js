import express from 'express'
import Parser from './parser'

const app = express()

export default app

app.get('/parse', async (req, res, next) => {
  const parser = new Parser()
  let data = await parser.parse()
  data = data.concat(await parser.parseRss())
  parser.writeFiles(data)

  res.send()
})

app.get('/load', async (req, res, next) => {
  const parser = new Parser()

  res.send(await parser.loadFiles())
})
