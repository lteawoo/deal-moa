import fs from 'fs'
import express from 'express'
import { Ppomppu } from './targets/ppomppu'

const app = express()

export default app

const BASE_DIR = 'C:/file'
const PPOMPPU_FILE = 'ppomppu.json'

const saveJson = (dealList) => {
  fs.writeFile(`${BASE_DIR}/${PPOMPPU_FILE}`, JSON.stringify(dealList), (err) => {
    if (err) {
      return err
    }
  })
}

app.get('/', async (req, res, next) => {
  const ppomppu = new Ppomppu()
  const data = await ppomppu.parse()

  saveJson(data)

  res.send()
})
