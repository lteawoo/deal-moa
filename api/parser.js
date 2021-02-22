import fs from 'fs'
import puppeteer from 'puppeteer'
// import Cooln from './targets/cooln'
import Ppomppu from './targets/ppomppu'
// import PpomppuAboard from './targets/ppomppu-abroad'

const BASE_DIR = 'C:/file'

export default class parser {
  constructor () {
    this.targets = [
      new Ppomppu()
      // new PpomppuAboard(),
      // new Cooln()
    ]
  }

  loadFiles () {
    let resultArr = []

    for (let i = 0; i < this.targets.length; i += 1) {
      const jsonData = this.loadFile(this.targets[i])
      resultArr = resultArr.concat(jsonData)
    }

    return resultArr
  }

  loadFile (target) {
    return JSON.parse(fs.readFileSync(`${BASE_DIR}/${target.name}.json`, 'utf8'))
  }

  writeFiles (datas) {
    for (let i = 0; i < datas.length; i += 1) {
      const data = datas[i]
      this.writeFile(data)
    }
  }

  writeFile (data) {
    fs.writeFile(`${BASE_DIR}/${data.name}.json`, JSON.stringify(data.data), (err) => {
      if (err) {
        return err
      }
    })
  }

  async parse () {
    const browser = await puppeteer.launch({
      headless: false
    })

    const resultArr = []

    for (let i = 0; i < this.targets.length; i += 1) {
      const data = await this.targets[i].parse(browser)
      resultArr.push({
        name: this.targets[i].name,
        data
      })
    }

    await browser.close()

    return resultArr
  }
}
