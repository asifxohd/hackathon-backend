
import express from 'express'

import { postStory,postComplaints,editStory,deleteStory,postvolunteer,searchVolunteers, registerUser, verifyOTP, loginUser, chatBot } from '../controllers/userControllers.js'

import { upload } from '../multer/multer.js'
const userRouter = express.Router()


userRouter.post('/register',registerUser);
userRouter.post('/otpverify',verifyOTP);
userRouter.post('/login',loginUser);
userRouter.post('/chatbot',chatBot);

userRouter.post('/add-story',upload.single('image'),postStory)
userRouter.post('/add-complaints',postComplaints)
userRouter.put('/edit-story',editStory)
userRouter.delete('/delete-story',deleteStory)
userRouter.post('/add-volunteer',postvolunteer)
userRouter.get('/serach-volunteer',searchVolunteers)


export default userRouter