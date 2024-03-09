import Story from '../models/userModels/storyModel.js'
import Complaint from '../models/userModels/complaintModel.js'
import path from 'path'

// CONTROLLER FUNCTION FOR POST THE STORIES

const postStory = async (req, res) => {
  try {
    const { title, description,name } = req.body

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

      const { id, title, description, name } = req.body;

      console.log(id);
      console.log(title);
      console.log(description);
      console.log(name);
  
      let imagePath = '';
  
      if (req.file) {
        imagePath = path.join('public', req.file.filename);
      }
  
      const story = await Story.findById(id);

      if (!story) {
        return res.status(404).json({ error: 'Story not found' });
      }
  
      story.title = title;
      story.description = description;
      story.name = name;
      if (imagePath) {
        story.image = imagePath;
      }
  
      const updatedStory = await story.save();
  
      res.status(200).json(updatedStory);
      console.log('Story updated');
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred while editing the story' });
    }
  };
  

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

export { postStory,editStory, postComplaints }
