
import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import userRouter from './routers/userRouter.js'
import connectDb from './config/db.js'


dotenv.config()

connectDb()


const port = process.env.PORT || 8000;
const app = express()

app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api/users',userRouter)



app.listen(port,()=>{
    console.log(`server is running @ http://127.0.0.1:${port}`)
})