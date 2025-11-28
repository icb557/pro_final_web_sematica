const mongoose = require('mongoose');

const VisualResourceSchema = new mongoose.Schema({
  elementId: { type: String, required: true, unique: true }, // ID used in frontend (e.g., 'img1')
  type: { type: String, enum: ['image', 'chart', 'ui'], required: true },
  description: { type: String, required: true },
  semanticMetadata: {
    context: { type: String, default: 'http://schema.org' },
    type: { type: String, required: true }, // e.g., 'ImageObject'
    caption: String,
    colorPalette: [{
      colorName: String,
      hex: String
    }],
    // For charts
    name: String,
    chartData: mongoose.Schema.Types.Mixed
  }
});

module.exports = mongoose.model('VisualResource', VisualResourceSchema);

