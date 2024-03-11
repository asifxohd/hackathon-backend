import express from 'express'
const userRouter = express.Router()



import {
  postStory,
  postComplaints,
  editStory,
  deleteStory,
  postvolunteer,
  registerUser,
  verifyOTP,
  loginUser,
  chatBot,
  searchVolunteers,
  getStory,
  getVolunteers
} from '../controllers/userControllers.js'
import { upload } from '../multer/multer.js'
import userAuthentication from '../middleware/userAuth.js'



userRouter.post('/register', registerUser)
userRouter.post('/otpverify', verifyOTP)
userRouter.post('/login', loginUser)
userRouter.post('/chatbot', chatBot)


userRouter.post('/add-story',upload.single('image'), postStory)
userRouter.post('/add-complaints', postComplaints)
userRouter.put('/edit-story',editStory)
userRouter.delete('/delete-story', deleteStory)
userRouter.post('/add-volunteer', postvolunteer)
userRouter.get('/serach-volunteer', searchVolunteers)
userRouter.get('/stories',getStory)
userRouter.get('/volunteers',getVolunteers)


export default userRouter