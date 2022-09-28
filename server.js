require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const formidable = require('express-formidable');
const { routerAdmin, adminBro } = require('./utils/admin');

const authRouter = require('./routes/authRouter')
const usersRouter = require('./routes/usersRouter')
const postsRouter = require('./routes/postRouter')
const categoryRouter = require('./routes/categoryRouter')
const commentRouter = require('./routes/commentRouter')

const server = express()

server.use(adminBro.options.rootPath, routerAdmin);
server.use(express.json())
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser())

server.use('/api/auth', authRouter)
server.use('/api/users', usersRouter)
server.use('/api/posts', postsRouter)
server.use('/api/categories', categoryRouter)
server.use('/api/comments', commentRouter)

server.use(formidable())


server.listen(process.env.APP_PORT, 'localhost', (error) => {
    error ? console.log(error) : console.log(`Server is running on port ${process.env.APP_PORT}`)
})