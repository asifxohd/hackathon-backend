import express from 'express'
import multer from 'multer'
import path from 'path'

const app = express()



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public') 
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
 });

 const upload = multer({ storage: storage });

 export {
    upload
 }