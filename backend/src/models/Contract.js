
const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => require('crypto').randomUUID()
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Contract name is required'],
    trim: true,
    maxlength: [255, 'Name cannot exceed 255 characters']
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['analyzed', 'analyzing', 'pending'],
    default: 'pending'
  },
  riskScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  riskLevel: {
    type: String,
    enum: ['high', 'medium', 'low', 'pending'],
    default: 'pending'
  },
  summary: {
    type: String,
    maxlength: [2000, 'Summary cannot exceed 2000 characters']
  },
  keyRisks: [{
    category: {
      type: String,
      enum: ['legal', 'financial', 'compliance', 'operational']
    },
    description: String,
    severity: {
      type: String,
      enum: ['high', 'medium', 'low']
    }
  }],
  recommendations: [String],
  fileContent: {
    type: String,
    maxlength: [100000, 'Contract content is too large']
  }
}, {
  timestamps: true
});

// Index for efficient querying
contractSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Contract', contractSchema);

