const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true // This must exist
  },
  strategy: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Plan', PlanSchema);