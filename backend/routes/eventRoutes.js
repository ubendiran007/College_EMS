const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Event = require('../models/Event');

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// GET all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ 'event.date': -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findOne({ eventId: req.params.id });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new event
router.post('/', async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update event
router.put('/:id', async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      { eventId: req.params.id },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST upload brochure
router.post('/:id/brochure', upload.single('brochure'), async (req, res) => {
  try {
    const event = await Event.findOne({ eventId: req.params.id });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    event.brochure = {
      filename: req.file.originalname,
      size: (req.file.size / (1024 * 1024)).toFixed(2) + ' MB',
      downloadUrl: `/uploads/${req.file.filename}`,
      fileId: req.file.filename
    };
    
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST upload photos
router.post('/:id/photos', upload.array('photos', 10), async (req, res) => {
  try {
    const event = await Event.findOne({ eventId: req.params.id });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    const photos = req.files.map((file, index) => ({
      id: event.gallery.length + index + 1,
      url: `/uploads/${file.filename}`,
      location: req.body.locations?.[index] || '',
      timestamp: new Date(),
      caption: req.body.captions?.[index] || '',
      title: req.body.titles?.[index] || '',
      coordinates: req.body.coordinates?.[index] || '',
      fileId: file.filename
    }));
    
    event.gallery.push(...photos);
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST add schedule
router.post('/:id/schedule', async (req, res) => {
  try {
    const event = await Event.findOne({ eventId: req.params.id });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    event.schedule.push(req.body);
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST add feedback
router.post('/:id/feedback', async (req, res) => {
  try {
    const event = await Event.findOne({ eventId: req.params.id });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    if (req.body.type === 'participant') {
      event.participantFeedback.testimonials.push(req.body.data);
      event.participantFeedback.totalResponses += 1;
    } else if (req.body.type === 'guest') {
      event.guestFeedback.push(req.body.data);
    }
    
    await event.save();
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ eventId: req.params.id });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
