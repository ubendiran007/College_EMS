const mongoose = require('mongoose');

const iqacProposalSchema = new mongoose.Schema({
  proposalId: {
    type: String,
    required: true,
    unique: true
  },
  eventTitle: { type: String, required: true },
  department: { type: String, required: true },
  eventType: { type: String, required: true },
  eventDate: { type: Date, required: true },
  venue: String,
  description: String,
  budget: Number,
  resourcePersons: [{
    name: String,
    designation: String,
    organization: String,
    expertise: String
  }],
  requirements: {
    foodRefreshment: {
      required: Boolean,
      vipCount: Number,
      guestCount: Number,
      count: Number
    },
    guestTravel: {
      required: Boolean,
      details: String
    },
    guestAccommodation: {
      required: Boolean,
      details: String
    },
    itSupport: {
      required: Boolean,
      details: String
    },
    audioVideoSupport: {
      required: Boolean,
      details: String
    }
  },
  status: {
    type: String,
    enum: ['Pending', 'Faculty_Approved', 'HOD_Approved', 'Principal_Approved', 'Rejected', 'Completed'],
    default: 'Pending'
  },
  currentApprover: {
    type: String,
    enum: ['faculty', 'hod', 'principal', 'completed'],
    default: 'faculty'
  },
  approvalHistory: [{
    approver: String,
    approverRole: String,
    action: String,
    comments: String,
    date: { type: Date, default: Date.now }
  }],
  postEventData: {
    isCompleted: { type: Boolean, default: false },
    completedEventId: String
  },
  createdBy: {
    type: String,
    required: true
  },
  createdByName: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('IQACProposal', iqacProposalSchema);
