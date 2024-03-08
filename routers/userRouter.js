
import express from 'express'
import { postStory } from '../controllers/userControllers.js'

const userRouter = express.Router()


userRouter.post('/add-story',postStory)



export default userRouter