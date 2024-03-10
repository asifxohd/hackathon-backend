import path from 'path'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import otpGenerator from 'otp-generator'

import Story from '../models/userModels/storyModel.js'
import Complaint from '../models/userModels/complaintModel.js'
import Volunteer from '../models/userModels/volunteerModel.js'
import userModel from '../models/userModels/userModel.js'
import sendEmail from './Helpers/nodeMailer.js'
import { passwordHash } from './Helpers/passwordHash.js'
import { openai } from '../config/openAI_config.js'

// USER REGISTRATION CONTROLLER
const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body

    if (!(username && email && password)) {
      return res
        .status(400)
        .json({ success: false, message: 'All fields are required.' })
    }

    const existingUser = await userModel.findOne({ email: email })
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: 'Email already registered.' })
    }

    const securePassword = await passwordHash(password)

    const user = new userModel({
      username,
      email,
      password: securePassword
    })

    const savedUser = await user.save()

    if (savedUser) {
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false
      })
      const html = `<div style="width: 100%;background: #F5FEFD;text-align:center"><h2>${user.username} Welcome Our Shopping Website</h2><h6>Verification OTP</h6><h3 style="color: red;">${otp}</h3><h2>Thank You For Joining...</h2></div>`
      await sendEmail(user.email, html)
      const OTPdata = {
        id: savedUser._id,
        otp,
        startTime: Date.now()
      }
      res
        .status(201)
        .cookie('OTP', JSON.stringify(OTPdata), {
          maxAge: 2 * 60 * 1000,
          secure: true,
          httpOnly: true,
          sameSite: 'strict'
        })
        .json({
          success: true,
          message: 'OTP sending Successful.'
        })
    } else {
      throw new Error('Registration failed, please try again.')
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
}

// USER OTP VERIFICATION
const verifyOTP = async (req, res, next) => {
  try {
    const { otp } = req.body
    const endTime = Date.now()
    const OTP_INFO = JSON.parse(req.cookies.OTP)
    const takenTime = endTime / 1000 - OTP_INFO.startTime / 1000

    if (takenTime < 120) {
      if (otp === OTP_INFO.otp) {
        const verifedUpdate = await userModel.updateOne(
          { _id: OTP_INFO.id },
          { $set: { isVerified: true } }
        )
        if (verifedUpdate) {
          res
            .status(200)
            .json({ success: true, message: 'OTP Verification Successful' })
          return
        }
      }
      res.status(404).json({ success: false, message: 'OTP Does Not Match.' })
    } else {
      res.status(404).json({ success: false, message: 'OTP Expired.' })
    }
  } catch (error) {
    console.log(error)
  }
}

// USER LOGIN CONTROLLER
const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body

    if (!(username && password)) {
      res
        .status(400)
        .json({
          success: false,
          message: 'Must Requires Username and Password'
        })
      return
    }

    const existingUser = await userModel.findOne({ email: username })

    if (
      !(existingUser && (await bcrypt.compare(password, existingUser.password)))
    ) {
      res
        .status(400)
        .json({ success: false, message: 'Check Username and Password' })
      return
    }

    if (!existingUser.isVerified) {
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false
      })
      const html = `<div style="width: 100%;background: #F5FEFD;text-align:center"><h2>Hi ${existingUser.username} Welcome to Our Website</h2><h6>Verification OTP</h6><h3 style="color: red;">${otp}</h3><h2>Thank You For Joining...</h2></div>`
      await sendEmail(existingUser.email, html)
      const OTPdata = {
        id: existingUser._id,
        otp,
        startTime: Date.now()
      }
      res
        .status(201)
        .cookie('OTP', JSON.stringify(OTPdata), {
          maxAge: 2 * 60 * 1000,
          secure: true,
          httpOnly: true,
          sameSite: 'strict'
        })
        .json({
          success: false,
          verificationProcess: true,
          message: 'OTP sending Successful.'
        })
      return
    }

    existingUser.password = null

    console.log(existingUser)

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    })

    res
      .status(201)
      .cookie('userToken', token, {
        maxAge: 86400000,
        secure: true,
        httpOnly: true,
        sameSite: 'strict'
      })
      .json({
        success: true,
        user: existingUser
      })
  } catch (error) {
    next(error)
  }
}

// USER HOME
const home = async (req, res, next) => {
  try {
    console.log(req.user)
    res.status(200).json({ home: true })
  } catch (error) {}
}

// OPEN AI INTEGRATION

const chatBot = async (req, res, next) => {
  try {
    const { userPrompt } = req.body

    // Check if user prompt is provided
    if (!userPrompt) {
      return res.status(400).json({ error: 'Please provide a prompt' })
    }

    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: userPrompt }
      ],
      model: 'gpt-3.5-turbo'
    })

    const assistantResponse = completion.choices[0].message.content
    res.json({ response: assistantResponse })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

