
import express from 'express'
import { postStory,postComplaints,editStory } from '../controllers/userControllers.js'
import { upload } from '../multer/multer.js'
const userRouter = express.Router()


userRouter.post('/add-story',upload.single('image'),postStory)
userRouter.post('/add-complaints',postComplaints)
userRouter.post('/edit-story',editStory)



export default userRouter