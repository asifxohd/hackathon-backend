
import express from 'express'
import dotenv from 'dotenv'
import userRouter from './routers/userRouter.js'
import connectDb from './config/db.js'

dotenv.config()

connectDb()

const port = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api/users',userRouter)






app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})