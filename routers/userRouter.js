
import express from 'express'
import { postStory,postComplaints,editStory,deleteStory,postvolunteer, registerUser } from '../controllers/userControllers.js'
import { upload } from '../multer/multer.js'
const userRouter = express.Router()


userRouter.post('/register',registerUser)

userRouter.post('/add-story',upload.single('image'),postStory)
userRouter.post('/add-complaints',postComplaints)
userRouter.put('/edit-story',editStory)
userRouter.delete('/delete-story',deleteStory)
userRouter.post('/add-volunteer',postvolunteer)


export default userRouter