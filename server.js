import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import userRouter from './routers/userRouter.js'
import connectDb from './config/db.js';
import cors from 'cors';
import session from 'express-session';
import path from 'path';
import {fileURLToPath} from 'url'




dotenv.config()

connectDb()


const port = process.env.PORT || 8000;
const app = express()



app.use(session({
    secret : 'key',
    resave : false,
    saveUninitialized : true,
    cookie : {secure : false}
}));
app.use(cors());
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/static', express.static(path.join(__dirname, 'public')))


app.use('/api/users',userRouter)



app.listen(port,()=>{
    console.log(`server is running @ http://127.0.0.1:${port}`)
})