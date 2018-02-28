const express = require('express')
const compression = require('compression')
const sassMiddleware = require('node-sass-middleware')
const tsm = require('ts-middleware')
// const tsm = require('./middleware/typescript')
const jsbeautify = require('js-beautify').js_beautify
const path = require('path')

const app = express()

app.locals.basedir = path.join(__dirname, '../resources/views')
app.use((req, res, next) => {
  res.locals.path = req.path
  res.locals.hpsrc = req.hostname.match(/localhost|127\.0\.0\.1/) ? '//localhost:3030/horsepower/hp.min.js' : 'https://cdn.horsepowerjs.com/latest/hp.min.js'
  res.locals.format = jsbeautify

  next()
})

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, '../resources/views'))

app.use(compression())
app.use(sassMiddleware({
  src: path.join(__dirname, '../resources/sass'),
  dest: path.join(__dirname, '../public/css'),
  debug: true,
  outputStyle: 'compressed',
  prefix: '/css'
}))

app.use(tsm(path.join(__dirname, '../resources/typescript/tsconfig.json')))

app.use('/js', express.static(path.join(__dirname, '../public/js')))
app.use('/css', express.static(path.join(__dirname, '../public/css')))
app.use('/images', express.static(path.join(__dirname, '../public/images')))

app.get('/', (req, res) => {
  res.render('pages/index')
})

app.get('/getting-started', (req, res) => res.render('pages/getting-started'))
app.get('/docs', (req, res) => res.render('pages/docs'))
// app.get('/docs/nav', (req, res) => res.render('pages/docs'))

// app.get(/\/docs\/.+?/, (req, res) => {
//   res.render('pages/index')
// })

app.listen(3000, () => console.log('Server started on port 3000'))