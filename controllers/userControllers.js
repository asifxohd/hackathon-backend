import Story from '../models/userModels/storyModel.js'
import Complaint from '../models/userModels/complaintModel.js'
import Volunteer from '../models/userModels/volunteerModel.js'
import path from 'path'
import { isBuffer } from 'util'

// CONTROLLER FUNCTION FOR POST THE STORIES

const postStory = async (req, res) => {
  try {
    const { title, description, name } = req.body

    let imagePath = ''

    if (req.file) {
      imagePath = path.join('public', req.file.filename)
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

    const newComplaint = new Complaint({
      complaints
    })

    const savedComplaint = await newComplaint.save()

    res.status(200).json(savedComplaint)
    if (savedComplaint) {
      console.log('complaint saved')
    }
  } catch (error) {
    console.log(error)
  }
}

// ADDING A NEW VOLUNTEER CONTROLLER LOGICS

const postvolunteer = async (req, res) => {
  try {
    const { location, name, number } = req.body

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

export {
  postStory,
  editStory,
  postComplaints,
  deleteStory,
  postvolunteer,
  searchVolunteers
}
