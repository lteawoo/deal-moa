import fs from 'fs'
import express from 'express'
import { Ppomppu } from './targets/ppomppu'
import { Ppomppu2 } from './targets/ppomppu-abroad'

const app = express()

export default app

const BASE_DIR = 'C:/file'
const PPOMPPU_FILE = 'ppomppu.json'
const PPOMPPU2_FILE = 'ppomppu2.json'

app.get('/parse/ppomppu', async (req, res, next) => {
  const ppomppu = new Ppomppu()
  const data = await ppomppu.parse()

  fs.writeFile(`${BASE_DIR}/${PPOMPPU_FILE}`, JSON.stringify(data), (err) => {
    if (err) {
      return err
    }
  })

  res.send()
})

app.get('/parse/ppomppu2', async (req, res, next) => {
  const ppomppu2 = new Ppomppu2()
  const data = await ppomppu2.parse()

  fs.writeFile(`${BASE_DIR}/${PPOMPPU2_FILE}`, JSON.stringify(data), (err) => {
    if (err) {
      return err
    }
  })

  res.send()
})

app.get('/load/ppomppu', (req, res, next) => {
  fs.readFile(`${BASE_DIR}/${PPOMPPU_FILE}`, (err, data) => {
    if (err) {
      res.send(err)
    } else {
      res.send(data)
    }
  })
})

app.get('/load/ppomppu2', (req, res, next) => {
  fs.readFile(`${BASE_DIR}/${PPOMPPU2_FILE}`, (err, data) => {
    if (err) {
      res.send(err)
    } else {
      res.send(data)
    }
  })
})
