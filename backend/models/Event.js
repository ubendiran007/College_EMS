const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true,
    unique: true
  },
  event: {
    id: String,
    title: { type: String, required: true },
    department: { type: String, required: true },
    organizer: String,
    type: { type: String, required: true },
    date: { type: Date, required: true },
    time: String,
    venue: String,
    status: { type: String, default: 'Completed' },
    description: String
  },
  brochure: {
    filename: String,
    size: String,
    pages: Number,
    downloadUrl: String,
    fileId: String
  },
  schedule: [{
    time: String,
    topic: String,
    speaker: String,
    type: String
  }],
  registration: {
    total: Number,
    categories: {
      students: Number,
      faculty: Number,
      external: Number
    },
    period: String,
    mode: String
  },
  attendance: {
    total: Number,
    percentage: Number,
    verified: Boolean,
    uploadDate: Date
  },
  gallery: [{
    id: Number,
    url: String,
    location: String,
    timestamp: Date,
    caption: String,
    title: String,
    coordinates: String,
    fileId: String
  }],
  resourcePersons: [{
    id: Number,
    name: String,
    designation: String,
    organization: String,
    expertise: String,
    photo: String,
    bio: String,
    email: String,
    phone: String,
    linkedin: String
  }],
  participantFeedback: {
    totalResponses: Number,
    responseRate: Number,
    satisfaction: Number,
    ratings: [Number],
    testimonials: [{
      name: String,
      role: String,
      rating: Number,
      comment: String
    }]
  },
  guestFeedback: [{
    id: Number,
    name: String,
    designation: String,
    organization: String,
    photo: String,
    rating: Number,
    feedback: String,
    highlights: [String],
    date: Date
  }],
  eventReport: {
    participants: Number,
    sessions: Number,
    completionRate: Number,
    satisfaction: Number,
    executiveSummary: String,
    keyOutcomes: [String],
    recommendations: [String],
    publishDate: Date
  },
  certificates: {
    template: String,
    issued: Number,
    mediaArchive: {
      photos: Number,
      videos: Number,
      presentations: Number
    }
  },
  iqacProposalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'IQACProposal'
  },
  createdBy: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);
