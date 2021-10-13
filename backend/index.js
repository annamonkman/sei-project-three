import express from 'express'
import mongoose from 'mongoose'
import { port, dbURI } from './config/environment.js'
import router from './config/router.js'

const app = express()

const startServer = async () => {
  try {
    await mongoose.connect(dbURI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    console.log('🚀 Database has connected successfully')

    app.use(express.json())

    app.use((req, _res, next) => {
      console.log(`🚨 Incoming request: ${req.method} - ${req.url}`)
      next()
    })

    app.use('/api', router)

    app.listen(port, () => console.log(`🚀 Express is up and running on port ${port}`))
  } catch (err) {
    console.log('🆘 Something went wrong starting the app')
    console.log(err)
  }
}
startServer()



// ? FOR HEROKU DEPLOYMENT GA ADVICE RUNNING FRONTEND ON BACKEND

// import express from 'express'
// import mongoose from 'mongoose'
// const app = express()
// import logger from './lib/logger'
// import router from './config/router.js'
// import errorHandler from './lib/errorHandler'
// import { dbURI, port } from './config/environment.js'

// import path from 'path'

// const __dirname = path.resolve()

// mongoose.connect(
//   dbURI,
//   { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true  },
//   (err) => {
//     if (err) return console.log(err)
//     console.log('Mongo is Connected!')
//   })

// app.use(express.static(`${__dirname}/client/build`)) // <-- This line has been added before the express json middleware, it will allow the app to respond to a request with contents of this directory "build", which will contain our React App code.

// app.use(express.json())

// app.use(logger)

// app.use('/api', router)

// app.use('/*', (_, res) => res.sendFile(`${__dirname}/client/build/index.html`)) // <-- This additional route handler has been added between the router and error handler middleware it means that any incoming request that does not match a route in router should respond back with our frontend.

// app.use(errorHandler)

// app.listen(port, () => console.log(`Express is listening on port ${port}`))
