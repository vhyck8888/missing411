import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  createdAt: { type: Date, default: Date.now }
});

const CaseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, default: 'Missing' },
  date: { type: Date, required: true },
  lastSeen: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  description: { type: String },
  photoUrl: { type: String },
  pending: { type: Boolean, default: true },  // 👈 Add this line
  createdAt: { type: Date, default: Date.now },
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: String,
      date: { type: Date, default: Date.now },
    }
  ]
});

export default mongoose.model('Case', CaseSchema);
