const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema({
  daltonismType: {
    type: String,
    enum: ['none', 'protanopia', 'deuteranopia', 'tritanopia'],
    default: 'none'
  },
  preferences: {
    contrastLevel: { type: String, default: 'normal' },
    fontSize: { type: String, default: 'medium' }
  }
});

module.exports = mongoose.model('UserProfile', UserProfileSchema);

