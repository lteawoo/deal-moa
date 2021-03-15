import fs from 'fs'
import puppeteer from 'puppeteer'
import Cooln from './targets/cooln'
import Ppomppu from './targets/ppomppu'
import PpomppuAboard from './targets/ppomppu-abroad'
import Quasarzone from './targets/quasarzone'

const BASE_DIR = 'C:/file'

export default class parser {
  constructor () {
    this.targets = [
      new Ppomppu(),
      new PpomppuAboard(),
      new Quasarzone()
    ]
    this.rssTargets = [
      new Cooln()
    ]
  }

  async loadFiles () {
    let resultArr = []

    for (let i = 0; i < this.targets.length; i += 1) {
      const jsonData = await this.loadFile(this.targets[i])
      if (jsonData) {
        resultArr = resultArr.concat(jsonData)
      }
    }

    for (let i = 0; i < this.rssTargets.length; i += 1) {
      const jsonData = await this.loadFile(this.rssTargets[i])
      if (jsonData) {
        resultArr = resultArr.concat(jsonData)
      }
    }

    return resultArr
  }

  async loadFile (target) {
    try {
      return await JSON.parse(fs.readFileSync(`${BASE_DIR}/${target.name}.json`, 'utf8'))
    } catch (e) {
      console.error('파일이 없음: ', target.name)
    }
  }

  writeFiles (datas) {
    for (let i = 0; i < datas.length; i += 1) {
      const data = datas[i]
      this.writeFile(data)
    }
  }

  async writeFile (data) {
    const prev = await this.loadFile(data)
    if (prev) {
      const prevDataList = prev.data
      const newDataList = data.data
      const totalCnt = prevDataList.length

      for (let i = 0; i < prevDataList.length; i += 1) {
        const prevData = prevDataList[i]

        for (let j = 0; j < newDataList.length; j += 1) {
          const newData = newDataList[j]
          if (newData.link === prevData.link) {
            prevDataList[i] = newDataList.splice(j, 1)[0]
            break
          }
        }
      }

      const updateDataCnt = newDataList.length
      data.data = newDataList.concat(prevDataList)
      console.log('name: ' + data.name, 'total: ' + totalCnt, 'update: ' + updateDataCnt)
    }

    fs.writeFile(`${BASE_DIR}/${data.name}.json`, JSON.stringify(data), (err) => {
      if (err) {
        return err
      }
    })
  }

  async parse () {
    const browser = await puppeteer.launch({
      headless: true
    })

    const resultArr = []

    for (let i = 0; i < this.targets.length; i += 1) {
      const data = await this.targets[i].parse(browser)
      resultArr.push(data)
    }

    await browser.close()

    return resultArr
  }

  async parseRss () {
    const resultArr = []

    for (let i = 0; i < this.rssTargets.length; i += 1) {
      const data = await this.rssTargets[i].parseRss()
      resultArr.push(data)
    }

    return resultArr
  }
}
