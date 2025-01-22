import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import cookieParser from 'cookie-parser'

import connectDB from './config/db.js'
import userRouter from './routes/user.route.js'

dotenv.config()
const port = process.env.PORT || 5000

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use('/api/users', userRouter)

app.listen(port, () => console.log(`Server is listing on port ${port}`)
)