// CONTROLLER FUNCTION FOR POST THE STORIES

const postStory = async (req, res) => {
  try {
    const { title, description, name } = req.body

    console.log(title)
    console.log(name)

    let imagePath = ''

    if (req.file) {
      imagePath = path.join( req.file.filename)
    }

    const newStory = new Story({
      title,
      description,
      name,
      image: imagePath
    })

    const savedStory = await newStory.save()

    res.status(200).json(savedStory)
    if (savedStory) {
      console.log('data added')
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'An error occure while saving the story' })
  }
}

// GETTING STORY CONTROLLER

const getStory = async (req, res) => {
  try {
    const story = await Story.find()
    if (!story) {
      return res.status(404).json({ error: 'Story not found' })
    }
    res.status(200).json({ story })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'An error occurred while getting the story' })
  }
}

// EDIT STORY CONTROLLER

const editStory = async (req, res) => {
  try {
    const { id, title, description, name } = req.body

    console.log(id)
    console.log(title)
    console.log(description)
    console.log(name)

    let imagePath = ''

    if (req.file) {
      imagePath = path.join('public', req.file.filename)
    }

    const story = await Story.findById(id)

    if (!story) {
      return res.status(404).json({ error: 'Story not found' })
    }

    story.title = title
    story.description = description
    story.name = name
    if (imagePath) {
      story.image = imagePath
    }

    const updatedStory = await story.save()

    res.status(200).json(updatedStory)
    console.log('Story updated')
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'An error occurred while editing the story' })
  }
}

// USER STORY DELETING CONTROLLER

const deleteStory = async (req, res) => {
  try {
    const { id } = req.body

    const deletedStory = await Story.findByIdAndDelete(id)

    console.log(deletedStory)

    if (!deletedStory) {
      return res.status(404).json({ error: 'Story not found' })
    }

    res.status(200).json({ message: 'Story deleted successfully' })
    console.log('Story deleted')
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ error: 'An error occurred while deleting the story' })
  }
}

// POSTING COMPLAINT FROM THE USER SIDE

const postComplaints = async (req, res) => {
  try {
    const { complaints } = req.body

    const user = await userModel.findOne({ _id: req.user })

    const email = user.email
    console.log(email)

    const newComplaint = new Complaint({
      complaints
    })

    const savedComplaint = await newComplaint.save()

    if (savedComplaint && user) {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: complaints }
        ],
        model: 'gpt-3.5-turbo'
      })

      const assistantResponse = completion.choices[0].message.content
      // res.json({ response: assistantResponse });

      console.log(assistantResponse)

      const html = `<div style="width: 100%;background: #F5FEFD;text-align:center">
                  <h2>Your complaint</h2>
                  <p>${complaints}</p>
                  <h3>Complaint Sollution:</h3>
                  <p>${assistantResponse}</p>
                </div>`

      await sendEmail(user.email, html)
    }

    res.status(200).json(savedComplaint)
    if (savedComplaint) {
      console.log('complaint saved')
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'An error occurred while adding volunteer' })
  }
}

// ADDING A NEW VOLUNTEER CONTROLLER LOGICS

const postvolunteer = async (req, res) => {
  try {
    const { location, name, number } = req.body

    const existingNumber = await Volunteer.findOne({ number: number })

    if (existingNumber) {
      return res.status(400).json({ message: 'Number already exists' })
    }

    const newVolunteer = new Volunteer({
      location,
      name,
      number
    })

    const savedVolunteer = await newVolunteer.save()

    res.status(200).json(savedVolunteer)

    if (savedVolunteer) {
      console.log('saved volunteer')
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'An error ocurred while adding vulunteer' })
  }
}

// SEARCH VOLUNTEERS CONTROLLER FUNCTIONALITY LOGICS

const searchVolunteers = async (req, res) => {
  try {
    const { query } = req.query

    const results = await Volunteer.find({
      $or: [{ location: { $regex: query, $options: 'i' } }]
    })

    if (!results) {
      return res.status(404).json({ error: 'No results found' })
    }

    res.status(200).json(results)
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ error: 'An error occurred while performing the search' })
  }
}

// GETTING VOLUNTEERS DATA CONTROLLER

const getVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find()
    res.status(200).json({ volunteers })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ error: 'An error occurred while getting the volunteers' })
  }
}

export {
  postStory,
  editStory,
  postComplaints,
  deleteStory,
  postvolunteer,
  registerUser,
  verifyOTP,
  loginUser,
  chatBot,
  home,
  searchVolunteers,
  getStory,
  getVolunteers
}
