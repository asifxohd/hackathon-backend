import mongoose from 'mongoose'

const Schema = mongoose.Schema

const complaintSchema = Schema(
  {
    complaints: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

const Complaint = mongoose.model('complaints', complaintSchema)

export default Complaint
