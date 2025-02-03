import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import connectDB from './config/db.js'
import userRouter from './routes/user.route.js'
import categoryRouter from './routes/category.route.js'
import productRouter from './routes/product.route.js'
import uploadRouter from './routes/upload.route.js'
import orderRouter from './routes/order.route.js'

dotenv.config()
const port = process.env.PORT || 5000

connectDB()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use('/api/users', userRouter)
app.use('/api/category', categoryRouter)
app.use('/api/products', productRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/orders', orderRouter)

app.get('/api/config/paypal', (req, res) => {
    res.send({clientId: process.env.PAYPAL_CLIENT_ID})
})

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname , "/uploads")));

app.listen(port, () => console.log(`Server is listing on port ${port}`)
)
