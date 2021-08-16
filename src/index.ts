import express from 'express'
import db from './db'
import { Product } from './types'

const app = express()
const port = 3000
app.use(express.json())

app.get('/',  (req, res) => {
  res.status(200).send('abandon all hope, ye who enter here')
})

app.get('/products', async (req, res) => {
  try {
    //account for request parameters + init options obj to pass to db query
    const count = req.body && req.body.count ? req.body.count : 5
    const page = req.body && req.body.page && req.body.page > 1 ? req.body.page - 1 : 0
    const options = {
      limit: count,
      skip: page
    }
    //query db and send
    const response = await db.model('Product').find({}, null, options)
    res.status(200).send(response)
  } catch (err) {
    res.status(500).send('err')
  }
})

app.get('/products/:product_id', async (req, res) => {
  const id = Number(req.params.product_id)
  try {
    const response = await db.model('Product').find({id: id})
    res.status(200).send(response)
  } catch (err) {
    res.status(404).send('err getting specific id')
  }
})

app.get('/products:product_id/styles', async (req, res) => {
  const id = req.params.product_id
  try {
    const response = {
      product_id: id,
    }
    const styles:any[] = await db.model('Style').find({'product_id': id})
    for (let x = 0; x < styles.length; x++) {
      const newSkus:any = {}
      for(let y = 0; y < styles[x].skus.length; y++) {
        const skuId = styles[x].skus[y]
        const sku = await db.model('Sku').find({id: skuId })
        newSkus[skuId] = sku
      }
      styles[x].skus = newSkus
    }
    response.results = styles
    res.status(200).send(response)
  } catch (err) {
    res.status(500).send(err)
  }
})

app.get('/products:product_id/related', async (req, res) => {
  const id = req.params.product_id
  try {
    const prod = await db.model('Product').findOne({id: id})
    const related = prod.related
    res.status(200).send(related)
  } catch (err) {
    res.status(500).send(err)
  }
})

app.listen(port, () => {
  console.log(`server listening on port ${port}`)
  console.log(db.readyState)
})

export default app
