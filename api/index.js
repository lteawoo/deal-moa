import express from 'express'

const app = express()

export default app

app.get('/', (req, res, next) => {
  res.send('test')
})
