import express from 'express'
import Parser from './parser'

const app = express()

export default app

app.get('/parse', async (req, res, next) => {
  const parser = new Parser()
  const data = await parser.parse()
  parser.writeFiles(data)

  res.send()
})

app.get('/load', (req, res, next) => {
  const parser = new Parser()
  res.send(parser.loadFiles())
})
