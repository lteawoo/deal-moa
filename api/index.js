import express from 'express'
import { Ppomppu } from './targets/ppomppu'

const app = express()

export default app

app.get('/', async (req, res, next) => {
  const ppomppu = new Ppomppu()
  const data = await ppomppu.parse()

  res.send(data)
})
