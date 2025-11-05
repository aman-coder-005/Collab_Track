import mongoose from 'mongoose';

// (taskSchema is the same as before)
const taskSchema = new mongoose.Schema({
  content: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// --- NEW: Define a schema for project applications ---
const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: { // Store the user's name for easy display
    type: String,
    required: true,
  },
  skills: [ // Store the skills they submitted
    { type: String }
  ],
  message: { // The optional message
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const projectSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    requiredSkills: [{ type: String }],
    teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    kanban: {
      todo: [taskSchema],
      inProgress: [taskSchema],
      completed: [taskSchema],
    },
    
    // --- NEW: Add the applications array ---
    applications: [applicationSchema],
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model('Project', projectSchema);

export default Project;