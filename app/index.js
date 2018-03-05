const express = require('express')
const compression = require('compression')
const sassMiddleware = require('node-sass-middleware')
const tsm = require('ts-middleware')
// const tsm = require('./middleware/typescript')
const path = require('path')
const fs = require('fs')
const pug = require('pug')

const app = express()

app.locals.basedir = path.join(__dirname, '../resources/views')
app.use((req, res, next) => {
  res.locals.path = req.path
  res.locals.hpsrc = req.hostname.match(/localhost|127\.0\.0\.1/) ? '//localhost:3030/horsepower/hp.min.js' : 'https://cdn.horsepowerjs.com/latest/hp.min.js'

  next()
})

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, '../resources/views'))

app.use(compression())
app.use(sassMiddleware({
  src: path.join(__dirname, '../resources/sass'),
  dest: path.join(__dirname, '../public/css'),
  // debug: true,
  outputStyle: 'compressed',
  prefix: '/css'
}))

app.use(tsm(path.join(__dirname, '../resources/typescript/tsconfig.json')))

app.use('/js', express.static(path.join(__dirname, '../public/js')))
app.use('/css', express.static(path.join(__dirname, '../public/css')))
app.use('/images', express.static(path.join(__dirname, '../public/images')))
app.use('/demos', express.static(path.join(__dirname, '../public/demos')))

app.get('/', (req, res) => {
  res.render('pages/index')
})

app.get('/demo/', (req, res) => res.render('pages/demo'))

app.get('/getting-started', (req, res) => res.render('pages/getting-started'))
app.get('/docs*', (req, res) => res.render('pages/docs'))
app.get('/templates/:item*?/:file', (req, res) => {
  let item = req.params.item.replace(/\.\./g, '').replace(/\/\//g, '/')
  let itemPath = req.params['0'].replace(/\.\./g, '').replace(/\/\//g, '/')
  res.send(pug.renderFile(path.join(__dirname, '../resources/templates', item, itemPath, req.params.file + '.pug')))
})
app.get('/data/:item*?/:file', (req, res) => {
  let item = req.params.item.replace(/\.\./g, '').replace(/\/\//g, '/')
  let itemPath = req.params['0'].replace(/\.\./g, '').replace(/\/\//g, '/')
  try {
    res.send(JSON.parse(fs.readFileSync(path.join(__dirname, '../resources/data', item, itemPath, req.params.file + '.json'))))
  } catch (e) {
    res.send({})
  }
})

app.listen(3000, () => console.log('Server started on port 3000'))