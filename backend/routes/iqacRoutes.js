const express = require('express');
const router = express.Router();
const IQACProposal = require('../models/IQACProposal');
const Event = require('../models/Event');

// GET all proposals
router.get('/proposals', async (req, res) => {
  try {
    const proposals = await IQACProposal.find().sort({ createdAt: -1 });
    res.json(proposals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single proposal
router.get('/proposals/:id', async (req, res) => {
  try {
    const proposal = await IQACProposal.findOne({ proposalId: req.params.id });
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    res.json(proposal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create proposal
router.post('/proposals', async (req, res) => {
  try {
    const proposal = new IQACProposal(req.body);
    await proposal.save();
    res.status(201).json(proposal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update proposal status
router.put('/proposals/:id/status', async (req, res) => {
  try {
    const { status, approver, comments } = req.body;
    
    const proposal = await IQACProposal.findOne({ proposalId: req.params.id });
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    
    proposal.status = status;
    proposal.approvalHistory.push({
      approver,
      action: status,
      comments,
      date: new Date()
    });
    proposal.updatedAt = Date.now();
    
    await proposal.save();
    res.json(proposal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST convert proposal to completed event
router.post('/proposals/:id/complete', async (req, res) => {
  try {
    const proposal = await IQACProposal.findOne({ proposalId: req.params.id });
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    
    if (proposal.status !== 'Approved') {
      return res.status(400).json({ error: 'Only approved proposals can be marked as completed' });
    }
    
    // Generate event ID
    const eventId = `EVT-${new Date().getFullYear()}-${String(await Event.countDocuments() + 1).padStart(3, '0')}`;
    
    // Create event from proposal
    const event = new Event({
      eventId,
      event: {
        id: eventId,
        title: proposal.eventTitle,
        department: proposal.department,
        organizer: proposal.department,
        type: proposal.eventType,
        date: proposal.eventDate,
        venue: proposal.venue,
        status: 'Completed',
        description: proposal.description
      },
      resourcePersons: proposal.resourcePersons.map((person, index) => ({
        id: index + 1,
        ...person
      })),
      ...req.body.postEventData, // Additional data from request
      iqacProposalId: proposal._id,
      createdBy: req.body.createdBy || 'IQAC'
    });
    
    await event.save();
    
    // Update proposal
    proposal.status = 'Completed';
    proposal.postEventData = {
      isCompleted: true,
      completedEventId: eventId
    };
    await proposal.save();
    
    res.status(201).json({ proposal, event });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT add post-event documentation to existing event
router.put('/events/:eventId/documentation', async (req, res) => {
  try {
    const event = await Event.findOne({ eventId: req.params.eventId });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Update event with post-event data
    Object.assign(event, req.body);
    event.updatedAt = Date.now();
    
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE proposal
router.delete('/proposals/:id', async (req, res) => {
  try {
    const proposal = await IQACProposal.findOneAndDelete({ proposalId: req.params.id });
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    res.json({ message: 'Proposal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
